import { useEffect, useState } from 'react';
import { fetchMyDonations } from '../api';
import { HeartHandshake, Loader2, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function MyDonations() {
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDonations = async () => {
      try {
        const res = await fetchMyDonations();
        setDonations(res.data);
      } catch (err) {
        console.error('Failed to load donations:', err);
      } finally {
        setLoading(false);
      }
    };
    loadDonations();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading donation history...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center text-brand-500 border border-brand-500/20">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white font-outfit leading-none">My Donations</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1.5 opacity-60">Impact History</p>
          </div>
        </div>
        <Link 
          to="/support" 
          className="px-8 py-4 bg-brand-500 text-slate-950 rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-400 transition-all flex items-center gap-2 group whitespace-nowrap"
        >
          <HeartHandshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
          Support NGO
        </Link>
      </header>

      {donations.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 text-center border-2 border-dashed border-white/10 rounded-[2rem] bg-slate-900/40"
        >
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
            <HeartHandshake className="w-10 h-10 text-slate-500" />
          </div>
          <h4 className="text-xl font-bold text-white mb-2">No donations yet</h4>
          <p className="text-slate-500 text-sm mb-8">Your kindness can change a pet's life today.</p>
          <Link to="/support" className="px-8 py-4 bg-brand-500 text-slate-950 rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-400 transition-all inline-block">
            Support an NGO
          </Link>
        </motion.div>
      ) : (
        <div className="space-y-4">
          {donations.map((d, index) => (
            <motion.div 
              key={d._id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-6 md:p-8 rounded-[1.5rem] bg-slate-900/50 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-brand-500/30 transition-all group"
            >
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-white/10 overflow-hidden flex items-center justify-center group-hover:border-brand-500/50 transition-all">
                  {d.ngo?.avatar ? (
                    <img src={d.ngo.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <HeartHandshake className="w-6 h-6 text-slate-600" />
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-black text-brand-500 uppercase tracking-widest mb-1">Donated To</p>
                  <h3 className="text-lg font-bold text-white group-hover:text-brand-400 transition-colors">
                    {d.ngo?.name || 'Unknown NGO'}
                  </h3>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Calendar className="w-3 h-3" /> Date & Time
                  </p>
                  <p className="text-sm font-bold text-slate-300">
                    {new Date(d.createdAt).toLocaleDateString(undefined, { 
                      month: 'short', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })} 
                    <span className="text-slate-600 ml-2">
                      {new Date(d.createdAt).toLocaleTimeString(undefined, {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Amount</p>
                  <div className="flex items-center gap-1 text-2xl font-black text-white font-outfit">
                    <span className="text-brand-500 text-lg">$</span>
                    {d.amount.toLocaleString()}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
