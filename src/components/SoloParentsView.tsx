import React, { useState } from 'react';
import { SoloParentRecord } from '../types';
import { 
  Search, 
  Plus, 
  Trash2, 
  FileText,
  Calendar,
  Sparkles,
  RefreshCw,
  Home,
  CheckCircle,
  Clock,
  XCircle,
  Briefcase,
  Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LIST_OF_BARANGAYS } from '../data/mockData';

interface SoloParentsViewProps {
  soloParentRecords: SoloParentRecord[];
  onAddSoloParentRecord: (newRecord: Omit<SoloParentRecord, 'id' | 'registrationDate'>) => void;
  onRenewCard: (id: string) => void;
  onUpdateEmployment: (id: string, empStatus: 'Employed' | 'Unemployed' | 'Self-Employed') => void;
}

export default function SoloParentsView({
  soloParentRecords,
  onAddSoloParentRecord,
  onRenewCard,
  onUpdateEmployment
}: SoloParentsViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [barangayFilter, setBarangayFilter] = useState('All');
  const [cardFilter, setCardFilter] = useState<'All' | 'Active' | 'Expired' | 'Pending'>('All');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [age, setAge] = useState(25);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Female');
  const [childrenCount, setChildrenCount] = useState(1);
  const [monthlyIncome, setMonthlyIncome] = useState(5000);
  const [barangay, setBarangay] = useState(LIST_OF_BARANGAYS[0]);
  const [cardStatus, setCardStatus] = useState<'Active' | 'Expired' | 'Pending'>('Active');
  const [employmentStatus, setEmploymentStatus] = useState<'Employed' | 'Unemployed' | 'Self-Employed'>('Employed');

  const [renewedId, setRenewedId] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || age <= 0 || childrenCount < 1) return;
    onAddSoloParentRecord({
      name,
      age,
      gender,
      childrenCount,
      monthlyIncome,
      barangay,
      cardStatus,
      employmentStatus
    });
    // Reset Form
    setName('');
    setAge(25);
    setGender('Female');
    setChildrenCount(1);
    setMonthlyIncome(5000);
    setBarangay(LIST_OF_BARANGAYS[0]);
    setCardStatus('Active');
    setEmploymentStatus('Employed');
    setShowAddModal(false);
  };

  const handleRenewCard = (id: string) => {
    onRenewCard(id);
    setRenewedId(id);
    setTimeout(() => {
      setRenewedId(null);
    }, 2000);
  };

  // Calculations for stats
  const totalParents = soloParentRecords.length;
  const totalChildren = soloParentRecords.reduce((sum, r) => sum + r.childrenCount, 0);
  const avgChildren = totalParents ? (totalChildren / totalParents).toFixed(1) : 0;
  const avgIncome = totalParents ? Math.round(soloParentRecords.reduce((sum, r) => sum + r.monthlyIncome, 0) / totalParents) : 0;

  const filteredRecords = soloParentRecords.filter(rec => {
    const matchesSearch = rec.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          rec.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBrgy = barangayFilter === 'All' || rec.barangay === barangayFilter;
    const matchesCard = cardFilter === 'All' || rec.cardStatus === cardFilter;

    return matchesSearch && matchesBrgy && matchesCard;
  });

  return (
    <div className="space-y-6" id="solo-parents-root">
      {/* Overview stats block */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6" id="solo-parents-stats">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 text-blue-500 rounded-xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Solo Parents</p>
            <p className="text-2xl font-black text-slate-800 dark:text-slate-100 mt-0.5">{totalParents}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 rounded-xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Children Protected</p>
            <p className="text-2xl font-black text-indigo-600 dark:text-indigo-400 mt-0.5">{totalChildren}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/40 text-amber-500 rounded-xl">
            <RefreshCw className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Children/Family</p>
            <p className="text-2xl font-black text-amber-500 mt-0.5">{avgChildren}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 rounded-xl">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Avg Monthly Income</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">₱{avgIncome.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Toolbar / Search Filters */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm space-y-4" id="solo-parents-toolbar">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 w-4.5 h-4.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search solo parents by Name or ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs border border-slate-200 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-transparent text-slate-700 dark:text-slate-200"
            />
          </div>

          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full md:w-auto bg-[#003fb1] hover:bg-[#1a56db] text-white px-4 py-2 font-bold text-xs rounded-lg flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Register Solo Parent
          </button>
        </div>

        {/* Filters dropdowns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-50 dark:border-slate-700/60" id="solo-parents-filters">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Barangay Residence</label>
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
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">ID Card Status</label>
            <select 
              value={cardFilter}
              onChange={(e: any) => setCardFilter(e.target.value)}
              className="w-full text-xs border border-slate-200 dark:border-slate-600 rounded-lg p-2 bg-transparent text-slate-700 dark:text-slate-200 focus:outline-none"
            >
              <option value="All">All Card Statuses</option>
              <option value="Active">Active Card (Valid)</option>
              <option value="Expired">Expired Card (Requires Renewal)</option>
              <option value="Pending">Pending Enrolment</option>
            </select>
          </div>
        </div>
      </div>

      {/* Solo Parent Registry Table */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden" id="solo-parents-table-container">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase border-b border-slate-100 dark:border-slate-700">
                <th className="px-6 py-4">Solo Parent ID</th>
                <th className="px-6 py-4">Full Name</th>
                <th className="px-6 py-4">Age / Gender</th>
                <th className="px-6 py-4">Barangay</th>
                <th className="px-6 py-4">No. of Children</th>
                <th className="px-6 py-4">Employment / Income</th>
                <th className="px-6 py-4">Card Validity</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
              <AnimatePresence>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map((rec) => {
                    let cardBadge = 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
                    if (rec.cardStatus === 'Active') {
                      cardBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 border border-emerald-100/50';
                    } else if (rec.cardStatus === 'Expired') {
                      cardBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 border border-rose-100/50';
                    } else if (rec.cardStatus === 'Pending') {
                      cardBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 border border-amber-100/50';
                    }

                    const isRenewed = renewedId === rec.id;

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

                        {/* Name and registered */}
                        <td className="px-6 py-4">
                          <p className="font-bold text-slate-800 dark:text-slate-100">{rec.name}</p>
                          <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                            <Calendar className="w-3.5 h-3.5" /> Registered: {rec.registrationDate}
                          </p>
                        </td>

                        {/* Age & Gender */}
                        <td className="px-6 py-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          {rec.age} yrs old • {rec.gender}
                        </td>

                        {/* Barangay */}
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-semibold text-xs">
                          {rec.barangay}
                        </td>

                        {/* Children Count */}
                        <td className="px-6 py-4">
                          <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 px-2.5 py-1 text-xs rounded-full">
                            {rec.childrenCount} kids
                          </span>
                        </td>

                        {/* Employment Status */}
                        <td className="px-6 py-4">
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-slate-700 dark:text-slate-200">{rec.employmentStatus}</span>
                            <span className="text-[10px] text-slate-400 mt-0.5">₱{rec.monthlyIncome.toLocaleString()}/month</span>
                          </div>
                        </td>

                        {/* Card Validity */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${cardBadge}`}>
                            {rec.cardStatus}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="px-6 py-4 text-right">
                          <div className="flex gap-2 justify-end text-xs">
                            {/* Renew ID card */}
                            <button 
                              onClick={() => handleRenewCard(rec.id)}
                              disabled={rec.cardStatus === 'Active' || isRenewed}
                              className={`px-3 py-1.5 rounded-lg border font-bold flex items-center gap-1.5 transition-all ${
                                isRenewed
                                  ? 'bg-emerald-500 border-emerald-500 text-white'
                                  : rec.cardStatus !== 'Active'
                                    ? 'border-slate-200 dark:border-slate-700 text-blue-600 dark:text-blue-400 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer'
                                    : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600 cursor-not-allowed'
                              }`}
                              title="Renew Solo Parent Benefit Card"
                            >
                              <RefreshCw className="w-3.5 h-3.5" />
                              <span>{isRenewed ? 'Renewed!' : 'Renew Card'}</span>
                            </button>

                            {/* Employment toggler */}
                            <select 
                              value={rec.employmentStatus}
                              onChange={(e) => onUpdateEmployment(rec.id, e.target.value as any)}
                              className="text-xs border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 bg-transparent text-slate-600 dark:text-slate-300 focus:outline-none"
                            >
                              <option value="Employed">Employed</option>
                              <option value="Self-Employed">Self-Emp</option>
                              <option value="Unemployed">Unemployed</option>
                            </select>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                      No Solo Parent registry records found matching filters
                    </td>
                  </tr>
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Register Solo Parent Modal */}
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
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Register Solo Parent</h3>
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
                    placeholder="e.g. Rivera, Jocelyn Sarah"
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
                      min={15}
                      max={100}
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">No. of Children</label>
                    <input 
                      type="number" 
                      min={1}
                      max={20}
                      required
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Monthly Income (₱)</label>
                    <input 
                      type="number" 
                      min={0}
                      required
                      value={monthlyIncome}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    />
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
                    <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employment</label>
                    <select 
                      value={employmentStatus}
                      onChange={(e: any) => setEmploymentStatus(e.target.value)}
                      className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                    >
                      <option value="Employed">Employed</option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Unemployed">Unemployed</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Card Status</label>
                  <select 
                    value={cardStatus}
                    onChange={(e: any) => setCardStatus(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 dark:border-slate-600 rounded-lg text-sm bg-transparent text-slate-800 dark:text-slate-100"
                  >
                    <option value="Active">Active Card (Approved)</option>
                    <option value="Pending">Pending Review</option>
                    <option value="Expired">Expired</option>
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
                    Register Family
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
