import { Disbursement, AICSProgram, PWDRecord, SeniorRecord, SoloParentRecord, BarangayRequest, MonthlyData } from '../types';

export const INITIAL_PROGRAMS: AICSProgram[] = [
  {
    id: 'prog-1',
    name: 'AICS - Educational Assistance',
    description: 'Financial assistance provided to students from low-income families to cover tuition, books, and transport.',
    allocatedBudget: 4500000,
    utilizedBudget: 3200000,
    status: 'Active',
    beneficiariesCount: 640
  },
  {
    id: 'prog-2',
    name: 'AICS - Medical Assistance',
    description: 'Financial support for medical bills, prescription medications, dialysis, chemo, and hospitalization costs.',
    allocatedBudget: 6000000,
    utilizedBudget: 4800000,
    status: 'Active',
    beneficiariesCount: 384
  },
  {
    id: 'prog-3',
    name: 'Senior Citizen Social Pension',
    description: 'Quarterly pension provided to qualified indigent senior citizens for daily subsistence and health needs.',
    allocatedBudget: 4000000,
    utilizedBudget: 2100000,
    status: 'Active',
    beneficiariesCount: 700
  },
  {
    id: 'prog-4',
    name: 'PWD Quarterly Financial Aid',
    description: 'Financial subsidy for registered PWDs to assist with specialized equipment, therapies, or living costs.',
    allocatedBudget: 2200000,
    utilizedBudget: 900000,
    status: 'Active',
    beneficiariesCount: 220
  },
  {
    id: 'prog-5',
    name: 'AICS - Burial Assistance',
    description: 'Financial subsidy for burial services, casket, and funeral costs for indigent families.',
    allocatedBudget: 1000000,
    utilizedBudget: 300000,
    status: 'Active',
    beneficiariesCount: 60
  },
  {
    id: 'prog-6',
    name: 'Solo Parents Cash Incentive',
    description: 'Monthly subsidy program aimed at helping single parents support their children’s basic needs.',
    allocatedBudget: 500000,
    utilizedBudget: 100000,
    status: 'Active',
    beneficiariesCount: 150
  }
];

export const INITIAL_DISBURSEMENTS: Disbursement[] = [
  {
    id: 'disb-1',
    recipient: 'Dela Cruz, Juan',
    program: 'AICS - Educational',
    amount: 5000,
    date: '2024-10-24',
    status: 'Disbursed',
    barangay: 'Poblacion I'
  },
  {
    id: 'disb-2',
    recipient: 'Santos, Maria',
    program: 'Senior Social Pension',
    amount: 3000,
    date: '2024-10-23',
    status: 'Pending',
    barangay: 'San Isidro'
  },
  {
    id: 'disb-3',
    recipient: 'Bautista, Jose',
    program: 'AICS - Medical',
    amount: 12500,
    date: '2024-10-22',
    status: 'Disbursed',
    barangay: 'Bukidnon East'
  },
  {
    id: 'disb-4',
    recipient: 'Reyes, Elena',
    program: 'PWD Assistance',
    amount: 2500,
    date: '2024-10-21',
    status: 'Rejected',
    barangay: 'Poblacion I'
  },
  {
    id: 'disb-5',
    recipient: 'Aquino, Fernando',
    program: 'AICS - Burial',
    amount: 10000,
    date: '2024-10-20',
    status: 'Disbursed',
    barangay: 'Maligaya'
  },
  {
    id: 'disb-6',
    recipient: 'Gonzales, Clara',
    program: 'Solo Parents Cash Incentive',
    amount: 1500,
    date: '2024-10-19',
    status: 'Disbursed',
    barangay: 'Santa Rosa'
  },
  {
    id: 'disb-7',
    recipient: 'Villanueva, Antonio',
    program: 'AICS - Medical',
    amount: 7500,
    date: '2024-10-18',
    status: 'Pending',
    barangay: 'San Isidro'
  },
  {
    id: 'disb-8',
    recipient: 'Cruz, Teresa',
    program: 'Senior Social Pension',
    amount: 3000,
    date: '2024-10-18',
    status: 'Disbursed',
    barangay: 'Bukidnon East'
  }
];

