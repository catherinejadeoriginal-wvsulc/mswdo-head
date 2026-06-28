import React, { useState, useEffect } from 'react';
import { 
  ActiveTab, 
  Disbursement, 
  AICSProgram, 
  PWDRecord, 
  SeniorRecord, 
  SoloParentRecord, 
  BarangayRequest,
  MonthlyData,
  AllocationHistoryRecord
} from './types';
import { 
  INITIAL_PROGRAMS, 
  INITIAL_DISBURSEMENTS, 
  INITIAL_PWD_RECORDS, 
  INITIAL_SENIOR_RECORDS, 
  INITIAL_SOLO_PARENT_RECORDS, 
  INITIAL_BARANGAY_REQUESTS, 
  INITIAL_MONTHLY_DATA,
  LIST_OF_BARANGAYS
} from './data/mockData';

// Icons
import { 
  Menu, 
  Bell, 
  LayoutDashboard, 
  Users, 
  Heart, 
  UserRound, 
  Coins, 
  Search, 
  LogOut, 
  X, 
  CheckCircle2, 
  Home, 
  FileCheck,
  ChevronDown,
  ChevronRight,
  Brain,
  UserCheck,
  FileSpreadsheet,
  Settings
} from 'lucide-react';

import { motion, AnimatePresence } from 'motion/react';

// Views
import DashboardView from './components/DashboardView';
import ProgramsView from './components/ProgramsView';
import PWDRegistryView from './components/PWDRegistryView';
import SeniorsView from './components/SeniorsView';
import SoloParentsView from './components/SoloParentsView';
import AnalyticsView from './components/AnalyticsView';
import FocalView, { FocalPerson } from './components/FocalView';
import BudgetView from './components/BudgetView';
import ReportsView from './components/ReportsView';
import ProfileModal from './components/ProfileModal';
import LoginView from './components/LoginView';
import { isApiAvailable as isSupabaseConfigured, dbService } from './lib/apiClient';

// Initial Focal Persons list
const INITIAL_FOCAL_PERSONS: FocalPerson[] = [
  { 
    id: 'foc-1', 
    name: 'Catherine Jade', 
    role: 'Social Welfare Officer III', 
    assignedProgramId: 'prog-2', // Medical Assistance
    contactNumber: '0917-234-5678', 
    email: 'catherine.jade@mswdo.gov.ph', 
    status: 'Active', 
    caseload: 34 
  },
  { 
    id: 'foc-2', 
    name: 'Mark Antonio', 
    role: 'Social Welfare Officer II', 
    assignedProgramId: 'prog-1', // Educational Assistance
    contactNumber: '0918-765-4321', 
    email: 'mark.antonio@mswdo.gov.ph', 
    status: 'Active', 
    caseload: 45 
  },
  { 
    id: 'foc-3', 
    name: 'Atty. Clara Gomez', 
    role: 'PWD Focal Coordinator', 
    assignedProgramId: 'prog-4', // PWD Aid
    contactNumber: '0922-444-5555', 
    email: 'clara.gomez@mswdo.gov.ph', 
    status: 'Active', 
    caseload: 22 
  },
  { 
    id: 'foc-4', 
    name: 'Engr. Robert Santos', 
    role: 'Senior Citizens Office Head', 
    assignedProgramId: 'prog-3', // Senior Pension
    contactNumber: '0905-111-2222', 
    email: 'robert.santos@mswdo.gov.ph', 
    status: 'On Leave', 
    caseload: 12 
  },
  { 
    id: 'foc-5', 
    name: 'Remedios Laxamana', 
    role: 'Social Welfare Officer I', 
    assignedProgramId: 'prog-6', // Solo Parents Incentive
    contactNumber: '0945-333-4444', 
    email: 'remedios.laxamana@mswdo.gov.ph', 
    status: 'Active', 
    caseload: 18 
  }
];

