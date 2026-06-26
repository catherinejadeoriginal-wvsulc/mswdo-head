import React, { useState, useRef } from 'react';
import { X, Camera, Shield, User, Mail, Phone, Lock, Save, RefreshCw, BadgeInfo } from 'lucide-react';
import { motion } from 'motion/react';

interface ProfileData {
  fullName: string;
  email: string;
  contactNumber: string;
  password: string;
  role: string;
  profilePic: string;
}

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
  onSave: (updatedProfile: ProfileData) => void;
}

export default function ProfileModal({ isOpen, onClose, profile, onSave }: ProfileModalProps) {
  const [fullName, setFullName] = useState(profile.fullName);
  const [email, setEmail] = useState(profile.email);
  const [contactNumber, setContactNumber] = useState(profile.contactNumber);
  const [password, setPassword] = useState(profile.password);
  const [confirmPassword, setConfirmPassword] = useState(profile.password);
  const [profilePic, setProfilePic] = useState(profile.profilePic);
  
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setErrorMsg('Image size must be less than 2MB.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
        setErrorMsg(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!fullName.trim()) {
      setErrorMsg('Full Name is required.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setErrorMsg('A valid email address is required.');
      return;
    }
    if (!contactNumber.trim()) {
      setErrorMsg('Contact number is required.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    onSave({
      fullName: fullName.trim(),
      email: email.trim(),
      contactNumber: contactNumber.trim(),
      password,
      role: profile.role,
      profilePic
    });

    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs" id="profile-modal-overlay">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col"
        id="profile-card-container"
      >
        {/* Header */}
        <div className="bg-[#003fb1] p-6 text-white flex justify-between items-center relative">
          <div className="space-y-1">
            <h3 className="text-lg font-black tracking-tight flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-200" /> Administrator Account Settings
            </h3>
            <p className="text-blue-100 text-xs font-medium">Configure authentication & administrative profile details</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 hover:bg-white/10 rounded-full text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto max-h-[80vh] text-xs">
          
          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-5 bg-slate-50 p-4 rounded-xl border border-slate-100" id="avatar-section">
            <div className="relative group">
              <img
                src={profilePic}
                alt="Profile Avatar"
                className="w-20 h-20 rounded-full object-cover border-2 border-[#1a56db] shadow-md"
                onError={(e) => {
                  // Fallback if image fails to load
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200';
                }}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 bg-[#1a56db] hover:bg-blue-700 text-white p-1.5 rounded-full shadow-md transition-colors cursor-pointer"
                title="Change Photo"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
            </div>
            
            <div className="text-center sm:text-left space-y-1">
              <span className="px-2.5 py-0.5 rounded-md font-black bg-emerald-50 text-emerald-700 border border-emerald-100 uppercase tracking-widest text-[9px] inline-block">
                {profile.role}
              </span>
              <p className="font-bold text-slate-800 text-sm">{fullName || 'Welfare Admin'}</p>
              <p className="text-slate-400 text-[10px]">LGU Municipal Officer-In-Charge • Active Duty</p>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-lg font-bold flex items-center gap-2">
              <BadgeInfo className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-100 text-emerald-700 rounded-lg font-bold flex items-center gap-2">
              <RefreshCw className="w-4 h-4 shrink-0 animate-spin" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Fields Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Full Name
              </label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-slate-400" /> Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Contact Number */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Number
              </label>
              <input
                type="text"
                required
                value={contactNumber}
                onChange={(e) => setContactNumber(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500"
              />
            </div>

            {/* Account Role (ReadOnly) */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5 text-slate-400" /> Account Role
              </label>
              <input
                type="text"
                readOnly
                value={profile.role}
                className="w-full p-2.5 border border-slate-100 rounded-lg text-xs bg-slate-50 font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 space-y-4">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
              <Lock className="w-4 h-4 text-slate-400" /> Security Credential Updates
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">New Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Confirm New Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type new password"
                  className="w-full p-2.5 border border-slate-200 rounded-lg text-xs font-mono"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3 text-xs font-bold">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#003fb1] hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 shadow-md transition-colors cursor-pointer"
            >
              <Save className="w-4 h-4" /> Save Account Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
