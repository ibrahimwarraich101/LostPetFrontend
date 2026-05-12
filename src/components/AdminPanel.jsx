import { useEffect, useState } from 'react';
import { 
  fetchAdminStats, 
  fetchAdminUsers, 
  verifyNGO, 
  deleteUser, 
  fetchAdminListings, 
  toggleFlagListing, 
  deleteListingAdmin,
  fetchAdminDonations
} from '../api';
import { 
  Users, 
  LayoutDashboard, 
  FileText, 
  Settings, 
  ShieldCheck, 
  AlertTriangle, 
  TrendingUp, 
  Trash2, 
  MoreVertical,
  CheckCircle2,
  XCircle,
  Eye,
  Filter,
  Search,
  ChevronRight,
  HeartHandshake,
  DollarSign,
  ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ListingCard from './ListingCard';
import { Link } from 'react-router-dom';

export default function AdminPanel({ user }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'dashboard') {
        const res = await fetchAdminStats();
        setStats(res.data);
      } else if (activeTab === 'users') {
        const res = await fetchAdminUsers();
        setUsers(res.data);
      } else if (activeTab === 'listings') {
        const res = await fetchAdminListings();
        setListings(res.data);
      } else if (activeTab === 'donations') {
        const res = await fetchAdminDonations();
        setDonations(res.data);
      }
    } catch (err) {
      console.error('Error loading admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const handleVerifyNGO = async (id) => {
    try {
      await verifyNGO(id);
      loadData();
    } catch (err) {
      alert('Failed to verify NGO');
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Delete this user and all their listings? This is permanent.')) return;
    try {
      await deleteUser(id);
      loadData();
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const handleToggleFlag = async (id) => {
    try {
      await toggleFlagListing(id);
      loadData();
    } catch (err) {
      alert('Failed to toggle flag');
    }
  };

  const handleDeleteListing = async (id) => {
    if (!window.confirm('Delete this listing?')) return;
    try {
      await deleteListingAdmin(id);
      loadData();
    } catch (err) {
      alert('Failed to delete listing');
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'listings', label: 'Listings Moderation', icon: FileText },
    { id: 'donations', label: 'Donations', icon: HeartHandshake },
    { id: 'settings', label: 'Admin Settings', icon: Settings },
  ];

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredListings = listings.filter(l => 
    l.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    l.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-white font-inter">
      {/* Sidebar - Desktop */}
      <aside className="w-72 border-r border-white/5 bg-slate-900/50 backdrop-blur-3xl fixed top-[73px] left-0 h-[calc(100vh-73px)] hidden lg:flex flex-col overflow-hidden z-40">
        <div className="p-8 pb-4">
          {/* Top Admin Info Section */}
          <div className="flex items-center gap-3 mb-10 px-2">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 overflow-hidden shadow-xl shadow-brand-500/20 border-2 border-brand-500/20">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-950 font-black text-xl">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
            <div className="truncate">
              <span className="font-black text-xl font-outfit tracking-tight block leading-none truncate">{user?.name}</span>
              <span className="text-[10px] font-bold text-slate-500 mt-1 block truncate">System Administrator</span>
            </div>
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all group ${
                  activeTab === item.id 
                    ? 'bg-brand-500 text-slate-950 shadow-lg shadow-brand-500/20' 
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="flex items-center gap-4 text-left whitespace-nowrap">
                  <item.icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-slate-950' : 'text-brand-500/60'}`} />
                  {item.label}
                </div>
                <ChevronRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${activeTab === item.id ? 'text-slate-950/50' : 'text-slate-700'}`} />
              </button>
            ))}

            <div className="pt-4 mt-4 border-t border-white/5">
              <Link
                to="/dashboard"
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
              >
                <div className="flex items-center gap-4">
                  <ArrowLeft className="w-5 h-5 text-brand-500/60 group-hover:scale-110 transition-transform" />
                  Return to Hub
                </div>
                <ChevronRight className="w-4 h-4 text-slate-700 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="flex items-center gap-3 text-brand-500">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Console Access</span>
          </div>
        </div>
      </aside>

      {/* Mobile Top Nav for Admin */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-t border-white/10 px-4 py-2 flex items-center justify-around">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${
              activeTab === item.id ? 'text-brand-400 bg-brand-500/10' : 'text-slate-500'
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-[9px] font-bold uppercase tracking-tighter">{item.label.split(' ')[0]}</span>
          </button>
        ))}
        <Link
          to="/dashboard"
          className="flex flex-col items-center gap-1 p-3 rounded-xl text-slate-500 hover:text-brand-400 transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="text-[9px] font-bold uppercase tracking-tighter">Exit</span>
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 ml-0 lg:ml-72 p-0 md:p-8 overflow-y-auto min-h-screen">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-12 px-4 md:px-0 pt-8 md:pt-0">
          <div>
            <h2 className="text-4xl font-black font-outfit mb-2 leading-none">
              {sidebarItems.find(i => i.id === activeTab)?.label}
            </h2>
            <p className="text-slate-500 font-medium mt-2">Control center for the PetRescue community.</p>
          </div>
          
          {(activeTab === 'users' || activeTab === 'listings') && (
            <div className="relative group w-full md:w-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-11 pr-6 py-3.5 bg-slate-900 border border-white/5 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-brand-500/50 transition-all w-full md:w-80"
              />
            </div>
          )}
        </header>

        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && stats && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-10"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0 md:gap-6">
                {[
                  { label: 'Total Users', val: stats.totalUsers, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                  { label: 'Active Listings', val: stats.totalListings, icon: FileText, color: 'text-brand-400', bg: 'bg-brand-400/10' },
                  { label: 'Verified NGOs', val: stats.verifiedNGOs, icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                  { label: 'Total Donations', val: `$${stats.totalDonationAmount?.toLocaleString()}`, icon: DollarSign, color: 'text-amber-400', bg: 'bg-amber-400/10' },
                  { label: 'Flagged Content', val: stats.flaggedListings, icon: AlertTriangle, color: 'text-rose-400', bg: 'bg-rose-400/10' },
                ].map((s, i) => (
                  <div key={i} className="p-8 md:rounded-[2.5rem] bg-slate-900/50 border-b md:border border-white/5 group hover:border-brand-500/20 transition-all">
                    <div className={`w-12 h-12 rounded-2xl ${s.bg} flex items-center justify-center mb-6`}>
                      <s.icon className={`w-6 h-6 ${s.color}`} />
                    </div>
                    <p className="text-slate-500 font-bold text-xs uppercase tracking-widest mb-1">{s.label}</p>
                    <p className="text-4xl font-black font-outfit">{s.val}</p>
                  </div>
                ))}
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <h3 className="text-xl font-bold font-outfit flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-brand-500" />
                    Recent Activity
                  </h3>
                  <div className="rounded-[2.5rem] bg-slate-900/50 border border-white/5 overflow-hidden">
                    <div className="p-6 border-b border-white/5 grid grid-cols-4 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <div className="col-span-2">Pet Name</div>
                      <div>Status</div>
                      <div>Date</div>
                    </div>
                    <div className="divide-y divide-white/5">
                      {stats.recentListings.map((l) => (
                        <div key={l._id} className="p-6 grid grid-cols-4 items-center group hover:bg-white/5 transition-all">
                          <div className="col-span-2 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-slate-800 overflow-hidden">
                              <img src={l.images[0]} className="w-full h-full object-cover" alt="" />
                            </div>
                            <span className="font-bold text-sm">{l.title}</span>
                          </div>
                          <div>
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                              l.category === 'Lost' ? 'text-rose-400 border-rose-400/20' : 'text-emerald-400 border-emerald-400/20'
                            }`}>
                              {l.category}
                            </span>
                          </div>
                          <div className="text-slate-500 text-xs font-medium">
                            {new Date(l.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h3 className="text-xl font-bold font-outfit flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    NGO Requests
                  </h3>
                  <div className="p-8 rounded-[2.5rem] bg-slate-900/50 border border-white/5 text-center">
                    <p className="text-4xl font-black text-white mb-2">{stats.pendingNGOs}</p>
                    <p className="text-slate-500 text-sm mb-6">NGOs awaiting verification</p>
                    <button 
                      onClick={() => setActiveTab('users')}
                      className="w-full py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                    >
                      View All Requests
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'users' && (
            <motion.div
              key="users"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="md:rounded-[2.5rem] bg-slate-900/50 md:border md:border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="hidden md:table-header-group bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-4 md:px-8 py-6">User</th>
                      <th className="px-4 md:px-8 py-6">Role / Status</th>
                      <th className="px-4 md:px-8 py-6 hidden md:table-cell">Joined</th>
                      <th className="px-4 md:px-8 py-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map((u) => (
                      <tr key={u._id} className="group hover:bg-white/5 transition-all flex flex-col md:table-row">
                        <td className="px-4 md:px-8 py-6">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center overflow-hidden border border-white/10">
                              {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : <Users className="w-5 h-5 text-slate-500" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm">{u.name}</p>
                              <p className="text-xs text-slate-500">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 md:px-8 py-3 md:py-6">
                          <div className="flex items-center gap-3">
                            {u.isAdmin && <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-black border border-blue-500/20">ADMIN</span>}
                            {u.isNGO ? (
                              u.isVerifiedNGO ? (
                                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">VERIFIED NGO</span>
                              ) : (
                                <button onClick={() => handleVerifyNGO(u._id)} className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-[10px] font-black border border-amber-500/20 hover:bg-amber-500 hover:text-slate-950 transition-all">PENDING NGO</button>
                              )
                            ) : (
                              <span className="px-3 py-1 rounded-full bg-white/5 text-slate-500 text-[10px] font-black border border-white/10">USER</span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 md:px-8 py-3 md:py-6 text-slate-500 text-sm hidden md:table-cell">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 md:px-8 py-4 md:py-6 text-left md:text-right">
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className={`p-3 rounded-xl transition-all ${u.isAdmin ? 'opacity-20 cursor-not-allowed' : 'text-slate-500 hover:bg-rose-500 hover:text-white'}`}
                            disabled={u.isAdmin}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'listings' && (
            <motion.div
              key="listings"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3"
            >
              {filteredListings.map((l) => (
                <div key={l._id} className="relative group">
                  <div className={`absolute inset-0 rounded-[3.5rem] border-2 transition-all z-10 pointer-events-none ${l.isFlagged ? 'border-rose-500' : 'border-transparent'}`} />
                  {l.isFlagged && (
                    <div className="absolute top-6 left-6 z-20 px-4 py-1.5 bg-rose-500 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-2xl">
                      Flagged for Review
                    </div>
                  )}
                  <ListingCard listing={l} />
                  <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleToggleFlag(l._id)}
                      className={`p-4 rounded-2xl backdrop-blur-md border border-white/10 transition-all shadow-2xl ${l.isFlagged ? 'bg-emerald-500 text-slate-950 hover:bg-emerald-400' : 'bg-rose-500 text-white hover:bg-rose-400'}`}
                      title={l.isFlagged ? 'Unflag' : 'Flag'}
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDeleteListing(l._id)}
                      className="p-4 bg-slate-900/90 backdrop-blur-md text-white rounded-2xl border border-white/10 hover:bg-slate-800 transition-all shadow-2xl"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'donations' && (
            <motion.div
              key="donations"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <div className="rounded-[2.5rem] bg-slate-900/50 border border-white/5 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-white/5 text-[10px] font-black uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-8 py-6">Donor</th>
                      <th className="px-8 py-6">Recipient NGO</th>
                      <th className="px-8 py-6">Amount</th>
                      <th className="px-8 py-6">Status</th>
                      <th className="px-8 py-6">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {donations.map((d) => (
                      <tr key={d._id} className="group hover:bg-white/5 transition-all">
                        <td className="px-8 py-6">
                          <div>
                            <p className="font-bold text-sm">{d.donor?.name || 'Anonymous'}</p>
                            <p className="text-xs text-slate-500">{d.donor?.email || 'N/A'}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <p className="font-bold text-sm text-brand-400">{d.ngo?.name || 'Unknown NGO'}</p>
                        </td>
                        <td className="px-8 py-6 font-black text-white font-outfit">
                          ${d.amount?.toLocaleString()}
                        </td>
                        <td className="px-8 py-6">
                          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                            {d.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-slate-500 text-sm">
                          {new Date(d.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                    {donations.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-20 text-center text-slate-500 font-bold uppercase tracking-widest text-xs">
                          No donations recorded yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl"
            >
              <div className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 space-y-12">
                <div>
                  <h3 className="text-2xl font-bold font-outfit mb-6">Platform Settings</h3>
                  <div className="space-y-6">
                    {[
                      { label: 'Public Registration', desc: 'Allow new users to create accounts.', active: true },
                      { label: 'NGO Direct Posting', desc: 'Allow NGOs to post without prior verification.', active: false },
                      { label: 'AI Matching Engine', desc: 'Enable smart suggestions for listings.', active: true },
                      { label: 'System Notifications', desc: 'Enable automated emails for matches.', active: true },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center justify-between py-4 border-b border-white/5 last:border-0">
                        <div>
                          <p className="font-bold mb-1">{s.label}</p>
                          <p className="text-xs text-slate-500">{s.desc}</p>
                        </div>
                        <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all ${s.active ? 'bg-brand-500' : 'bg-slate-800'}`}>
                          <div className={`w-6 h-6 rounded-full bg-white transition-all ${s.active ? 'translate-x-6' : ''}`} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold font-outfit mb-6">Safety Controls</h3>
                  <button className="w-full py-4 px-6 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-2xl font-bold hover:bg-rose-500 hover:text-white transition-all text-left flex items-center justify-between">
                    <span>Clear Flagged Content Cache</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