export default function App() {
  // Session login state
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('mswdo_logged_in') === 'true';
  });

  const handleLogout = () => {
    localStorage.removeItem('mswdo_logged_in');
    setIsLoggedIn(false);
  };

  // Database Connection Mode & Sync state
  const [dbMode, setDbMode] = useState<'local' | 'mysql'>('local');
  const [isLoadingDB, setIsLoadingDB] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  // State variables synchronized with localStorage
  const [activeTab, setActiveTab] = useState<ActiveTab>(() => {
    return (localStorage.getItem('mswdo_active_tab') as ActiveTab) || 'dashboard';
  });
  
  const [programs, setPrograms] = useState<AICSProgram[]>(() => {
    const saved = localStorage.getItem('mswdo_programs');
    return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
  });

  const [disbursements, setDisbursements] = useState<Disbursement[]>(() => {
    const saved = localStorage.getItem('mswdo_disbursements');
    return saved ? JSON.parse(saved) : INITIAL_DISBURSEMENTS;
  });

  const [pwdRecords, setPWDRecords] = useState<PWDRecord[]>(() => {
    const saved = localStorage.getItem('mswdo_pwd_records');
    return saved ? JSON.parse(saved) : INITIAL_PWD_RECORDS;
  });

  const [seniorRecords, setSeniorRecords] = useState<SeniorRecord[]>(() => {
    const saved = localStorage.getItem('mswdo_senior_records');
    return saved ? JSON.parse(saved) : INITIAL_SENIOR_RECORDS;
  });

  const [soloParentRecords, setSoloParentRecords] = useState<SoloParentRecord[]>(() => {
    const saved = localStorage.getItem('mswdo_soloparent_records');
    return saved ? JSON.parse(saved) : INITIAL_SOLO_PARENT_RECORDS;
  });

  const [barangayRequests, setBarangayRequests] = useState<BarangayRequest[]>(() => {
    const saved = localStorage.getItem('mswdo_barangay_requests');
    return saved ? JSON.parse(saved) : INITIAL_BARANGAY_REQUESTS;
  });

  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>(() => {
    const saved = localStorage.getItem('mswdo_monthly_data');
    return saved ? JSON.parse(saved) : INITIAL_MONTHLY_DATA;
  });

  const [focalPersons, setFocalPersons] = useState<FocalPerson[]>(() => {
    const saved = localStorage.getItem('mswdo_focal_persons');
    return saved ? JSON.parse(saved) : INITIAL_FOCAL_PERSONS;
  });

  const [allocationHistory, setAllocationHistory] = useState<AllocationHistoryRecord[]>(() => {
    const saved = localStorage.getItem('mswdo_allocation_history');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'TXN-984123',
        dateTime: '2026-06-20 09:30 AM',
        programName: 'AICS - Educational Assistance',
        previousBudget: 4000000,
        newBudget: 4500000,
        amountChanged: 500000,
        budgetSource: 'LGU Q3 Supplemental Fund',
        remarks: 'Supplemental funding for Q4 scholarship grantees',
        modifiedBy: 'Catherine Jade',
        actionType: 'Allocated',
        status: 'Completed'
      },
      {
        id: 'TXN-874211',
        dateTime: '2026-06-18 02:15 PM',
        programName: 'AICS - Medical Assistance',
        previousBudget: 6000000,
        newBudget: 5500000,
        amountChanged: -500000,
        budgetSource: 'Internal Social Reallocation',
        remarks: 'Budget reduction due to mid-year surplus assessment',
        modifiedBy: 'Catherine Jade',
        actionType: 'Edited',
        status: 'Completed'
      },
      {
        id: 'TXN-382910',
        dateTime: '2026-06-18 02:20 PM',
        programName: 'Senior Citizen Social Pension',
        previousBudget: 3500000,
        newBudget: 4000000,
        amountChanged: 500000,
        budgetSource: 'Internal Social Reallocation',
        remarks: 'Transferred from AICS Medical Assistance to cover additional indigent seniors list',
        modifiedBy: 'Catherine Jade',
        actionType: 'Transferred',
        status: 'Completed'
      }
    ];
  });

  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('mswdo_profile');
    return saved ? JSON.parse(saved) : {
      fullName: 'Catherine Jade',
      email: 'catherine.jade@mswdo.gov.ph',
      contactNumber: '0917-234-5678',
      password: 'password123',
      role: 'Social Welfare Officer III / Administrator',
      profilePic: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjgw3zekIdHW14ZhlK-2eoMxUnbcYPjqLpUbNEiTtdqGJvUBmzL2ZEAx34HGvQP8bh-vSrazKIsTA5PMRK-4p7fNKlobG4qD-FMS8mUX8ALFlgBLopDchkz6PhvShaz1XA2Kj5EuLhzgaGJu5llBHMmmHkivosHkxTT0WEIwkKVvcaff01e8RwQTlhLnIQRTMPHFqyO-CDcXdHLMcPw5Kgci_PzxLSB6glDI-oNYb_f06u1kBl92au4EfKrOmAdqp_qlmcHEsT93o'
    };
  });

  const handleAddHistoryRecord = (record: Omit<AllocationHistoryRecord, 'id' | 'dateTime' | 'status'>) => {
    const formatDateTime = () => {
      const d = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      let hours = d.getHours();
      const minutes = pad(d.getMinutes());
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      return `${year}-${month}-${day} ${pad(hours)}:${minutes} ${ampm}`;
    };

    const newRecord: AllocationHistoryRecord = {
      ...record,
      id: `TXN-${Math.floor(100000 + Math.random() * 900000)}`,
      dateTime: formatDateTime(),
      status: 'Completed'
    };
    setAllocationHistory(prev => [newRecord, ...prev]);
    if (isSupabaseConfigured) {
      dbService.upsertAllocationHistory(newRecord).catch(err => console.error("Error upserting history in Supabase:", err));
    }
  };

  // UI state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationsBadge, setNotificationsBadge] = useState(true);
  const [topSearch, setTopSearch] = useState('');
  const [isProgramsMenuExpanded, setIsProgramsMenuExpanded] = useState(true);

  // Modals state
  const [showAddGrantModal, setShowAddGrantModal] = useState(false);
  const [selectedBarangay, setSelectedBarangay] = useState<BarangayRequest | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // Add Grant Form fields
  const [recipient, setRecipient] = useState('');
  const [selectedProgramId, setSelectedProgramId] = useState(programs[0]?.id || '');
  const [grantAmount, setGrantAmount] = useState(5000);
  const [grantBarangay, setGrantBarangay] = useState(LIST_OF_BARANGAYS[0]);
  const [grantStatus, setGrantStatus] = useState<'Disbursed' | 'Pending'>('Disbursed');

  // Initial data synchronization from Express API / MySQL database
  useEffect(() => {
    if (isSupabaseConfigured) {
      const loadDatabaseData = async () => {
        setIsLoadingDB(true);
        setDbError(null);
        try {
          const data = await dbService.syncAllData();
          if (data.programs && data.programs.length > 0) setPrograms(data.programs);
          if (data.disbursements && data.disbursements.length > 0) setDisbursements(data.disbursements);
          if (data.pwdRecords && data.pwdRecords.length > 0) setPWDRecords(data.pwdRecords);
          if (data.seniorRecords && data.seniorRecords.length > 0) setSeniorRecords(data.seniorRecords);
          if (data.soloParentRecords && data.soloParentRecords.length > 0) setSoloParentRecords(data.soloParentRecords);
          if (data.focalPersons && data.focalPersons.length > 0) setFocalPersons(data.focalPersons);
          if (data.allocationHistory && data.allocationHistory.length > 0) setAllocationHistory(data.allocationHistory);
          if (data.profile && data.profile.fullName) setProfile((prev: any) => ({ ...prev, ...data.profile }));
          setDbMode(data.mode === 'mysql' ? 'mysql' : 'local');
        } catch (err: any) {
          console.error("Failed to sync database data:", err);
          setDbError(err.message || 'MySQL database connection failed.');
          setDbMode('local'); // Fallback to local state
        } finally {
          setIsLoadingDB(false);
        }
      };
      loadDatabaseData();
    } else {
      setDbMode('local');
    }
  }, []);

  // Persistence side effects
  useEffect(() => {
    localStorage.setItem('mswdo_active_tab', activeTab);
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem('mswdo_programs', JSON.stringify(programs));
  }, [programs]);

  useEffect(() => {
    localStorage.setItem('mswdo_disbursements', JSON.stringify(disbursements));
  }, [disbursements]);

  useEffect(() => {
    localStorage.setItem('mswdo_pwd_records', JSON.stringify(pwdRecords));
  }, [pwdRecords]);

  useEffect(() => {
    localStorage.setItem('mswdo_senior_records', JSON.stringify(seniorRecords));
  }, [seniorRecords]);

  useEffect(() => {
    localStorage.setItem('mswdo_soloparent_records', JSON.stringify(soloParentRecords));
  }, [soloParentRecords]);

  useEffect(() => {
    localStorage.setItem('mswdo_barangay_requests', JSON.stringify(barangayRequests));
  }, [barangayRequests]);

  useEffect(() => {
    localStorage.setItem('mswdo_monthly_data', JSON.stringify(monthlyData));
  }, [monthlyData]);

  useEffect(() => {
    localStorage.setItem('mswdo_focal_persons', JSON.stringify(focalPersons));
  }, [focalPersons]);

  useEffect(() => {
    localStorage.setItem('mswdo_allocation_history', JSON.stringify(allocationHistory));
  }, [allocationHistory]);

  useEffect(() => {
    localStorage.setItem('mswdo_profile', JSON.stringify(profile));
  }, [profile]);

  // Handle active navigation
  const navigateToTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
  };

  // Add a new disbursement (Grant release)
  const handleAddDisbursement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient.trim() || grantAmount <= 0) return;

    const matchedProgram = programs.find(p => p.id === selectedProgramId);

    const newDisb: Disbursement = {
      id: `disb-${Date.now().toString().slice(-6)}`,
      recipient,
      program: matchedProgram ? matchedProgram.name : 'AICS Grant',
      amount: grantAmount,
      date: new Date().toISOString().slice(0, 10),
      status: grantStatus,
      barangay: grantBarangay
    };

    // Update disbursements
    setDisbursements(prev => [newDisb, ...prev]);
    if (isSupabaseConfigured) {
      dbService.upsertDisbursement(newDisb).catch(err => console.error("Error upserting disbursement:", err));
    }

    // If active and disbursed, automatically update program utilization!
    if (grantStatus === 'Disbursed') {
      setPrograms(prev => prev.map(p => {
        if (p.id === selectedProgramId) {
          const updatedProgram = {
            ...p,
            utilizedBudget: p.utilizedBudget + grantAmount,
            beneficiariesCount: p.beneficiariesCount + 1
          };
          if (isSupabaseConfigured) {
            dbService.upsertProgram(updatedProgram).catch(err => console.error("Error updating program:", err));
          }
          return updatedProgram;
        }
        return p;
      }));

      // Update monthly chart values (adding to Oct spent for simulation!)
      setMonthlyData(prev => prev.map(m => {
        if (m.month === 'Oct') {
          return { ...m, spent: Number((m.spent + (grantAmount / 1000000)).toFixed(2)) };
        }
        return m;
      }));
    }

    // Reset Form
    setRecipient('');
    setGrantAmount(5000);
    setGrantBarangay(LIST_OF_BARANGAYS[0]);
    setGrantStatus('Disbursed');
    setShowAddGrantModal(false);
  };

  // Create Program
  const handleAddProgram = (newProg: Omit<AICSProgram, 'id' | 'utilizedBudget' | 'beneficiariesCount'>) => {
    const newProgram: AICSProgram = {
      ...newProg,
      id: `prog-${(programs.length + 1)}`,
      utilizedBudget: 0,
      beneficiariesCount: 0
    };
    setPrograms(prev => [...prev, newProgram]);
    if (isSupabaseConfigured) {
      dbService.upsertProgram(newProgram).catch(err => console.error("Error adding program:", err));
    }
  };

  // Update budget allocation for a program
  const handleUpdateProgramBudget = (id: string, newAlloc: number) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === id) {
        const updatedProgram = { ...p, allocatedBudget: newAlloc };
        if (isSupabaseConfigured) {
          dbService.upsertProgram(updatedProgram).catch(err => console.error("Error updating program budget:", err));
        }
        return updatedProgram;
      }
      return p;
    }));
  };

  // Toggle program status (Active/Inactive)
  const handleToggleProgramStatus = (id: string) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === id) {
        const nextStatus = p.status === 'Active' ? 'Inactive' : 'Active';
        const updatedProgram = { ...p, status: nextStatus };
        if (isSupabaseConfigured) {
          dbService.upsertProgram(updatedProgram).catch(err => console.error("Error toggling program status:", err));
        }
        return updatedProgram;
      }
      return p;
    }));
  };

  // Register PWD
  const handleAddPWDRecord = (newPWD: Omit<PWDRecord, 'id' | 'registrationDate'>) => {
    const newRecord: PWDRecord = {
      ...newPWD,
      id: `PWD-2026-${(pwdRecords.length + 1).toString().padStart(3, '0')}`,
      registrationDate: new Date().toISOString().slice(0, 10)
    };
    setPWDRecords(prev => [newRecord, ...prev]);
    if (isSupabaseConfigured) {
      dbService.upsertPWDRecord(newRecord).catch(err => console.error("Error adding PWD:", err));
    }
  };

  // Update PWD Status
  const handleUpdatePWDStatus = (id: string, status: 'Active' | 'Inactive') => {
    setPWDRecords(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, status };
        if (isSupabaseConfigured) {
          dbService.upsertPWDRecord(updated).catch(err => console.error("Error updating PWD status:", err));
        }
        return updated;
      }
      return r;
    }));
  };

  // Toggle PWD Allowance claim
  const handleToggleAssistanceClaim = (id: string) => {
    setPWDRecords(prev => prev.map(r => {
      if (r.id === id) {
        const nextStatus = r.assistanceStatus === 'Claimed' ? 'Unclaimed' : 'Claimed';
        const updated = { ...r, assistanceStatus: nextStatus };
        if (isSupabaseConfigured) {
          dbService.upsertPWDRecord(updated).catch(err => console.error("Error toggling PWD claim status:", err));
        }
        return updated;
      }
      return r;
    }));
  };

  // Register Senior Citizen
  const handleAddSeniorRecord = (newSenior: Omit<SeniorRecord, 'id' | 'registrationDate'>) => {
    const newRecord: SeniorRecord = {
      ...newSenior,
      id: `SNR-2026-${(seniorRecords.length + 1).toString().padStart(3, '0')}`,
      registrationDate: new Date().toISOString().slice(0, 10)
    };
    setSeniorRecords(prev => [newRecord, ...prev]);
    if (isSupabaseConfigured) {
      dbService.upsertSeniorRecord(newRecord).catch(err => console.error("Error adding Senior:", err));
    }
  };

  // Update Pension Status for Senior Citizen
  const handleUpdatePensionStatus = (id: string, status: 'Active' | 'Suspended' | 'Pending') => {
    setSeniorRecords(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, pensionStatus: status };
        if (isSupabaseConfigured) {
          dbService.upsertSeniorRecord(updated).catch(err => console.error("Error updating Senior pension status:", err));
        }
        return updated;
      }
      return r;
    }));
  };

  // Disburse Pension for a Senior
  const handleDisbursePension = (id: string) => {
    const senior = seniorRecords.find(r => r.id === id);
    if (!senior) return;

    // Release ₱1,000 monthly stipend
    const stipendAmount = 1000;
    const newDisb: Disbursement = {
      id: `disb-${Date.now().toString().slice(-6)}`,
      recipient: senior.name,
      program: 'Senior Social Pension',
      amount: stipendAmount,
      date: new Date().toISOString().slice(0, 10),
      status: 'Disbursed',
      barangay: senior.barangay
    };

    // Add to disbursements
    setDisbursements(prev => [newDisb, ...prev]);
    if (isSupabaseConfigured) {
      dbService.upsertDisbursement(newDisb).catch(err => console.error("Error upserting pension disbursement:", err));
    }

    // Deduct from program budget
    setPrograms(prev => prev.map(p => {
      if (p.id === 'prog-3') { // Senior Program ID
        const updatedProgram = {
          ...p,
          utilizedBudget: p.utilizedBudget + stipendAmount,
          beneficiariesCount: p.beneficiariesCount + 1
        };
        if (isSupabaseConfigured) {
          dbService.upsertProgram(updatedProgram).catch(err => console.error("Error updating program budget:", err));
        }
        return updatedProgram;
      }
      return p;
    }));

    // Update claim date
    setSeniorRecords(prev => prev.map(r => {
      if (r.id === id) {
        const updatedSenior = { ...r, lastClaimDate: new Date().toISOString().slice(0, 10) };
        if (isSupabaseConfigured) {
          dbService.upsertSeniorRecord(updatedSenior).catch(err => console.error("Error updating senior last claim date:", err));
        }
        return updatedSenior;
      }
      return r;
    }));
  };

  // Register Solo Parent
  const handleAddSoloParentRecord = (newRecord: Omit<SoloParentRecord, 'id' | 'registrationDate'>) => {
    const fullRec: SoloParentRecord = {
      ...newRecord,
      id: `SLP-2026-${(soloParentRecords.length + 1).toString().padStart(3, '0')}`,
      registrationDate: new Date().toISOString().slice(0, 10)
    };
    setSoloParentRecords(prev => [fullRec, ...prev]);
    if (isSupabaseConfigured) {
      dbService.upsertSoloParentRecord(fullRec).catch(err => console.error("Error adding Solo Parent:", err));
    }
  };

  // Renew Solo Parent Card
  const handleRenewCard = (id: string) => {
    setSoloParentRecords(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, cardStatus: 'Active' as const };
        if (isSupabaseConfigured) {
          dbService.upsertSoloParentRecord(updated).catch(err => console.error("Error renewing card:", err));
        }
        return updated;
      }
      return r;
    }));
  };

  // Update Solo Parent employment
  const handleUpdateEmployment = (id: string, empStatus: 'Employed' | 'Unemployed' | 'Self-Employed') => {
    setSoloParentRecords(prev => prev.map(r => {
      if (r.id === id) {
        const updated = { ...r, employmentStatus: empStatus };
        if (isSupabaseConfigured) {
          dbService.upsertSoloParentRecord(updated).catch(err => console.error("Error updating employment:", err));
        }
        return updated;
      }
      return r;
    }));
  };

  // Handle Barangay list click
  const handleBarangayClick = (brgy: BarangayRequest) => {
    setSelectedBarangay(brgy);
  };

  // Process Barangay request actions (Approve/Reject)
  const handleResolveBarangayRequest = (type: 'approve' | 'reject') => {
    if (!selectedBarangay) return;

    if (type === 'approve') {
      // Simulate creating a medical grant to resolve
      const activePrograms = programs.filter(p => p.status === 'Active');
      const randomProgram = activePrograms[Math.floor(Math.random() * activePrograms.length)] || programs[0];
      
      const stipendAmount = 3500;
      const newDisb: Disbursement = {
        id: `disb-${Date.now().toString().slice(-6)}`,
        recipient: `Barangay ${selectedBarangay.name} Client`,
        program: randomProgram.name,
        amount: stipendAmount,
        date: new Date().toISOString().slice(0, 10),
        status: 'Disbursed',
        barangay: selectedBarangay.name
      };

      setDisbursements(prev => [newDisb, ...prev]);
      if (isSupabaseConfigured) {
        dbService.upsertDisbursement(newDisb).catch(err => console.error("Error adding disbursement for barangay request:", err));
      }

      setPrograms(prev => prev.map(p => {
        if (p.id === randomProgram.id) {
          const updatedProgram = {
            ...p,
            utilizedBudget: p.utilizedBudget + stipendAmount,
            beneficiariesCount: p.beneficiariesCount + 1
          };
          if (isSupabaseConfigured) {
            dbService.upsertProgram(updatedProgram).catch(err => console.error("Error updating program for barangay request:", err));
          }
          return updatedProgram;
        }
        return p;
      }));
    }

    // Decrement pending requests count
    setBarangayRequests(prev => prev.map(b => {
      if (b.id === selectedBarangay.id) {
        const nextPending = Math.max(0, b.pendingRequests - 1);
        const nextStatus = nextPending > 100 ? 'CRITICAL' : nextPending > 30 ? 'MODERATE' : 'STABLE';
        return { ...b, pendingRequests: nextPending, status: nextStatus };
      }
      return b;
    }));

    // Re-get selected barangay with updated fields
    setSelectedBarangay(prev => {
      if (!prev) return null;
      const nextPending = Math.max(0, prev.pendingRequests - 1);
      const nextStatus = nextPending > 100 ? 'CRITICAL' : nextPending > 30 ? 'MODERATE' : 'STABLE';
      return { ...prev, pendingRequests: nextPending, status: nextStatus };
    });
  };

  // Re-allocate / Transfer budget approval from Analytics/Budget Simulation
  const handleApplyRecommendation = (sourceProgId: string, destProgId: string, amount: number) => {
    setPrograms(prev => prev.map(p => {
      if (p.id === sourceProgId) {
        const updated = { ...p, allocatedBudget: Math.max(0, p.allocatedBudget - amount) };
        if (isSupabaseConfigured) {
          dbService.upsertProgram(updated).catch(err => console.error("Error updating source program budget:", err));
        }
        return updated;
      }
      if (p.id === destProgId) {
        const updated = { ...p, allocatedBudget: p.allocatedBudget + amount };
        if (isSupabaseConfigured) {
          dbService.upsertProgram(updated).catch(err => console.error("Error updating dest program budget:", err));
        }
        return updated;
      }
      return p;
    }));
  };

  // Focal person mutations
  const handleAddFocalPerson = (focal: Omit<FocalPerson, 'id' | 'caseload'>) => {
    const newFoc: FocalPerson = {
      ...focal,
      id: `foc-${(focalPersons.length + 1)}`,
      caseload: Math.floor(Math.random() * 30) + 10
    };
    setFocalPersons(prev => [...prev, newFoc]);
    if (isSupabaseConfigured) {
      dbService.upsertFocalPerson(newFoc).catch(err => console.error("Error adding focal person:", err));
    }
  };

  const handleUpdateFocalPerson = (id: string, updated: Partial<FocalPerson>) => {
    setFocalPersons(prev => prev.map(f => {
      if (f.id === id) {
        const merged = { ...f, ...updated };
        if (isSupabaseConfigured) {
          dbService.upsertFocalPerson(merged).catch(err => console.error("Error updating focal person:", err));
        }
        return merged;
      }
      return f;
    }));
  };

  const handleDeleteFocalPerson = (id: string) => {
    setFocalPersons(prev => prev.filter(f => f.id !== id));
    if (isSupabaseConfigured) {
      dbService.deleteFocalPerson(id).catch(err => console.error("Error deleting focal person:", err));
    }
  };

  // Dynamic content router
  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView 
            programs={programs}
            disbursements={disbursements}
            barangayRequests={barangayRequests}
            monthlyData={monthlyData}
            onAddDisbursementClick={() => setShowAddGrantModal(true)}
            onViewAllDisbursementsClick={() => navigateToTab('reports')}
            onBarangayClick={handleBarangayClick}
            onViewDetailedMapClick={() => navigateToTab('analytics')}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView 
            programs={programs}
            barangayRequests={barangayRequests}
            disbursements={disbursements}
            onApplyRecommendation={handleApplyRecommendation}
          />
        );
      case 'programs':
        return (
          <ProgramsView 
            programs={programs}
            onAddProgram={handleAddProgram}
            onUpdateProgramBudget={handleUpdateProgramBudget}
            onToggleProgramStatus={handleToggleProgramStatus}
          />
        );
      case 'pwd':
        return (
          <PWDRegistryView 
            pwdRecords={pwdRecords}
            onAddPWDRecord={handleAddPWDRecord}
            onUpdatePWDStatus={handleUpdatePWDStatus}
            onToggleAssistanceClaim={handleToggleAssistanceClaim}
          />
        );
      case 'seniors':
        return (
          <SeniorsView 
            seniorRecords={seniorRecords}
            onAddSeniorRecord={handleAddSeniorRecord}
            onUpdatePensionStatus={handleUpdatePensionStatus}
            onDisbursePension={handleDisbursePension}
          />
        );
      case 'soloparents':
        return (
          <SoloParentsView 
            soloParentRecords={soloParentRecords}
            onAddSoloParentRecord={handleAddSoloParentRecord}
            onRenewCard={handleRenewCard}
            onUpdateEmployment={handleUpdateEmployment}
          />
        );
      case 'focal':
        return (
          <FocalView 
            programs={programs}
            focalPersons={focalPersons}
            onAddFocalPerson={handleAddFocalPerson}
            onUpdateFocalPerson={handleUpdateFocalPerson}
            onDeleteFocalPerson={handleDeleteFocalPerson}
          />
        );
      case 'budget':
        return (
          <BudgetView 
            programs={programs}
            onUpdateProgramBudget={handleUpdateProgramBudget}
            onApplyRecommendation={handleApplyRecommendation}
            allocationHistory={allocationHistory}
            onAddHistoryRecord={handleAddHistoryRecord}
            setPrograms={setPrograms}
            profile={profile}
          />
        );
      case 'reports':
        return (
          <ReportsView 
            programs={programs}
            disbursements={disbursements}
            barangayRequests={barangayRequests}
          />
        );
      default:
        return <div>View not found</div>;
    }
  };

  const isProgramsTabActive = ['programs', 'pwd', 'seniors', 'soloparents'].includes(activeTab);

  if (!isLoggedIn) {
    return (
      <LoginView 
        correctEmail={profile.email} 
        correctPass={profile.password || 'password123'} 
        onLoginSuccess={() => {
          localStorage.setItem('mswdo_logged_in', 'true');
          setIsLoggedIn(true);
        }}
      />
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f9f9ff] text-[#151c27] font-sans antialiased" id="mswdo-app-root">
      
      {/* 1. Desktop Side Navigation Rail */}
      <aside className="hidden lg:flex flex-col h-screen sticky top-0 bg-white border-r border-[#c3c5d7] w-[280px] shadow-sm shrink-0 z-20" id="desktop-sidebar">
        <div className="p-8 space-y-6">
          <div className="flex flex-col items-start gap-1">
            <span className="text-xl font-black text-[#003fb1] tracking-tight">MSWDO Admin</span>
            <span className="text-[#5c5f60] text-xs font-semibold uppercase tracking-wider">Social Welfare Office</span>
          </div>

          <div 
            onClick={() => setShowProfileModal(true)}
            className="flex items-center gap-3 p-3 bg-[#e2e8f8] rounded-2xl hover:bg-[#dce2f3] transition-colors cursor-pointer"
          >
            <img 
              className="w-10 h-10 rounded-full object-cover border border-blue-200 shadow-xs shrink-0"
              src={profile.profilePic} 
              alt={profile.fullName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200';
              }}
            />
            <div className="min-w-0">
              <p className="text-xs font-black truncate">{profile.fullName}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-widest">● Online</span>
                <span className="text-gray-400">|</span>
                {isLoadingDB ? (
                  <span className="text-[9px] uppercase font-bold text-amber-500 tracking-widest animate-pulse">Syncing...</span>
                ) : dbMode === 'mysql' ? (
                  <span className="text-[9px] uppercase font-bold text-blue-600 tracking-widest" title="Connected to MySQL Database">MySQL Active</span>
                ) : (
                  <span className="text-[9px] uppercase font-bold text-gray-500 tracking-widest" title="Using Local Flat-File JSON">Local Fallback</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Nav Items */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {/* Dashboard */}
          <button
            onClick={() => navigateToTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-xs rounded-xl transition-all cursor-pointer group ${
              activeTab === 'dashboard' 
                ? 'bg-[#1a56db] text-white shadow-sm font-bold scale-[1.01]' 
                : 'text-[#5c5f60] hover:bg-[#dee0e2]/40 hover:text-[#151c27]'
            }`}
          >
            <LayoutDashboard className="w-5 h-5 shrink-0" />
            <span>Dashboard</span>
          </button>

          {/* Analytics & Decision Support */}
          <button
            onClick={() => navigateToTab('analytics')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-xs rounded-xl transition-all cursor-pointer group ${
              activeTab === 'analytics' 
                ? 'bg-[#1a56db] text-white shadow-sm font-bold scale-[1.01]' 
                : 'text-[#5c5f60] hover:bg-[#dee0e2]/40 hover:text-[#151c27]'
            }`}
          >
            <Brain className="w-5 h-5 shrink-0" />
            <span>Analytics & Decision</span>
          </button>

          {/* Programs Collapsible Menu Group */}
          <div className="space-y-1">
            <button
              onClick={() => setIsProgramsMenuExpanded(!isProgramsMenuExpanded)}
              className={`w-full flex items-center justify-between px-4 py-3 font-semibold text-xs rounded-xl transition-all cursor-pointer text-[#5c5f60] hover:bg-[#dee0e2]/40 hover:text-[#151c27] ${
                isProgramsTabActive ? 'bg-[#dee0e2]/25 text-[#151c27] font-bold' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 shrink-0" />
                <span>Programs Registry</span>
              </div>
              {isProgramsMenuExpanded ? (
                <ChevronDown className="w-4 h-4 text-slate-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400" />
              )}
            </button>

            {isProgramsMenuExpanded && (
              <div className="pl-4 pr-1 py-1 space-y-1 border-l-2 border-[#e2e8f8] ml-6">
                <button
                  onClick={() => navigateToTab('programs')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 font-medium text-[11px] rounded-lg transition-all text-left ${
                    activeTab === 'programs'
                      ? 'bg-[#003fb1]/10 text-[#003fb1] font-bold'
                      : 'text-[#5c5f60] hover:bg-slate-100 hover:text-[#151c27]'
                  }`}
                >
                  <FileCheck className="w-4 h-4 shrink-0" />
                  <span>AICS Crisis Assistance</span>
                </button>
                <button
                  onClick={() => navigateToTab('pwd')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 font-medium text-[11px] rounded-lg transition-all text-left ${
                    activeTab === 'pwd'
                      ? 'bg-[#003fb1]/10 text-[#003fb1] font-bold'
                      : 'text-[#5c5f60] hover:bg-slate-100 hover:text-[#151c27]'
                  }`}
                >
                  <Users className="w-4 h-4 shrink-0" />
                  <span>PWD Registry</span>
                </button>
                <button
                  onClick={() => navigateToTab('seniors')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 font-medium text-[11px] rounded-lg transition-all text-left ${
                    activeTab === 'seniors'
                      ? 'bg-[#003fb1]/10 text-[#003fb1] font-bold'
                      : 'text-[#5c5f60] hover:bg-slate-100 hover:text-[#151c27]'
                  }`}
                >
                  <Heart className="w-4 h-4 shrink-0" />
                  <span>Senior Citizens</span>
                </button>
                <button
                  onClick={() => navigateToTab('soloparents')}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 font-medium text-[11px] rounded-lg transition-all text-left ${
                    activeTab === 'soloparents'
                      ? 'bg-[#003fb1]/10 text-[#003fb1] font-bold'
                      : 'text-[#5c5f60] hover:bg-slate-100 hover:text-[#151c27]'
                  }`}
                >
                  <UserRound className="w-4 h-4 shrink-0" />
                  <span>Solo Parents</span>
                </button>
              </div>
            )}
          </div>

          {/* Focal Management */}
          <button
            onClick={() => navigateToTab('focal')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-xs rounded-xl transition-all cursor-pointer group ${
              activeTab === 'foc' || activeTab === 'focal'
                ? 'bg-[#1a56db] text-white shadow-sm font-bold scale-[1.01]' 
                : 'text-[#5c5f60] hover:bg-[#dee0e2]/40 hover:text-[#151c27]'
            }`}
          >
            <UserCheck className="w-5 h-5 shrink-0" />
            <span>Focal Management</span>
          </button>

          {/* Budget Management */}
          <button
            onClick={() => navigateToTab('budget')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-xs rounded-xl transition-all cursor-pointer group ${
              activeTab === 'budget' 
                ? 'bg-[#1a56db] text-white shadow-sm font-bold scale-[1.01]' 
                : 'text-[#5c5f60] hover:bg-[#dee0e2]/40 hover:text-[#151c27]'
            }`}
          >
            <Coins className="w-5 h-5 shrink-0" />
            <span>Budget Management</span>
          </button>

          {/* Reports & Ledger */}
          <button
            onClick={() => navigateToTab('reports')}
            className={`w-full flex items-center gap-3 px-4 py-3 font-semibold text-xs rounded-xl transition-all cursor-pointer group ${
              activeTab === 'reports' 
                ? 'bg-[#1a56db] text-white shadow-sm font-bold scale-[1.01]' 
                : 'text-[#5c5f60] hover:bg-[#dee0e2]/40 hover:text-[#151c27]'
            }`}
          >
            <FileSpreadsheet className="w-5 h-5 shrink-0" />
            <span>Ledger & Reports</span>
          </button>
        </nav>

        {/* Bottom controls */}
        <div className="p-6 mt-auto border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 border border-[#737686] hover:bg-slate-50 transition-colors rounded-xl text-[#5c5f60] hover:text-[#151c27] text-xs font-bold"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer (Sidebar Overlay) */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <div className="fixed inset-0 z-50 flex lg:hidden">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />

            {/* Content drawer */}
            <motion.div 
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="relative w-[280px] h-full bg-white flex flex-col p-6 shadow-2xl z-20"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-lg font-black text-[#003fb1]">MSWDO Admin</span>
                  <p className="text-[10px] uppercase font-bold text-[#5c5f60] tracking-wider">Social Welfare</p>
                </div>
                <button 
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className="p-1.5 hover:bg-slate-50 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation links */}
              <nav className="space-y-1 flex-1 overflow-y-auto">
                <button
                  onClick={() => navigateToTab('dashboard')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl transition-all ${
                    activeTab === 'dashboard' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                  }`}
                >
                  <LayoutDashboard className="w-5 h-5 shrink-0" />
                  <span>Dashboard</span>
                </button>

                <button
                  onClick={() => navigateToTab('analytics')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl transition-all ${
                    activeTab === 'analytics' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                  }`}
                >
                  <Brain className="w-5 h-5 shrink-0" />
                  <span>Analytics</span>
                </button>

                <div className="py-1">
                  <p className="px-4 py-1 text-[9px] uppercase font-black tracking-widest text-slate-400">Registries</p>
                  <button
                    onClick={() => navigateToTab('programs')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs rounded-xl transition-all ${
                      activeTab === 'programs' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                    }`}
                  >
                    <FileCheck className="w-5 h-5 shrink-0" />
                    <span>AICS Assistance</span>
                  </button>
                  <button
                    onClick={() => navigateToTab('pwd')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs rounded-xl transition-all ${
                      activeTab === 'pwd' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-5 h-5 shrink-0" />
                    <span>PWD Registry</span>
                  </button>
                  <button
                    onClick={() => navigateToTab('seniors')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs rounded-xl transition-all ${
                      activeTab === 'seniors' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                    }`}
                  >
                    <Heart className="w-5 h-5 shrink-0" />
                    <span>Seniors Citizens</span>
                  </button>
                  <button
                    onClick={() => navigateToTab('soloparents')}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 font-bold text-xs rounded-xl transition-all ${
                      activeTab === 'soloparents' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                    }`}
                  >
                    <UserRound className="w-5 h-5 shrink-0" />
                    <span>Solo Parents</span>
                  </button>
                </div>

                <button
                  onClick={() => navigateToTab('focal')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl transition-all ${
                    activeTab === 'focal' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                  }`}
                >
                  <UserCheck className="w-5 h-5 shrink-0" />
                  <span>Focal Management</span>
                </button>

                <button
                  onClick={() => navigateToTab('budget')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl transition-all ${
                    activeTab === 'budget' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                  }`}
                >
                  <Coins className="w-5 h-5 shrink-0" />
                  <span>Budget Management</span>
                </button>

                <button
                  onClick={() => navigateToTab('reports')}
                  className={`w-full flex items-center gap-3 px-4 py-3 font-bold text-xs rounded-xl transition-all ${
                    activeTab === 'reports' ? 'bg-[#1a56db] text-white shadow-sm' : 'text-[#5c5f60] hover:bg-slate-50'
                  }`}
                >
                  <FileSpreadsheet className="w-5 h-5 shrink-0" />
                  <span>Ledger & Reports</span>
                </button>
              </nav>

              <div className="mt-auto border-t border-slate-100 pt-4">
                <button 
                  onClick={() => {
                    setIsMobileSidebarOpen(false);
                    handleLogout();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-xs text-[#5c5f60] font-black"
                >
                  <LogOut className="w-5 h-5 shrink-0" />
                  <span>Sign Out</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. Main Viewport Container */}
      <main className="flex-1 flex flex-col min-w-0">
        
        {/* MySQL Status Banner */}
        {dbError ? (
          <div className="bg-red-50 border-b border-red-200 px-6 py-2 flex items-center justify-between text-xs text-red-700" id="db-error-banner">
            <span className="font-semibold flex items-center gap-1.5">
              ⚠️ Database Connection Failed: {dbError}. Defaulting to Local fallback.
            </span>
          </div>
        ) : dbMode === 'local' ? (
          <div className="bg-[#f0f4fe] border-b border-[#003fb1]/10 px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-[#003fb1]" id="db-config-banner">
            <div className="flex items-center gap-2 font-medium">
              <span className="bg-[#003fb1]/10 text-[#003fb1] font-black px-1.5 py-0.5 rounded-sm text-[10px]">MYSQL DB</span>
              <span>Running in <strong>Local Fallback Mode</strong>. Configure your MySQL credentials (<code>MYSQL_HOST</code>, <code>MYSQL_USER</code>, <code>MYSQL_PASSWORD</code>, <code>MYSQL_DATABASE</code>) in <code>.env</code>.</span>
            </div>
          </div>
        ) : null}

        {/* Top App Bar Header */}
        <header className="flex justify-between items-center px-6 lg:px-10 sticky top-0 z-30 w-full bg-white h-16 border-b border-[#c3c5d7]/50 shadow-xs" id="top-app-bar">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden hover:bg-slate-50 rounded-full p-2 cursor-pointer active:scale-95 transition-transform"
              id="mobile-hamburger"
            >
              <Menu className="w-5 h-5 text-[#151c27]" />
            </button>
            <h1 className="font-extrabold text-lg text-[#003fb1] capitalize" id="header-page-title">
              {activeTab === 'pwd' 
                ? 'PWD Registry' 
                : activeTab === 'soloparents' 
                  ? 'Solo Parents' 
                  : activeTab === 'seniors' 
                    ? 'Senior Citizens'
                    : activeTab === 'analytics'
                      ? 'Decision & Analytics'
                      : activeTab === 'focal'
                        ? 'Focal Persons Directory'
                        : activeTab === 'reports'
                          ? 'Ledger & Reports'
                          : activeTab === 'budget'
                            ? 'Budget Management'
                            : activeTab === 'programs'
                              ? 'AICS Crisis Assistance'
                              : activeTab}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick search input (Global simulation) */}
            <div className="hidden sm:flex items-center bg-[#f0f3ff] px-4 py-2 rounded-full border border-[#c3c5d7]/30" id="header-search-bar">
              <Search className="text-[#5c5f60] text-xs w-4 h-4 mr-2" />
              <input 
                type="text" 
                placeholder="Search case files..." 
                value={topSearch}
                onChange={(e) => setTopSearch(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && topSearch.trim()) {
                    alert(`Global database search initiated for "${topSearch}"... Filtered listings.`);
                    setTopSearch('');
                  }
                }}
                className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs w-48 text-[#151c27]"
              />
            </div>

            {/* Notification bell and badge dropdown overlay */}
            <div className="relative" id="notifications-bell-container">
              <button 
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setNotificationsBadge(false);
                }}
                className="hover:bg-slate-50 rounded-full p-2 cursor-pointer transition-colors"
              >
                <Bell className="w-5 h-5 text-[#151c27]" />
                {notificationsBadge && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-600 rounded-full border border-white"></span>
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 bg-white rounded-xl border border-slate-100 shadow-xl w-72 z-20 py-2 text-xs"
                    >
                      <p className="px-4 py-2 font-bold text-slate-800 border-b border-slate-50">Notifications</p>
                      <div className="divide-y divide-slate-50 max-h-60 overflow-y-auto">
                        <div className="p-3 hover:bg-slate-50 flex gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="font-bold">Backlog Warning in Poblacion I</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">142 pending welfare claims require allocation.</p>
                          </div>
                        </div>
                        <div className="p-3 hover:bg-slate-50 flex gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                          <div>
                            <p className="font-bold">Medical Assistance Limit Alert</p>
                            <p className="text-[10px] text-slate-400 mt-0.5">Medical budget utilization is at 80% (High levels).</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Profile image */}
            <img 
              onClick={() => setShowProfileModal(true)}
              className="w-8 h-8 rounded-full border border-[#c3c5d7] object-cover hover:scale-105 active:scale-95 transition-all cursor-pointer"
              src={profile.profilePic}
              alt={profile.fullName}
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200';
              }}
            />
          </div>
        </header>

        {/* Dynamic View container with smooth animations */}
        <div className="p-6 lg:p-10 flex-1 max-w-[1440px] mx-auto w-full pb-20 lg:pb-10" id="main-content-scroller">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderActiveView()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* 3. Bottom Navigation Bar (Mobile Viewport Only) */}
        <nav className="lg:hidden fixed bottom-0 left-0 w-full z-40 flex justify-around items-center py-2 px-4 bg-white border-t border-[#c3c5d7]/50 shadow-lg rounded-t-2xl" id="mobile-bottom-nav">
          <button 
            onClick={() => navigateToTab('dashboard')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              activeTab === 'dashboard' ? 'text-[#003fb1] font-bold scale-110' : 'text-[#5c5f60]'
            }`}
          >
            <Home className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Home</span>
          </button>
          
          <button 
            onClick={() => navigateToTab('analytics')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              activeTab === 'analytics' ? 'text-[#003fb1] font-bold scale-110' : 'text-[#5c5f60]'
            }`}
          >
            <Brain className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Decision</span>
          </button>

          <button 
            onClick={() => navigateToTab('budget')}
            className={`flex flex-col items-center justify-center p-2 rounded-xl transition-all ${
              activeTab === 'budget' ? 'text-[#003fb1] font-bold scale-110' : 'text-[#5c5f60]'
            }`}
          >
            <Coins className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Budget</span>
          </button>

          <button 
            onClick={() => setShowProfileModal(true)}
            className="flex flex-col items-center justify-center p-2 text-[#5c5f60] rounded-xl"
          >
            <UserRound className="w-5 h-5" />
            <span className="text-[10px] mt-0.5">Profile</span>
          </button>
        </nav>
      </main>

      {/* Modal 1: Add Grant (Disbursement) */}
      <AnimatePresence>
        {showAddGrantModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Issue Social Welfare Grant</h3>
                <button 
                  onClick={() => setShowAddGrantModal(false)}
                  className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddDisbursement} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Beneficiary Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dela Cruz, Maria"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Select AICS Program</label>
                  <select 
                    value={selectedProgramId}
                    onChange={(e) => setSelectedProgramId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-transparent"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Grant Amount (₱)</label>
                    <input 
                      type="number" 
                      min={100}
                      required
                      value={grantAmount}
                      onChange={(e) => setGrantAmount(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Disbursed Status</label>
                    <select 
                      value={grantStatus}
                      onChange={(e: any) => setGrantStatus(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-transparent"
                    >
                      <option value="Disbursed">Disbursed (Released)</option>
                      <option value="Pending">Pending Audit</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Resident Barangay</label>
                  <select 
                    value={grantBarangay}
                    onChange={(e) => setGrantBarangay(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-transparent"
                  >
                    {LIST_OF_BARANGAYS.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="pt-4 flex gap-3 justify-end text-xs">
                  <button 
                    type="button"
                    onClick={() => setShowAddGrantModal(false)}
                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Approve and Release
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Barangay Request Details */}
      <AnimatePresence>
        {selectedBarangay && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">{selectedBarangay.name} Requests</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Real-time municipal caseworker queue</p>
                </div>
                <button 
                  onClick={() => setSelectedBarangay(null)}
                  className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div className="bg-[#f0f3ff] p-4 rounded-xl flex items-center justify-between border border-blue-50">
                  <div>
                    <p className="text-xs font-bold text-[#5c5f60] uppercase">PENDING CASE FILES</p>
                    <p className="text-2xl font-black text-[#003fb1] mt-0.5">{selectedBarangay.pendingRequests}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase ${
                    selectedBarangay.status === 'CRITICAL' 
                      ? 'bg-rose-50 text-rose-700' 
                      : 'bg-amber-50 text-amber-700'
                  }`}>
                    {selectedBarangay.status} SEVERITY
                  </span>
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-3">
                  <p className="text-xs font-bold text-slate-500">NEXT CLIENT QUEUE IN {selectedBarangay.name.toUpperCase()}</p>
                  
                  {selectedBarangay.pendingRequests > 0 ? (
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800">Assistance Request #{(2048 + selectedBarangay.pendingRequests)}</p>
                        <p className="text-slate-400 mt-0.5">AICS Medical Subsidy Support Case</p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleResolveBarangayRequest('approve')}
                          className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleResolveBarangayRequest('reject')}
                          className="px-2.5 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-500 font-bold rounded-lg"
                        >
                          Decline
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-slate-400 font-medium text-xs">
                      🎉 All caseworker queues in {selectedBarangay.name} are fully completed!
                    </div>
                  )}
                </div>

                <div className="pt-4 flex justify-end text-xs">
                  <button 
                    onClick={() => setSelectedBarangay(null)}
                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 font-bold"
                  >
                    Close Panel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: Profile Modal */}
      <AnimatePresence>
        {showProfileModal && (
          <ProfileModal
            isOpen={showProfileModal}
            onClose={() => setShowProfileModal(false)}
            profile={profile}
            onSave={(updatedProfile) => {
              setProfile(updatedProfile);
            }}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
