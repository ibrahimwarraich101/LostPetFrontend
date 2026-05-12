import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchListings, deleteListing } from '../api';
import ListingForm from './ListingForm';
import ListingCard from './ListingCard';
import Inbox from './Inbox';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, LayoutDashboard, MessageSquare, AlertCircle, Loader2, Edit3, Trash2 } from 'lucide-react';

export default function Dashboard({ user }) {
  const [listings, setListings] = useState([]);
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('listings'); // 'listings' or 'inbox'

  const userListings = useMemo(() => {
    if (!user) return [];
    const userId = user.id || user._id;
    return listings.filter((item) => {
      const ownerId = item.owner?._id || item.owner?.id || item.owner;
      return String(ownerId) === String(userId);
    });
  }, [listings, user]);

  const load = async () => {
    setLoading(true);
    try {
      const response = await fetchListings({});
      setListings(response.data);
    } catch (err) {
      setError('Unable to load listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSaved = () => {
    setShowForm(false);
    setSelected(null);
    load();
  };

  const handleEdit = (listing) => {
    setSelected(listing);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;
    try {
      await deleteListing(id);
      load();
    } catch (err) {
      setError('Unable to delete listing.');
    }
  };

  if (!user) return null;

  return (
    <div className="space-y-12">
      {/* Header Section */}
      <div className="relative p-8 md:p-10 md:rounded-[2rem] overflow-hidden bg-slate-900/40 md:border md:border-white/5 backdrop-blur-xl">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-500/5 rounded-full blur-[80px]" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white font-outfit leading-none">My Dashboard</h1>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-2 opacity-60">Control Center</p>
          </div>
          <button 
            onClick={() => { setSelected(null); setShowForm(true); }}
            className="px-8 py-4 bg-brand-500 text-slate-950 rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-400 transition-all flex items-center gap-2 group whitespace-nowrap"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
            New Listing
          </button>
        </div>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-12"
          >
            <div className="p-1 rounded-[3rem] bg-gradient-to-br from-brand-500/20 to-transparent">
              <div className="bg-slate-950 p-8 rounded-[2.8rem] border border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-bold text-white font-outfit">{selected ? 'Edit Listing' : 'Create New Listing'}</h2>
                  <button onClick={() => setShowForm(false)} className="text-slate-500 hover:text-white font-bold">Cancel</button>
                </div>
                <ListingForm listing={selected} onSaved={handleSaved} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900/50 rounded-2xl w-fit border border-white/5 mb-10">
        <button 
          onClick={() => setActiveTab('listings')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'listings' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          My Listings ({userListings.length})
        </button>
        <button 
          onClick={() => setActiveTab('inbox')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === 'inbox' ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
        >
          <MessageSquare className="w-4 h-4" />
          Inbox
        </button>
      </div>

      {activeTab === 'listings' ? (
        <div className="space-y-8">
          {loading && listings.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-4">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Syncing your listings...</p>
            </div>
          ) : userListings.length === 0 ? (
            <div className="py-32 rounded-[4rem] border-2 border-dashed border-white/10 bg-slate-950 text-center">
              <AlertCircle className="w-16 h-16 text-slate-800 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2 font-outfit">No listings found</h3>
              <p className="text-slate-500 max-w-sm mx-auto mb-10">You haven't posted any pets yet. Start by creating your first listing!</p>
              <button 
                onClick={() => { setSelected(null); setShowForm(true); }}
                className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-3xl font-bold hover:bg-white/10 transition-all"
              >
                Create Listing
              </button>
            </div>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {userListings.map((listing) => (
                <div key={listing._id} className="relative group">
                  <ListingCard listing={listing} />
                  <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEdit(listing)}
                      className="p-3 bg-slate-900/90 backdrop-blur-md text-amber-400 rounded-2xl border border-white/10 hover:bg-amber-400 hover:text-slate-950 transition-all shadow-xl"
                      title="Edit"
                    >
                      <Edit3 className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => handleDelete(listing._id)}
                      className="p-3 bg-slate-900/90 backdrop-blur-md text-rose-400 rounded-2xl border border-white/10 hover:bg-rose-400 hover:text-white transition-all shadow-xl"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-[4rem] bg-slate-900/40 border border-white/5 p-8 md:p-12 backdrop-blur-xl">
          <Inbox user={user} />
        </div>
      )}

      {error && (
        <div className="fixed bottom-8 right-8 bg-rose-500 text-white px-6 py-4 rounded-2xl shadow-2xl animate-bounce">
          {error}
        </div>
      )}
    </div>
  );
}
