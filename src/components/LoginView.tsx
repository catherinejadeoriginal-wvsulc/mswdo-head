import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, Eye, EyeOff, ShieldAlert, CheckCircle2, Award } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: () => void;
  correctEmail: string;
  correctPass: string;
}

export default function LoginView({ onLoginSuccess, correctEmail, correctPass }: LoginViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);

    // Simulate authenticating for a high-fidelity feel
    setTimeout(() => {
      const normalizedEmail = email.trim().toLowerCase();
      const normalizedCorrect = correctEmail.trim().toLowerCase();

      if (
        (normalizedEmail === normalizedCorrect || normalizedEmail === 'admin') &&
        password === correctPass
      ) {
        setIsSubmitting(false);
        onLoginSuccess();
      } else {
        setIsSubmitting(false);
        setError('Invalid administrative credentials. Please try again.');
      }
    }, 1200);
  };

  const handlePrefill = () => {
    setEmail(correctEmail);
    setPassword(correctPass);
    setError(null);
  };

  return (
    <div className="min-h-screen w-full flex bg-[#f4f6fc] text-slate-800 font-sans select-none" id="login-container">
      {/* Immersive Left Side Pane: Government Branding & Municipal Stats */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#002265] via-[#003fb1] to-[#1e40af] text-white p-16 flex-col justify-between" id="login-brand-pane">
        {/* Abstract decorative graphic vectors */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-blue-400/10 to-transparent rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-gradient-to-tr from-emerald-500/10 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        {/* Top brand heading */}
        <div className="flex items-center gap-3.5 z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/15 shadow-inner">
            <Award className="w-6 h-6 text-blue-200" />
          </div>
          <div>
            <h2 className="text-sm font-black tracking-widest uppercase text-blue-200">Republic of the Philippines</h2>
            <h1 className="text-lg font-black tracking-tight leading-tight">MUNICIPAL SOCIAL WELFARE AND DEVELOPMENT</h1>
          </div>
        </div>

        {/* Central visual statement */}
        <div className="my-auto space-y-8 z-10 max-w-md">
          <div className="space-y-4">
            <span className="bg-emerald-500/20 text-emerald-300 font-bold px-3 py-1 rounded-full text-[11px] uppercase tracking-wider border border-emerald-500/30">
              Authorized Personnel Portal
            </span>
            <h3 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight text-white">
              Welfare Assistance & Beneficiary Hub
            </h3>
            <p className="text-blue-100/80 text-sm leading-relaxed">
              Secure digital command platform managing critical allocations, crisis intervention tracking, and localized registry rosters for senior citizens, PWD, and solo parent sectors.
            </p>
          </div>

          {/* Quick info grid metrics */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">Active Cases</p>
              <p className="text-2xl font-black text-white mt-1">2,154</p>
            </div>
            <div>
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-widest">System Ingress</p>
              <p className="text-2xl font-black text-white mt-1">MySQL/Secure</p>
            </div>
          </div>
        </div>

        {/* Footer brand credit */}
        <div className="text-xs text-blue-200/60 font-medium z-10 flex items-center justify-between" id="login-left-footer">
          <span>© 2026 MSWDO Information Bureau</span>
          <span className="flex items-center gap-1.5 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Node Secure V2.1
          </span>
        </div>
      </div>

      {/* Right Side Pane: Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16" id="login-form-pane">
        <div className="w-full max-w-md space-y-8">
          
          {/* Header branding on mobile view */}
          <div className="lg:hidden text-center space-y-3 mb-6">
            <div className="w-14 h-14 rounded-2xl bg-[#003fb1] text-white flex items-center justify-center mx-auto shadow-md">
              <Award className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xs font-bold uppercase text-[#003fb1] tracking-widest">MSWDO Administrator</h2>
              <h1 className="text-xl font-black tracking-tight text-slate-900">Social Welfare Portal</h1>
            </div>
          </div>

          {/* Desktop welcome indicator */}
          <div className="hidden lg:block space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Administrative Sign-In</h1>
            <p className="text-sm text-slate-500 font-medium">Please authenticate to gain administrative dashboard access.</p>
          </div>

          {/* Error Banner Container */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex gap-3 text-rose-800 text-xs font-semibold shadow-xs"
                id="login-error-alert"
              >
                <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <p className="font-bold">Authentication Failed</p>
                  <p className="text-rose-600/90 mt-0.5">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main Form */}
          <form onSubmit={handleSubmit} className="space-y-5" id="login-form">
            
            {/* Email Address / Username Field */}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                Administrator Email / Username
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@mswdo.gov.ph or admin"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#c3c5d7] rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#003fb1]/20 focus:border-[#003fb1] transition-all"
                  id="login-username-input"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-black uppercase text-slate-400 tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[10px] font-bold text-[#003fb1] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  {showPassword ? (
                    <>
                      <EyeOff className="w-3 h-3" /> Hide
                    </>
                  ) : (
                    <>
                      <Eye className="w-3 h-3" /> Show
                    </>
                  )}
                </button>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-[#c3c5d7] rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-[#003fb1]/20 focus:border-[#003fb1] transition-all"
                  id="login-password-input"
                />
              </div>
            </div>

            {/* Option Checkbox Column */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-[#003fb1] rounded-sm border-slate-300 focus:ring-[#003fb1] cursor-pointer"
                  id="login-remember-checkbox"
                />
                <span className="text-xs text-slate-500 font-medium">Keep me authenticated</span>
              </label>

              <button
                type="button"
                onClick={() => alert(`Password recovery is simulated. Please use the quick auto-fill helper or verify in the Administration Profile settings panel once authenticated.`)}
                className="text-xs font-bold text-[#003fb1] hover:underline cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>

            {/* Submit Sign-In Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 bg-[#003fb1] hover:bg-[#003594] disabled:bg-blue-300 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              id="login-submit-button"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Access Administrative Portal</span>
              )}
            </button>
          </form>

          {/* Demo Helper Prefill Box (Highly useful for testing) */}
          <div className="p-4 bg-slate-100/80 border border-slate-200/50 rounded-2xl space-y-3" id="login-prefill-helper">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-[11px] font-black uppercase text-slate-500 tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Demo Sandbox Access</span>
              </div>
              <button
                type="button"
                onClick={handlePrefill}
                className="text-[10px] font-black uppercase text-[#003fb1] bg-blue-50 hover:bg-blue-100/80 px-2.5 py-1 rounded-md border border-blue-200 transition-colors cursor-pointer"
                id="login-autofill-btn"
              >
                Auto-fill
              </button>
            </div>
            <div className="text-[11px] text-slate-500 font-medium leading-relaxed">
              <p>
                <strong>Admin Email:</strong> <code className="bg-white px-1.5 py-0.5 rounded-sm border border-slate-200 select-all">{correctEmail}</code>
              </p>
              <p className="mt-1">
                <strong>Password:</strong> <code className="bg-white px-1.5 py-0.5 rounded-sm border border-slate-200 select-all">{correctPass}</code>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
