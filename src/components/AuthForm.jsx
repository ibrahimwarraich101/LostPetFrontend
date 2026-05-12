import { useState } from 'react';
import { loginUser, registerUser } from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, ArrowRight, Loader2, Info } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AuthForm({ mode, onAuth }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (mode === 'register' && !form.name.trim()) newErrors.name = 'Full name is required';
    if (!form.email) {
      newErrors.email = mode === 'login' ? 'Email or Name is required' : 'Email is required';
    } else if (mode === 'register' && !/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!form.password) {
      newErrors.password = 'Password is required';
    } else if (form.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = mode === 'login' ? await loginUser(form) : await registerUser(form);
      
      if (mode === 'register') {
        setSuccess(true);
        return;
      }

      localStorage.setItem('pet-app-token', response.data.token);
      onAuth(response.data.user);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-12">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 p-10 rounded-[2.5rem] border border-white/10 shadow-2xl shadow-black/40"
      >
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-white font-outfit mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-slate-400 text-sm">
            {mode === 'login' 
              ? 'Join the community to help pets find home.' 
              : 'Join our community of animal lovers.'}
          </p>
        </div>

        {success ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <div className="w-20 h-20 bg-brand-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-brand-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Check your email</h3>
            <p className="text-slate-400 mb-8">
              We've sent a verification link to <span className="text-white font-bold">{form.email}</span>. 
              Please click the link to activate your account.
            </p>
            <Link 
              to="/login" 
              className="inline-flex items-center gap-2 text-brand-400 font-bold hover:underline"
              onClick={() => setSuccess(false)}
            >
              Back to Login <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="John Doe"
                  className={`w-full bg-white border-2 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:ring-4 focus:ring-brand-500/20 transition-all ${errors.name ? 'border-red-400 bg-red-50' : 'border-slate-100 focus:border-brand-500'}`} 
                />
              </div>
              {errors.name && <p className="text-red-400 text-[10px] font-bold ml-1 uppercase">{errors.name}</p>}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
              {mode === 'login' ? 'Email or Name' : 'Email Address'}
            </label>
            <div className="relative">
              {mode === 'login' ? (
                <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              ) : (
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              )}
              <input 
                type={mode === 'login' ? 'text' : 'email'}
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                placeholder={mode === 'login' ? 'Enter your email or name' : 'name@example.com'}
                className={`w-full bg-white border-2 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:ring-4 focus:ring-brand-500/20 transition-all ${errors.email ? 'border-red-400 bg-red-50' : 'border-slate-100 focus:border-brand-500'}`} 
              />
            </div>
            {errors.email && <p className="text-red-400 text-[10px] font-bold ml-1 uppercase">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="password"
                name="password" 
                value={form.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                className={`w-full bg-white border-2 rounded-xl py-3.5 pl-11 pr-4 text-slate-900 focus:ring-4 focus:ring-brand-500/20 transition-all ${errors.password ? 'border-red-400 bg-red-50' : 'border-slate-100 focus:border-brand-500'}`} 
              />
            </div>
            {errors.password && <p className="text-red-400 text-[10px] font-bold ml-1 uppercase">{errors.password}</p>}
            {mode === 'login' && (
              <div className="text-right">
                <Link to="/forgot-password" size="sm" className="text-[10px] font-black uppercase text-slate-500 hover:text-brand-400 transition-colors">
                  Forgot Password?
                </Link>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm animate-shake">
              <Info className="w-4 h-4 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-brand-500 text-slate-900 font-black py-4 rounded-2xl hover:bg-brand-400 shadow-xl shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : mode === 'login' ? 'Login' : 'Sign Up'}
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>
        )}

        <div className="mt-8 pt-8 border-t border-slate-800 text-center">
          <p className="text-slate-500 text-sm">
            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}{' '}
            <Link 
              to={mode === 'login' ? '/register' : '/login'} 
              className="text-brand-400 font-bold hover:underline"
            >
              {mode === 'login' ? 'Sign Up' : 'Login'}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
