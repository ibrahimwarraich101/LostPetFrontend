import { useState } from 'react';
import { ShieldCheck, Lock, Loader2, User, Bell, Eye, EyeOff, CheckCircle2, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { changePassword, verifyPassword } from '../api';

export default function Settings({ user }) {
  const navigate = useNavigate();
  const [passForm, setPassForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [showPass, setShowPass] = useState({ old: false, new: false, confirm: false });

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await verifyPassword({ password: passForm.oldPassword });
      setIsVerified(true);
      setMessage({ type: 'success', text: 'Password verified. You can now set a new one.' });
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Incorrect current password.' });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passForm.newPassword !== passForm.confirmPassword) {
      return setMessage({ type: 'error', text: 'Passwords do not match.' });
    }
    setLoading(true);
    setMessage({ type: '', text: '' });
    try {
      await changePassword({ oldPassword: passForm.oldPassword, newPassword: passForm.newPassword });
      setMessage({ type: 'success', text: 'Password updated successfully! Redirecting...' });
      setPassForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
      setIsVerified(false);
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.message || 'Failed to change password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-0 md:py-12 px-0 md:px-4">
      <div className="mb-10 text-center pt-8 md:pt-0 px-4 md:px-0">
        <h1 className="text-4xl font-black text-white font-outfit mb-2">Account Settings</h1>
        <p className="text-slate-500 font-medium">Manage your security preferences and account details.</p>
      </div>

      <div className="max-w-2xl mx-auto">
        {/* Content Area */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-8 md:p-12 md:rounded-[2rem] bg-slate-900/50 md:border md:border-white/10 backdrop-blur-3xl md:shadow-2xl"
        >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
                <Lock className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white font-outfit">Security Settings</h3>
                <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">
                  {isVerified ? 'Set your new password' : 'Confirm your current password'}
                </p>
              </div>
            </div>

            <form onSubmit={isVerified ? handlePasswordSubmit : handleVerify} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Current Password</label>
                <div className="relative">
                  <input 
                    type={showPass.old ? "text" : "password"}
                    value={passForm.oldPassword}
                    onChange={(e) => setPassForm({ ...passForm, oldPassword: e.target.value })}
                    className={`w-full px-5 py-4 bg-slate-950 border rounded-2xl text-white outline-none transition-all ${
                      isVerified ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-white/10 focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10'
                    }`}
                    disabled={isVerified}
                    required
                    placeholder="Enter current password"
                  />
                  {!isVerified && (
                    <button 
                      type="button"
                      onClick={() => setShowPass({ ...showPass, old: !showPass.old })}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-400"
                    >
                      {showPass.old ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  )}
                  {isVerified && (
                    <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-emerald-500" />
                  )}
                </div>
              </div>

              <AnimatePresence>
                {isVerified && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0, y: -20 }}
                    animate={{ opacity: 1, height: 'auto', y: 0 }}
                    exit={{ opacity: 0, height: 0, y: -20 }}
                    className="space-y-8 overflow-hidden"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">New Password</label>
                        <div className="relative">
                          <input 
                            type={showPass.new ? "text" : "password"}
                            value={passForm.newPassword}
                            onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-950 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                            required
                            placeholder="New password"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPass({ ...showPass, new: !showPass.new })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-400"
                          >
                            {showPass.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Confirm New</label>
                        <div className="relative">
                          <input 
                            type={showPass.confirm ? "text" : "password"}
                            value={passForm.confirmPassword}
                            onChange={(e) => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                            className="w-full px-5 py-4 bg-slate-950 border border-white/10 rounded-2xl text-white outline-none focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all"
                            required
                            placeholder="Confirm new password"
                          />
                          <button 
                            type="button"
                            onClick={() => setShowPass({ ...showPass, confirm: !showPass.confirm })}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-brand-400"
                          >
                            {showPass.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {message.text && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-2xl text-xs font-bold border flex items-center gap-3 ${
                    message.type === 'success' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}
                >
                  {message.type === 'success' ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                  {message.text}
                </motion.div>
              )}

              <div className="flex items-center gap-4">
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`inline-flex items-center gap-3 px-10 py-4 rounded-2xl font-black shadow-xl transition-all active:scale-95 disabled:opacity-50 ${
                    isVerified 
                      ? 'bg-brand-500 text-slate-950 shadow-brand-500/20 hover:bg-brand-400' 
                      : 'bg-white/10 text-white border border-white/10 hover:bg-white/20'
                  }`}
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : isVerified ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    <ShieldCheck className="w-5 h-5" />
                  )}
                  {isVerified ? 'Change Password' : 'Verify Password'}
                </button>
                
                {isVerified && (
                  <button 
                    type="button"
                    onClick={() => setIsVerified(false)}
                    className="text-xs font-bold text-slate-500 hover:text-white transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </form>
          </motion.div>
      </div>
    </div>
  );
}
