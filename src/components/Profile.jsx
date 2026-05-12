import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchProfile, updateProfile, uploadImage, changePassword } from '../api';
import { User, Mail, Camera, Loader2, CheckCircle2, ShieldCheck, AlertCircle, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile({ user: initialUser, onUpdate }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchProfile();
        setUser(res.data);
      } catch (err) {
        setError('Failed to load profile.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const data = new FormData();
    data.append('image', file);
    try {
      const response = await uploadImage(data);
      setUser((prev) => ({ ...prev, avatar: response.data.url }));
    } catch (err) {
      setError('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await updateProfile(user);
      setUser(res.data);
      if (onUpdate) onUpdate(res.data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-4" />
        <p className="font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-0 md:py-10 px-0 md:px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-900 md:rounded-[2rem] md:shadow-xl md:shadow-black/40 md:border md:border-white/5 overflow-hidden"
      >
        <div className="h-32 bg-gradient-to-r from-brand-500 to-orange-400 relative">
          {user.isNGO && (
            <div className="absolute top-4 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/30 flex items-center gap-2 text-white text-xs font-bold uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" /> Verified NGO
            </div>
          )}
        </div>

        <div className="px-8 pb-12">
          <div className="relative -mt-16 mb-8 inline-block">
            <div className="w-32 h-32 rounded-[2.5rem] bg-white p-1.5 shadow-lg relative z-10">
              <div className="w-full h-full rounded-[2.2rem] bg-slate-100 overflow-hidden relative group">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                    <User className="w-12 h-12" />
                  </div>
                )}
                <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  {uploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarUpload} disabled={uploading} />
                </label>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-brand-500 uppercase tracking-[0.2em] ml-1">Username</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      name="name" 
                      value={user.name} 
                      onChange={handleChange} 
                      className="w-full pl-11 pr-4 py-3.5 bg-slate-950 border border-white/10 rounded-2xl text-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none" 
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input 
                      value={user.email} 
                      disabled 
                      className="w-full pl-11 pr-4 py-3.5 bg-white/5 border border-white/5 rounded-2xl text-slate-500 cursor-not-allowed italic" 
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Profile Description</label>
                <textarea 
                  name="description" 
                  value={user.description || ''} 
                  onChange={handleChange} 
                  rows="5" 
                  placeholder="Tell the community about yourself..."
                  className="w-full p-5 bg-slate-950 border border-white/10 rounded-[2rem] text-white focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10 transition-all outline-none resize-none"
                />
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
              {error && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-medium">
                  <AlertCircle className="w-4 h-4" /> {error}
                </div>
              )}
              {success && (
                <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-medium">
                  <CheckCircle2 className="w-4 h-4" /> {success}
                </div>
              )}
              
              <button 
                type="submit" 
                disabled={saving}
                className="w-full max-w-xs bg-brand-500 text-white font-bold py-4 px-8 rounded-2xl hover:bg-brand-600 shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
              >
                {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle2 className="w-5 h-5" />}
                {saving ? 'Saving Changes...' : 'Save Profile'}
              </button>

              {!user.isNGO && (
                <Link 
                  to="/verify-ngo"
                  className="text-xs font-bold text-slate-400 hover:text-brand-500 flex items-center gap-2 transition-colors mt-2"
                >
                  <ShieldCheck className="w-4 h-4" /> Are you an NGO? Apply for verification
                </Link>
              )}
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
