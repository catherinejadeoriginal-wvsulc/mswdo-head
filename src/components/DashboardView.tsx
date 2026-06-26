import React, { useState } from 'react';
import { Disbursement, AICSProgram, BarangayRequest, MonthlyData } from '../types';
import { 
  TrendingUp, 
  AlertTriangle, 
  PiggyBank, 
  Wallet, 
  ListTodo, 
  MoreVertical, 
  Search, 
  Plus, 
  MapPin, 
  History, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  ChevronRight,
  Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DashboardViewProps {
  programs: AICSProgram[];
  disbursements: Disbursement[];
  barangayRequests: BarangayRequest[];
  monthlyData: MonthlyData[];
  onAddDisbursementClick: () => void;
  onViewAllDisbursementsClick: () => void;
  onBarangayClick: (barangay: BarangayRequest) => void;
  onViewDetailedMapClick: () => void;
}

export default function DashboardView({
  programs,
  disbursements,
  barangayRequests,
  monthlyData,
  onAddDisbursementClick,
  onViewAllDisbursementsClick,
  onBarangayClick,
  onViewDetailedMapClick
}: DashboardViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [hoveredDonutSegment, setHoveredDonutSegment] = useState<string | null>(null);

  // Dynamic calculations based on state (which perfectly match mockup defaults!)
  const totalBudget = 25000000; // ₱25M
  const utilizedBudget = programs.reduce((sum, prog) => sum + prog.utilizedBudget, 0);
  const remainingBudget = totalBudget - utilizedBudget;
  const utilizedPercentage = Math.round((utilizedBudget / totalBudget) * 100);

  // Filter disbursements for search
  const filteredDisbursements = disbursements
    .filter(d => 
      d.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.program.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.barangay.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .slice(0, 4); // Display top 4 recent items as in mockup

  const formatCurrency = (val: number) => {
    if (val >= 1000000) {
      return `₱${(val / 1000000).toFixed(1)}M`;
    }
    return `₱${val.toLocaleString()}`;
  };

  // Pie/Donut calculations for beneficiaries:
  // Mockup: AICS (45%), Senior (30%), PWD (15%), Solo (10%)
  const segments = [
    { label: 'AICS', percentage: 45, color: '#003fb1', hoverColor: '#1d4ed8' },
    { label: 'Senior Citizens', percentage: 30, color: '#4edea3', hoverColor: '#22c55e' },
    { label: 'PWDs', percentage: 15, color: '#c5c6c8', hoverColor: '#9ca3af' },
    { label: 'Solo Parents', percentage: 10, color: '#1353d8', hoverColor: '#3b82f6' }
  ];

  // Helper to calculate stroke dash properties for circular chart
  let cumulativePercentage = 0;

  return (
    <div className="space-y-6" id="dashboard-view-root">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" id="stat-cards-grid">
        {/* Card 1: Active Programs */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          id="stat-card-active-programs"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
              <ListTodo className="w-6 h-6" />
            </div>
            <span className="text-emerald-700 dark:text-emerald-400 font-medium text-xs flex items-center gap-1 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-full">
              <TrendingUp className="w-3.5 h-3.5" /> +12%
            </span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Active Programs</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">24</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">Across 14 barangays</p>
        </motion.div>

        {/* Card 2: Total Annual Budget */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          id="stat-card-total-budget"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Annual Budget</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(totalBudget)}</p>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-2">FY 2024 Allocation</p>
        </motion.div>

        {/* Card 3: Utilized Budget */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          id="stat-card-utilized-budget"
        >
          <div className="flex justify-between items-start mb-3">
            <div className="p-3 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <span className="text-rose-700 dark:text-rose-400 font-medium text-xs flex items-center gap-1 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-1 rounded-full">
              <AlertTriangle className="w-3.5 h-3.5" /> High
            </span>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Utilized Budget</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(utilizedBudget)}</p>
          
          <div className="w-full bg-slate-100 dark:bg-slate-700 h-2 rounded-full mt-4 overflow-hidden relative">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${utilizedPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="bg-blue-600 dark:bg-blue-500 h-full rounded-full"
            />
          </div>
          <p className="text-slate-400 dark:text-slate-500 text-xs mt-2 text-right font-medium">{utilizedPercentage}% Spent</p>
        </motion.div>

        {/* Card 4: Remaining Budget */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.15 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group cursor-pointer"
          id="stat-card-remaining-budget"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
              <PiggyBank className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Remaining Budget</h3>
          <p className="text-3xl font-bold text-slate-800 dark:text-slate-100">{formatCurrency(remainingBudget)}</p>
          <p className="text-emerald-600 dark:text-emerald-400 text-xs font-medium mt-2">Sustainable levels</p>
        </motion.div>
      </div>

      {/* Main Analytics Layout - Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="bento-analytics-grid">
        
        {/* Bar Chart: Budget Utilization */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 flex flex-col" id="monthly-utilization-chart-container">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Monthly Budget Utilization</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Comparative analysis of expenditures (Millions)</p>
            </div>
            <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>

          {/* Interactive SVG Bar Chart */}
          <div className="flex-1 min-h-[300px] flex items-center justify-center relative p-2" id="svg-bar-chart">
            <svg viewBox="0 0 600 240" className="w-full h-full">
              {/* Gridlines */}
              {[0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5].map((val, idx) => {
                const yPos = 200 - (val / 3.5) * 160;
                return (
                  <g key={idx}>
                    <line 
                      x1="45" 
                      y1={yPos} 
                      x2="580" 
                      y2={yPos} 
                      stroke="#f1f5f9" 
                      className="dark:stroke-slate-700/60" 
                      strokeWidth="1" 
                    />
                    <text 
                      x="35" 
                      y={yPos + 4} 
                      textAnchor="end" 
                      fontSize="10" 
                      className="fill-slate-400 dark:fill-slate-500 font-medium"
                    >
                      {val.toFixed(1)}
                    </text>
                  </g>
                );
              })}

              {/* Chart Bars */}
              {monthlyData.map((data, idx) => {
                const barWidth = 24;
                const gap = 30;
                const startX = 60 + idx * (barWidth + gap);
                const forecastHeight = (data.forecast / 3.5) * 160;
                const spentHeight = (data.spent / 3.5) * 160;

                const isHovered = hoveredBar === idx;

                return (
                  <g 
                    key={idx}
                    onMouseEnter={() => setHoveredBar(idx)}
                    onMouseLeave={() => setHoveredBar(null)}
                    className="cursor-pointer"
                  >
                    {/* Forecast Background Bar */}
                    <rect 
                      x={startX} 
                      y={200 - forecastHeight} 
                      width={barWidth} 
                      height={forecastHeight} 
                      fill="#e2e8f8" 
                      className="dark:fill-slate-700"
                      rx="6" 
                    />

                    {/* Spent Active Bar */}
                    <motion.rect 
                      initial={{ height: 0, y: 200 }}
                      animate={{ height: spentHeight, y: 200 - spentHeight }}
                      transition={{ duration: 0.5, delay: idx * 0.03 }}
                      x={startX} 
                      width={barWidth} 
                      fill={isHovered ? '#1d4ed8' : '#003fb1'} 
                      rx="6" 
                    />

                    {/* Month Label */}
                    <text 
                      x={startX + barWidth / 2} 
                      y="218" 
                      textAnchor="middle" 
                      fontSize="10" 
                      className="fill-slate-500 dark:fill-slate-400 font-medium"
                    >
                      {data.month}
                    </text>

                    {/* Invisible hover overlay to make selecting easier */}
                    <rect 
                      x={startX - gap/4}
                      y="10"
                      width={barWidth + gap/2}
                      height="200"
                      fill="transparent"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Dynamic Tooltip */}
            <AnimatePresence>
              {hoveredBar !== null && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 10 }}
                  className="absolute bg-slate-900 text-white p-3 rounded-lg shadow-xl text-xs flex flex-col gap-1 pointer-events-none border border-slate-700"
                  style={{
                    left: `${60 + hoveredBar * 54 - 15}px`,
                    bottom: '240px'
                  }}
                  id="chart-tooltip"
                >
                  <p className="font-bold border-b border-slate-700 pb-1 mb-1">{monthlyData[hoveredBar].month} 2024</p>
                  <p className="flex justify-between gap-4">
                    <span className="text-slate-400">Spent:</span> 
                    <span className="font-bold text-blue-400">₱{monthlyData[hoveredBar].spent.toFixed(2)}M</span>
                  </p>
                  <p className="flex justify-between gap-4">
                    <span className="text-slate-400">Forecast:</span> 
                    <span className="font-bold text-slate-300">₱{monthlyData[hoveredBar].forecast.toFixed(2)}M</span>
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chart Legend */}
          <div className="flex justify-center gap-6 mt-2 pt-2 border-t border-slate-50 dark:border-slate-700/50 text-xs text-slate-500 dark:text-slate-400 font-medium" id="chart-legend">
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-[#003fb1] rounded-md"></span>
              <span>Actual Spent</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 bg-[#e2e8f8] dark:bg-slate-700 rounded-md"></span>
              <span>Forecast / Limit</span>
            </div>
          </div>
        </div>

        {/* Pie Chart: Beneficiary Distribution */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm p-6 flex flex-col" id="beneficiary-distribution-chart-container">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Beneficiaries</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Distribution by category</p>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center gap-6 py-4" id="donut-chart-subcontainer">
            {/* Custom Interactive SVG Donut */}
            <div className="relative w-full aspect-square max-w-[180px] flex items-center justify-center" id="donut-chart-interactive">
              <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                {/* Gray background track */}
                <circle 
                  cx="18" 
                  cy="18" 
                  r="15.915" 
                  fill="transparent" 
                  stroke="#f1f5f9" 
                  className="dark:stroke-slate-700"
                  strokeWidth="3.2" 
                />

                {/* Draw segments */}
                {segments.map((seg, idx) => {
                  // Calculate stroke properties
                  const dashArray = `${seg.percentage} ${100 - seg.percentage}`;
                  const strokeOffset = 100 - cumulativePercentage;
                  cumulativePercentage += seg.percentage;

                  const isHovered = hoveredDonutSegment === seg.label;

                  return (
                    <circle 
                      key={idx}
                      cx="18" 
                      cy="18" 
                      r="15.915" 
                      fill="transparent" 
                      stroke={seg.color} 
                      strokeWidth={isHovered ? "4.2" : "3.2"} 
                      strokeDasharray={dashArray} 
                      strokeDashoffset={strokeOffset}
                      className="transition-all duration-200 cursor-pointer"
                      onMouseEnter={() => setHoveredDonutSegment(seg.label)}
                      onMouseLeave={() => setHoveredDonutSegment(null)}
                    />
                  );
                })}
              </svg>

              {/* Center labels showing hovered or total summary */}
              <div className="absolute text-center flex flex-col items-center justify-center pointer-events-none" id="donut-center-label">
                {hoveredDonutSegment ? (
                  <>
                    <span className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 tracking-wider">
                      {hoveredDonutSegment.split(' ')[0]}
                    </span>
                    <span className="text-xl font-extrabold text-blue-600 dark:text-blue-400">
                      {segments.find(s => s.label === hoveredDonutSegment)?.percentage}%
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 dark:text-slate-500 tracking-wider">
                      Total Clients
                    </span>
                    <span className="text-xl font-extrabold text-slate-800 dark:text-slate-100">
                      2,154
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Segment legend list */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 w-full text-xs" id="donut-legend">
              {segments.map((seg, idx) => {
                const isHovered = hoveredDonutSegment === seg.label;
                return (
                  <div 
                    key={idx} 
                    className={`flex items-center gap-2 p-1.5 rounded-lg transition-colors cursor-pointer ${
                      isHovered ? 'bg-slate-50 dark:bg-slate-700/50 font-bold' : ''
                    }`}
                    onMouseEnter={() => setHoveredDonutSegment(seg.label)}
                    onMouseLeave={() => setHoveredDonutSegment(null)}
                  >
                    <span 
                      className="w-3 h-3 rounded-full shrink-0" 
                      style={{ backgroundColor: seg.color }}
                    />
                    <span className="text-slate-600 dark:text-slate-300 font-medium truncate">
                      {seg.label} ({seg.percentage}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Barangay Requests & Recent Activity Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="map-recent-section">
        
        {/* Barangay Assistance Map List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col" id="barangay-assistance-map-list">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700/60">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Barangay Assistance Map</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Real-time request volume</p>
          </div>

          {/* List items with color-coded severity borders */}
          <div className="p-6 flex-1 overflow-y-auto max-h-[380px] space-y-3 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700" id="barangay-list-scroller">
            {barangayRequests.slice(0, 5).map((brgy) => {
              // Status Styling
              let borderClass = 'border-l-4 border-slate-300';
              let badgeClass = 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';

              if (brgy.status === 'CRITICAL') {
                borderClass = 'border-l-4 border-rose-500';
                badgeClass = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400';
              } else if (brgy.status === 'MODERATE') {
                borderClass = 'border-l-4 border-amber-500';
                badgeClass = 'bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400';
              } else if (brgy.status === 'STABLE') {
                borderClass = 'border-l-4 border-emerald-500';
                badgeClass = 'bg-emerald-50 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400';
              }

              return (
                <motion.div 
                  whileHover={{ scale: 1.01, x: 2 }}
                  key={brgy.id}
                  onClick={() => onBarangayClick(brgy)}
                  className={`flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-700/40 rounded-xl ${borderClass} transition-all cursor-pointer`}
                >
                  <div>
                    <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{brgy.name}</p>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{brgy.pendingRequests} pending requests</p>
                  </div>
                  <span className={`px-2.5 py-1 text-[10px] font-bold rounded-full tracking-wider uppercase ${badgeClass}`}>
                    {brgy.status}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700/50 text-center rounded-b-2xl">
            <button 
              onClick={onViewDetailedMapClick}
              className="w-full text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-bold text-sm py-1.5 flex items-center justify-center gap-1.5 hover:underline"
            >
              <MapPin className="w-4 h-4" /> View Detailed Map Analytics
            </button>
          </div>
        </div>

        {/* Recent Disbursements Spreadsheet/Table */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm flex flex-col overflow-hidden" id="recent-disbursements-table-card">
          <div className="p-6 border-b border-slate-50 dark:border-slate-700/60 flex flex-col sm:flex-row gap-4 justify-between sm:items-center">
            <div>
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Disbursements</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm">Latest social welfare grants issued</p>
            </div>
            
            <div className="flex gap-2" id="table-header-actions">
              <button 
                onClick={onViewAllDisbursementsClick}
                className="text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-4 py-2 font-semibold text-xs rounded-full flex items-center gap-1.5 border border-blue-100 dark:border-blue-900/30 transition-all cursor-pointer"
              >
                <History className="w-3.5 h-3.5" /> View All History
              </button>
              <button 
                onClick={onAddDisbursementClick}
                className="bg-[#003fb1] hover:bg-[#1a56db] text-white px-4 py-2 font-bold text-xs rounded-full flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Grant
              </button>
            </div>
          </div>

          {/* Quick Search and Filter bar */}
          <div className="px-6 py-3 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-50 dark:border-slate-700/40 flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="Quick search recipient, program, or barangay..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent border-none focus:outline-none focus:ring-0 text-xs w-full text-slate-700 dark:text-slate-300"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-2"
              >
                Clear
              </button>
            )}
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-700/40 text-slate-500 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                  <th className="px-6 py-4 font-bold">Recipient</th>
                  <th className="px-6 py-4 font-bold">Program</th>
                  <th className="px-6 py-4 font-bold">Amount</th>
                  <th className="px-6 py-4 font-bold">Barangay</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                <AnimatePresence>
                  {filteredDisbursements.length > 0 ? (
                    filteredDisbursements.map((disb) => {
                      let statusBadge = 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-200';
                      let StatusIcon = Clock;

                      if (disb.status === 'Disbursed') {
                        statusBadge = 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100/50 dark:border-emerald-900/30';
                        StatusIcon = CheckCircle2;
                      } else if (disb.status === 'Pending') {
                        statusBadge = 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-100/50 dark:border-amber-900/30';
                        StatusIcon = Clock;
                      } else if (disb.status === 'Rejected') {
                        statusBadge = 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border border-rose-100/50 dark:border-rose-900/30';
                        StatusIcon = XCircle;
                      }

                      return (
                        <motion.tr 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={disb.id} 
                          className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors"
                        >
                          <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-100">{disb.recipient}</td>
                          <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs font-medium">{disb.program}</td>
                          <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-100">₱{disb.amount.toLocaleString()}</td>
                          <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs font-medium">{disb.barangay}</td>
                          <td className="px-6 py-4 text-slate-400 dark:text-slate-500 text-xs font-medium">
                            {new Date(disb.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-full tracking-wide uppercase ${statusBadge}`}>
                              <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                              {disb.status}
                            </span>
                          </td>
                        </motion.tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-slate-400 dark:text-slate-500 font-medium">
                        No recent disbursements found matching "{searchTerm}"
                      </td>
                    </tr>
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
