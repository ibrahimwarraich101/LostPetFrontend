import { useState } from 'react';
import { forgotPassword } from '../api';
import { Mail, ArrowRight, Loader2, Info, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError('Email is required');
    
    setLoading(true);
    setError('');
    try {
      await forgotPassword({ email });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-slate-900 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black/40"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white font-outfit mb-2">Reset Password</h2>
          <p className="text-slate-400 text-sm">Enter your email to receive a password reset link.</p>
        </div>

        {success ? (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-brand-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-4">Email Sent!</h3>
            <p className="text-slate-400 mb-8">
              Check your inbox for <span className="text-white font-bold">{email}</span>. 
              The link will expire in 1 hour.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-brand-400 font-bold hover:underline"
            >
              Back to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-white border-2 border-slate-100 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:ring-4 focus:ring-brand-500/20 focus:border-brand-500 transition-all outline-none" 
                />
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm">
                <Info className="w-4 h-4" />
                <p>{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 text-slate-900 font-black py-4 rounded-2xl hover:bg-brand-400 shadow-xl shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
              {!loading && <ArrowRight className="w-4 h-4" />}
            </button>

            <Link 
              to="/login" 
              className="block text-center text-slate-500 text-sm font-bold hover:text-white transition-colors"
            >
              Back to Login
            </Link>
          </form>
        )}
      </motion.div>
    </div>
  );
}
