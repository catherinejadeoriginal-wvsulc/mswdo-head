import React, { useState, useMemo } from 'react';
import { AICSProgram, AllocationHistoryRecord } from '../types';
import { 
  DollarSign, 
  TrendingUp, 
  AlertTriangle, 
  ArrowRightLeft, 
  Check, 
  X, 
  PiggyBank, 
  Activity, 
  Percent,
  Calculator,
  RotateCcw,
  Plus,
  Edit3,
  Eye,
  Search,
  Download,
  Printer,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  User,
  CheckCircle2,
  Building,
  Filter,
  Info,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BudgetViewProps {
  programs: AICSProgram[];
  onUpdateProgramBudget: (id: string, newAlloc: number) => void;
  onApplyRecommendation: (sourceProgId: string, destProgId: string, amount: number) => void;
  allocationHistory: AllocationHistoryRecord[];
  onAddHistoryRecord: (record: Omit<AllocationHistoryRecord, 'id' | 'dateTime' | 'status'>) => void;
  setPrograms: React.Dispatch<React.SetStateAction<AICSProgram[]>>;
  profile: { fullName: string };
}

export default function BudgetView({
  programs,
  onUpdateProgramBudget,
  onApplyRecommendation,
  allocationHistory,
  onAddHistoryRecord,
  setPrograms,
  profile
}: BudgetViewProps) {
  // Navigation
  const [activeSubTab, setActiveSubTab] = useState<'programs' | 'transfer' | 'history'>('programs');

  // Modals state
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeProgramId, setActiveProgramId] = useState<string>('');

  // Allocate Form State
  const [allocAmount, setAllocAmount] = useState<number>(500000);
  const [allocSource, setAllocSource] = useState<string>('LGU Supplemental Fund');
  const [allocDate, setAllocDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [allocRemarks, setAllocRemarks] = useState<string>('Allocated supplemental funding to meet higher client demand.');
  
  // Edit Form State
  const [editNewBudget, setEditNewBudget] = useState<number>(0);
  const [editSource, setEditSource] = useState<string>('Municipal Council Resolution No. 24');
  const [editDate, setEditDate] = useState<string>(new Date().toISOString().slice(0, 10));
  const [editRemarks, setEditRemarks] = useState<string>('Adjusted budget allocation as authorized by municipal council.');

  // Transfer Simulator Form State
  const [simSourceId, setSimSourceId] = useState<string>(programs[0]?.id || '');
  const [simDestId, setSimDestId] = useState<string>(programs[1]?.id || '');
  const [simAmount, setSimAmount] = useState<number>(200000);
  const [isSimulated, setIsSimulated] = useState<boolean>(false);

  // Filter States for Allocation History
  const [historySearch, setHistorySearch] = useState('');
  const [historyProgramFilter, setHistoryProgramFilter] = useState('All');
  const [historyTypeFilter, setHistoryTypeFilter] = useState('All');
  const [historyDateFrom, setHistoryDateFrom] = useState('');
  const [historyDateTo, setHistoryDateTo] = useState('');

  // Confirmation Flow
  const [confirmingAction, setConfirmingAction] = useState<'allocate' | 'edit' | 'transfer' | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);
  const [formValidationError, setFormValidationError] = useState<string | null>(null);

  // Global calculations
  const totalBudgetLimit = 25000000;
  const totalAllocated = useMemo(() => programs.reduce((sum, p) => sum + p.allocatedBudget, 0), [programs]);
  const totalUtilized = useMemo(() => programs.reduce((sum, p) => sum + p.utilizedBudget, 0), [programs]);
  const totalRemaining = totalBudgetLimit - totalUtilized;
  const unallocatedPool = totalBudgetLimit - totalAllocated;
  const utilizedPercent = ((totalUtilized / totalBudgetLimit) * 100).toFixed(1);

  // Find active program for modal contexts
  const activeProgram = useMemo(() => programs.find(p => p.id === activeProgramId), [programs, activeProgramId]);
  const selectedProgramDetails = useMemo(() => programs.find(p => p.id === selectedProgramId), [programs, selectedProgramId]);

  // Handle opening Allocate Modal
  const openAllocateModal = (programId: string) => {
    setActiveProgramId(programId);
    setAllocAmount(100000);
    setAllocSource('LGU Supplemental Fund');
    setAllocRemarks('');
    setFormValidationError(null);
    setShowAllocateModal(true);
  };

  // Handle opening Edit Modal
  const openEditModal = (programId: string) => {
    const prog = programs.find(p => p.id === programId);
    if (prog) {
      setActiveProgramId(programId);
      setEditNewBudget(prog.allocatedBudget);
      setEditSource('LGU Budget Adjustment');
      setEditRemarks('');
      setFormValidationError(null);
      setShowEditModal(true);
    }
  };

  // Handle opening Details Modal
  const openDetailsModal = (programId: string) => {
    setSelectedProgramId(programId);
    setShowDetailsModal(true);
  };

  // Run Allocations validation
  const validateAllocation = () => {
    setFormValidationError(null);
    if (allocAmount <= 0) {
      setFormValidationError('Allocation amount must be greater than zero.');
      return false;
    }
    if (totalAllocated + allocAmount > totalBudgetLimit) {
      setFormValidationError(`This allocation of ₱${allocAmount.toLocaleString()} exceeds the maximum municipal budget of ₱${totalBudgetLimit.toLocaleString()}. Maximum allowable additions across all programs is ₱${unallocatedPool.toLocaleString()}.`);
      return false;
    }
    return true;
  };

  // Execute Allocation
  const executeAllocation = () => {
    if (!activeProgram) return;
    const prevBudget = activeProgram.allocatedBudget;
    const newBudget = prevBudget + allocAmount;

    // Update programs state
    setPrograms(prev => prev.map(p => {
      if (p.id === activeProgram.id) {
        return { ...p, allocatedBudget: newBudget };
      }
      return p;
    }));

    // Record in history
    onAddHistoryRecord({
      programName: activeProgram.name,
      previousBudget: prevBudget,
      newBudget: newBudget,
      amountChanged: allocAmount,
      budgetSource: allocSource || 'Municipal Social Services Fund',
      remarks: allocRemarks || `Supplemental allocation added.`,
      modifiedBy: profile.fullName || 'Catherine Jade',
      actionType: 'Allocated'
    });

    setSuccessToast(`Successfully allocated ₱${allocAmount.toLocaleString()} to "${activeProgram.name}".`);
    setShowAllocateModal(false);
    setConfirmingAction(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Run Edit Budget validation
  const validateEdit = () => {
    setFormValidationError(null);
    if (!activeProgram) return false;

    if (editNewBudget <= 0) {
      setFormValidationError('Budget allocation amount must be greater than zero.');
      return false;
    }

    if (editNewBudget < activeProgram.utilizedBudget) {
      setFormValidationError(`Cannot set the budget to ₱${editNewBudget.toLocaleString()} because the program has already spent ₱${activeProgram.utilizedBudget.toLocaleString()}. Budget cannot be lower than utilized funds.`);
      return false;
    }

    // Sum of other programs
    const otherSum = programs.reduce((sum, p) => p.id === activeProgram.id ? sum : sum + p.allocatedBudget, 0);
    if (otherSum + editNewBudget > totalBudgetLimit) {
      const maxAlloc = totalBudgetLimit - otherSum;
      setFormValidationError(`The new budget of ₱${editNewBudget.toLocaleString()} exceeds the available municipal budget. The maximum allocation allowed for this program is ₱${maxAlloc.toLocaleString()}.`);
      return false;
    }

    return true;
  };

  // Execute Edit Budget
  const executeEdit = () => {
    if (!activeProgram) return;
    const prevBudget = activeProgram.allocatedBudget;
    const change = editNewBudget - prevBudget;

    setPrograms(prev => prev.map(p => {
      if (p.id === activeProgram.id) {
        return { ...p, allocatedBudget: editNewBudget };
      }
      return p;
    }));

    onAddHistoryRecord({
      programName: activeProgram.name,
      previousBudget: prevBudget,
      newBudget: editNewBudget,
      amountChanged: change,
      budgetSource: editSource || 'LGU Budget Adjustment Action',
      remarks: editRemarks || `Budget adjusted from ₱${prevBudget.toLocaleString()} to ₱${editNewBudget.toLocaleString()}.`,
      modifiedBy: profile.fullName || 'Catherine Jade',
      actionType: 'Edited'
    });

    setSuccessToast(`Successfully updated budget for "${activeProgram.name}" to ₱${editNewBudget.toLocaleString()}.`);
    setShowEditModal(false);
    setConfirmingAction(null);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Simulate Transfer validation
  const runSimulation = (e: React.FormEvent) => {
    e.preventDefault();
    setFormValidationError(null);

    if (simSourceId === simDestId) {
      setFormValidationError('Source and Destination programs must be different.');
      setIsSimulated(false);
      return;
    }

    const sourceProg = programs.find(p => p.id === simSourceId);
    if (!sourceProg) return;

    const sourceRemaining = sourceProg.allocatedBudget - sourceProg.utilizedBudget;
    if (simAmount > sourceRemaining) {
      setFormValidationError(`Insufficient available budget in source. Maximum amount that can be transferred from "${sourceProg.name.replace('AICS - ', '')}" is ₱${sourceRemaining.toLocaleString()}.`);
      setIsSimulated(false);
      return;
    }

    if (simAmount <= 0) {
      setFormValidationError('Transfer amount must be greater than zero.');
      setIsSimulated(false);
      return;
    }

    setIsSimulated(true);
  };

  // Execute Transfer
  const executeTransfer = () => {
    const sourceProg = programs.find(p => p.id === simSourceId);
    const destProg = programs.find(p => p.id === simDestId);
    if (!sourceProg || !destProg) return;

    const prevSourceBudget = sourceProg.allocatedBudget;
    const prevDestBudget = destProg.allocatedBudget;

    const nextSourceBudget = prevSourceBudget - simAmount;
    const nextDestBudget = prevDestBudget + simAmount;

    // Apply the reallocations
    setPrograms(prev => prev.map(p => {
      if (p.id === sourceProg.id) {
        return { ...p, allocatedBudget: nextSourceBudget };
      }
      if (p.id === destProg.id) {
        return { ...p, allocatedBudget: nextDestBudget };
      }
      return p;
    }));

    // Log source reduction in history
    onAddHistoryRecord({
      programName: sourceProg.name,
      previousBudget: prevSourceBudget,
      newBudget: nextSourceBudget,
      amountChanged: -simAmount,
      budgetSource: 'Internal Social Fund Reallocation',
      remarks: `Deducted ₱${simAmount.toLocaleString()} transferred to "${destProg.name.replace('AICS - ', '')}".`,
      modifiedBy: profile.fullName || 'Catherine Jade',
      actionType: 'Transferred'
    });

    // Log dest addition in history
    onAddHistoryRecord({
      programName: destProg.name,
      previousBudget: prevDestBudget,
      newBudget: nextDestBudget,
      amountChanged: simAmount,
      budgetSource: 'Internal Social Fund Reallocation',
      remarks: `Received ₱${simAmount.toLocaleString()} transfer from "${sourceProg.name.replace('AICS - ', '')}".`,
      modifiedBy: profile.fullName || 'Catherine Jade',
      actionType: 'Transferred'
    });

    setSuccessToast(`Successfully transferred ₱${simAmount.toLocaleString()} from "${sourceProg.name.replace('AICS - ', '')}" to "${destProg.name.replace('AICS - ', '')}".`);
    setConfirmingAction(null);
    setIsSimulated(false);
    setSimAmount(100000);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  // Allocation History Search & Filters
  const filteredHistory = useMemo(() => {
    return allocationHistory.filter(record => {
      // 1. Search filter
      const searchMatch = 
        record.programName.toLowerCase().includes(historySearch.toLowerCase()) ||
        record.budgetSource.toLowerCase().includes(historySearch.toLowerCase()) ||
        record.remarks.toLowerCase().includes(historySearch.toLowerCase()) ||
        record.id.toLowerCase().includes(historySearch.toLowerCase()) ||
        record.modifiedBy.toLowerCase().includes(historySearch.toLowerCase());

      // 2. Program filter
      const programMatch = historyProgramFilter === 'All' || record.programName === historyProgramFilter;

      // 3. Type filter
      const typeMatch = historyTypeFilter === 'All' || record.actionType === historyTypeFilter;

      // 4. Date range filter
      let dateMatch = true;
      if (historyDateFrom) {
        dateMatch = dateMatch && record.dateTime.slice(0, 10) >= historyDateFrom;
      }
      if (historyDateTo) {
        dateMatch = dateMatch && record.dateTime.slice(0, 10) <= historyDateTo;
      }

      return searchMatch && programMatch && typeMatch && dateMatch;
    });
  }, [allocationHistory, historySearch, historyProgramFilter, historyTypeFilter, historyDateFrom, historyDateTo]);

  // Export Allocation History as CSV Excel
  const handleExportCSV = () => {
    const headers = ['Transaction ID', 'Date & Time', 'Program', 'Previous Budget (PHP)', 'New Budget (PHP)', 'Difference (PHP)', 'Budget Source', 'Remarks', 'Modified By', 'Action Type', 'Status'];
    const rows = filteredHistory.map(r => [
      r.id,
      r.dateTime,
      `"${r.programName}"`,
      r.previousBudget,
      r.newBudget,
      r.amountChanged,
      `"${r.budgetSource}"`,
      `"${r.remarks}"`,
      `"${r.modifiedBy}"`,
      r.actionType,
      r.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mswdo_budget_allocation_history_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print Allocation History
  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <html>
        <head>
          <title>MSWDO Budget Allocation & Audit History Report</title>
          <style>
            body { font-family: 'Helvetica', sans-serif; color: #1e293b; padding: 30px; }
            h2 { color: #0f172a; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 5px; }
            p { font-size: 12px; color: #64748b; margin-top: 0; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 11px; }
            th { background-color: #f8fafc; color: #475569; font-weight: bold; text-align: left; padding: 10px; border: 1px solid #cbd5e1; }
            td { padding: 10px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background-color: #f8fafc; }
            .badge { display: inline-block; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: bold; }
            .badge-allocated { background-color: #ecfdf5; color: #065f46; }
            .badge-edited { background-color: #eff6ff; color: #1e40af; }
            .badge-transferred { background-color: #fffbeb; color: #92400e; }
            .footer { margin-top: 40px; font-size: 10px; color: #94a3b8; text-align: center; border-top: 1px solid #f1f5f9; padding-top: 15px; }
          </style>
        </head>
        <body>
          <h2>MSWDO Municipal Aid Program - Budget Allocation & Audit History</h2>
          <p>Generated on ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()} by Administrator: ${profile.fullName}</p>
          <table>
            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Date & Time</th>
                <th>Program</th>
                <th>Prev Budget</th>
                <th>New Budget</th>
                <th>Amt Changed</th>
                <th>Source</th>
                <th>Type</th>
                <th>Modified By</th>
              </tr>
            </thead>
            <tbody>
              ${filteredHistory.map(r => `
                <tr>
                  <td><strong>${r.id}</strong></td>
                  <td>${r.dateTime}</td>
                  <td>${r.programName}</td>
                  <td>₱${r.previousBudget.toLocaleString()}</td>
                  <td>₱${r.newBudget.toLocaleString()}</td>
                  <td style="color: ${r.amountChanged >= 0 ? '#10b981' : '#ef4444'}; font-weight: bold">
                    ${r.amountChanged >= 0 ? '+' : ''}₱${r.amountChanged.toLocaleString()}
                  </td>
                  <td>${r.budgetSource}</td>
                  <td><span class="badge badge-${r.actionType.toLowerCase()}">${r.actionType}</span></td>
                  <td>${r.modifiedBy}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            MSWDO Social Management & Decision Support Platform • Confirmed Secure Audit Log
          </div>
          <script>window.print();</script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // Filtered allocation records for the specific selected program (details modal)
  const selectedProgramHistory = useMemo(() => {
    if (!selectedProgramDetails) return [];
    return allocationHistory.filter(h => h.programName === selectedProgramDetails.name);
  }, [allocationHistory, selectedProgramDetails]);

  return (
    <div className="space-y-6" id="budget-view-root">
      
      {/* Toast Messages */}
      <AnimatePresence>
        {successToast && (
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 right-6 z-50 bg-slate-950 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3 border border-slate-800 text-xs font-semibold max-w-md"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-white">Action Completed Successfully</p>
              <p className="text-slate-400 text-[10px] font-normal mt-0.5">{successToast}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Budget Dashboard summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4" id="budget-dashboard-summary">
        {/* Card 1: Combined Budget Cap */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Municipal Budget Limit</span>
            <p className="text-xl font-black text-slate-800 mt-1">₱{totalBudgetLimit.toLocaleString()}</p>
          </div>
          <p className="text-slate-400 text-[10px] font-medium">LGU Combined Program Limit FY 2026</p>
        </div>

        {/* Card 2: Allocated Budget Sum */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Allocated Budget</span>
            <p className="text-xl font-black text-[#003fb1] mt-1">₱{totalAllocated.toLocaleString()}</p>
          </div>
          <div className="flex justify-between items-center text-[10px] font-medium">
            <span className="text-slate-400">Reserved for Sector aid</span>
            <span className={unallocatedPool > 0 ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>
              {unallocatedPool > 0 ? `₱${unallocatedPool.toLocaleString()} Unallocated` : '100% Assigned'}
            </span>
          </div>
        </div>

        {/* Card 3: Current Expenditure */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Total Expended Funds</span>
            <p className="text-xl font-black text-rose-600 mt-1">₱{totalUtilized.toLocaleString()}</p>
          </div>
          <div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div className="bg-[#003fb1] h-full" style={{ width: `${utilizedPercent}%` }} />
            </div>
            <p className="text-slate-500 text-[9px] font-bold mt-1 text-right">{utilizedPercent}% Expended Burn Rate</p>
          </div>
        </div>

        {/* Card 4: Free Operating Surplus */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-xs space-y-2 flex flex-col justify-between">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Sustainable Surplus Reserves</span>
            <p className="text-xl font-black text-emerald-600 mt-1">₱{totalRemaining.toLocaleString()}</p>
          </div>
          <p className="text-emerald-500 text-[10px] font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 shrink-0" /> Available safe operating cushion
          </p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6 -mb-px">
          <button
            onClick={() => setActiveSubTab('programs')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'programs' 
                ? 'border-[#003fb1] text-[#003fb1]' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <PiggyBank className="w-4 h-4" /> MSWDO Program Allocations
          </button>
          <button
            onClick={() => {
              setActiveSubTab('transfer');
              setIsSimulated(false);
            }}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'transfer' 
                ? 'border-[#003fb1] text-[#003fb1]' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <ArrowRightLeft className="w-4 h-4" /> Interactive Transfer Simulator
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`pb-3 text-xs font-bold transition-all border-b-2 flex items-center gap-2 cursor-pointer ${
              activeSubTab === 'history' 
                ? 'border-[#003fb1] text-[#003fb1]' 
                : 'border-transparent text-slate-400 hover:text-slate-700'
            }`}
          >
            <Activity className="w-4 h-4" /> Allocation & Audit History
          </button>
        </div>
      </div>

      {/* RENDER ACTIVE SUBTAB CONTENT */}
      {activeSubTab === 'programs' && (
        <div className="space-y-6" id="programs-subtab">
          
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-800">MSWDO Program Budgets & Threshold Monitors</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Manage budget parameters, allocate supplemental grants, and track burn rates of each sector.</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
                <Info className="w-4 h-4 text-[#003fb1] shrink-0" />
                <span>Municipal ceiling: <strong className="text-slate-800">₱{totalBudgetLimit.toLocaleString()}</strong></span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" id="programs-grid-list">
              {programs.map((prog) => {
                const remaining = prog.allocatedBudget - prog.utilizedBudget;
                const utilPercent = Math.round((prog.utilizedBudget / prog.allocatedBudget) * 100) || 0;
                const isWarningThreshold = utilPercent >= 80;

                return (
                  <div key={prog.id} className="bg-slate-50 rounded-xl border border-slate-100 p-5 flex flex-col justify-between gap-4 relative overflow-hidden group hover:border-[#c3c5d7] transition-all">
                    
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-extrabold text-slate-800 text-xs truncate" title={prog.name}>{prog.name}</h4>
                          <p className="text-[10px] text-slate-400 mt-0.5">Beneficiaries: <strong className="text-slate-700 font-bold">{prog.beneficiariesCount}</strong></p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                          prog.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-slate-150 text-slate-500'
                        }`}>
                          {prog.status}
                        </span>
                      </div>

                      <p className="text-[10px] text-slate-400 line-clamp-2 h-7 leading-relaxed">{prog.description}</p>
                    </div>

                    {/* Progress details */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span className="text-slate-400 uppercase">Expenditure Burn Rate</span>
                        <span className={isWarningThreshold ? 'text-rose-600' : 'text-blue-700'}>{utilPercent}%</span>
                      </div>
                      
                      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden relative">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isWarningThreshold ? 'bg-rose-600' : 'bg-[#003fb1]'
                          }`} 
                          style={{ width: `${Math.min(100, utilPercent)}%` }} 
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-1 pt-1 text-[9px] font-semibold text-slate-400 font-mono">
                        <div>
                          <p className="uppercase text-[8px] font-sans font-bold text-slate-300">Allocated</p>
                          <p className="text-slate-700 font-bold truncate">₱{prog.allocatedBudget.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="uppercase text-[8px] font-sans font-bold text-slate-300">Utilized</p>
                          <p className="text-rose-600 font-bold truncate">₱{prog.utilizedBudget.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                          <p className="uppercase text-[8px] font-sans font-bold text-slate-300">Remaining</p>
                          <p className="text-emerald-600 font-bold truncate">₱{remaining.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions block */}
                    <div className="pt-3 border-t border-slate-100/60 flex items-center justify-between gap-1 bg-white -mx-5 -mb-5 px-5 py-3 rounded-b-xl mt-2">
                      <button
                        onClick={() => openDetailsModal(prog.id)}
                        className="p-1.5 hover:bg-slate-50 text-slate-500 hover:text-slate-800 rounded-lg transition-colors flex items-center justify-center gap-1 text-[10px] font-bold"
                        title="View Audits & Metrics"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>

                      <div className="flex gap-1">
                        <button
                          onClick={() => openEditModal(prog.id)}
                          className="px-2 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-800 rounded-lg transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-blue-500" /> Edit
                        </button>
                        <button
                          onClick={() => openAllocateModal(prog.id)}
                          className="px-2 py-1.5 bg-[#003fb1] hover:bg-blue-700 text-white rounded-lg transition-all text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" /> Allocate
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {activeSubTab === 'transfer' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="transfer-subtab">
          
          {/* Simulation setup */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-100 p-6 shadow-xs flex flex-col justify-between">
            <div className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-1.5">
                  <ArrowRightLeft className="w-5 h-5 text-blue-600" /> Fund Re-Allocation
                </h3>
                <p className="text-slate-400 text-[11px] leading-relaxed">
                  Simulate and safely execute a direct budget transfer from one social aid program to another.
                </p>
              </div>

              <form onSubmit={runSimulation} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Source Program (Surplus)</label>
                  <select 
                    value={simSourceId}
                    onChange={(e) => {
                      setSimSourceId(e.target.value);
                      setIsSimulated(false);
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold bg-transparent"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Destination Program (Needs Budget)</label>
                  <select 
                    value={simDestId}
                    onChange={(e) => {
                      setSimDestId(e.target.value);
                      setIsSimulated(false);
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold bg-transparent"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Transfer Amount (₱)</label>
                  <input 
                    type="number" 
                    value={simAmount || ''}
                    onChange={(e) => {
                      setSimAmount(e.target.value === '' ? 0 : Number(e.target.value));
                      setIsSimulated(false);
                    }}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500 font-mono"
                    placeholder="Enter transfer amount..."
                  />
                </div>

                {formValidationError && (
                  <div className="p-3 bg-rose-50 text-rose-700 rounded-lg text-[10px] font-bold border border-rose-100 flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formValidationError}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full py-2.5 bg-slate-900 hover:bg-black text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                >
                  <Calculator className="w-4 h-4 text-blue-400" /> Run Re-allocation Simulation
                </button>
              </form>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 text-center text-[10px] text-slate-400">
              Simulation results are transient and must be applied to save changes.
            </div>
          </div>

          {/* Simulation Visual Comparison */}
          <div className="lg:col-span-8 bg-slate-50 rounded-2xl border border-slate-100 p-6 flex flex-col justify-between gap-6 relative overflow-hidden min-h-[400px]">
            {isSimulated ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6 flex-1 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black bg-amber-50 text-amber-700 border border-amber-100 tracking-wider uppercase animate-pulse">Simulation Pending Approval</span>
                      <h4 className="text-xs font-extrabold text-slate-800 mt-1">Comparison: Before vs. After Transfer</h4>
                    </div>
                    <p className="text-xs font-black text-blue-700">Amount: ₱{simAmount.toLocaleString()}</p>
                  </div>

                  {/* Side-by-side Comparison Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Source Program Card */}
                    {(() => {
                      const prog = programs.find(p => p.id === simSourceId)!;
                      const newBudget = prog.allocatedBudget - simAmount;
                      const beforeUtilPercent = Math.round((prog.utilizedBudget / prog.allocatedBudget) * 100);
                      const afterUtilPercent = Math.round((prog.utilizedBudget / newBudget) * 100);

                      return (
                        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3 shadow-xs">
                          <p className="text-[10px] font-black uppercase text-rose-600 flex items-center gap-1">
                            <ArrowDownRight className="w-4 h-4" /> Source (Deduction)
                          </p>
                          <h5 className="font-extrabold text-slate-800 text-xs truncate">{prog.name}</h5>
                          
                          <div className="space-y-2 pt-1 border-t border-slate-50">
                            <div>
                              <p className="text-[9px] text-slate-400">Allocation Change</p>
                              <div className="flex justify-between items-center text-xs pt-0.5">
                                <span className="text-slate-500 line-through">₱{prog.allocatedBudget.toLocaleString()}</span>
                                <span className="text-slate-800 font-extrabold">₱{newBudget.toLocaleString()}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-[9px] text-slate-400">Burn Rate Change</p>
                              <div className="flex justify-between items-center text-xs pt-0.5 font-bold">
                                <span className="text-slate-500">{beforeUtilPercent}%</span>
                                <span className="text-rose-600 font-black">{afterUtilPercent}% {afterUtilPercent >= 80 ? '(High Burn Risk!)' : ''}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* Destination Program Card */}
                    {(() => {
                      const prog = programs.find(p => p.id === simDestId)!;
                      const newBudget = prog.allocatedBudget + simAmount;
                      const beforeUtilPercent = Math.round((prog.utilizedBudget / prog.allocatedBudget) * 100);
                      const afterUtilPercent = Math.round((prog.utilizedBudget / newBudget) * 100);

                      return (
                        <div className="bg-white rounded-xl border border-slate-100 p-4 space-y-3 shadow-xs">
                          <p className="text-[10px] font-black uppercase text-emerald-600 flex items-center gap-1">
                            <ArrowUpRight className="w-4 h-4" /> Destination (Addition)
                          </p>
                          <h5 className="font-extrabold text-slate-800 text-xs truncate">{prog.name}</h5>
                          
                          <div className="space-y-2 pt-1 border-t border-slate-50">
                            <div>
                              <p className="text-[9px] text-slate-400">Allocation Change</p>
                              <div className="flex justify-between items-center text-xs pt-0.5">
                                <span className="text-slate-500">₱{prog.allocatedBudget.toLocaleString()}</span>
                                <span className="text-slate-800 font-extrabold">₱{newBudget.toLocaleString()}</span>
                              </div>
                            </div>

                            <div>
                              <p className="text-[9px] text-slate-400">Burn Rate Change</p>
                              <div className="flex justify-between items-center text-xs pt-0.5 font-bold">
                                <span className="text-slate-500">{beforeUtilPercent}%</span>
                                <span className="text-emerald-600 font-black">{afterUtilPercent}% (Increased Reserves)</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                  </div>

                  {/* Summary Card */}
                  <div className="p-4 bg-blue-50 border border-blue-100 text-blue-900 rounded-xl flex gap-3 text-xs items-start">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">Difference and Re-Allocation Summary</p>
                      <p className="text-blue-700 font-medium text-[10px] mt-1 leading-relaxed">
                        Moving ₱{simAmount.toLocaleString()} will decrease the remaining reserves of the Source by exactly that amount, raising its burn threshold. Destination Program will enjoy supplementary reserves to cover additional clients. No net impact on total LGU municipal ceiling.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t border-slate-100 text-xs font-bold">
                  <button 
                    onClick={() => setIsSimulated(false)}
                    className="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer"
                  >
                    Reset Simulation
                  </button>
                  <button 
                    onClick={() => setConfirmingAction('transfer')}
                    className="px-5 py-2 bg-[#003fb1] hover:bg-blue-700 text-white rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Apply and Authorize Transfer
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                  <ArrowRightLeft className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-extrabold text-slate-700 text-sm">Transfer Simulator Standby</h4>
                  <p className="text-slate-400 text-xs max-w-sm leading-relaxed">
                    Select a surplus source program and a needy destination program in the form, configure the target transfer amount, and run simulation to preview before applying changes.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {activeSubTab === 'history' && (
        <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-5" id="history-subtab">
          
          {/* Filter Toolbar */}
          <div className="flex flex-col gap-4 border-b border-slate-100 pb-5">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-800">Allocation History & Municipal Security Audit Log</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">Comprehensive audit log of all financial allocations, direct adjustments, and re-allocations.</p>
              </div>

              {/* Exports */}
              <div className="flex items-center gap-2 text-xs font-bold self-start sm:self-auto">
                <button
                  onClick={handlePrint}
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
                <button
                  onClick={handlePrint} // Print-to-pdf uses the same formatted engine
                  className="px-3 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  onClick={handleExportCSV}
                  className="px-3 py-2 bg-slate-900 hover:bg-black text-white rounded-lg flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> Export Excel
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 pt-2 text-xs">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={historySearch}
                  onChange={(e) => setHistorySearch(e.target.value)}
                  className="w-full p-2.5 pl-9 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {/* Program filter */}
              <div>
                <select
                  value={historyProgramFilter}
                  onChange={(e) => setHistoryProgramFilter(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-transparent"
                >
                  <option value="All">All Programs</option>
                  {programs.map(p => (
                    <option key={p.id} value={p.name}>{p.name}</option>
                  ))}
                </select>
              </div>

              {/* Type filter */}
              <div>
                <select
                  value={historyTypeFilter}
                  onChange={(e) => setHistoryTypeFilter(e.target.value)}
                  className="w-full p-2.5 border border-[#dee0e2] rounded-lg text-xs bg-transparent"
                >
                  <option value="All">All Transaction Types</option>
                  <option value="Allocated">Allocated</option>
                  <option value="Edited">Edited</option>
                  <option value="Transferred">Transferred</option>
                </select>
              </div>

              {/* Date From */}
              <div className="relative">
                <input
                  type="date"
                  value={historyDateFrom}
                  onChange={(e) => setHistoryDateFrom(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  title="Date From"
                />
              </div>

              {/* Date To */}
              <div className="relative">
                <input
                  type="date"
                  value={historyDateTo}
                  onChange={(e) => setHistoryDateTo(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  title="Date To"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold">
                  <th className="p-4">Transaction ID</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Program</th>
                  <th className="p-4">Previous Budget</th>
                  <th className="p-4">New Budget</th>
                  <th className="p-4">Amt Changed</th>
                  <th className="p-4">Budget Source</th>
                  <th className="p-4">Modified By</th>
                  <th className="p-4">Type</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredHistory.length > 0 ? (
                  filteredHistory.map((record) => (
                    <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-slate-800">{record.id}</td>
                      <td className="p-4 text-slate-400 whitespace-nowrap">{record.dateTime}</td>
                      <td className="p-4 font-bold text-slate-700 whitespace-nowrap">{record.programName}</td>
                      <td className="p-4 text-slate-500 font-mono">₱{record.previousBudget.toLocaleString()}</td>
                      <td className="p-4 text-slate-800 font-bold font-mono">₱{record.newBudget.toLocaleString()}</td>
                      <td className={`p-4 font-extrabold font-mono ${record.amountChanged >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {record.amountChanged >= 0 ? '+' : ''}₱{record.amountChanged.toLocaleString()}
                      </td>
                      <td className="p-4 text-slate-500 max-w-[200px] truncate" title={record.budgetSource}>{record.budgetSource}</td>
                      <td className="p-4 text-slate-600 whitespace-nowrap font-medium flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-slate-400" /> {record.modifiedBy}
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded-md font-black text-[9px] uppercase ${
                          record.actionType === 'Allocated' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          record.actionType === 'Edited' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                          'bg-amber-50 text-amber-700 border border-amber-100'
                        }`}>
                          {record.actionType}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Completed
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={10} className="text-center p-8 text-slate-400">
                      No matching budget transaction logs found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ----------------- MODALS & DIALOGS ----------------- */}

      {/* Modal 1: Allocate Budget */}
      <AnimatePresence>
        {showAllocateModal && activeProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" id="allocate-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-slate-100 text-xs flex flex-col"
            >
              <div className="bg-[#003fb1] p-5 text-white flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-black text-sm flex items-center gap-2"><Plus className="w-5 h-5 text-blue-200" /> Allocate Supplemental Budget</h3>
                  <p className="text-blue-100 text-[10px] mt-0.5">MSWDO Social Aid Program Expansion</p>
                </div>
                <button onClick={() => setShowAllocateModal(false)} className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable form content */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Target Social Program</span>
                  <p className="font-extrabold text-slate-800 text-xs">{activeProgram.name}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 pt-1.5 border-t border-slate-200/50">
                    <span>Current Budget: ₱{activeProgram.allocatedBudget.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Additional Allocation Amount (PHP)</label>
                    <input
                      type="number"
                      step={50000}
                      value={allocAmount || ''}
                      onChange={(e) => setAllocAmount(e.target.value === '' ? 0 : Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Budget Allocation Source</label>
                    <input
                      type="text"
                      placeholder="e.g. LGU Supplemental FY Q3"
                      value={allocSource}
                      onChange={(e) => setAllocSource(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Allocation Date</label>
                    <input
                      type="date"
                      value={allocDate}
                      onChange={(e) => setAllocDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Internal Audit Remarks / Reference</label>
                    <textarea
                      rows={2}
                      placeholder="Enter legal reference, purpose, or remarks..."
                      value={allocRemarks}
                      onChange={(e) => setAllocRemarks(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {formValidationError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg font-bold flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formValidationError}</span>
                  </div>
                )}

                {/* Live Preview */}
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[10px] flex justify-between font-mono">
                  <span className="text-blue-700 font-bold">New Proposed Budget:</span>
                  <span className="text-slate-800 font-black">₱{(activeProgram.allocatedBudget + allocAmount).toLocaleString()}</span>
                </div>

              </div>

              {/* Sticky bottom buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0">
                <button onClick={() => setShowAllocateModal(false)} className="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer">Cancel</button>
                <button 
                  onClick={() => {
                    if (validateAllocation()) {
                      setConfirmingAction('allocate');
                    }
                  }} 
                  className="px-5 py-2 bg-[#003fb1] hover:bg-blue-700 text-white rounded-lg cursor-pointer"
                >
                  Confirm & Save
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 2: Edit Budget Allocation */}
      <AnimatePresence>
        {showEditModal && activeProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" id="edit-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-slate-100 text-xs flex flex-col"
            >
              <div className="bg-[#003fb1] p-5 text-white flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-black text-sm flex items-center gap-2"><Edit3 className="w-5 h-5 text-blue-200" /> Edit Budget Allocation</h3>
                  <p className="text-blue-100 text-[10px] mt-0.5">MSWDO Core Parameter Adjustment</p>
                </div>
                <button onClick={() => setShowEditModal(false)} className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable form content */}
              <div className="p-6 space-y-4 overflow-y-auto flex-1">
                
                <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                  <span className="text-[9px] uppercase font-bold text-slate-400">Target Social Program</span>
                  <p className="font-extrabold text-slate-800 text-xs">{activeProgram.name}</p>
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2 pt-1.5 border-t border-slate-200/50">
                    <span>Spent (Utilized): ₱{activeProgram.utilizedBudget.toLocaleString()}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">New Budget Allocation Amount (PHP)</label>
                    <input
                      type="number"
                      step={100000}
                      value={editNewBudget || ''}
                      onChange={(e) => setEditNewBudget(e.target.value === '' ? 0 : Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold focus:ring-1 focus:ring-blue-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Budget Allocation Source</label>
                    <input
                      type="text"
                      placeholder="e.g. LGU Budget Adjustment Council Resolution"
                      value={editSource}
                      onChange={(e) => setEditSource(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Allocation Date</label>
                    <input
                      type="date"
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Internal Audit Remarks / Reference</label>
                    <textarea
                      rows={2}
                      placeholder="Enter legal reference, purpose, or remarks..."
                      value={editRemarks}
                      onChange={(e) => setEditRemarks(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {formValidationError && (
                  <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg font-bold flex items-start gap-1.5">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{formValidationError}</span>
                  </div>
                )}

                {/* Live Preview */}
                <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-[10px] flex justify-between font-mono">
                  <span className="text-blue-700 font-bold">Previous Budget:</span>
                  <span className="text-slate-500 line-through font-bold">₱{activeProgram.allocatedBudget.toLocaleString()}</span>
                  <span className="text-blue-700 font-bold ml-2">New:</span>
                  <span className="text-slate-800 font-black">₱{editNewBudget.toLocaleString()}</span>
                </div>

              </div>

              {/* Sticky bottom buttons */}
              <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end gap-3 font-bold shrink-0">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border border-slate-200 bg-white rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer">Cancel</button>
                <button 
                  onClick={() => {
                    if (validateEdit()) {
                      setConfirmingAction('edit');
                    }
                  }} 
                  className="px-5 py-2 bg-[#003fb1] hover:bg-blue-700 text-white rounded-lg cursor-pointer"
                >
                  Confirm & Save
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal 3: View Details & AUDITS */}
      <AnimatePresence>
        {showDetailsModal && selectedProgramDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" id="details-modal-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden border border-slate-100 text-xs flex flex-col max-h-[85vh]"
            >
              <div className="bg-slate-900 p-5 text-white flex justify-between items-center shrink-0">
                <div>
                  <h3 className="font-black text-sm flex items-center gap-1.5"><Eye className="w-5 h-5 text-blue-400" /> Program Specifications & Audits</h3>
                  <p className="text-slate-400 text-[10px] mt-0.5">{selectedProgramDetails.name}</p>
                </div>
                <button onClick={() => setShowDetailsModal(false)} className="p-1 hover:bg-white/10 rounded-full text-white/80 hover:text-white cursor-pointer">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-5 overflow-y-auto flex-1">
                
                {/* Specs cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Burn Threshold</p>
                    <p className="text-lg font-black text-slate-800 mt-1">
                      {Math.round((selectedProgramDetails.utilizedBudget / selectedProgramDetails.allocatedBudget) * 100)}%
                    </p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Beneficiary Families</p>
                    <p className="text-lg font-black text-[#003fb1] mt-1">{selectedProgramDetails.beneficiariesCount}</p>
                  </div>
                  <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-center">
                    <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Status Indicator</p>
                    <p className="text-lg font-black text-emerald-600 mt-1 uppercase text-xs">{selectedProgramDetails.status}</p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h4 className="font-extrabold text-slate-800">Program Objective</h4>
                  <p className="text-slate-500 leading-relaxed text-[11px] bg-slate-50 p-3 rounded-lg border border-slate-100/50">
                    {selectedProgramDetails.description}
                  </p>
                </div>

                {/* Audit trail list inside details */}
                <div className="space-y-3">
                  <h4 className="font-extrabold text-slate-800 flex items-center gap-1"><Activity className="w-4 h-4 text-blue-600" /> Program-Specific Allocation Log</h4>
                  
                  <div className="border border-slate-100 rounded-xl overflow-hidden">
                    <div className="max-h-[200px] overflow-y-auto">
                      <table className="w-full text-left text-[10px]">
                        <thead className="bg-slate-50 text-slate-500 font-bold sticky top-0">
                          <tr>
                            <th className="p-3">Txn ID</th>
                            <th className="p-3">Date</th>
                            <th className="p-3">Budget Change</th>
                            <th className="p-3">Source</th>
                            <th className="p-3">Type</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                          {selectedProgramHistory.length > 0 ? (
                            selectedProgramHistory.map(h => (
                              <tr key={h.id} className="hover:bg-slate-50/50">
                                <td className="p-3 font-mono font-bold text-slate-700">{h.id}</td>
                                <td className="p-3 text-slate-400 whitespace-nowrap">{h.dateTime.slice(0, 10)}</td>
                                <td className={`p-3 font-bold font-mono ${h.amountChanged >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                  {h.amountChanged >= 0 ? '+' : ''}₱{h.amountChanged.toLocaleString()}
                                </td>
                                <td className="p-3 text-slate-500 max-w-[120px] truncate">{h.budgetSource}</td>
                                <td className="p-3 whitespace-nowrap font-bold text-slate-600">{h.actionType}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={5} className="text-center p-6 text-slate-400">
                                No allocation logs recorded for this program.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

              </div>

              <div className="p-4 bg-slate-50 border-t border-slate-150 flex justify-end shrink-0">
                <button onClick={() => setShowDetailsModal(false)} className="px-4 py-2 bg-slate-900 text-white font-bold rounded-lg hover:bg-black cursor-pointer">
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ---------------- ACTION CONFIRMATION OVERLAY ---------------- */}
      <AnimatePresence>
        {confirmingAction && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-xs" id="confirm-overlay">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm border border-slate-150 text-xs text-center space-y-4"
            >
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-xl border border-amber-100">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-800 text-sm">Confirm Budget Action</h4>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {confirmingAction === 'allocate' && `Are you sure you want to allocate an additional ₱${allocAmount.toLocaleString()} to "${activeProgram?.name}"?`}
                  {confirmingAction === 'edit' && `Are you sure you want to adjust the core budget allocation for "${activeProgram?.name}" to ₱${editNewBudget?.toLocaleString()}?`}
                  {confirmingAction === 'transfer' && `Are you sure you want to execute a permanent fund re-allocation of ₱${simAmount.toLocaleString()} from "${programs.find(p => p.id === simSourceId)?.name.replace('AICS - ', '')}" to "${programs.find(p => p.id === simDestId)?.name.replace('AICS - ', '')}"?`}
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-left space-y-1.5 font-mono text-[10px]">
                <p className="flex justify-between text-slate-500">
                  <span>Authorized By:</span> <strong className="text-slate-800 font-extrabold">{profile.fullName}</strong>
                </p>
                <p className="flex justify-between text-slate-500">
                  <span>Action Classification:</span> <strong className="text-blue-700 font-extrabold uppercase">{confirmingAction}</strong>
                </p>
                <p className="flex justify-between text-slate-500">
                  <span>Status:</span> <strong className="text-amber-600 font-bold animate-pulse">Pending Confirmation</strong>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 font-bold text-xs">
                <button
                  onClick={() => setConfirmingAction(null)}
                  className="w-full py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-500 rounded-lg cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (confirmingAction === 'allocate') executeAllocation();
                    if (confirmingAction === 'edit') executeEdit();
                    if (confirmingAction === 'transfer') executeTransfer();
                  }}
                  className="w-full py-2.5 bg-[#003fb1] hover:bg-blue-700 text-white rounded-lg cursor-pointer shadow-md"
                >
                  Yes, Authorize Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
