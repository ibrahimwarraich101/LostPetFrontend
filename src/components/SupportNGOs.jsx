import { useState } from 'react';
import { Heart, ArrowRight, ShieldCheck, User, Sparkles, Globe, HeartHandshake } from 'lucide-react';
import { motion } from 'framer-motion';
import DonationModal from './DonationModal';
import { Link } from 'react-router-dom';

export default function SupportNGOs({ user }) {
  const [showDonation, setShowDonation] = useState(false);

  // Sample NGO data
  const ngos = [
    { 
      name: 'Paws & Whiskers Sanctuary', 
      avatar: '/ngo1.png', 
      description: 'A safe haven for stray and abandoned animals in the city. We provide high-quality medical care and behavioral rehabilitation.',
      rescues: 120,
      verified: true,
      category: 'Rescue'
    },
    { 
      name: 'Feline Friends Foundation', 
      avatar: '/ngo2.png', 
      description: 'Dedicated to the rescue and rehabilitation of street cats. We manage multiple colonies and promote TNR programs.',
      rescues: 85,
      verified: true,
      category: 'Feline Care'
    },
    { 
      name: 'Animal Care Trust', 
      avatar: '/ngo3.png', 
      description: 'Providing medical care and shelter for injured strays. Our team works 24/7 to respond to animal emergencies.',
      rescues: 210,
      verified: true,
      category: 'Medical'
    },
    { 
      name: 'Rescue Rangers', 
      avatar: '/ngo4.png', 
      description: 'Fast-response rescue team for animals in distress. We specialize in difficult extractions and emergency transport.',
      rescues: 45,
      verified: true,
      category: 'Emergency'
    }
  ];

  return (
    <div className="min-h-screen pb-24 overflow-hidden bg-slate-950">
      {/* Background Orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-brand-500/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-accent-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Cinematic Hero Section */}
        <section className="pt-16 pb-24">
          <div className="relative rounded-[4rem] overflow-hidden border-2 border-brand-500/10 bg-slate-900/40 backdrop-blur-xl shadow-[0_0_80px_rgba(6,182,212,0.05)]">
            <div className="absolute inset-0">
              <img src="/ngo-hero.png" alt="Happy pets" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
            </div>

            <div className="relative z-20 p-8 md:p-20 grid lg:grid-cols-2 gap-12 items-center">
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-8"
              >
                <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-brand-500 text-slate-950 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-brand-500/20">
                  <Sparkles className="w-3.5 h-3.5" />
                  Impact the Community
                </div>
                <h1 className="text-5xl md:text-7xl font-black text-white font-outfit leading-[1.05] tracking-tight">
                  Be the Hero <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 to-cyan-300">They Deserve.</span>
                </h1>
                <p className="text-slate-400 text-lg leading-relaxed max-w-lg">
                  Every contribution matters. We partner with the most dedicated shelters to ensure every dollar you give goes directly to saving lives.
                </p>
                <div className="flex flex-wrap gap-5">
                  <button 
                    onClick={() => setShowDonation(true)}
                    className="px-10 py-5 bg-brand-500 text-slate-950 rounded-[2rem] font-black shadow-2xl shadow-brand-500/30 hover:bg-brand-400 hover:-translate-y-1 transition-all active:scale-95 flex items-center gap-3 group"
                  >
                    Donate Now
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <Link 
                    to="/verify-ngo"
                    className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-[2rem] font-bold backdrop-blur-md hover:bg-white/10 hover:-translate-y-1 transition-all active:scale-95"
                  >
                    Register NGO
                  </Link>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="hidden lg:block relative"
              >
                <div className="absolute inset-0 bg-brand-500/20 blur-[100px] rounded-full animate-pulse" />
                <div className="relative p-10 bg-slate-950/60 backdrop-blur-3xl rounded-[3rem] border border-brand-500/20 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
                  <div className="grid grid-cols-2 gap-8">
                    {[
                      { label: 'Total Rescues', value: '4.2k+', icon: HeartHandshake, color: 'text-brand-400' },
                      { label: 'Active NGOs', value: '24', icon: ShieldCheck, color: 'text-emerald-400' },
                      { label: 'Cities Covered', value: '12', icon: Globe, color: 'text-cyan-400' },
                      { label: 'Active Listings', value: '850+', icon: Sparkles, color: 'text-amber-400' },
                    ].map((stat, i) => (
                      <div key={i} className="space-y-2">
                        <stat.icon className={`w-6 h-6 ${stat.color} mb-2`} />
                        <p className="text-3xl font-black text-white font-outfit">{stat.value}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Shelters Grid */}
        <div className="space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-white font-outfit">Verified Shelters</h2>
              <p className="text-slate-500 mt-2">Connect with the organizations making a difference.</p>
            </div>
            <div className="flex gap-2">
              {['All', 'Rescue', 'Medical', 'Emergency'].map(tag => (
                <button key={tag} className="px-5 py-2.5 rounded-xl bg-slate-900 border border-white/5 text-xs font-bold text-slate-400 hover:text-white hover:border-brand-500/30 transition-all">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {ngos.map((ngo, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative p-8 rounded-[3.5rem] bg-slate-900/40 border border-white/5 overflow-hidden transition-all hover:border-brand-500/40 hover:shadow-2xl hover:shadow-brand-500/10"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/5 rounded-full blur-3xl group-hover:bg-brand-500/10 transition-all" />
                
                <div className="flex flex-col sm:flex-row items-start gap-8 relative z-10">
                  <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-3xl bg-slate-800 border-2 border-white/10 overflow-hidden shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                      {ngo.avatar ? (
                        <img src={ngo.avatar} alt={ngo.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-600">
                          <User className="w-10 h-10" />
                        </div>
                      )}
                    </div>
                    {ngo.verified && (
                      <div className="absolute -bottom-2 -right-2 bg-brand-500 text-slate-950 p-1.5 rounded-xl shadow-xl border-4 border-slate-900">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-brand-500 uppercase tracking-[0.2em]">{ngo.category}</span>
                      <h3 className="text-2xl font-bold text-white font-outfit group-hover:text-brand-400 transition-colors">{ngo.name}</h3>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                      {ngo.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-xs font-bold text-slate-300">{ngo.rescues} Successful Rescues</span>
                      </div>
                      <button className="flex items-center gap-1.5 text-xs font-black text-brand-500 uppercase tracking-widest hover:text-brand-400 transition-colors group/btn">
                        Visit Shelter
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <DonationModal user={user} isOpen={showDonation} onClose={() => setShowDonation(false)} />
    </div>
  );
}
