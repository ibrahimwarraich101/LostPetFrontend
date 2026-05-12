import { useEffect, useState } from 'react';
import { fetchFavorites } from '../api';
import ListingCard from './ListingCard';
import { Heart, Loader2, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Favorites({ user }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadFavorites = async () => {
    setLoading(true);
    try {
      const res = await fetchFavorites();
      setFavorites(res.data);
    } catch (err) {
      console.error('Failed to load favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
        <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading your saved pets...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header>
        <div className="flex items-center gap-4 mb-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 border border-rose-500/20">
            <Heart className="w-5 h-5 fill-current" />
          </div>
          <h1 className="text-3xl font-black text-white font-outfit">Saved Pets</h1>
        </div>
        <p className="text-slate-500 text-sm font-medium max-w-xl">
          Keep track of the pets you've saved.
        </p>
      </header>

      {favorites.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-24 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-slate-900/40"
        >
          <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
          <h4 className="text-xl font-bold text-white mb-2">No saved pets yet</h4>
          <p className="text-slate-500 text-sm mb-8">Start browsing and click the heart icon to save pets you care about.</p>
          <a href="/" className="px-8 py-4 bg-brand-500 text-slate-950 rounded-2xl font-black shadow-xl shadow-brand-500/20 hover:bg-brand-400 transition-all inline-block">
            Browse Listings
          </a>
        </motion.div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map((listing, index) => (
            <motion.div 
              key={listing._id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: index * 0.05 }}
            >
              <ListingCard listing={listing} user={user} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
