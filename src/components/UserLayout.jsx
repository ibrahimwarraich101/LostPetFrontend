import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User as UserIcon, 
  Settings, 
  Heart, 
  HeartHandshake,
  ChevronRight,
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function UserLayout({ children, user, onLogout }) {
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'My Profile', icon: UserIcon, path: '/profile' },
    { name: 'Settings', icon: Settings, path: '/settings' },
    { name: 'Saved Pets', icon: Heart, path: '/favorites' },
    { name: 'My Donations', icon: HeartHandshake, path: '/my-donations' },
  ];

  if (user?.isAdmin) {
    menuItems.push({ name: 'Admin', icon: ShieldCheck, path: '/admin' });
  }

  if (!user) return children;

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-inter overflow-x-hidden">
      {/* Sidebar - Desktop */}
      <aside className="w-72 border-r border-white/5 bg-slate-900/50 backdrop-blur-3xl fixed top-[73px] left-0 h-[calc(100vh-73px)] hidden lg:flex flex-col overflow-hidden z-40">
        <div className="p-8 pb-4">
          {/* Top User Info Section */}
          <div className="flex items-center gap-4 mb-10 px-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 overflow-hidden shadow-xl shadow-brand-500/20 border-2 border-brand-500/20">
              {user.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-950 font-black text-xl">
                  {user.name.charAt(0)}
                </div>
              )}
            </div>
            <div className="truncate">
              <span className="font-black text-xl font-outfit tracking-tight block leading-none truncate">{user.name}</span>
              <span className="text-[10px] font-bold text-slate-500 mt-1 block truncate">{user.email}</span>
            </div>
          </div>

          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all group ${
                    isActive 
                      ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20' 
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <item.icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-slate-950' : 'text-brand-500/60'}`} />
                    <span className="leading-tight">{item.name}</span>
                  </div>
                  <ChevronRight className={`w-4 h-4 shrink-0 transition-transform group-hover:translate-x-1 ${isActive ? 'text-slate-950/50' : 'text-slate-700'}`} />
                </Link>
              );
            })}
          </nav>
          
          <div className="mt-4 pt-4 border-t border-white/5">
            <button 
              onClick={onLogout}
              className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold text-rose-400 hover:bg-rose-500/10 transition-all group"
            >
              <LogOut className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Log Out
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Nav */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around">
        {menuItems.filter(i => i.name !== 'Admin').map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
                isActive ? 'text-brand-400 bg-brand-500/10' : 'text-slate-500'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-bold uppercase tracking-tighter">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-72 p-0 md:p-8 pb-24 lg:pb-8 overflow-y-auto min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
}
