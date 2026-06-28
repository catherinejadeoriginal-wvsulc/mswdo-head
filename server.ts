import express from 'express';
import path from 'path';
import fs from 'fs';
import mysql from 'mysql2/promise';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// MySQL connection configuration from environment variables
const mysqlConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306', 10),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'mswdo_db',
};

let pool: mysql.Pool | null = null;
let isMysqlConnected = false;

// Initialize MySQL Pool
async function initDatabase() {
  try {
    pool = mysql.createPool({
      ...mysqlConfig,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    // Test the connection
    const connection = await pool.getConnection();
    console.log('✅ Connected successfully to MySQL database:', mysqlConfig.database);
    connection.release();
    isMysqlConnected = true;
  } catch (err: any) {
    console.warn('⚠️ Could not connect to MySQL database:', err.message);
    console.info('👉 Falling back to local flat-file JSON storage (src/data/db.json).');
    pool = null;
    isMysqlConnected = false;
  }
}

const jsonDbPath = path.join(process.cwd(), 'src', 'data', 'db.json');

// Helper to read JSON data as backup or primary fallback
function getJsonData() {
  try {
    if (fs.existsSync(jsonDbPath)) {
      const raw = fs.readFileSync(jsonDbPath, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (error) {
    console.error('Error reading JSON DB file:', error);
  }
  return {};
}

// Helper to write JSON data
function saveJsonData(key: string, records: any) {
  try {
    const data = getJsonData();
    data[key] = records;
    if (!fs.existsSync(path.dirname(jsonDbPath))) {
      fs.mkdirSync(path.dirname(jsonDbPath), { recursive: true });
    }
    fs.writeFileSync(jsonDbPath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error(`Error saving JSON DB for key ${key}:`, error);
  }
}

// --- API Endpoints ---

// 1. Health & Database connection status
app.get('/api/db-status', (req, res) => {
  res.json({
    status: isMysqlConnected ? 'connected' : 'local_fallback',
    config: {
      host: mysqlConfig.host,
      database: mysqlConfig.database,
      user: mysqlConfig.user,
    },
  });
});

// 2. Fetch all datasets (Initial sync)
app.get('/api/data', async (req, res) => {
  const localData = getJsonData();
  
  if (!isMysqlConnected || !pool) {
    return res.json({
      mode: 'local',
      programs: localData.programs || [],
      disbursements: localData.disbursements || [],
      pwdRecords: localData.pwdRecords || [],
      seniorRecords: localData.seniorRecords || [],
      soloParentRecords: localData.soloParentRecords || [],
      focalPersons: localData.focalPersons || [],
      allocationHistory: localData.allocationHistory || [],
      profile: localData.profile || {
        fullName: 'Catherine Jade',
        email: 'catherine.jade@mswdo.gov.ph',
        contactNumber: '0917-234-5678',
        role: 'Social Welfare Officer III / Administrator',
        profilePic: ''
      },
    });
  }

  try {
    // Read directly from MySQL tables
    const [programs] = await pool.query('SELECT id, name, description, CAST(allocated_budget AS DOUBLE) AS allocatedBudget, CAST(utilized_budget AS DOUBLE) AS utilizedBudget, status, beneficiaries_count AS beneficiariesCount FROM tb_program');
    const [disbursements] = await pool.query('SELECT id, recipient, program_name AS program, CAST(amount AS DOUBLE) AS amount, DATE_FORMAT(disbursement_date, "%Y-%m-%d") AS date, status, barangay FROM tb_disbursement ORDER BY disbursement_date DESC');
    const [pwdRecords] = await pool.query('SELECT id, name, age, gender, barangay, disability_type AS disabilityType, status, assistance_status AS assistanceStatus, DATE_FORMAT(registration_date, "%Y-%m-%d") AS registrationDate FROM tb_pwd_record ORDER BY name ASC');
    const [seniorRecords] = await pool.query('SELECT id, name, age, gender, barangay, pension_status AS pensionStatus, DATE_FORMAT(last_claim_date, "%Y-%m-%d") AS lastClaimDate, contact_number AS contactNumber, DATE_FORMAT(registration_date, "%Y-%m-%d") AS registrationDate FROM tb_senior_record ORDER BY name ASC');
    const [soloParentRecords] = await pool.query('SELECT id, name, age, gender, children_count AS childrenCount, CAST(monthly_income AS DOUBLE) AS monthlyIncome, barangay, card_status AS cardStatus, employment_status AS employmentStatus, DATE_FORMAT(registration_date, "%Y-%m-%d") AS registrationDate FROM tb_solo_parent_record ORDER BY name ASC');
    const [focalPersons] = await pool.query('SELECT id, name, role, assigned_program_id AS assignedProgramId, contact_number AS contactNumber, email, status, caseload FROM tb_focal_person');
    const [allocationHistory] = await pool.query('SELECT id, DATE_FORMAT(date_time, "%Y-%m-%d %H:%i:%s") AS dateTime, program_name AS programName, CAST(previous_budget AS DOUBLE) AS previousBudget, CAST(new_budget AS DOUBLE) AS newBudget, CAST(amount_changed AS DOUBLE) AS amountChanged, budget_source AS budgetSource, remarks, modified_by AS modifiedBy, action_type AS actionType, status FROM tb_allocation_history ORDER BY date_time DESC');
    const [profiles]: any[] = await pool.query('SELECT full_name AS fullName, email, contact_number AS contactNumber, role, profile_pic AS profilePic FROM tb_admin_profile LIMIT 1');

    res.json({
      mode: 'mysql',
      programs,
      disbursements,
      pwdRecords,
      seniorRecords,
      soloParentRecords,
      focalPersons,
      allocationHistory,
      profile: profiles[0] || {
        fullName: 'Catherine Jade',
        email: 'catherine.jade@mswdo.gov.ph',
        contactNumber: '0917-234-5678',
        role: 'Social Welfare Officer III / Administrator',
        profilePic: ''
      },
    });
  } catch (error: any) {
    console.error('MySQL load error, falling back to local JSON:', error.message);
    res.json({
      mode: 'local_fallback',
      error: error.message,
      programs: localData.programs || [],
      disbursements: localData.disbursements || [],
      pwdRecords: localData.pwdRecords || [],
      seniorRecords: localData.seniorRecords || [],
      soloParentRecords: localData.soloParentRecords || [],
      focalPersons: localData.focalPersons || [],
      allocationHistory: localData.allocationHistory || [],
      profile: localData.profile || {},
    });
  }
});

// 3. Upsert Program
app.post('/api/upsert-program', async (req, res) => {
  const program = req.body;
  
  // Always update JSON backup
  const programs = getJsonData().programs || [];
  const index = programs.findIndex((p: any) => p.id === program.id);
  if (index >= 0) {
    programs[index] = program;
  } else {
    programs.push(program);
  }
  saveJsonData('programs', programs);

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO tb_program (id, name, description, allocated_budget, utilized_budget, status, beneficiaries_count)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           description = VALUES(description),
           allocated_budget = VALUES(allocated_budget),
           utilized_budget = VALUES(utilized_budget),
           status = VALUES(status),
           beneficiaries_count = VALUES(beneficiaries_count)`,
        [
          program.id,
          program.name,
          program.description,
          program.allocatedBudget,
          program.utilizedBudget,
          program.status,
          program.beneficiariesCount
        ]
      );
      return res.json({ status: 'success', mode: 'mysql' });
    } catch (err: any) {
      console.error('MySQL program upsert failed:', err.message);
      return res.json({ status: 'local_saved', error: err.message });
    }
  }
  res.json({ status: 'success', mode: 'local' });
});

// 4. Upsert Disbursement
app.post('/api/upsert-disbursement', async (req, res) => {
  const disb = req.body;

  const disbursements = getJsonData().disbursements || [];
  const index = disbursements.findIndex((d: any) => d.id === disb.id);
  if (index >= 0) {
    disbursements[index] = disb;
  } else {
    disbursements.unshift(disb);
  }
  saveJsonData('disbursements', disbursements);

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO tb_disbursement (id, recipient, program_name, amount, disbursement_date, status, barangay)
         VALUES (?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           recipient = VALUES(recipient),
           program_name = VALUES(program_name),
           amount = VALUES(amount),
           disbursement_date = VALUES(disbursement_date),
           status = VALUES(status),
           barangay = VALUES(barangay)`,
        [
          disb.id,
          disb.recipient,
          disb.program,
          disb.amount,
          disb.date,
          disb.status,
          disb.barangay
        ]
      );
      return res.json({ status: 'success', mode: 'mysql' });
    } catch (err: any) {
      console.error('MySQL disbursement upsert failed:', err.message);
      return res.json({ status: 'local_saved', error: err.message });
    }
  }
  res.json({ status: 'success', mode: 'local' });
});

// 5. Upsert PWD Record
app.post('/api/upsert-pwd', async (req, res) => {
  const record = req.body;

  const pwdRecords = getJsonData().pwdRecords || [];
  const index = pwdRecords.findIndex((r: any) => r.id === record.id);
  if (index >= 0) {
    pwdRecords[index] = record;
  } else {
    pwdRecords.unshift(record);
  }
  saveJsonData('pwdRecords', pwdRecords);

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO tb_pwd_record (id, name, age, gender, barangay, disability_type, status, assistance_status, registration_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           age = VALUES(age),
           gender = VALUES(gender),
           barangay = VALUES(barangay),
           disability_type = VALUES(disability_type),
           status = VALUES(status),
           assistance_status = VALUES(assistance_status),
           registration_date = VALUES(registration_date)`,
        [
          record.id,
          record.name,
          record.age,
          record.gender,
          record.barangay,
          record.disabilityType,
          record.status,
          record.assistanceStatus,
          record.registrationDate
        ]
      );
      return res.json({ status: 'success', mode: 'mysql' });
    } catch (err: any) {
      console.error('MySQL PWD upsert failed:', err.message);
      return res.json({ status: 'local_saved', error: err.message });
    }
  }
  res.json({ status: 'success', mode: 'local' });
});

// 6. Upsert Senior Record
app.post('/api/upsert-senior', async (req, res) => {
  const record = req.body;

  const seniorRecords = getJsonData().seniorRecords || [];
  const index = seniorRecords.findIndex((r: any) => r.id === record.id);
  if (index >= 0) {
    seniorRecords[index] = record;
  } else {
    seniorRecords.unshift(record);
  }
  saveJsonData('seniorRecords', seniorRecords);

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO tb_senior_record (id, name, age, gender, barangay, pension_status, last_claim_date, contact_number, registration_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           age = VALUES(age),
           gender = VALUES(gender),
           barangay = VALUES(barangay),
           pension_status = VALUES(pension_status),
           last_claim_date = VALUES(last_claim_date),
           contact_number = VALUES(contact_number),
           registration_date = VALUES(registration_date)`,
        [
          record.id,
          record.name,
          record.age,
          record.gender,
          record.barangay,
          record.pensionStatus,
          record.lastClaimDate || null,
          record.contactNumber,
          record.registrationDate
        ]
      );
      return res.json({ status: 'success', mode: 'mysql' });
    } catch (err: any) {
      console.error('MySQL senior upsert failed:', err.message);
      return res.json({ status: 'local_saved', error: err.message });
    }
  }
  res.json({ status: 'success', mode: 'local' });
});

// 7. Upsert Solo Parent Record
app.post('/api/upsert-soloparent', async (req, res) => {
  const record = req.body;

  const soloParentRecords = getJsonData().soloParentRecords || [];
  const index = soloParentRecords.findIndex((r: any) => r.id === record.id);
  if (index >= 0) {
    soloParentRecords[index] = record;
  } else {
    soloParentRecords.unshift(record);
  }
  saveJsonData('soloParentRecords', soloParentRecords);

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO tb_solo_parent_record (id, name, age, gender, children_count, monthly_income, barangay, card_status, employment_status, registration_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           age = VALUES(age),
           gender = VALUES(gender),
           children_count = VALUES(children_count),
           monthly_income = VALUES(monthly_income),
           barangay = VALUES(barangay),
           card_status = VALUES(card_status),
           employment_status = VALUES(employment_status),
           registration_date = VALUES(registration_date)`,
        [
          record.id,
          record.name,
          record.age,
          record.gender,
          record.childrenCount,
          record.monthlyIncome,
          record.barangay,
          record.cardStatus,
          record.employmentStatus,
          record.registrationDate
        ]
      );
      return res.json({ status: 'success', mode: 'mysql' });
    } catch (err: any) {
      console.error('MySQL solo parent upsert failed:', err.message);
      return res.json({ status: 'local_saved', error: err.message });
    }
  }
  res.json({ status: 'success', mode: 'local' });
});

// 8. Upsert Focal Person
app.post('/api/upsert-focal', async (req, res) => {
  const focal = req.body;

  const focalPersons = getJsonData().focalPersons || [];
  const index = focalPersons.findIndex((f: any) => f.id === focal.id);
  if (index >= 0) {
    focalPersons[index] = focal;
  } else {
    focalPersons.push(focal);
  }
  saveJsonData('focalPersons', focalPersons);

  if (isMysqlConnected && pool) {
    try {
      await pool.query(
        `INSERT INTO tb_focal_person (id, name, role, assigned_program_id, contact_number, email, status, caseload)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           name = VALUES(name),
           role = VALUES(role),
           assigned_program_id = VALUES(assigned_program_id),
           contact_number = VALUES(contact_number),
           email = VALUES(email),
           status = VALUES(status),
           caseload = VALUES(caseload)`,
        [
          focal.id,
          focal.name,
          focal.role,
          focal.assignedProgramId || null,
          focal.contactNumber,
          focal.email,
          focal.status,
          focal.caseload
        ]
      );
      return res.json({ status: 'success', mode: 'mysql' });
    } catch (err: any) {
      console.error('MySQL focal person upsert failed:', err.message);
      return res.json({ status: 'local_saved', error: err.message });
    }
  }
  res.json({ status: 'success', mode: 'local' });
});

// 9. Delete Focal Person
app.post('/api/delete-focal', async (req, res) => {
  const { id } = req.body;

  const focalPersons = getJsonData().focalPersons || [];
  const filtered = focalPersons.filter((f: any) => f.id !== id);
  saveJsonData('focalPersons', filtered);

  if (isMysqlConnected && pool) {
    try {
      await pool.query('DELETE FROM tb_focal_person WHERE id = ?', [id]);
      return res.json({ status: 'success', mode: 'mysql' });
    } catch (err: any) {
      console.error('MySQL focal person deletion failed:', err.message);
      return res.json({ status: 'local_saved', error: err.message });
    }
  }
  res.json({ status: 'success', mode: 'local' });
});

// 10. Upsert Allocation History
app.post('/api/upsert-history', async (req, res) => {
  const history = req.body;

  const allocationHistory = getJsonData().allocationHistory || [];
  const index = allocationHistory.findIndex((h: any) => h.id === history.id);
  if (index >= 0) {
    allocationHistory[index] = history;
  } else {
    allocationHistory.unshift(history);
  }
  saveJsonData('allocationHistory', allocationHistory);

  if (isMysqlConnected && pool) {
    try {
      // Re-format custom date if needed (history date can come as "YYYY-MM-DD HH:MM:SS" or dynamic format)
      // We will parse it and match standard DATETIME
      let formattedDate = history.dateTime;
      if (history.dateTime.includes('AM') || history.dateTime.includes('PM')) {
        // e.g., "2026-06-20 09:30 AM" -> convert to YYYY-MM-DD HH:MM:SS
        const parts = history.dateTime.split(' ');
        const datePart = parts[0];
        const timePart = parts[1];
        const ampm = parts[2];
        let [hours, minutes] = timePart.split(':').map(Number);
        if (ampm === 'PM' && hours < 12) hours += 12;
        if (ampm === 'AM' && hours === 12) hours = 0;
        formattedDate = `${datePart} ${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`;
      }

      await pool.query(
        `INSERT INTO tb_allocation_history (id, date_time, program_name, previous_budget, new_budget, amount_changed, budget_source, remarks, modified_by, action_type, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           date_time = VALUES(date_time),
           program_name = VALUES(program_name),
           previous_budget = VALUES(previous_budget),
           new_budget = VALUES(new_budget),
           amount_changed = VALUES(amount_changed),
           budget_source = VALUES(budget_source),
           remarks = VALUES(remarks),
           modified_by = VALUES(modified_by),
           action_type = VALUES(action_type),
           status = VALUES(status)`,
        [
          history.id,
          formattedDate,
          history.programName,
          history.previousBudget,
          history.newBudget,
          history.amountChanged,
          history.budgetSource,
          history.remarks,
          history.modifiedBy,
          history.actionType,
          history.status
        ]
      );
      return res.json({ status: 'success', mode: 'mysql' });
    } catch (err: any) {
      console.error('MySQL history upsert failed:', err.message);
      return res.json({ status: 'local_saved', error: err.message });
    }
  }
  res.json({ status: 'success', mode: 'local' });
});

// --- Start Server and Vite setup ---
async function startServer() {
  await initDatabase();

  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
