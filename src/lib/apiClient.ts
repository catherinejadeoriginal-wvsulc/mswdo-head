import { 
  AICSProgram, 
  Disbursement, 
  PWDRecord, 
  SeniorRecord, 
  SoloParentRecord, 
  AllocationHistoryRecord 
} from '../types';
import { FocalPerson } from '../components/FocalView';

// Read values from Vite environment or detect if running in Express environment
export const isApiAvailable = true; // Always true because Express server serves the API

export interface FullSyncData {
  mode: 'mysql' | 'local' | 'local_fallback';
  programs: AICSProgram[];
  disbursements: Disbursement[];
  pwdRecords: PWDRecord[];
  seniorRecords: SeniorRecord[];
  soloParentRecords: SoloParentRecord[];
  focalPersons: FocalPerson[];
  allocationHistory: AllocationHistoryRecord[];
  profile: {
    fullName: string;
    email: string;
    contactNumber: string;
    role: string;
    profilePic: string;
  };
}

export const dbService = {
  // 1. Initial full database sync
  async syncAllData(): Promise<FullSyncData> {
    const res = await fetch('/api/data');
    if (!res.ok) {
      throw new Error(`Failed to fetch database records: ${res.statusText}`);
    }
    return res.json();
  },

  // 2. Programs
  async upsertProgram(p: AICSProgram): Promise<void> {
    const res = await fetch('/api/upsert-program', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(p),
    });
    if (!res.ok) throw new Error('Failed to upsert program');
  },

  // 3. Disbursements
  async upsertDisbursement(d: Disbursement): Promise<void> {
    const res = await fetch('/api/upsert-disbursement', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(d),
    });
    if (!res.ok) throw new Error('Failed to upsert disbursement');
  },

  // 4. PWD Records
  async upsertPWDRecord(r: PWDRecord): Promise<void> {
    const res = await fetch('/api/upsert-pwd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    });
    if (!res.ok) throw new Error('Failed to upsert PWD record');
  },

  // 5. Senior Records
  async upsertSeniorRecord(r: SeniorRecord): Promise<void> {
    const res = await fetch('/api/upsert-senior', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    });
    if (!res.ok) throw new Error('Failed to upsert senior record');
  },

  // 6. Solo Parent Records
  async upsertSoloParentRecord(r: SoloParentRecord): Promise<void> {
    const res = await fetch('/api/upsert-soloparent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(r),
    });
    if (!res.ok) throw new Error('Failed to upsert solo parent record');
  },

  // 7. Focal Persons
  async upsertFocalPerson(f: FocalPerson): Promise<void> {
    const res = await fetch('/api/upsert-focal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(f),
    });
    if (!res.ok) throw new Error('Failed to upsert focal person');
  },

  async deleteFocalPerson(id: string): Promise<void> {
    const res = await fetch('/api/delete-focal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!res.ok) throw new Error('Failed to delete focal person');
  },

  // 8. Allocation History
  async upsertAllocationHistory(h: AllocationHistoryRecord): Promise<void> {
    const res = await fetch('/api/upsert-history', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(h),
    });
    if (!res.ok) throw new Error('Failed to upsert allocation history');
  }
};
