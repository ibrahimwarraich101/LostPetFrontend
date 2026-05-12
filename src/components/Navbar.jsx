import { Link, useLocation } from 'react-router-dom';
import { 
  PawPrint, 
  User as UserIcon, 
  ShieldCheck, 
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Navbar({ user, onLogout }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-[#020617]/70 backdrop-blur-md border-b border-white/5">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-8 py-3 relative">
        {/* Logo Section */}
        <Link 
          to="/" 
          onClick={() => {
            if (location.pathname === '/') {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          className="flex items-center gap-3 group shrink-0"
        >
          <div className="bg-brand-500 p-2.5 rounded-[1rem] text-slate-950 shadow-xl shadow-brand-500/30 group-hover:rotate-12 transition-all duration-500">
            <PawPrint className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-white font-outfit leading-none">
              Pet<span className="text-brand-500">Rescue</span>
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mt-1">Community Hub</span>
          </div>
        </Link>

        {/* Main Navigation */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-10">
          <Link 
            to="/" 
            onClick={() => {
              if (location.pathname === '/') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`text-sm font-bold transition-colors flex items-center gap-2 relative group ${location.pathname === '/' ? 'text-brand-400' : 'text-slate-400 hover:text-brand-400'}`}
          >
            Browse Pets
            <div className={`absolute -bottom-1 left-0 h-0.5 bg-brand-500 transition-all ${location.pathname === '/' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>

          <Link 
            to="/support" 
            onClick={() => {
              if (location.pathname === '/support') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }
            }}
            className={`text-sm font-bold transition-colors flex items-center gap-2 relative group ${location.pathname === '/support' ? 'text-brand-400' : 'text-slate-400 hover:text-brand-400'}`}
          >
            Support NGOs
            <div className={`absolute -bottom-1 left-0 h-0.5 bg-brand-500 transition-all ${location.pathname === '/support' ? 'w-full' : 'w-0 group-hover:w-full'}`} />
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              {/* Separate Admin Panel Button */}
              {user.isAdmin && (
                <Link to="/admin" className="hidden lg:flex items-center gap-2.5 px-6 py-2.5 rounded-2xl bg-brand-500 text-slate-950 font-black text-xs hover:bg-brand-400 transition-all shadow-xl shadow-brand-500/20 mr-2 border border-white/10">
                  <ShieldCheck className="w-4 h-4" />
                  Admin Console
                </Link>
              )}

              {/* Profile Button */}
              <Link 
                to="/dashboard"
                className="flex items-center gap-2 md:gap-3 p-1.5 pr-3 md:pr-4 rounded-2xl bg-white/5 border border-white/5 hover:border-brand-500/30 transition-all group"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 rounded-xl bg-slate-900 overflow-hidden border border-white/10 group-hover:border-brand-500/50 transition-all">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600 bg-slate-950">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-black text-white">{user.name}</p>
                </div>
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-slate-400 hover:text-white transition-all"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 md:px-6 py-2.5 text-sm font-bold text-slate-400 hover:text-brand-400 transition-all">
                Sign In
              </Link>
              <Link to="/register" className="px-4 md:px-6 py-2.5 md:py-3 bg-brand-500 text-slate-950 rounded-xl md:rounded-2xl text-xs md:text-sm font-extrabold shadow-xl shadow-brand-500/25 hover:bg-brand-400 transition-all">
                Join
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-slate-950 border-b border-white/5 overflow-hidden"
          >
            <nav className="flex flex-col p-4 space-y-2">
              <Link 
                to="/" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-4 rounded-2xl text-sm font-bold transition-all ${location.pathname === '/' ? 'bg-brand-500/10 text-brand-400' : 'text-slate-400'}`}
              >
                Browse Pets
              </Link>
              <Link 
                to="/support" 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`p-4 rounded-2xl text-sm font-bold transition-all ${location.pathname === '/support' ? 'bg-brand-500/10 text-brand-400' : 'text-slate-400'}`}
              >
                Support NGOs
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

