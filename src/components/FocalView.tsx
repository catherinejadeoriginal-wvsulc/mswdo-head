import React, { useState } from 'react';
import { AICSProgram } from '../types';
import { 
  Users, 
  Search, 
  Plus, 
  Mail, 
  Phone, 
  ShieldAlert, 
  Check, 
  X, 
  Edit, 
  Briefcase, 
  CheckCircle,
  MoreVertical,
  Sliders,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface FocalPerson {
  id: string;
  name: string;
  role: string;
  assignedProgramId: string;
  contactNumber: string;
  email: string;
  status: 'Active' | 'On Leave' | 'Inactive';
  caseload: number;
}

interface FocalViewProps {
  programs: AICSProgram[];
  focalPersons: FocalPerson[];
  onAddFocalPerson: (focal: Omit<FocalPerson, 'id' | 'caseload'>) => void;
  onUpdateFocalPerson: (id: string, updated: Partial<FocalPerson>) => void;
  onDeleteFocalPerson: (id: string) => void;
}

export default function FocalView({
  programs,
  focalPersons,
  onAddFocalPerson,
  onUpdateFocalPerson,
  onDeleteFocalPerson
}: FocalViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Active' | 'On Leave' | 'Inactive'>('All');
  
  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentFocal, setCurrentFocal] = useState<FocalPerson | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formRole, setFormRole] = useState('Social Welfare Officer II');
  const [formProgramId, setFormProgramId] = useState('');
  const [formContact, setFormContact] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formStatus, setFormStatus] = useState<'Active' | 'On Leave' | 'Inactive'>('Active');

  const openAddModal = () => {
    setFormName('');
    setFormRole('Social Welfare Officer II');
    setFormProgramId(programs[0]?.id || '');
    setFormContact('');
    setFormEmail('');
    setFormStatus('Active');
    setShowAddModal(true);
  };

  const openEditModal = (focal: FocalPerson) => {
    setCurrentFocal(focal);
    setFormName(focal.name);
    setFormRole(focal.role);
    setFormProgramId(focal.assignedProgramId);
    setFormContact(focal.contactNumber);
    setFormEmail(focal.email);
    setFormStatus(focal.status);
    setShowEditModal(true);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formContact.trim()) return;

    onAddFocalPerson({
      name: formName,
      role: formRole,
      assignedProgramId: formProgramId,
      contactNumber: formContact,
      email: formEmail || `${formName.toLowerCase().replace(/[^a-z]/g, '')}@mswdo.gov.ph`,
      status: formStatus
    });

    setShowAddModal(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentFocal || !formName.trim() || !formContact.trim()) return;

    onUpdateFocalPerson(currentFocal.id, {
      name: formName,
      role: formRole,
      assignedProgramId: formProgramId,
      contactNumber: formContact,
      email: formEmail,
      status: formStatus
    });

    setShowEditModal(false);
  };

  const getProgramName = (id: string) => {
    return programs.find(p => p.id === id)?.name || 'General Operations';
  };

  // Filter listings
  const filteredFocal = focalPersons.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          f.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          getProgramName(f.assignedProgramId).toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatusFilter === 'All' || f.status === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6" id="focal-view-root">
      
      {/* Search and Action Header */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="focal-header-actions">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-slate-800">Municipal Focal Persons Directory</h2>
          <p className="text-slate-500 text-xs">Assign, coordinate, and edit officers managing municipal programs</p>
        </div>

        <button 
          onClick={openAddModal}
          className="bg-[#003fb1] hover:bg-[#1a56db] text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer self-stretch sm:self-auto justify-center"
        >
          <Plus className="w-4 h-4" /> Add Program Focal Person
        </button>
      </div>

      {/* Filter and stats row */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100 text-xs" id="focal-filter-row">
        <div className="flex items-center gap-3 bg-white px-3 py-1.5 rounded-lg border border-slate-200 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-400 shrink-0" />
          <input 
            type="text" 
            placeholder="Search focal officers, programs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs w-full sm:w-48 text-slate-800"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-slate-400 font-bold uppercase tracking-wider shrink-0 text-[10px]">Filter:</span>
          {['All', 'Active', 'On Leave', 'Inactive'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatusFilter(status as any)}
              className={`px-3 py-1.5 rounded-lg font-bold uppercase tracking-wider shrink-0 transition-all ${
                selectedStatusFilter === status 
                  ? 'bg-[#1a56db] text-white' 
                  : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="focal-persons-grid">
        <AnimatePresence>
          {filteredFocal.length > 0 ? (
            filteredFocal.map((focal) => {
              let statusBadge = 'bg-slate-100 text-slate-600 border-slate-200';
              if (focal.status === 'Active') {
                statusBadge = 'bg-emerald-50 text-emerald-700 border-emerald-100';
              } else if (focal.status === 'On Leave') {
                statusBadge = 'bg-amber-50 text-amber-700 border-amber-100';
              } else if (focal.status === 'Inactive') {
                statusBadge = 'bg-rose-50 text-rose-700 border-rose-100';
              }

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={focal.id}
                  className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 text-[#003fb1] font-black text-xs flex items-center justify-center border border-blue-100 shadow-xs uppercase">
                          {focal.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800 text-sm leading-snug">{focal.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold">{focal.role}</span>
                        </div>
                      </div>

                      <span className={`px-2 py-0.5 text-[9px] font-bold rounded-md border uppercase ${statusBadge}`}>
                        {focal.status}
                      </span>
                    </div>

                    <div className="bg-[#f8fafc] p-3 rounded-xl border border-slate-100/50 space-y-1">
                      <span className="text-[9px] uppercase font-bold text-slate-400 block">Assigned Welfare Sector</span>
                      <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                        <Briefcase className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span className="truncate">{getProgramName(focal.assignedProgramId)}</span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs text-slate-500 pt-1">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium font-mono">{focal.contactNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                        <span className="font-medium truncate">{focal.email}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex justify-between items-center mt-4">
                    <div className="text-[11px] text-slate-400 font-medium">
                      Managing: <strong className="text-slate-700 font-black">{focal.caseload} active cases</strong>
                    </div>

                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(focal)}
                        className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-500 hover:text-blue-600 rounded-lg transition-colors cursor-pointer"
                        title="Edit / Reassign Focal Officer"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => {
                          if (confirm(`Are you sure you want to remove Focal Person "${focal.name}"?`)) {
                            onDeleteFocalPerson(focal.id);
                          }
                        }}
                        className="p-1.5 border border-slate-200 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-colors cursor-pointer"
                        title="Remove Officer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full bg-white rounded-2xl border border-slate-100 p-12 text-center text-slate-400 text-xs font-semibold">
              No municipal focal persons found matching the filter constraints.
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Add / Edit Modals */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-slate-100"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">
                  {showAddModal ? 'Register Focal Person' : 'Edit Focal Person & Assignment'}
                </h3>
                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                  }}
                  className="p-1.5 hover:bg-slate-50 rounded-full text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Officer Cruz, Juana"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Municipal Role</label>
                    <select 
                      value={formRole}
                      onChange={(e) => setFormRole(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-transparent"
                    >
                      <option value="Social Welfare Officer I">Social Welfare Officer I</option>
                      <option value="Social Welfare Officer II">Social Welfare Officer II</option>
                      <option value="Social Welfare Officer III">Social Welfare Officer III</option>
                      <option value="PWD Focal Coordinator">PWD Focal Coordinator</option>
                      <option value="Senior Citizens Office Head">Senior Citizens Office Head</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Availability Status</label>
                    <select 
                      value={formStatus}
                      onChange={(e: any) => setFormStatus(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-transparent"
                    >
                      <option value="Active">Active Duty</option>
                      <option value="On Leave">On Official Leave</option>
                      <option value="Inactive">Suspended / Inactive</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Assign to Social Welfare Program</label>
                  <select 
                    value={formProgramId}
                    onChange={(e) => setFormProgramId(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-lg text-xs bg-transparent"
                  >
                    {programs.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                    <option value="general">General Office Support Operations</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Number</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 0917-555-0199"
                      required
                      value={formContact}
                      onChange={(e) => setFormContact(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Government Email</label>
                    <input 
                      type="email" 
                      placeholder="e.g. officer@mswdo.gov.ph"
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 rounded-lg text-xs"
                    />
                  </div>
                </div>

                <div className="pt-4 flex gap-3 justify-end text-xs">
                  <button 
                    type="button"
                    onClick={() => {
                      setShowAddModal(false);
                      setShowEditModal(false);
                    }}
                    className="px-4 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold shadow-sm"
                  >
                    {showAddModal ? 'Confirm Registration' : 'Save Adjustments'}
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
