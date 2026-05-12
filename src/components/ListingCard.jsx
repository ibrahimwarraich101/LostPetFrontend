import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, PawPrint, ShieldCheck, Heart, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { toggleFavorite } from '../api';

export default function ListingCard({ listing, user: initialUser }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(initialUser);
  const [favoriting, setFavoriting] = useState(false);
  
  const isLost = listing.category === 'Lost';
  const isFound = listing.category === 'Found';
  
  const isFavorited = user?.favorites?.includes(listing._id || listing.id);

  const handleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    setFavoriting(true);
    try {
      const res = await toggleFavorite(listing._id || listing.id);
      const updatedUser = { ...user, favorites: res.data };
      setUser(updatedUser);
      // Optional: Update local storage or global state if needed
      localStorage.setItem('pet-app-user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to toggle favorite:', err);
    } finally {
      setFavoriting(false);
    }
  };

  const categoryStyles = {
    Lost: 'bg-rose-50 text-rose-600 border-rose-100',
    Found: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    Adoption: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-[2.5rem] bg-slate-900 border border-white/5 shadow-2xl shadow-black/60 transition-all duration-500 hover:-translate-y-2 hover:border-brand-500/40 hover:shadow-brand-500/10">
      <div className="relative aspect-[16/11] overflow-hidden bg-slate-950">
        {listing.images?.[0] ? (
          <img 
            src={listing.images[0]} 
            alt={listing.title} 
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
          />
        ) : (
          <div className="flex h-full items-center justify-center text-slate-800">
            <PawPrint className="w-12 h-12" />
          </div>
        )}
        
        {/* Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-10">
          <span className={`px-4 py-2 rounded-2xl text-[10px] font-extrabold uppercase tracking-[0.15em] border backdrop-blur-md shadow-lg ${categoryStyles[listing.category] || 'bg-slate-900/80 text-white border-white/10'}`}>
            {listing.category}
          </span>
          
          <div className="flex items-center gap-2">
            {listing.owner?.isNGO && (
              <div className="p-2 rounded-2xl bg-brand-500 text-slate-950 border border-white/10 backdrop-blur-md shadow-lg shadow-brand-500/20" title="NGO Verified">
                <ShieldCheck className="w-4 h-4" />
              </div>
            )}
            
            <button 
              onClick={handleFavorite}
              disabled={favoriting}
              className={`p-2.5 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg transition-all active:scale-90 ${
                isFavorited 
                  ? 'bg-rose-500 text-white border-rose-500/30' 
                  : 'bg-slate-900/80 text-white hover:bg-slate-800 hover:text-rose-400'
              }`}
            >
              {favoriting ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
              )}
            </button>
          </div>
        </div>

        {/* Status Overlay */}
        {(listing.status === 'Adopted' || listing.status === 'Resolved') && (
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-[2px] flex items-center justify-center">
            <span className="bg-white text-slate-900 px-6 py-3 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl">
              {listing.status}
            </span>
          </div>
        )}
        
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950 to-transparent opacity-60" />
      </div>
      
      <div className="flex flex-col flex-grow p-6">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white line-clamp-1 font-outfit leading-tight mb-1 group-hover:text-brand-400 transition-colors">{listing.title}</h3>
          <p className="text-xs font-bold text-brand-500 uppercase tracking-widest">{listing.species} {listing.breed && `• ${listing.breed}`}</p>
        </div>
        
        <div className="space-y-3 mt-auto pt-5 border-t border-white/5">
          <div className="flex items-center text-xs font-medium text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center mr-3">
              <MapPin className="w-3.5 h-3.5 text-brand-500" />
            </div>
            <span className="line-clamp-1">{listing.location}</span>
          </div>
          <div className="flex items-center text-xs font-medium text-slate-400">
            <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center mr-3">
              <Calendar className="w-3.5 h-3.5 text-brand-500" />
            </div>
            <span>{new Date(listing.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
        
        <Link 
          to={`/listing/${listing._id || listing.id}`} 
          className="mt-6 w-full flex items-center justify-center gap-2 rounded-2xl bg-white py-4 text-xs font-extrabold text-slate-950 transition-all hover:bg-brand-500 hover:shadow-xl hover:shadow-brand-500/20 active:scale-[0.98]"
        >
          View Full Profile
        </Link>
      </div>
    </div>
  );
}
