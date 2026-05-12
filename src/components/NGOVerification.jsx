import { useState, useEffect } from 'react';
import { submitVerification, fetchVerificationStatus } from '../api';
import { ShieldCheck, Info, CheckCircle2, Clock, AlertTriangle, Building, Globe, Mail, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NGOVerification({ user }) {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    organizationName: '',
    registrationNumber: '',
    contactEmail: '',
    website: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetchVerificationStatus();
        setStatus(res.data);
      } catch (err) {
        // Not a big deal if it fails
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!form.organizationName.trim()) errors.organizationName = 'Organization name is required';
    if (!form.registrationNumber.trim()) errors.registrationNumber = 'Registration number is required';
    if (!form.contactEmail.trim()) {
      errors.contactEmail = 'Contact email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.contactEmail)) {
      errors.contactEmail = 'Please enter a valid email address';
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      const res = await submitVerification(form);
      setStatus(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit verification request.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-slate-400">
        <Loader2 className="w-10 h-10 animate-spin text-brand-500 mb-4" />
        <p className="font-medium">Checking status...</p>
      </div>
    );
  }

  if (user.isNGO) {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6 px-4 md:px-0">
        <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mx-auto shadow-lg shadow-emerald-200/50">
          <ShieldCheck className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 font-outfit">You are Verified!</h2>
        <p className="text-slate-600">Your organization status is active. Your listings now feature the verified badge, building trust in the community.</p>
      </div>
    );
  }

  if (status && status.status === 'Pending') {
    return (
      <div className="max-w-4xl mx-auto py-20 text-center space-y-6 px-4 md:px-0">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center mx-auto shadow-lg shadow-blue-200/50">
          <Clock className="w-12 h-12" />
        </div>
        <h2 className="text-3xl font-bold text-slate-900 font-outfit">Verification Pending</h2>
        <p className="text-slate-600">We've received your request for <strong>{status.organizationName}</strong>. Our team is reviewing your documents. You'll be notified once approved.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-0 md:py-10 px-0 md:px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white md:rounded-[2rem] shadow-xl shadow-slate-200/50 md:border md:border-slate-100 overflow-hidden"
      >
        <div className="grid md:grid-cols-2">
          <div className="bg-slate-900 p-12 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10">
              <ShieldCheck className="w-12 h-12 text-brand-500 mb-8" />
              <h2 className="text-3xl font-bold font-outfit mb-6">NGO & Shelter Verification</h2>
              <p className="text-slate-400 mb-8 leading-relaxed">
                Verified organizations gain access to exclusive tools, higher listing visibility, and a trusted badge that reassures adopters.
              </p>
              <ul className="space-y-4">
                {[
                  'Verified Badge on all listings',
                  'Priority search placement',
                  'NGO-specific dashboard tools',
                  'Direct donation links (Coming Soon)',
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" /> {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="p-12">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Submit Credentials</h3>
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Organization Name</label>
                <div className="relative">
                  <Building className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${validationErrors.organizationName ? 'text-rose-400' : 'text-slate-400'}`} />
                  <input 
                    name="organizationName" 
                    value={form.organizationName} 
                    onChange={handleChange} 
                    className={`w-full pl-11 pr-4 py-3 border rounded-2xl text-slate-900 transition-all ${validationErrors.organizationName ? 'bg-rose-50 border-rose-200 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-500'}`} 
                    placeholder="e.g. Happy Paws Shelter"
                  />
                </div>
                {validationErrors.organizationName && <p className="text-[10px] font-bold text-rose-500 ml-1">{validationErrors.organizationName}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Registration Number</label>
                <div className="relative">
                  <Info className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${validationErrors.registrationNumber ? 'text-rose-400' : 'text-slate-400'}`} />
                  <input 
                    name="registrationNumber" 
                    value={form.registrationNumber} 
                    onChange={handleChange} 
                    className={`w-full pl-11 pr-4 py-3 border rounded-2xl text-slate-900 transition-all ${validationErrors.registrationNumber ? 'bg-rose-50 border-rose-200 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-500'}`} 
                    placeholder="Government Reg. ID"
                  />
                </div>
                {validationErrors.registrationNumber && <p className="text-[10px] font-bold text-rose-500 ml-1">{validationErrors.registrationNumber}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
                <div className="relative">
                  <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 ${validationErrors.contactEmail ? 'text-rose-400' : 'text-slate-400'}`} />
                  <input 
                    type="email"
                    name="contactEmail" 
                    value={form.contactEmail} 
                    onChange={handleChange} 
                    className={`w-full pl-11 pr-4 py-3 border rounded-2xl text-slate-900 transition-all ${validationErrors.contactEmail ? 'bg-rose-50 border-rose-200 focus:border-rose-500' : 'bg-slate-50 border-slate-200 focus:bg-white focus:border-brand-500'}`} 
                    placeholder="org@example.com"
                  />
                </div>
                {validationErrors.contactEmail && <p className="text-[10px] font-bold text-rose-500 ml-1">{validationErrors.contactEmail}</p>}
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest ml-1">Website (Optional)</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    name="website" 
                    value={form.website} 
                    onChange={handleChange} 
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:bg-white focus:border-brand-500 outline-none transition-all" 
                    placeholder="https://your-shelter.org"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-xs font-medium">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </div>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-brand-500 text-white font-bold py-4 rounded-2xl hover:bg-brand-600 shadow-xl shadow-brand-500/20 transition-all flex items-center justify-center gap-2 mt-4"
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                Apply for Verification
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
