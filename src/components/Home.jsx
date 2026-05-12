import { useEffect, useState, useRef } from 'react';
import { fetchListings } from '../api';
import ListingCard from './ListingCard';
import { Search, MapPin, Loader2, Filter, ChevronDown, CheckCircle2, AlertCircle, Heart, HeartHandshake, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const initialFilter = { search: '', category: '', species: '', location: '', size: '', gender: '' };

export default function Home({ user }) {
  const [filters, setFilters] = useState(initialFilter);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const searchInputRef = useRef(null);
  const searchSectionRef = useRef(null);
  const howItWorksRef = useRef(null);

  const scrollToHowItWorks = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadListings = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetchListings(filters);
      setListings(response.data);
    } catch (err) {
      setError('Unable to load listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListings();
  }, [filters.category, filters.species, filters.size, filters.gender]);

  const handleChange = (event) => {
    setFilters((prev) => ({ ...prev, [event.target.name]: event.target.value }));
  };

  const handleSearch = async (event) => {
    event.preventDefault();
    await loadListings();
  };

  const clearFilters = () => {
    setFilters(initialFilter);
    setActiveDropdown(null);
    fetchListings({}).then((res) => setListings(res.data)).catch(() => setError('Unable to refresh listings.'));
  };

  const scrollToSearch = () => {
    searchSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const CustomFilterSelect = ({ name, value, options, placeholder }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => setActiveDropdown(activeDropdown === name ? null : name)}
        className={`w-full py-2.5 px-3 flex items-center justify-between bg-slate-950 text-white rounded-xl border border-white/5 hover:border-brand-500/30 transition-all text-sm font-medium ${activeDropdown === name ? 'ring-1 ring-brand-500/50' : ''}`}
      >
        <span className="truncate">{options.find(o => o.value === value)?.label || placeholder}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-300 ${activeDropdown === name ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {activeDropdown === name && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
            <motion.div
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-1.5 z-50 bg-slate-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden p-1 backdrop-blur-xl max-h-48 overflow-y-auto"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setFilters(f => ({ ...f, [name]: opt.value }));
                    setActiveDropdown(null);
                  }}
                  className={`w-full flex items-center px-3 py-2 rounded-lg text-[13px] font-bold transition-all ${
                    value === opt.value ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white text-left'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 overflow-hidden">
        <div className="aurora-bg" />
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-400 text-xs font-bold uppercase tracking-widest animate-float">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-500"></span>
              </span>
              Community Safety Net
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.1] font-outfit text-left">
              Bringing Every <br />
              <span className="text-brand-500">Pet Home</span> Safe.
            </h1>
            <p className="text-lg text-white max-w-lg leading-relaxed text-left">
              The intelligent platform for lost & found pet recovery. Connect with your community and find your best friend again with our matching AI.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={scrollToSearch} className="px-10 py-5 bg-brand-500 text-slate-950 rounded-3xl font-bold shadow-2xl shadow-brand-500/20 hover:bg-brand-400 hover:-translate-y-1 transition-all active:scale-95 flex items-center justify-center">
                Start Searching
              </button>
              <button onClick={scrollToHowItWorks} className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-3xl font-bold shadow-xl shadow-black/20 hover:bg-white/10 hover:-translate-y-1 transition-all active:scale-95">
                How it Works
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-brand-500/30 rounded-[4rem] rotate-3 blur-[100px] -z-10" />
            <div className="relative rounded-[4rem] overflow-hidden shadow-[0_0_50px_rgba(6,182,212,0.2)] border-2 border-brand-500/20 transform hover:rotate-1 transition-transform duration-700 bg-slate-900/50 backdrop-blur-sm">
              <img src="/hero.png" alt="Happy pets" className="w-full h-auto opacity-90 mix-blend-lighten" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Filters Section - Sticky */}
      <section id="search" ref={searchSectionRef} className="max-w-7xl mx-auto px-4 md:px-8 scroll-mt-28">
        <div className="sticky top-[84px] z-40 bg-slate-900/80 backdrop-blur-xl border border-white/5 p-3 md:p-4 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] mb-12">
          <form onSubmit={handleSearch} className="flex items-center md:grid md:grid-cols-12 gap-2 md:gap-3">
            <div className="relative flex-grow md:col-span-5 group">
              <Search className="hidden md:block absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input 
                ref={searchInputRef}
                name="search" 
                value={filters.search} 
                onChange={handleChange} 
                placeholder="Search pets..." 
                className="w-full pl-4 md:pl-11 pr-12 md:pr-4 py-3.5 md:py-3 border-none bg-slate-950 text-white rounded-2xl transition-all text-sm md:text-base outline-none focus:ring-2 focus:ring-brand-500/50" 
              />
              <button type="submit" className="md:hidden absolute right-2 top-1/2 -translate-y-1/2 bg-brand-500 text-slate-950 p-2 rounded-xl">
                <Search className="w-4 h-4" />
              </button>
            </div>
            <div className="hidden md:block relative md:col-span-3">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                name="location" 
                value={filters.location} 
                onChange={handleChange} 
                placeholder="Location..." 
                className="w-full pl-11 pr-4 py-3 border-none bg-slate-950 text-white rounded-2xl transition-all text-sm outline-none focus:ring-2 focus:ring-brand-500/50" 
              />
            </div>
            <div className="hidden md:block relative md:col-span-2">
              <CustomFilterSelect 
                name="category"
                value={filters.category}
                placeholder="All Categories"
                options={[
                  { label: 'All Categories', value: '' },
                  { label: 'Lost', value: 'Lost' },
                  { label: 'Found', value: 'Found' },
                  { label: 'Adoption', value: 'Adoption' }
                ]}
              />
            </div>
            <div className="hidden md:flex shrink-0 md:col-span-2 gap-2">
              <button type="submit" className="bg-brand-500 text-slate-950 font-black rounded-2xl md:flex-grow md:py-3 flex items-center justify-center gap-2 shadow-lg shadow-brand-500/20 hover:bg-brand-400 transition-all">
                <Search className="w-4 h-4" />
                <span className="hidden md:inline text-sm">Search</span>
              </button>
              <button 
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className={`p-3 rounded-2xl border transition-all ${showAdvanced ? 'bg-brand-500 border-brand-500 text-slate-950' : 'bg-slate-950 border-white/10 text-slate-400'}`}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </form>

          <motion.div 
            initial={false}
            animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0, marginTop: showAdvanced ? 12 : 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-white/5">
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Species</p>
                <CustomFilterSelect 
                  name="species"
                  value={filters.species}
                  placeholder="Any Species"
                  options={[
                    { label: 'Any Species', value: '' },
                    { label: 'Dog', value: 'Dog' },
                    { label: 'Cat', value: 'Cat' },
                    { label: 'Bird', value: 'Bird' },
                    { label: 'Other', value: 'Other' }
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Pet Size</p>
                <CustomFilterSelect 
                  name="size"
                  value={filters.size}
                  placeholder="Any Size"
                  options={[
                    { label: 'Any Size', value: '' },
                    { label: 'Small', value: 'Small' },
                    { label: 'Medium', value: 'Medium' },
                    { label: 'Large', value: 'Large' }
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Gender</p>
                <CustomFilterSelect 
                  name="gender"
                  value={filters.gender}
                  placeholder="Any Gender"
                  options={[
                    { label: 'Any Gender', value: '' },
                    { label: 'Male', value: 'Male' },
                    { label: 'Female', value: 'Female' }
                  ]}
                />
              </div>
              <div className="flex items-end">
                <button onClick={clearFilters} className="w-full py-2.5 text-[10px] font-bold text-brand-400 uppercase tracking-widest hover:text-brand-300 transition-colors">
                  Reset Filters
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Results Section */}
        <div className="space-y-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-black text-white font-outfit">Recent Listings</h2>
              <p className="text-slate-500 text-sm mt-1">Real-time updates from your local community</p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="w-10 h-10 text-brand-500 animate-spin" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Fetching Pets...</p>
            </div>
          ) : error ? (
            <div className="max-w-md mx-auto my-12 p-8 bg-rose-950/20 border border-rose-900/50 rounded-[2.5rem] text-center space-y-4">
              <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
              <h4 className="text-lg font-bold text-white">Something went wrong</h4>
              <p className="text-slate-400 text-sm">{error}</p>
            </div>
          ) : listings.length === 0 ? (
            <div className="py-24 text-center border-2 border-dashed border-white/10 rounded-[3rem] bg-slate-900/40">
              <Search className="w-12 h-12 text-slate-500 mx-auto mb-4" />
              <h4 className="text-xl font-semibold text-white">No pets found</h4>
              <button onClick={clearFilters} className="mt-6 px-8 py-3 bg-white/5 text-white rounded-2xl font-bold">Clear Filters</button>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listings.map((listing, index) => (
                <motion.div key={listing._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
                  <ListingCard listing={listing} user={user} />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* How it Works Section */}
      <section ref={howItWorksRef} className="max-w-7xl mx-auto px-4 md:px-8 py-12 scroll-mt-28">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Create a Listing', desc: 'Post details about a lost or found pet including photos and location.', icon: AlertCircle, color: 'text-rose-400' },
            { step: '02', title: 'Spread the Word', desc: 'Our community and matching system instantly start looking for matches.', icon: HeartHandshake, color: 'text-brand-400' },
            { step: '03', title: 'Safe Reunion', desc: 'Connect securely with others and bring your best friend home.', icon: CheckCircle2, color: 'text-emerald-400' }
          ].map((item, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-10 rounded-[3rem] bg-slate-900/50 border border-white/5 relative overflow-hidden group transition-colors hover:border-brand-500/20"
            >
              <div className="absolute top-6 right-8 text-8xl font-black text-white/5 group-hover:text-brand-500/10 transition-all duration-700 pointer-events-none select-none">{item.step}</div>
              <item.icon className={`w-12 h-12 ${item.color} mb-8 relative z-10`} />
              <h3 className="text-2xl font-bold text-white mb-4 relative z-10 font-outfit">{item.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
