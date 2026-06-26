import React, { useState } from 'react';
import { PWDRecord } from '../types';
import { 
  Search, 
  Filter, 
  Plus, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  CreditCard,
  Edit2,
  Calendar,
  Users2,
  Check,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LIST_OF_BARANGAYS } from '../data/mockData';

interface PWDRegistryViewProps {
  pwdRecords: PWDRecord[];
  onAddPWDRecord: (newPWD: Omit<PWDRecord, 'id' | 'registrationDate'>) => void;
  onUpdatePWDStatus: (id: string, status: 'Active' | 'Inactive') => void;
  onToggleAssistanceClaim: (id: string) => void;
}

const DISABILITY_TYPES = [
  'Visual Impairment',
  'Hearing Impairment',
  'Orthopedic Disability',
  'Psychosocial Disability',
  'Autism Spectrum Disorder',
  'Intellectual Disability',
  'Speech and Language Impairment',
  'Multiple Disabilities'
];

export default function PWDRegistryView({
  pwdRecords,
  onAddPWDRecord,
  onUpdatePWDStatus,
  onToggleAssistanceClaim
}: PWDRegistryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('All');
  const [disabilityFilter, setDisabilityFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Inactive'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState(18);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [barangay, setBarangay] = useState(LIST_OF_BARANGAYS[0]);
  const [disabilityType, setDisabilityType] = useState(DISABILITY_TYPES[0]);
  const [status, setStatus] = useState<'Active' | 'Inactive'>('Active');
  const [assistanceStatus, setAssistanceStatus] = useState<'Claimed' | 'Unclaimed'>('Unclaimed');

  // Success indicator for issuing cash cards
  const [issuedCardId, setIssuedCardId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || age <= 0) return;
    onAddPWDRecord({
      name,
      age,
      gender,
      barangay,
      disabilityType,
      status,
      assistanceStatus
    });
    // Reset Form
    setName('');
    setAge(18);
    setGender('Male');
    setBarangay(LIST_OF_BARANGAYS[0]);
    setDisabilityType(DISABILITY_TYPES[0]);
    setStatus('Active');
    setAssistanceStatus('Unclaimed');
    setShowAddModal(false);
  };

  const handleIssueCashCard = (id: string) => {
    setIssuedCardId(id);
    setTimeout(() => {
      setIssuedCardId(null);
    }, 2500);
  };

  // Filter records
  const filteredRecords = pwdRecords.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.disabilityType.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrgy = barangayFilter === 'All' || rec.barangay === barangayFilter;
    const matchesDisability = disabilityFilter === 'All' || rec.disabilityType === disabilityFilter;
    const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;

    return matchesSearch && matchesBrgy && matchesDisability && matchesStatus;
  });

  return (
    <div className="space-y-6" id="pwd-registry-root">
      {/* Overview Statistics Banner */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm" id="pwd-banner-stats">
        <div className="text-center md:border-r border-slate-100 dark:border-slate-700 py-2">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Registered PWDs</p>
          <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-1">{pwdRecords.length}</p>
        </div>
        <div className="text-center md:border-r border-slate-100 dark:border-slate-700 py-2">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Beneficiaries</p>
          <p className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">
            {pwdRecords.filter(r => r.status === 'Active').length}
          </p>
        </div>
        <div className="text-center md:border-r border-slate-100 dark:border-slate-700 py-2">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Claims Distributed</p>
          <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
            {pwdRecords.filter(r => r.assistanceStatus === 'Claimed').length}
          </p>
        </div>
        <div className="text-center py-2">
          <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending/Unclaimed</p>
          <p className="text-2xl font-black text-amber-500 mt-1">
            {pwdRecords.filter(r => r.assistanceStatus === 'Unclaimed' && r.status === 'Active').length}
          </p>
        </div>
      </div>

      {/* Toolbar / Search Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4" id="pwd-toolbar">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search PWD by Name, ID, Disability..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-slate-700 dark:text-slate-200"
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto bg-[#003fb1] hover:bg-[#1a56db] text-white px-4 py-2 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register New PWD
          </button>
        </div>

        {/* Dropdown Filters row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-50 dark:border-slate-700/60" id="pwd-dropdown-filters">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Barangay</label>
            <select 
              value={barangayFilter}
              onChange={(e) => setBarangayFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Barangays</option>
              {LIST_OF_BARANGAYS.map((b, i) => (
                <option key={i} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Disability Category</label>
            <select 
              value={disabilityFilter}
              onChange={(e) => setDisabilityFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Disabilities</option>
              {DISABILITY_TYPES.map((type, i) => (
                <option key={i} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Account Status</label>
            <select 
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active accounts</option>
              <option value="Inactive">Inactive/Suspended</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden" id="pwd-records-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">Beneficiary ID</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Demographics</th>
                <th className="px-6 py-4">Barangay</th>
                <th className="px-6 py-4">Disability Details</th>
                <th className="px-6 py-4">Quarterly Pension</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
              <AnimatePresence>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec) => {
                    const isCardIssued = issuedCardId === rec.id;
                    
                    return (
                      <motion.tr 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        key={rec.id}
                        className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                      >
                        {/* ID */}
                        <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400 dark:text-slate-500">
                          {rec.id}
                        </td>
                        
                        {/* Name & Status tag */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-slate-800 dark:text-slate-100">{rec.name}</p>
                            <span className={`px-1.5 py-0.5 text-[8px] font-bold rounded-full ${
                              rec.status === 'Active' 
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40' 
                                : 'bg-rose-50 text-rose-600 dark:bg-rose-950/40'
                            }`}>
                              {rec.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3 h-3" /> Registered: {rec.registrationDate}
                          </p>
                        </td>

                        {/* Demographics */}
                        <td className="px-6 py-4 text-xs text-slate-500 dark:text-slate-400 font-medium">
                          {rec.age} yrs old • {rec.gender}
                        </td>

                        {/* Barangay */}
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-semibold text-xs">
                          {rec.barangay}
                        </td>

                        {/* Disability Type */}
                        <td className="px-6 py-4">
                          <span className="bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 px-2.5 py-1 text-xs font-semibold rounded-lg">
                            {rec.disabilityType}
                          </span>
                        </td>

                        {/* Allowance Claim state */}
                        <td className="px-6 py-4">
                          <button 
                            onClick={() => onToggleAssistanceClaim(rec.id)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full cursor-pointer transition-colors ${
                              rec.assistanceStatus === 'Claimed'
                                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40'
                                : 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 hover:bg-amber-100'
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${rec.assistanceStatus === 'Claimed' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                            {rec.assistanceStatus}
                          </button>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end">
                            {/* Cash card activator */}
                            <button 
                              onClick={() => handleIssueCashCard(rec.id)}
                              disabled={isCardIssued}
                              className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition-all ${
                                isCardIssued 
                                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                                  : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:text-blue-600 dark:text-slate-400 hover:bg-blue-50/50'
                              }`}
                              title="Issue MSWDO Financial Cash Card"
                            >
                              {isCardIssued ? <Check className="w-4 h-4" /> : <CreditCard className="w-4 h-4" />}
                              <span>{isCardIssued ? 'Issued!' : 'Issue Card'}</span>
                            </button>

                            {/* Status changer */}
                            <button 
                              onClick={() => onUpdatePWDStatus(rec.id, rec.status === 'Active' ? 'Inactive' : 'Active')}
                              className={`p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-800 dark:text-slate-400 hover:bg-slate-50`}
                              title={rec.status === 'Active' ? 'Mark Inactive' : 'Mark Active'}
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No PWD registry records found matching filters
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Register PWD Modal */}
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
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Register Person with Disability</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name (Last, First)</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Dela Cruz, Maria Bella"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                    <input 
                      type="number" 
                      min={0}
                      max={120}
                      required
                      value={age}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Gender</label>
                    <select 
                      value={gender}
                      onChange={(e: any) => setGender(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Barangay</label>
                    <select 
                      value={barangay}
                      onChange={(e) => setBarangay(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    >
                      {LIST_OF_BARANGAYS.map((b, i) => (
                        <option key={i} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Disability Type</label>
                    <select 
                      value={disabilityType}
                      onChange={(e) => setDisabilityType(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    >
                      {DISABILITY_TYPES.map((type, i) => (
                        <option key={i} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Status</label>
                    <select 
                      value={status}
                      onChange={(e: any) => setStatus(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    >
                      <option value="Active">Active account</option>
                      <option value="Inactive">Inactive</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">First Pension Claim</label>
                    <select 
                      value={assistanceStatus}
                      onChange={(e: any) => setAssistanceStatus(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    >
                      <option value="Unclaimed">Unclaimed (Pending)</option>
                      <option value="Claimed">Claimed (Disbursed)</option>
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
                    Complete Registration
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
