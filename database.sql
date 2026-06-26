-- MSWDO Head Portal Database Schema
-- For PHP & MySQL Deployment

CREATE DATABASE IF NOT EXISTS mswdo_db;
USE mswdo_db;

-- 1. Programs Table
CREATE TABLE IF NOT EXISTS tb_program (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    allocated_budget DECIMAL(15,2) DEFAULT 0.00,
    utilized_budget DECIMAL(15,2) DEFAULT 0.00,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    beneficiaries_count INT DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 2. Focal Persons Table
CREATE TABLE IF NOT EXISTS tb_focal_person (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    assigned_program_id VARCHAR(50),
    contact_number VARCHAR(50),
    email VARCHAR(255) NOT NULL,
    status ENUM('Active', 'On Leave', 'Suspended') DEFAULT 'Active',
    caseload INT DEFAULT 0,
    FOREIGN KEY (assigned_program_id) REFERENCES tb_program(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 3. Disbursements Table
CREATE TABLE IF NOT EXISTS tb_disbursement (
    id VARCHAR(50) PRIMARY KEY,
    recipient VARCHAR(255) NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    disbursement_date DATE NOT NULL,
    status ENUM('Disbursed', 'Pending', 'Rejected') DEFAULT 'Pending',
    barangay VARCHAR(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. PWD Records Table
CREATE TABLE IF NOT EXISTS tb_pwd_record (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    disability_type VARCHAR(255) NOT NULL,
    status ENUM('Active', 'Inactive') DEFAULT 'Active',
    assistance_status ENUM('Claimed', 'Unclaimed') DEFAULT 'Unclaimed',
    registration_date DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 5. Senior Records Table
CREATE TABLE IF NOT EXISTS tb_senior_record (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    barangay VARCHAR(100) NOT NULL,
    pension_status ENUM('Active', 'Suspended', 'Pending') DEFAULT 'Active',
    last_claim_date DATE,
    contact_number VARCHAR(50),
    registration_date DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 6. Solo Parent Records Table
CREATE TABLE IF NOT EXISTS tb_solo_parent_record (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NOT NULL,
    children_count INT NOT NULL DEFAULT 0,
    monthly_income DECIMAL(15,2) DEFAULT 0.00,
    barangay VARCHAR(100) NOT NULL,
    card_status ENUM('Active', 'Expired', 'Pending') DEFAULT 'Active',
    employment_status ENUM('Employed', 'Unemployed', 'Self-Employed') DEFAULT 'Employed',
    registration_date DATE NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 7. Allocation History Table
CREATE TABLE IF NOT EXISTS tb_allocation_history (
    id VARCHAR(50) PRIMARY KEY,
    date_time DATETIME NOT NULL,
    program_name VARCHAR(255) NOT NULL,
    previous_budget DECIMAL(15,2) NOT NULL,
    new_budget DECIMAL(15,2) NOT NULL,
    amount_changed DECIMAL(15,2) NOT NULL,
    budget_source VARCHAR(255) DEFAULT '',
    remarks TEXT,
    modified_by VARCHAR(255) NOT NULL,
    action_type ENUM('Allocated', 'Edited', 'Transferred') NOT NULL,
    status ENUM('Completed', 'Failed') DEFAULT 'Completed'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 8. Admin Profile Table
CREATE TABLE IF NOT EXISTS tb_admin_profile (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    contact_number VARCHAR(50),
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(255) DEFAULT 'Administrator',
    profile_pic TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


-- SEED INITIAL DATA

-- Admin Seed (password123 hash)
INSERT INTO tb_admin_profile (id, full_name, email, contact_number, password_hash, role, profile_pic) VALUES
(1, 'Catherine Jade', 'catherine.jade@mswdo.gov.ph', '0917-234-5678', '$2y$10$YCoZpX.3g1C3F7X77tZ8KOfU2lV9O1PqF2rSe99v6G6/D/sB7vJmC', 'Social Welfare Officer III / Administrator', 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjgw3zekIdHW14ZhlK-2eoMxUnbcYPjqLpUbNEiTtdqGJvUBmzL2ZEAx34HGvQP8bh-vSrazKIsTA5PMRK-4p7fNKlobG4qD-FMS8mUX8ALFlgBLopDchkz6PhvShaz1XA2Kj5EuLhzgaGJu5llBHMmmHkivosHkxTT0WEIwkKVvcaff01e8RwQTlhLnIQRTMPHFqyO-CDcXdHLMcPw5Kgci_PzxLSB6glDI-oNYb_f06u1kBl92au4EfKrOmAdqp_qlmcHEsT93o');

-- Program Seeds
INSERT INTO tb_program (id, name, description, allocated_budget, utilized_budget, status, beneficiaries_count) VALUES
('prog-1', 'AICS - Educational Assistance', 'Financial assistance provided to students from low-income families to cover tuition, books, and transport.', 4500000.00, 3200000.00, 'Active', 640),
('prog-2', 'AICS - Medical Assistance', 'Financial support for medical bills, prescription medications, dialysis, chemo, and hospitalization costs.', 6000000.00, 4800000.00, 'Active', 384),
('prog-3', 'Senior Citizen Social Pension', 'Quarterly pension provided to qualified indigent senior citizens for daily subsistence and health needs.', 4000000.00, 2100000.00, 'Active', 700),
('prog-4', 'PWD Quarterly Financial Aid', 'Financial subsidy for registered PWDs to assist with specialized equipment, therapies, or living costs.', 2200000.00, 900000.00, 'Active', 220),
('prog-5', 'AICS - Burial Assistance', 'Financial subsidy for burial services, casket, and funeral costs for indigent families.', 1000000.00, 300000.00, 'Active', 60),
('prog-6', 'Solo Parents Cash Incentive', 'Monthly subsidy program aimed at helping single parents support their children’s basic needs.', 500000.00, 100000.00, 'Active', 150);

-- Focal Person Seeds
INSERT INTO tb_focal_person (id, name, role, assigned_program_id, contact_number, email, status, caseload) VALUES
('foc-1', 'Catherine Jade', 'Social Welfare Officer III', 'prog-2', '0917-234-5678', 'catherine.jade@mswdo.gov.ph', 'Active', 34),
('foc-2', 'Mark Antonio', 'Social Welfare Officer II', 'prog-1', '0918-765-4321', 'mark.antonio@mswdo.gov.ph', 'Active', 45),
('foc-3', 'Atty. Clara Gomez', 'PWD Focal Coordinator', 'prog-4', '0922-444-5555', 'clara.gomez@mswdo.gov.ph', 'Active', 22),
('foc-4', 'Engr. Robert Santos', 'Senior Citizens Office Head', 'prog-3', '0905-111-2222', 'robert.santos@mswdo.gov.ph', 'On Leave', 12),
('foc-5', 'Remedios Laxamana', 'Social Welfare Officer I', 'prog-6', '0945-333-4444', 'remedios.laxamana@mswdo.gov.ph', 'Active', 18);

-- Disbursement Seeds
INSERT INTO tb_disbursement (id, recipient, program_name, amount, disbursement_date, status, barangay) VALUES
('disb-1', 'Dela Cruz, Juan', 'AICS - Educational Assistance', 5000.00, '2024-10-24', 'Disbursed', 'Poblacion I'),
('disb-2', 'Santos, Maria', 'Senior Citizen Social Pension', 3000.00, '2024-10-23', 'Pending', 'San Isidro'),
('disb-3', 'Bautista, Jose', 'AICS - Medical Assistance', 12500.00, '2024-10-22', 'Disbursed', 'Bukidnon East'),
('disb-4', 'Reyes, Elena', 'PWD Quarterly Financial Aid', 2500.00, '2024-10-21', 'Rejected', 'Poblacion I'),
('disb-5', 'Aquino, Fernando', 'AICS - Burial Assistance', 10000.00, '2024-10-20', 'Disbursed', 'Maligaya'),
('disb-6', 'Gonzales, Clara', 'Solo Parents Cash Incentive', 1500.00, '2024-10-19', 'Disbursed', 'Santa Rosa'),
('disb-7', 'Villanueva, Antonio', 'AICS - Medical Assistance', 7500.00, '2024-10-18', 'Pending', 'San Isidro'),
('disb-8', 'Cruz, Teresa', 'Senior Citizen Social Pension', 3000.00, '2024-10-18', 'Disbursed', 'Bukidnon East');

-- PWD Record Seeds
INSERT INTO tb_pwd_record (id, name, age, gender, barangay, disability_type, status, assistance_status, registration_date) VALUES
('PWD-2024-001', 'Reyes, Elena', 28, 'Female', 'Poblacion I', 'Visual Impairment', 'Active', 'Unclaimed', '2024-02-15'),
('PWD-2024-002', 'Dizon, Marc Anthony', 12, 'Male', 'Maligaya', 'Autism Spectrum Disorder', 'Active', 'Claimed', '2024-04-10'),
('PWD-2024-003', 'Mendoza, Remedios', 64, 'Female', 'San Isidro', 'Orthopedic Disability', 'Active', 'Claimed', '2023-11-05'),
('PWD-2024-004', 'Torres, Carlos', 35, 'Male', 'Santa Rosa', 'Hearing Impairment', 'Active', 'Unclaimed', '2024-01-20'),
('PWD-2024-005', 'Castro, Ricardo', 42, 'Male', 'Bukidnon East', 'Psychosocial Disability', 'Inactive', 'Unclaimed', '2022-08-14'),
('PWD-2024-006', 'Salvador, Beatrice', 19, 'Female', 'Poblacion I', 'Speech and Language Impairment', 'Active', 'Claimed', '2024-06-18');

-- Senior Record Seeds
INSERT INTO tb_senior_record (id, name, age, gender, barangay, pension_status, last_claim_date, contact_number, registration_date) VALUES
('SNR-2024-001', 'Santos, Maria', 72, 'Female', 'San Isidro', 'Pending', '2024-09-15', '0917-888-2940', '2021-03-12'),
('SNR-2024-002', 'Cruz, Teresa', 68, 'Female', 'Bukidnon East', 'Active', '2024-10-18', '0918-726-1188', '2022-05-19'),
('SNR-2024-003', 'Garcia, Manuel', 81, 'Male', 'Poblacion I', 'Active', '2024-10-15', '0922-192-3847', '2019-10-04'),
('SNR-2024-004', 'Ramos, Eduardo', 75, 'Male', 'Maligaya', 'Suspended', '2024-06-30', '0905-294-1184', '2020-07-22'),
('SNR-2024-005', 'Solis, Jovita', 66, 'Female', 'Santa Rosa', 'Active', '2024-10-10', '0945-883-9912', '2023-01-14');

-- Solo Parent Record Seeds
INSERT INTO tb_solo_parent_record (id, name, age, gender, children_count, monthly_income, barangay, card_status, employment_status, registration_date) VALUES
('SLP-2024-001', 'Gonzales, Clara', 32, 'Female', 3, 12000.00, 'Santa Rosa', 'Active', 'Employed', '2023-04-18'),
('SLP-2024-002', 'Rivera, Jocelyn', 41, 'Female', 2, 8500.00, 'Poblacion I', 'Active', 'Self-Employed', '2022-09-05'),
('SLP-2024-003', 'Pascual, Jonathan', 38, 'Male', 1, 18000.00, 'Maligaya', 'Active', 'Employed', '2024-01-15'),
('SLP-2024-004', 'Laxamana, Sarah', 26, 'Female', 2, 4500.00, 'Bukidnon East', 'Pending', 'Unemployed', '2024-08-30'),
('SLP-2024-005', 'Gomez, Michael', 45, 'Male', 4, 15000.00, 'San Isidro', 'Expired', 'Self-Employed', '2021-02-11');

-- Allocation History Seeds
INSERT INTO tb_allocation_history (id, date_time, program_name, previous_budget, new_budget, amount_changed, budget_source, remarks, modified_by, action_type, status) VALUES
('TXN-984123', '2026-06-20 09:30:00', 'AICS - Educational Assistance', 4000000.00, 4500000.00, 500000.00, 'LGU Q3 Supplemental Fund', 'Supplemental funding for Q4 scholarship grantees', 'Catherine Jade', 'Allocated', 'Completed'),
('TXN-874211', '2026-06-18 14:15:00', 'AICS - Medical Assistance', 6000000.00, 5500000.00, -500000.00, 'Internal Social Reallocation', 'Budget reduction due to mid-year surplus assessment', 'Catherine Jade', 'Edited', 'Completed'),
('TXN-382910', '2026-06-18 14:20:00', 'Senior Citizen Social Pension', 3500000.00, 4000000.00, 500000.00, 'Internal Social Reallocation', 'Transferred from AICS Medical Assistance to cover additional indigent seniors list', 'Catherine Jade', 'Transferred', 'Completed');