export const INITIAL_PWD_RECORDS: PWDRecord[] = [
  {
    id: 'PWD-2024-001',
    name: 'Reyes, Elena',
    age: 28,
    gender: 'Female',
    barangay: 'Poblacion I',
    disabilityType: 'Visual Impairment',
    status: 'Active',
    assistanceStatus: 'Unclaimed',
    registrationDate: '2024-02-15'
  },
  {
    id: 'PWD-2024-002',
    name: 'Dizon, Marc Anthony',
    age: 12,
    gender: 'Male',
    barangay: 'Maligaya',
    disabilityType: 'Autism Spectrum Disorder',
    status: 'Active',
    assistanceStatus: 'Claimed',
    registrationDate: '2024-04-10'
  },
  {
    id: 'PWD-2024-003',
    name: 'Mendoza, Remedios',
    age: 64,
    gender: 'Female',
    barangay: 'San Isidro',
    disabilityType: 'Orthopedic Disability',
    status: 'Active',
    assistanceStatus: 'Claimed',
    registrationDate: '2023-11-05'
  },
  {
    id: 'PWD-2024-004',
    name: 'Torres, Carlos',
    age: 35,
    gender: 'Male',
    barangay: 'Santa Rosa',
    disabilityType: 'Hearing Impairment',
    status: 'Active',
    assistanceStatus: 'Unclaimed',
    registrationDate: '2024-01-20'
  },
  {
    id: 'PWD-2024-005',
    name: 'Castro, Ricardo',
    age: 42,
    gender: 'Male',
    barangay: 'Bukidnon East',
    disabilityType: 'Psychosocial Disability',
    status: 'Inactive',
    assistanceStatus: 'Unclaimed',
    registrationDate: '2022-08-14'
  },
  {
    id: 'PWD-2024-006',
    name: 'Salvador, Beatrice',
    age: 19,
    gender: 'Female',
    barangay: 'Poblacion I',
    disabilityType: 'Speech and Language Impairment',
    status: 'Active',
    assistanceStatus: 'Claimed',
    registrationDate: '2024-06-18'
  }
];

export const INITIAL_SENIOR_RECORDS: SeniorRecord[] = [
  {
    id: 'SNR-2024-001',
    name: 'Santos, Maria',
    age: 72,
    gender: 'Female',
    barangay: 'San Isidro',
    pensionStatus: 'Pending',
    lastClaimDate: '2024-09-15',
    contactNumber: '0917-888-2940',
    registrationDate: '2021-03-12'
  },
  {
    id: 'SNR-2024-002',
    name: 'Cruz, Teresa',
    age: 68,
    gender: 'Female',
    barangay: 'Bukidnon East',
    pensionStatus: 'Active',
    lastClaimDate: '2024-10-18',
    contactNumber: '0918-726-1188',
    registrationDate: '2022-05-19'
  },
  {
    id: 'SNR-2024-003',
    name: 'Garcia, Manuel',
    age: 81,
    gender: 'Male',
    barangay: 'Poblacion I',
    pensionStatus: 'Active',
    lastClaimDate: '2024-10-15',
    contactNumber: '0922-192-3847',
    registrationDate: '2019-10-04'
  },
  {
    id: 'SNR-2024-004',
    name: 'Ramos, Eduardo',
    age: 75,
    gender: 'Male',
    barangay: 'Maligaya',
    pensionStatus: 'Suspended',
    lastClaimDate: '2024-06-30',
    contactNumber: '0905-294-1184',
    registrationDate: '2020-07-22'
  },
  {
    id: 'SNR-2024-005',
    name: 'Solis, Jovita',
    age: 66,
    gender: 'Female',
    barangay: 'Santa Rosa',
    pensionStatus: 'Active',
    lastClaimDate: '2024-10-10',
    contactNumber: '0945-883-9912',
    registrationDate: '2023-01-14'
  }
];

