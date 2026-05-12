import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, Search, Ghost } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-inter">
      {/* Animated Background Blobs */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 10, repeat: Infinity }}
        className="absolute -top-40 -right-40 w-96 h-96 bg-brand-500 rounded-full blur-[100px] pointer-events-none"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          rotate: [0, -90, 0],
          opacity: [0.1, 0.2, 0.1]
        }}
        transition={{ duration: 12, repeat: Infinity }}
        className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-500 rounded-full blur-[100px] pointer-events-none"
      />

      <div className="relative z-10 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block mb-8">
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 5, -5, 0]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Ghost className="w-32 h-32 text-brand-400 opacity-20 mx-auto" />
            </motion.div>
            <h1 className="text-[12rem] font-black text-white/5 font-outfit leading-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">
              404
            </h1>
          </div>
          
          <h2 className="text-5xl font-black text-white font-outfit mb-6 tracking-tight">
            Oops! You're Lost in Space.
          </h2>
          <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
            The page you are looking for has wandered off into the digital wilderness. Don't worry, we'll help you find your way back home.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              to="/" 
              className="px-8 py-4 bg-brand-500 text-slate-950 font-black rounded-2xl flex items-center gap-3 hover:bg-brand-400 shadow-xl shadow-brand-500/20 transition-all hover:-translate-y-1 active:scale-95 group"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              Return Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="px-8 py-4 bg-white/5 text-white border border-white/10 font-black rounded-2xl flex items-center gap-3 hover:bg-white/10 transition-all hover:-translate-y-1 active:scale-95 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Go Back
            </button>
          </div>
        </motion.div>

        {/* Quick Search suggestion */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 pt-10 border-t border-white/5"
        >
          <p className="text-slate-600 text-xs font-black uppercase tracking-[0.2em] mb-4">Popular Pages</p>
          <div className="flex flex-wrap justify-center gap-4 text-sm font-bold">
            <Link to="/dashboard" className="text-slate-400 hover:text-brand-400 transition-colors">Dashboard</Link>
            <span className="text-white/5">•</span>
            <Link to="/support" className="text-slate-400 hover:text-brand-400 transition-colors">Support NGOs</Link>
            <span className="text-white/5">•</span>
            <Link to="/profile" className="text-slate-400 hover:text-brand-400 transition-colors">My Profile</Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
