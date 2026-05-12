import { useState } from 'react';
import { createListing, updateListing, uploadImage } from '../api';
import { Camera, MapPin, Info, CheckCircle2, Loader2, X, Plus, ChevronDown, Filter, AlertCircle, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReCAPTCHA from 'react-google-recaptcha';

const categories = ['Lost', 'Found', 'Adoption'];
const sizes = ['Small', 'Medium', 'Large', 'Unknown'];
const speciesList = [
  'Dog', 'Cat', 'Bird', 'Rabbit', 'Hamster', 
  'Guinea Pig', 'Ferret', 'Reptile', 'Amphibian', 
  'Fish', 'Turtle', 'Parrot', 'Horse', 'Goat', 'Pig'
];

export default function ListingForm({ listing = null, onSaved }) {
  const [form, setForm] = useState({
    category: listing?.category || 'Lost',
    title: listing?.title || '',
    species: listing?.species || '',
    breed: listing?.breed || '',
    age: listing?.age || '',
    color: listing?.color || '',
    size: listing?.size || 'Unknown',
    description: listing?.description || '',
    location: listing?.location || '',
    contactInfo: listing?.contactInfo || '',
    status: listing?.status || 'Active',
  });
  const [isOtherSpecies, setIsOtherSpecies] = useState(listing?.species && !speciesList.includes(listing.species));
  const [images, setImages] = useState(listing?.images || []);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null);

  const toggleDropdown = (name) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleDropdownSelect = (name, value) => {
    if (name === 'speciesSelect') {
      if (value === 'Other') {
        setIsOtherSpecies(true);
        setForm(f => ({ ...f, species: '' }));
      } else {
        setIsOtherSpecies(false);
        setForm(f => ({ ...f, species: value }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
    setActiveDropdown(null);
  };

  const CustomSelect = ({ name, value, options, placeholder, error, icon: Icon }) => (
    <div className="relative">
      <button
        type="button"
        onClick={() => toggleDropdown(name)}
        className={`w-full bg-slate-950 border rounded-2xl py-4 px-5 text-left text-white flex items-center justify-between transition-all outline-none focus:ring-2 ${
          error ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-white/5 focus:ring-brand-500/50'
        } ${activeDropdown === name ? 'ring-2 ring-brand-500/50 border-brand-500/30' : ''}`}
      >
        <span className="flex items-center gap-3">
          {Icon && <Icon className="w-4 h-4 text-slate-500" />}
          <span className={`text-sm ${!value ? 'text-slate-500' : 'text-white font-bold'}`}>
            {options.find(o => o.value === value)?.label || placeholder}
          </span>
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-300 ${activeDropdown === name ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {activeDropdown === name && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setActiveDropdown(null)} />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute top-full left-0 right-0 mt-2 z-50 bg-slate-900 border border-white/10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] overflow-hidden p-2 backdrop-blur-xl max-h-72 overflow-y-auto"
            >
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleDropdownSelect(name, opt.value)}
                  className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl text-sm font-bold transition-all ${
                    value === opt.value ? 'bg-brand-500 text-slate-950' : 'text-slate-400 hover:bg-white/5 hover:text-white text-left'
                  }`}
                >
                  {opt.icon && <opt.icon className={`w-4 h-4 ${value === opt.value ? 'text-slate-950' : 'text-slate-500'}`} />}
                  {opt.label}
                </button>
              ))}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'speciesSelect') {
      if (value === 'Other') {
        setIsOtherSpecies(true);
        setForm(f => ({ ...f, species: '' }));
      } else {
        setIsOtherSpecies(false);
        setForm(f => ({ ...f, species: value }));
      }
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    const data = new FormData();
    data.append('image', file);
    try {
      const response = await uploadImage(data);
      setImages((prev) => [...prev, response.data.url]);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!form.title.trim()) errors.title = 'Listing title is required';
    if (!form.species.trim()) errors.species = 'Please select or enter a species';
    if (!form.location.trim()) errors.location = 'Location is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!validateForm()) return;
    if (!recaptchaToken) {
      setError('Please verify that you are not a robot.');
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form, images, recaptchaToken };
      const result = listing ? await updateListing(listing._id, payload) : await createListing(payload);
      onSaved(result.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 bg-slate-900 p-8 md:p-12 rounded-[3.5rem] border border-white/5 shadow-2xl shadow-black/40" noValidate>
      <div className="space-y-1">
        <h2 className="text-3xl font-black text-white font-outfit">{listing ? 'Edit Listing' : 'Create New Listing'}</h2>
        <p className="text-slate-500 text-sm">Provide accurate details to help with recovery or adoption.</p>
      </div>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* Basic Info Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-brand-500 font-bold text-xs uppercase tracking-widest">
            <Info className="w-4 h-4" /> Basic Information
          </div>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <label className="block">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Category</span>
                <div className="mt-2 flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setForm(f => ({ ...f, category: cat }))}
                      className={`flex-1 py-3 rounded-2xl text-xs font-bold border transition-all ${
                        form.category === cat 
                        ? 'bg-brand-500 text-slate-950 border-brand-500 shadow-lg shadow-brand-500/20' 
                        : 'bg-slate-950 text-slate-500 border-white/5 hover:border-brand-500/30'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </label>
              
              <label className="block">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Status</span>
                <div className="mt-2">
                  <CustomSelect 
                    name="status"
                    value={form.status}
                    options={[
                      { label: 'Active', value: 'Active', icon: CheckCircle2 },
                      { label: 'Resolved', value: 'Resolved', icon: Plus },
                      { label: 'Adopted', value: 'Adopted', icon: Heart }
                    ]}
                  />
                </div>
              </label>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Listing Title</span>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="e.g. Lost Golden Retriever in Central Park"
                className={`mt-2 w-full bg-slate-950 border rounded-2xl py-4 px-5 text-white transition-all outline-none focus:ring-2 ${validationErrors.title ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-white/5 focus:ring-brand-500/50'}`} 
              />
              {validationErrors.title && <p className="mt-1.5 text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-wider">{validationErrors.title}</p>}
            </label>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <label className="block">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Species</span>
                  <div className="mt-2">
                    <CustomSelect 
                      name="speciesSelect"
                      value={isOtherSpecies ? 'Other' : form.species}
                      placeholder="Select Species"
                      error={validationErrors.species}
                      options={[
                        ...speciesList.map(s => ({ label: s, value: s })),
                        { label: 'Other Species', value: 'Other' }
                      ]}
                    />
                  </div>
                </label>

                {isOtherSpecies && (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
                    <label className="block">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Enter Other Species</span>
                      <input 
                        name="species" 
                        value={form.species} 
                        onChange={handleChange} 
                        placeholder="Type species name..." 
                        className={`mt-2 w-full bg-slate-950 border rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 transition-all ${validationErrors.species ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-white/5 focus:ring-brand-500/50'}`} 
                      />
                    </label>
                  </motion.div>
                )}
                {validationErrors.species && !isOtherSpecies && <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-wider">{validationErrors.species}</p>}
              </div>
              
              <label className="block">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Breed</span>
                <input 
                  name="breed" 
                  value={form.breed} 
                  onChange={handleChange} 
                  placeholder="Optional"
                  className="mt-2 w-full bg-slate-950 border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-brand-500/50" 
                />
              </label>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <label className="block">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Color</span>
                <input name="color" value={form.color} onChange={handleChange} className="mt-2 w-full bg-slate-950 border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-brand-500/50" />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Age</span>
                <input name="age" value={form.age} onChange={handleChange} className="mt-2 w-full bg-slate-950 border-white/5 rounded-2xl py-4 px-5 text-white outline-none focus:ring-2 focus:ring-brand-500/50" />
              </label>
              <label className="block">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Size</span>
                <div className="mt-2">
                  <CustomSelect 
                    name="size"
                    value={form.size}
                    options={sizes.map(s => ({ label: s, value: s }))}
                  />
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Media and Details Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-2 text-brand-500 font-bold text-xs uppercase tracking-widest">
            <Camera className="w-4 h-4" /> Photos & Details
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Photos (Up to 4)</span>
              <div className="grid grid-cols-4 gap-4">
                {images.map((url, i) => (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    key={i} 
                    className="relative aspect-square rounded-2xl overflow-hidden border border-white/10 shadow-xl"
                  >
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setImages(imgs => imgs.filter(u => u !== url))}
                      className="absolute top-1.5 right-1.5 bg-slate-950/80 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-500 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.div>
                ))}
                {images.length < 4 && (
                  <label className="aspect-square rounded-2xl border-2 border-dashed border-white/10 flex flex-col items-center justify-center cursor-pointer bg-slate-950 hover:bg-brand-500/5 hover:border-brand-500/40 transition-all group">
                    {uploading ? (
                      <Loader2 className="w-6 h-6 text-brand-500 animate-spin" />
                    ) : (
                      <>
                        <div className="p-3 rounded-full bg-white/5 group-hover:bg-brand-500/10 transition-colors mb-1">
                          <Plus className="w-6 h-6 text-slate-500 group-hover:text-brand-500" />
                        </div>
                        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest group-hover:text-brand-500">Upload</span>
                      </>
                    )}
                    <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                  </label>
                )}
              </div>
            </div>

            <label className="block">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Location</span>
              <div className="relative mt-2">
                <MapPin className={`absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 ${validationErrors.location ? 'text-rose-400' : 'text-slate-400'}`} />
                <input 
                  name="location" 
                  value={form.location} 
                  onChange={handleChange} 
                  placeholder="City, Neighborhood, or Landmark"
                  className={`w-full bg-slate-950 border rounded-2xl py-4 pl-12 pr-5 text-white focus:ring-2 transition-all outline-none ${validationErrors.location ? 'border-rose-500/50 focus:ring-rose-500/20' : 'border-white/5 focus:ring-brand-500/50'}`} 
                />
              </div>
              {validationErrors.location && <p className="mt-1.5 text-[10px] font-bold text-rose-500 ml-1 uppercase tracking-wider">{validationErrors.location}</p>}
            </label>

            <label className="block">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider ml-1">Description</span>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                rows="5" 
                placeholder="Describe identifying marks, temperament, or situation..."
                className="mt-2 w-full bg-slate-950 border-white/5 rounded-2xl py-4 px-5 text-white resize-none outline-none focus:ring-2 focus:ring-brand-500/50" 
              />
            </label>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 flex flex-col items-center gap-6">
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-rose-400 bg-rose-500/10 px-6 py-4 rounded-[1.5rem] border border-rose-500/20 text-xs font-bold"
          >
            <Info className="w-4 h-4" /> {error}
          </motion.div>
        )}

        <div className="flex justify-center pb-2">
          <ReCAPTCHA
            sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
            onChange={(token) => setRecaptchaToken(token)}
            theme="dark"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={saving || uploading} 
          className="w-full max-w-sm bg-brand-500 text-slate-950 font-black py-5 px-8 rounded-[2rem] shadow-2xl shadow-brand-500/20 hover:bg-brand-400 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 text-lg"
        >
          {saving ? <Loader2 className="w-6 h-6 animate-spin" /> : <CheckCircle2 className="w-6 h-6" />}
          {saving ? 'Processing...' : listing ? 'Save Changes' : 'Publish Listing'}
        </button>
      </div>
    </form>
  );
}
