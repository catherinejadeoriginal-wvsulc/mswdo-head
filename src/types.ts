export interface Disbursement {
  id: string;
  recipient: string;
  program: string;
  amount: number;
  date: string;
  status: 'Disbursed' | 'Pending' | 'Rejected';
  barangay: string;
}

export interface AICSProgram {
  id: string;
  name: string;
  description: string;
  allocatedBudget: number;
  utilizedBudget: number;
  status: 'Active' | 'Inactive';
  beneficiariesCount: number;
}

export interface PWDRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  barangay: string;
  disabilityType: string;
  status: 'Active' | 'Inactive';
  assistanceStatus: 'Claimed' | 'Unclaimed';
  registrationDate: string;
}

export interface SeniorRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  barangay: string;
  pensionStatus: 'Active' | 'Suspended' | 'Pending';
  lastClaimDate: string;
  contactNumber: string;
  registrationDate: string;
}

export interface SoloParentRecord {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  childrenCount: number;
  monthlyIncome: number;
  barangay: string;
  cardStatus: 'Active' | 'Expired' | 'Pending';
  employmentStatus: 'Employed' | 'Unemployed' | 'Self-Employed';
  registrationDate: string;
}

export interface BarangayRequest {
  id: string;
  name: string;
  pendingRequests: number;
  status: 'CRITICAL' | 'MODERATE' | 'STABLE';
}

export interface MonthlyData {
  month: string;
  spent: number;
  forecast: number;
}

export interface AllocationHistoryRecord {
  id: string;
  dateTime: string;
  programName: string;
  previousBudget: number;
  newBudget: number;
  amountChanged: number;
  budgetSource: string;
  remarks: string;
  modifiedBy: string;
  actionType: 'Allocated' | 'Edited' | 'Transferred';
  status: 'Completed' | 'Failed';
}

export type ActiveTab = 'dashboard' | 'analytics' | 'programs' | 'pwd' | 'seniors' | 'soloparents' | 'focal' | 'budget' | 'reports';