export const INITIAL_SOLO_PARENT_RECORDS: SoloParentRecord[] = [
  {
    id: 'SLP-2024-001',
    name: 'Gonzales, Clara',
    age: 32,
    gender: 'Female',
    childrenCount: 3,
    monthlyIncome: 12000,
    barangay: 'Santa Rosa',
    cardStatus: 'Active',
    employmentStatus: 'Employed',
    registrationDate: '2023-04-18'
  },
  {
    id: 'SLP-2024-002',
    name: 'Rivera, Jocelyn',
    age: 41,
    gender: 'Female',
    childrenCount: 2,
    monthlyIncome: 8500,
    barangay: 'Poblacion I',
    cardStatus: 'Active',
    employmentStatus: 'Self-Employed',
    registrationDate: '2022-09-05'
  },
  {
    id: 'SLP-2024-003',
    name: 'Pascual, Jonathan',
    age: 38,
    gender: 'Male',
    childrenCount: 1,
    monthlyIncome: 18000,
    barangay: 'Maligaya',
    cardStatus: 'Active',
    employmentStatus: 'Employed',
    registrationDate: '2024-01-15'
  },
  {
    id: 'SLP-2024-004',
    name: 'Laxamana, Sarah',
    age: 26,
    gender: 'Female',
    childrenCount: 2,
    monthlyIncome: 4500,
    barangay: 'Bukidnon East',
    cardStatus: 'Pending',
    employmentStatus: 'Unemployed',
    registrationDate: '2024-08-30'
  },
  {
    id: 'SLP-2024-005',
    name: 'Gomez, Michael',
    age: 45,
    gender: 'Male',
    childrenCount: 4,
    monthlyIncome: 15000,
    barangay: 'San Isidro',
    cardStatus: 'Expired',
    employmentStatus: 'Self-Employed',
    registrationDate: '2021-02-11'
  }
];

export const INITIAL_BARANGAY_REQUESTS: BarangayRequest[] = [
  { id: 'brgy-1', name: 'Poblacion I', pendingRequests: 142, status: 'CRITICAL' },
  { id: 'brgy-2', name: 'San Isidro', pendingRequests: 88, status: 'MODERATE' },
  { id: 'brgy-3', name: 'Maligaya', pendingRequests: 31, status: 'STABLE' },
  { id: 'brgy-4', name: 'Santa Rosa', pendingRequests: 12, status: 'STABLE' },
  { id: 'brgy-5', name: 'Bukidnon East', pendingRequests: 75, status: 'MODERATE' },
  { id: 'brgy-6', name: 'Alang-alang', pendingRequests: 45, status: 'MODERATE' },
  { id: 'brgy-7', name: 'Batinguel', pendingRequests: 18, status: 'STABLE' },
  { id: 'brgy-8', name: 'Tacloban West', pendingRequests: 110, status: 'CRITICAL' }
];

export const INITIAL_MONTHLY_DATA: MonthlyData[] = [
  { month: 'Jan', spent: 1.2, forecast: 1.3 },
  { month: 'Feb', spent: 1.4, forecast: 1.3 },
  { month: 'Mar', spent: 0.9, forecast: 1.3 },
  { month: 'Apr', spent: 2.1, forecast: 1.3 },
  { month: 'May', spent: 1.8, forecast: 1.3 },
  { month: 'Jun', spent: 2.5, forecast: 1.3 },
  { month: 'Jul', spent: 3.2, forecast: 1.3 },
  { month: 'Aug', spent: 2.8, forecast: 1.3 },
  { month: 'Sep', spent: 1.9, forecast: 1.3 },
  { month: 'Oct', spent: 1.4, forecast: 1.3 }
];

export const LIST_OF_BARANGAYS = [
  'Poblacion I',
  'San Isidro',
  'Maligaya',
  'Santa Rosa',
  'Bukidnon East',
  'Alang-alang',
  'Batinguel',
  'Tacloban West',
  'Poblacion II',
  'Calindagan',
  'Bagacay',
  'Mangnao',
  'Daro',
  'Banilad'
];
