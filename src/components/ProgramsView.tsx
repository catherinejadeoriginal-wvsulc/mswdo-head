import React, { useState } from 'react';
import { AICSProgram } from '../types';
import { 
  Plus, 
  Search, 
  Settings, 
  TrendingUp, 
  ListTodo, 
  DollarSign, 
  Filter, 
  FolderEdit, 
  Users, 
  Building2,
  Lock,
  Unlock,
  CheckCircle2,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ProgramsViewProps {
  programs: AICSProgram[];
  onAddProgram: (newProg: Omit<AICSProgram, 'id' | 'utilizedBudget' | 'beneficiariesCount'>) => void;
  onUpdateProgramBudget: (id: string, newAlloc: number) => void;
  onToggleProgramStatus: (id: string) => void;
}

export default function ProgramsView({
  programs,
  onAddProgram,
  onUpdateProgramBudget,
  onToggleProgramStatus
}: ProgramsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [showAddModal, setShowAddModal] = useState(false);
  
  // State for Add Program Form
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [allocatedBudget, setAllocatedBudget] = useState(100000);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');

  // State for Editing Budget
  const [editingProgramId, setEditingProgramId] = useState<string | null>(null);
  const [editBudgetAmount, setEditBudgetAmount] = useState(0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim() || allocatedBudget <= 0) return;
    onAddProgram({ name, description, allocatedBudget, status });
    // Reset
    setName('');
    setDescription('');
    setAllocatedBudget(100000);
    setStatus('Active');
    setShowAddModal(false);
  };

  const startEditBudget = (prog: AICSProgram) => {
    setEditingProgramId(prog.id);
    setEditBudgetAmount(prog.allocatedBudget);
  };

  const saveBudgetEdit = (id: string) => {
    onUpdateProgramBudget(id, editBudgetAmount);
    setEditingProgramId(null);
  };

  const filteredPrograms = programs.filter(prog => {
    const matchesSearch = prog.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prog.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || prog.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="programs-view-root">
      {/* Header Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="programs-header-cards">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white p-6 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <p className="opacity-80 text-xs font-semibold uppercase tracking-wider">Total Programs</p>
            <p className="text-3xl font-extrabold mt-1">{programs.length}</p>
          </div>
          <Building2 className="w-10 h-10 opacity-30" />
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Welfare Subsidies</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {programs.filter(p => p.status === 'Active').length}
            </p>
          </div>
          <CheckCircle2 className="w-10 h-10 text-blue-500 opacity-20" />
        </div>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Active Beneficiaries</p>
            <p className="text-3xl font-extrabold text-slate-800 dark:text-slate-100 mt-1">
              {programs.reduce((acc, p) => acc + p.beneficiariesCount, 0).toLocaleString()}
            </p>
          </div>
          <Users className="w-10 h-10 text-emerald-500 opacity-20" />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm" id="programs-toolbar">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search welfare programs..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-slate-700 dark:text-slate-200"
          />
        </div>

        <div className="flex gap-3 w-full sm:w-auto shrink-0 justify-end">
          <select 
            value={statusFilter}
            onChange={(e: any) => setStatusFilter(e.target.value)}
            className="text-xs border border-slate-200 dark:border-slate-600 rounded-lg px-3 py-2 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active Only</option>
            <option value="Inactive">Inactive Only</option>
          </select>

          <button 
            onClick={() => setShowAddModal(true)}
            className="bg-[#003fb1] hover:bg-[#1a56db] text-white px-4 py-2 font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Create Program
          </button>
        </div>
      </div>

      {/* Grid of Programs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="programs-cards-grid">
        <AnimatePresence>
          {filteredPrograms.map((prog) => {
            const utilizationPercent = Math.round((prog.utilizedBudget / prog.allocatedBudget) * 100);
            const remainingBudget = prog.allocatedBudget - prog.utilizedBudget;
            
            return (
              <motion.div 
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={prog.id}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Title and Badge */}
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">{prog.name}</h3>
                      <p className="text-slate-400 text-xs font-mono mt-0.5">{prog.id.toUpperCase()}</p>
                    </div>
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full uppercase tracking-wider ${
                      prog.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400' 
                        : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                    }`}>
                      {prog.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed">{prog.description}</p>

                  {/* Budget Allocation Breakdown */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl space-y-3 border border-slate-100/50 dark:border-slate-700/50">
                    <div className="grid grid-cols-3 gap-2 text-center text-xs">
                      <div>
                        <p className="text-slate-400 font-medium">Allocated</p>
                        {editingProgramId === prog.id ? (
                          <div className="flex items-center gap-1 mt-1 justify-center">
                            <span className="text-slate-500 font-bold">₱</span>
                            <input 
                              type="number" 
                              value={editBudgetAmount}
                              onChange={(e) => setEditBudgetAmount(Number(e.target.value))}
                              className="w-16 p-1 border border-slate-200 rounded text-center text-xs text-slate-800"
                            />
                          </div>
                        ) : (
                          <p className="font-bold text-slate-800 dark:text-slate-100 mt-0.5">₱{prog.allocatedBudget.toLocaleString()}</p>
                        )}
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Utilized</p>
                        <p className="font-bold text-blue-600 dark:text-blue-400 mt-0.5">₱{prog.utilizedBudget.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-slate-400 font-medium">Remaining</p>
                        <p className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">₱{remainingBudget.toLocaleString()}</p>
                      </div>
                    </div>

                    {/* Utilization Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] text-slate-400 font-bold">
                        <span>BUDGET EXPENDITURE</span>
                        <span>{utilizationPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-200 dark:bg-slate-700 h-1.5 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            utilizationPercent > 80 
                              ? 'bg-rose-500' 
                              : utilizationPercent > 50 
                                ? 'bg-blue-600' 
                                : 'bg-emerald-500'
                          }`}
                          style={{ width: `${utilizationPercent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-50 dark:border-slate-700/50 text-xs">
                  <div className="flex items-center gap-1 text-slate-400 font-medium">
                    <Users className="w-4 h-4" />
                    <span>{prog.beneficiariesCount} active cases</span>
                  </div>

                  <div className="flex gap-2">
                    {editingProgramId === prog.id ? (
                      <>
                        <button 
                          onClick={() => setEditingProgramId(null)}
                          className="px-2.5 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 font-bold"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => saveBudgetEdit(prog.id)}
                          className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg"
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <>
                        <button 
                          onClick={() => startEditBudget(prog)}
                          className="p-1.5 hover:bg-slate-50 dark:hover:bg-slate-700 rounded text-slate-500 dark:text-slate-300 font-semibold"
                          title="Adjust Budget Allocation"
                        >
                          <FolderEdit className="w-4.5 h-4.5" />
                        </button>
                        <button 
                          onClick={() => onToggleProgramStatus(prog.id)}
                          className={`p-1.5 rounded font-semibold ${
                            prog.status === 'Active' 
                              ? 'hover:bg-rose-50 text-slate-500 dark:text-slate-300 hover:text-rose-600' 
                              : 'hover:bg-emerald-50 text-slate-500 dark:text-slate-300 hover:text-emerald-600'
                          }`}
                          title={prog.status === 'Active' ? 'Deactivate Program' : 'Activate Program'}
                        >
                          {prog.status === 'Active' ? <Lock className="w-4.5 h-4.5" /> : <Unlock className="w-4.5 h-4.5" />}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Add Program Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-100 dark:border-slate-700"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Create Welfare Program</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Program Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AICS - Medical Assistance"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Description</label>
                  <textarea 
                    placeholder="Briefly describe the purpose and criteria of the subsidy program..."
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Initial Budget</label>
                    <input 
                      type="number" 
                      min={1000}
                      required
                      value={allocatedBudget}
                      onChange={(e) => setAllocatedBudget(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select 
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end text-sm">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 border border-slate-200 dark:border-slate-600 rounded-lg hover:bg-slate-50 text-slate-500 dark:text-slate-300 font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    Create Program
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
