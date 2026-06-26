import React, { useState } from 'react';
import { SeniorRecord } from '../types';
import { 
  Search, 
  Plus, 
  AlertCircle, 
  CheckCircle, 
  HelpCircle, 
  Phone, 
  Trash2, 
  FileText,
  Clock,
  UserCheck,
  Calendar,
  DollarSign,
  Heart,
  XCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LIST_OF_BARANGAYS } from '../data/mockData';

interface SeniorsViewProps {
  seniorRecords: SeniorRecord[];
  onAddSeniorRecord: (newSenior: Omit<SeniorRecord, 'id' | 'registrationDate'>) => void;
  onUpdatePensionStatus: (id: string, status: 'Active' | 'Suspended' | 'Pending') => void;
  onDisbursePension: (id: string) => void;
}

export default function SeniorsView({
  seniorRecords,
  onAddSeniorRecord,
  onUpdatePensionStatus,
  onDisbursePension
}: SeniorsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('All');
  const [pensionFilter, setPensionFilter] = useState<'All' | 'Active' | 'Suspended' | 'Pending'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [age, setAge] = useState(60);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [barangay, setBarangay] = useState(LIST_OF_BARANGAYS[0]);
  const [pensionStatus, setPensionStatus] = useState<'Active' | 'Suspended' | 'Pending'>('Active');
  const [contactNumber, setContactNumber] = useState('');

  // Disbursement visual indicator state
  const [disbursedSeniorId, setDisbursedSeniorId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || age < 60) return;
    onAddSeniorRecord({
      name,
      age,
      gender,
      barangay,
      pensionStatus,
      lastClaimDate: 'Never',
      contactNumber: contactNumber || 'No Contact',
    });
    // Reset Form
    setName('');
    setAge(60);
    setGender('Female');
    setBarangay(LIST_OF_BARANGAYS[0]);
    setPensionStatus('Active');
    setContactNumber('');
    setShowAddModal(false);
  };

  const handleDisburseClick = (id: string) => {
    onDisbursePension(id);
    setDisbursedSeniorId(id);
    setTimeout(() => {
      setDisbursedSeniorId(null);
    }, 2500);
  };

  const filteredRecords = seniorRecords.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          rec.contactNumber.includes(searchTerm);
    const matchesBrgy = barangayFilter === 'All' || rec.barangay === barangayFilter;
    const matchesPension = pensionFilter === 'All' || rec.pensionStatus === pensionFilter;

    return matchesSearch && matchesBrgy && matchesPension;
  });

  return (
    <div className="space-y-6" id="seniors-view-root">
      {/* Overview Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="seniors-stats">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-950/40 text-red-500 rounded-xl">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Seniors</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{seniorRecords.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Pensioners</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
              {seniorRecords.filter(r => r.pensionStatus === 'Active').length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Approvals</p>
            <p className="text-2xl font-black text-amber-500 mt-0.5">
              {seniorRecords.filter(r => r.pensionStatus === 'Pending').length}
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Est. Monthly Payout</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">
              ₱{(seniorRecords.filter(r => r.pensionStatus === 'Active').length * 1000).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4" id="seniors-toolbar">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search senior citizens by Name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-slate-700 dark:text-slate-200"
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto bg-[#003fb1] hover:bg-[#1a56db] text-white px-4 py-2 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register Senior Citizen
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-50 dark:border-slate-700/60" id="seniors-filters-grid">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Barangay Location</label>
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
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Pension Program Status</label>
            <select 
              value={pensionFilter}
              onChange={(e: any) => setPensionFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Pension (Receiving)</option>
              <option value="Suspended">Suspended/Frozen</option>
              <option value="Pending">Pending Application Review</option>
            </select>
          </div>
        </div>
      </div>

      {/* Senior Records Spreadsheet Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden" id="seniors-records-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">Senior ID</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Age / Demographics</th>
                <th className="px-6 py-4">Barangay</th>
                <th className="px-6 py-4">Contact</th>
                <th className="px-6 py-4">Pension Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
              <AnimatePresence>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec) => {
                    // Claim Status Styling
                    let pensionBadge = 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
                    if (rec.pensionStatus === 'Active') {
                      pensionBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/50';
                    } else if (rec.pensionStatus === 'Pending') {
                      pensionBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100/50';
                    } else if (rec.pensionStatus === 'Suspended') {
                      pensionBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100/50';
                    }

                    const isPayoutDisbursed = disbursedSeniorId === rec.id;

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

                        {/* Name and registration */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 dark:text-slate-100">{rec.name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" /> Enrolled: {rec.registrationDate}
                          </p>
                        </td>

                        {/* Age & Demographics */}
                        <td className="px-6 py-4 font-semibold text-slate-600 dark:text-slate-400 text-xs">
                          {rec.age} yrs old • {rec.gender}
                        </td>

                        {/* Barangay */}
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-semibold text-xs">
                          {rec.barangay}
                        </td>

                        {/* Contact */}
                        <td className="px-6 py-4 text-xs font-medium text-slate-500 dark:text-slate-400">
                          <div className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            <span>{rec.contactNumber}</span>
                          </div>
                        </td>

                        {/* Pension Status */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${pensionBadge}`}>
                            {rec.pensionStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end text-xs">
                            {/* Record Payout / claim */}
                            <button 
                              onClick={() => handleDisburseClick(rec.id)}
                              disabled={rec.pensionStatus !== 'Active' || isPayoutDisbursed}
                              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all ${
                                isPayoutDisbursed
                                  ? 'bg-emerald-500 border-emerald-500 text-white font-black'
                                  : rec.pensionStatus === 'Active'
                                    ? 'border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 hover:border-blue-300'
                                    : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                              }`}
                              title="Disburse Monthly Senior Stipend"
                            >
                              <DollarSign className="w-3.5 h-3.5" />
                              <span>{isPayoutDisbursed ? 'Paid!' : 'Issue Payout'}</span>
                            </button>

                            {/* Status changer */}
                            <select 
                              value={rec.pensionStatus}
                              onChange={(e) => onUpdatePensionStatus(rec.id, e.target.value as any)}
                              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-transparent text-slate-600 dark:text-slate-300 focus:outline-none"
                            >
                              <option value="Active">Active</option>
                              <option value="Suspended">Suspend</option>
                              <option value="Pending">Review</option>
                            </select>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No Senior Citizens found matching filters
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Senior Modal */}
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
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Register Senior Citizen</h3>
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
                    placeholder="e.g. Santos, Maria Jovita"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age (Minimum 60)</label>
                    <input 
                      type="number" 
                      min={60}
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
                      <option value="Female">Female</option>
                      <option value="Male">Male</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Barangay Residence</label>
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Phone</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 0917-000-0000"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pension Program Status</label>
                  <select 
                    value={pensionStatus}
                    onChange={(e: any) => setPensionStatus(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                  >
                    <option value="Active">Active Pensioner (Automatic claims enabled)</option>
                    <option value="Pending">Pending Review (Requires validation)</option>
                    <option value="Suspended">Suspended/Frozen Account</option>
                  </select>
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
                    Enrol Citizen
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
