import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchListingById, getMatches } from '../api';
import ListingCard from './ListingCard';
import ContactModal from './ContactModal';
import { MapPin, Calendar, Tag, User, MessageCircle, AlertCircle, Share2, ArrowLeft, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ListingDetail({ user: currentUser }) {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [matches, setMatches] = useState([]);
  const [error, setError] = useState('');
  const [showContact, setShowContact] = useState(false);

  const categoryStyles = {
    Lost: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    Found: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    Adoption: 'bg-brand-500/10 text-brand-400 border-brand-500/20',
  };

  useEffect(() => {
    const load = async () => {
      try {
        console.log('Fetching listing for ID:', id);
        const response = await fetchListingById(id);
        console.log('Listing received:', response.data);
        setListing(response.data);
        
        // Load matches separately so they don't block the main content
        try {
          const matchResponse = await getMatches(id);
          setMatches(matchResponse?.data?.matches || []);
        } catch (matchErr) {
          console.warn('Matches failed to load:', matchErr);
          setMatches([]);
        }
      } catch (err) {
        console.error('Error loading listing:', err);
        setError('Unable to load listing details.');
      }
    };
    load();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [id]);

  if (error) {
    return (
      <div className="max-w-2xl mx-auto py-20 text-center">
        <AlertCircle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2 font-outfit">Oops!</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <Link to="/" className="inline-flex items-center text-brand-500 font-bold hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="animate-pulse flex flex-col md:flex-row gap-12">
          <div className="h-96 w-full md:w-1/2 bg-slate-900 rounded-[3rem]"></div>
          <div className="flex-1 space-y-6 py-8">
            <div className="h-12 w-3/4 bg-slate-900 rounded-2xl"></div>
            <div className="h-6 w-1/2 bg-slate-900 rounded-full"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-slate-900 rounded-2xl"></div>
              <div className="h-20 bg-slate-900 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const isOwner = currentUser && listing?.owner && (
    (typeof listing.owner === 'object' ? listing.owner._id === currentUser.id : listing.owner === currentUser.id)
  );

  return (
    <div className="max-w-6xl mx-auto pb-20 px-4">
      <Link to="/" className="inline-flex items-center text-slate-500 hover:text-brand-500 mb-10 transition-colors group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
        <span className="font-bold text-sm uppercase tracking-widest">Back to Listings</span>
      </Link>

      <div className="grid gap-12 lg:grid-cols-2 items-start">
        {/* Left: Images */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          <div className="overflow-hidden rounded-[3.5rem] bg-slate-900 border border-white/5 shadow-2xl aspect-[4/5] relative">
            {listing.images?.[0] ? (
              <img src={listing.images[0]} alt={listing.title} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-slate-700 bg-slate-950">
                <Tag className="w-16 h-16 opacity-10" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
          </div>
          {listing.images?.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {listing.images.slice(1).map((url, i) => (
                <div key={i} className="aspect-square rounded-2xl overflow-hidden border border-white/5 hover:border-brand-500/40 transition-all cursor-pointer">
                  <img src={url} alt="" className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right: Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col"
        >
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest border backdrop-blur-md ${categoryStyles[listing.category]}`}>
              {listing.category}
            </span>
            <span className="px-5 py-2 rounded-2xl bg-slate-950 text-slate-400 text-[10px] font-black uppercase tracking-widest border border-white/5">
              {listing.status}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 font-outfit leading-tight">{listing.title}</h1>
          
          <div className="flex flex-wrap items-center gap-8 mb-10 text-slate-400">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mr-3">
                <MapPin className="w-4 h-4 text-brand-500" />
              </div>
              <span className="text-sm font-bold">{listing.location}</span>
            </div>
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center mr-3">
                <Calendar className="w-4 h-4 text-brand-500" />
              </div>
              <span className="text-sm font-bold">Posted {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Recently'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-600 mb-2">Species</p>
              <p className="font-bold text-white">{listing.species}</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-600 mb-2">Breed</p>
              <p className="font-bold text-white">{listing.breed || 'Unknown'}</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-600 mb-2">Color</p>
              <p className="font-bold text-white">{listing.color || 'Unknown'}</p>
            </div>
            <div className="bg-slate-950 p-5 rounded-3xl border border-white/5">
              <p className="text-[10px] uppercase font-black tracking-[0.2em] text-slate-600 mb-2">Size</p>
              <p className="font-bold text-white">{listing.size || 'Unknown'}</p>
            </div>
          </div>

          <div className="mb-12">
            <h3 className="text-xl font-bold text-white mb-4 font-outfit">Identification & Situation</h3>
            <p className="text-slate-400 leading-relaxed text-lg whitespace-pre-line bg-white/5 p-8 rounded-[2.5rem] border border-white/5">
              {listing.description || 'No description provided.'}
            </p>
          </div>

          {listing.owner?.isNGO && (
            <div className="mt-4 p-8 rounded-[3rem] bg-brand-500/5 border border-brand-500/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-5 mb-5 relative z-10">
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 overflow-hidden shadow-xl">
                  {listing.owner.avatar ? (
                    <img src={listing.owner.avatar} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-600">
                      <User className="w-6 h-6" />
                    </div>
                  )}
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{listing.owner.name}</h4>
                  <div className="flex items-center gap-1.5 text-brand-400">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="text-[10px] uppercase font-black tracking-widest">Verified NGO</span>
                  </div>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed relative z-10">
                {listing.owner.description || 'Dedicated to animal welfare and pet rescue in the community.'}
              </p>
            </div>
          )}

          <div className="mt-12 flex flex-wrap gap-4">
            {!isOwner ? (
              <>
                <button 
                  onClick={() => setShowContact(true)}
                  className="flex-grow inline-flex items-center justify-center gap-3 bg-brand-500 text-slate-950 font-black py-5 px-10 rounded-[2rem] hover:bg-brand-400 shadow-2xl shadow-brand-500/20 transition-all active:scale-[0.98] text-lg"
                >
                  <MessageCircle className="w-6 h-6" />
                  Contact Now
                </button>
                <button className="inline-flex items-center justify-center bg-white/5 text-white border border-white/10 font-bold p-5 rounded-[2rem] hover:bg-white/10 transition-all">
                  <Share2 className="w-6 h-6" />
                </button>
              </>
            ) : (
              <Link 
                to="/dashboard"
                className="flex-grow inline-flex items-center justify-center gap-3 bg-slate-800 text-white font-black py-5 px-10 rounded-[2rem] hover:bg-slate-700 transition-all text-lg"
              >
                Manage My Listing
              </Link>
            )}
          </div>
        </motion.div>
      </div>

      {/* Suggested Matches Section */}
      <section className="mt-32">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black text-white font-outfit">AI Smart Matches</h2>
            <p className="text-slate-500 mt-2">Our AI found these related listings for you</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-brand-500/10 text-brand-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-brand-500/20 animate-pulse">
            AI Engine Active
          </div>
        </div>
        
        {matches.length === 0 ? (
          <div className="bg-slate-950 rounded-[4rem] p-20 text-center border-2 border-dashed border-white/5">
            <AlertCircle className="w-16 h-16 text-slate-800 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-white mb-3 font-outfit">No matches found yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
              We'll automatically notify you when someone posts a {listing.category === 'Lost' ? 'Found' : 'Lost'} listing that matches this pet's profile.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {matches.map((item) => (
              <div key={item._id} className="relative group">
                <div className="absolute -top-4 left-8 z-10 px-4 py-1.5 bg-brand-500 text-slate-950 rounded-full text-[10px] font-black uppercase tracking-widest shadow-xl group-hover:-translate-y-1 transition-transform">
                  {item.matchReason}
                </div>
                <ListingCard listing={item} />
              </div>
            ))}
          </div>
        )}
      </section>



      {showContact && (
        <ContactModal 
          listing={listing} 
          user={currentUser} 
          onClose={() => setShowContact(false)} 
        />
      )}
    </div>
  );
}
