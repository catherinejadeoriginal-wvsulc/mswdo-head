import React, { useState, useRef, useEffect } from 'react';
import { AICSProgram, Disbursement, BarangayRequest } from '../types';
import { 
  FileSpreadsheet, 
  Download, 
  Sparkles, 
  Send, 
  CheckCircle,
  Activity,
  Bot,
  Filter,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { LIST_OF_BARANGAYS } from '../data/mockData';

interface ReportsViewProps {
  programs: AICSProgram[];
  disbursements: Disbursement[];
  barangayRequests: BarangayRequest[];
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: Date;
}

export default function ReportsView({
  programs,
  disbursements,
  barangayRequests
}: ReportsViewProps) {
  const [activeSubTab, setActiveSubTab] = useState<'ledger' | 'ai'>('ledger');
  
  // Filtering states
  const [filterProgram, setFilterProgram] = useState('All');
  const [filterBarangay, setFilterBarangay] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterSearch, setFilterSearch] = useState('');

  // AI chat states
  const [chatInput, setChatInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const totalBudget = 25000000;
  const totalSpent = programs.reduce((sum, p) => sum + p.utilizedBudget, 0);
  const remainingBudget = totalBudget - totalSpent;
  const utilizedPercent = ((totalSpent / totalBudget) * 100).toFixed(1);

  // Welcome message initialization
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([
        {
          id: 'welcome-msg',
          sender: 'assistant',
          text: `👋 Hello Admin! I am the **MSWDO Civic AI Consultant**.\n\nI have scanned your local database of **${programs.length} active programs**, **${disbursements.length} recent grants**, and pending barangay files. I can help you with:\n- 📊 **Budget Utilization Analysis** (identifying over/underspent sectors)\n- ✍️ **Memo Generation** (drafting recommendation letters for beneficiaries)\n- 🗺️ **Barangay Request Assessments**\n- 💡 **Policy and Allocation Proposals**\n\nAsk me a question or try typing **"analyze budget"** or **"draft educational memo for Dela Cruz"** to see me work!`,
          timestamp: new Date()
        }
      ]);
    }
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle send message
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: chatInput,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    const query = chatInput.toLowerCase();
    setChatInput('');
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      let responseText = '';

      if (query.includes('analyze') && query.includes('budget')) {
        responseText = `### 📊 Contextual Budget utilization Report\n\nBased on your active records, here is my automated optimization report:\n\n*   **Total Municipal Budget Allocation:** ₱${totalBudget.toLocaleString()}\n*   **Total Amount Disbursed/Spent:** ₱${totalSpent.toLocaleString()} (**${utilizedPercent}%** utilized)\n*   **Remaining Sustainable Reserve:** ₱${remainingBudget.toLocaleString()}\n\n#### 📈 Key Program Breakdown:\n${programs.map(p => `*   **${p.name}:** ₱${p.utilizedBudget.toLocaleString()} utilized of ₱${p.allocatedBudget.toLocaleString()} (**${Math.round((p.utilizedBudget / p.allocatedBudget) * 100)}%**)`).join('\n')}\n\n#### 💡 Actionable Insights:\n1.  🚨 **High Burn Rate in Medical Subsidies:** Medical assistance is at **${Math.round((programs.find(p => p.id === 'prog-2')?.utilizedBudget || 0) / (programs.find(p => p.id === 'prog-2')?.allocatedBudget || 1) * 100)}%** utilization. I suggest a re-allocation of ₱500,000 from the **Solo Parents Cash Incentive** surplus to ensure coverage for Q4 chemotherapy cases.\n2.  🌱 **Underspent Sectors:** Solo parent programs are currently under-utilized (**${Math.round((programs.find(p => p.id === 'prog-6')?.utilizedBudget || 0) / (programs.find(p => p.id === 'prog-6')?.allocatedBudget || 1) * 100)}%**). This suggests a bottleneck in local ID-card issuance. I recommend setting up mobile registration desks in **Poblacion I** and **San Isidro**.`;
      } 
      else if (query.includes('memo') || query.includes('letter') || query.includes('draft')) {
        let recipient = 'Juan Dela Cruz';
        let program = 'Educational Assistance';
        let amount = '₱5,000.00';

        if (query.includes('maria') || query.includes('santos')) {
          recipient = 'Maria Santos';
          program = 'Senior Social Pension';
          amount = '₱3,000.00';
        } else if (query.includes('bautista') || query.includes('jose')) {
          recipient = 'Jose Bautista';
          program = 'Medical Assistance';
          amount = '₱12,500.00';
        }

        responseText = `### 📄 Recommendation Memo Draft\n\n**OFFICE OF THE MUNICIPAL SOCIAL WELFARE AND DEVELOPMENT**\n*LGU Municipal Admin Center*\n\n**MEMORANDUM**\n\n**TO:** Municipal Treasurer / Disbursement Officer\n**FROM:** MSWDO Officer-in-Charge\n**DATE:** June 26, 2026\n**SUBJECT:** Social Welfare Grant Endorsement under ${program}\n\n---\n\nThis is to formally recommend and endorse the releasing of financial assistance to:\n\n*   **Beneficiary Name:** **${recipient}**\n*   **Approved Grant Category:** ${program}\n*   **Allocated Amount:** **${amount}**\n*   **Barangay Residence:** Poblacion I / San Isidro Area\n\n**Justification:**\nUpon detailed case analysis, physical verification, and submission of the required certificate of indigency and municipal ID card, the beneficiary is certified as qualified to receive this urgent subsidy. This release shall be drawn against the **FY 2024 Allocated Social Welfare Fund**.\n\nApproved by:\n\n**MSWDO ADMIN**\n*Social Welfare Officer III*`;
      } 
      else if (query.includes('barangay') || query.includes('request') || query.includes('map')) {
        const criticalBrgys = barangayRequests.filter(b => b.status === 'CRITICAL');
        responseText = `### 🗺️ Barangay Request Volume Assessment\n\nI have mapped the current pending request counts. We have **${criticalBrgys.length} critical sectors** requiring immediate caseworker dispatch:\n\n${barangayRequests.map(b => `*   **${b.name}:** ${b.pendingRequests} requests (**${b.status}** severity)`).join('\n')}\n\n#### 🎯 Caseworker Deployment Strategy:\n1.  **Poblacion I & Tacloban West (${criticalBrgys.map(b => b.name).join(' & ')}):** These barangays represent over 50% of your total request volume. I recommend deploying 2 dedicated social officers to Poblacion I starting tomorrow to clear the backlog of senior citizens' medical files.\n2.  **San Isidro & Bukidnon East (Moderate):** Hold regular payout caravans on Fridays to distribute pre-approved cash grants directly, bypassing office backlogs.`;
      } 
      else {
        responseText = `### 💡 MSWDO Policy Consultant Response\n\nThank you for your inquiry about "**${chatInput}**".\n\nAs your MSWDO assistant, I have analyzed our current database:\n\n*   **Available Surplus:** ₱${remainingBudget.toLocaleString()} (Excellent, fully sustainable levels)\n*   **Total active clients:** 2,154 across all databases.\n\nTo help you further, here are some commands I understand:\n- 📈 **"analyze budget"** (Get an automated program-by-program audit)\n- 🗺️ **"barangay requests"** (View caseworker deployment strategy)\n- ✍️ **"draft memo for Dela Cruz"** (Generate professional recommendation letters)\n\nWhat other social service action or report would you like me to process for you?`;
      }

      const aiMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: responseText,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200);
  };

  // Filter Disbursements
  const filteredDisbursements = disbursements.filter(d => {
    const matchesSearch = d.recipient.toLowerCase().includes(filterSearch.toLowerCase()) || 
                          d.id.toLowerCase().includes(filterSearch.toLowerCase());
    const matchesProgram = filterProgram === 'All' || d.program.toLowerCase().includes(filterProgram.toLowerCase());
    const matchesBarangay = filterBarangay === 'All' || d.barangay === filterBarangay;
    const matchesStatus = filterStatus === 'All' || d.status === filterStatus;
    
    return matchesSearch && matchesProgram && matchesBarangay && matchesStatus;
  });

  // Export filtered CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'RECIPIENT', 'PROGRAM', 'AMOUNT', 'BARANGAY', 'DATE', 'STATUS'];
    const rows = filteredDisbursements.map(d => [
      d.id,
      `"${d.recipient}"`,
      `"${d.program}"`,
      d.amount,
      `"${d.barangay}"`,
      d.date,
      d.status
    ]);

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `MSWDO_Disbursements_FilteredReport_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleResetFilters = () => {
    setFilterProgram('All');
    setFilterBarangay('All');
    setFilterStatus('All');
    setFilterSearch('');
  };

  return (
    <div className="space-y-6" id="reports-view-root">
      
      {/* Sub Tabs */}
      <div className="flex border-b border-slate-100 pb-px" id="reports-subtabs">
        <button 
          onClick={() => setActiveSubTab('ledger')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all cursor-pointer ${
            activeSubTab === 'ledger' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          📁 Master Ledger & Reports
        </button>
        <button 
          onClick={() => setActiveSubTab('ai')}
          className={`px-6 py-3 font-bold text-sm border-b-2 transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSubTab === 'ai' 
              ? 'border-blue-600 text-blue-600' 
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Sparkles className="w-4 h-4 text-blue-500 animate-pulse" /> Civic AI Assistant
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeSubTab === 'ledger' ? (
          <motion.div 
            key="ledger"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            {/* Filter Panel */}
            <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm space-y-4" id="ledger-filter-panel">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Filter className="w-4 h-4 text-slate-400" /> Filter Logs
                </span>
                <button 
                  onClick={handleResetFilters}
                  className="text-[#003fb1] hover:underline text-xs font-bold flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> Reset
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                {/* Search */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Search Recipient</label>
                  <input 
                    type="text"
                    placeholder="Search name or ID..."
                    value={filterSearch}
                    onChange={(e) => setFilterSearch(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-transparent"
                  />
                </div>

                {/* Program Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filter Program</label>
                  <select 
                    value={filterProgram}
                    onChange={(e) => setFilterProgram(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-transparent"
                  >
                    <option value="All">All Programs</option>
                    <option value="Educational">AICS - Educational</option>
                    <option value="Medical">AICS - Medical</option>
                    <option value="Pension">Senior Social Pension</option>
                    <option value="PWD">PWD Assistance</option>
                    <option value="Solo">Solo Parents Incentive</option>
                    <option value="Burial">AICS - Burial</option>
                  </select>
                </div>

                {/* Barangay Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filter Barangay</label>
                  <select 
                    value={filterBarangay}
                    onChange={(e) => setFilterBarangay(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-transparent"
                  >
                    <option value="All">All Barangays</option>
                    {LIST_OF_BARANGAYS.map((b, i) => (
                      <option key={i} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Filter Status</label>
                  <select 
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs bg-transparent"
                  >
                    <option value="All">All Statuses</option>
                    <option value="Disbursed">Disbursed</option>
                    <option value="Pending">Pending</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Action Banner */}
            <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4" id="ledger-export-banner">
              <div>
                <h3 className="font-bold text-slate-800 text-sm">Disbursement Ledger Logs</h3>
                <p className="text-slate-400 text-xs">Showing {filteredDisbursements.length} matching rows</p>
              </div>

              <button 
                onClick={handleExportCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl flex items-center gap-2 shadow-xs transition-all cursor-pointer self-stretch md:self-auto justify-center"
              >
                <Download className="w-4 h-4" /> Export Filtered (.CSV)
              </button>
            </div>

            {/* Ledger Table */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden" id="ledger-table-card">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 font-bold uppercase border-b border-slate-100">
                      <th className="px-6 py-3.5">Disbursement ID</th>
                      <th className="px-6 py-3.5">Recipient</th>
                      <th className="px-6 py-3.5">Program Sector</th>
                      <th className="px-6 py-3.5">Disbursed Amount</th>
                      <th className="px-6 py-3.5">Resident Barangay</th>
                      <th className="px-6 py-3.5">Transaction Date</th>
                      <th className="px-6 py-3.5">Audit Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {filteredDisbursements.length > 0 ? (
                      filteredDisbursements.map((d) => (
                        <tr key={d.id} className="hover:bg-slate-50/40 transition-colors">
                          <td className="px-6 py-3.5 font-mono font-bold text-slate-400">{d.id}</td>
                          <td className="px-6 py-3.5 font-bold text-slate-850">{d.recipient}</td>
                          <td className="px-6 py-3.5 font-semibold text-slate-500">{d.program}</td>
                          <td className="px-6 py-3.5 font-black text-slate-800">₱{d.amount.toLocaleString()}</td>
                          <td className="px-6 py-3.5 font-medium">{d.barangay}</td>
                          <td className="px-6 py-3.5">{d.date}</td>
                          <td className="px-6 py-3.5">
                            <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                              d.status === 'Disbursed' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : d.status === 'Pending' 
                                  ? 'bg-amber-50 text-amber-700' 
                                  : 'bg-rose-50 text-rose-700'
                            }`}>
                              {d.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-slate-400 font-semibold">
                          No ledger records matching the selected search and filtering filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex flex-col h-[550px] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden"
            id="ai-consultant-chat-container"
          >
            {/* Header */}
            <div className="bg-white px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl">
                <Bot className="w-6 h-6 shrink-0" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-855 flex items-center gap-1.5">
                  MSWDO Civic AI Assistant <span className="bg-blue-100 text-blue-600 text-[9px] px-1.5 py-0.5 rounded-full uppercase tracking-widest">ACTIVE</span>
                </h3>
                <p className="text-[11px] text-slate-400">Contextual, state-aware AI helper for municipal social services</p>
              </div>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4" id="ai-chat-scroller">
              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex gap-3 max-w-xl ${msg.sender === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs shrink-0 ${
                    msg.sender === 'user' 
                      ? 'bg-[#003fb1] text-white font-bold' 
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {msg.sender === 'user' ? 'ME' : 'AI'}
                  </div>

                  <div className={`p-4 rounded-2xl text-xs leading-relaxed space-y-2 border ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white border-blue-600 rounded-tr-none'
                      : 'bg-white text-slate-700 border-slate-100 rounded-tl-none shadow-xs'
                  }`}>
                    <div className="whitespace-pre-line">
                      {msg.text.split('\n').map((line, lIdx) => {
                        let parsedLine: React.ReactNode = line;
                        
                        if (line.startsWith('### ')) {
                          parsedLine = <h4 className={`text-sm font-extrabold mt-3 mb-1.5 ${msg.sender === 'user' ? 'text-white' : 'text-slate-800'}`}>{line.slice(4)}</h4>;
                        } else if (line.startsWith('#### ')) {
                          parsedLine = <h5 className={`text-xs font-bold uppercase tracking-wider mt-3.5 mb-1 ${msg.sender === 'user' ? 'text-slate-200' : 'text-slate-500'}`}>{line.slice(5)}</h5>;
                        } 
                        else if (line.startsWith('*   ') || line.startsWith('-   ')) {
                          parsedLine = <div className="pl-4 relative before:content-['•'] before:absolute before:left-1 before:font-bold">{line.slice(4)}</div>;
                        } else if (line.startsWith('* ') || line.startsWith('- ')) {
                          parsedLine = <div className="pl-4 relative before:content-['•'] before:absolute before:left-1 before:font-bold">{line.slice(2)}</div>;
                        }

                        const boldRegex = /\*\*(.*?)\*\*/g;
                        if (typeof parsedLine === 'string' && boldRegex.test(parsedLine)) {
                          const parts = parsedLine.split(boldRegex);
                          parsedLine = parts.map((part, i) => i % 2 === 1 ? <strong key={i} className="font-extrabold">{part}</strong> : part);
                        }

                        return <div key={lIdx}>{parsedLine}</div>;
                      })}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 max-w-sm">
                  <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-xs">AI</div>
                  <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none">
                    <div className="flex gap-1.5" id="typing-loader">
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Form */}
            <form onSubmit={handleSendMessage} className="bg-white p-4 border-t border-slate-100 flex gap-3">
              <input 
                type="text" 
                placeholder="Ask AI Consultant about budget, policies, memos..." 
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                disabled={isTyping}
                className="w-full text-xs px-4 py-2.5 border border-slate-200 rounded-lg bg-transparent text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                type="submit"
                disabled={!chatInput.trim() || isTyping}
                className="bg-[#003fb1] hover:bg-[#1a56db] disabled:bg-slate-100 text-white disabled:text-slate-400 p-2.5 rounded-lg flex items-center justify-center shadow-xs transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
