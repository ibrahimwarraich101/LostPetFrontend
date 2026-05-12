import { useState, useEffect } from 'react';
import { X, CreditCard, Heart, DollarSign, Loader2, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { submitDonation } from '../api';
import ReCAPTCHA from 'react-google-recaptcha';

export default function DonationModal({ isOpen, onClose, user }) {
  const [step, setStep] = useState(1); // 1: Amount, 2: Payment, 3: Success
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [saveCard, setSaveCard] = useState(false);
  const [cardInfo, setCardInfo] = useState({ number: '', expiry: '', cvc: '' });
  const [errors, setErrors] = useState({});
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  useEffect(() => {
    if (user?.savedCard) {
      setCardInfo({
        number: user.savedCard.number || '',
        expiry: user.savedCard.expiry || '',
        cvc: ''
      });
      setSaveCard(true);
    }
  }, [user, isOpen]);

  const validateStep1 = () => {
    const newErrors = {};
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      newErrors.amount = 'Please enter a valid donation amount.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    if (!cardInfo.number || cardInfo.number.replace(/\s/g, '').length < 16) {
      newErrors.number = 'Please enter a valid 16-digit card number.';
    }
    if (!cardInfo.expiry || !/^\d{2} \/ \d{2}$/.test(cardInfo.expiry)) {
      newErrors.expiry = 'Use MM / YY format.';
    }
    if (!cardInfo.cvc || cardInfo.cvc.length < 3) {
      newErrors.cvc = 'Enter 3-digit CVC.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleDonate = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handlePayment = async () => {
    if (!validateStep2()) return;
    if (!recaptchaToken) {
      setErrors({ ...errors, general: 'Please verify that you are not a robot.' });
      return;
    }
    setLoading(true);
    try {
      await submitDonation({
        ngoId: "654f1234567890abcdef1234", // Placeholder NGO ID
        amount: parseFloat(amount),
        saveCard,
        cardDetails: saveCard ? { number: cardInfo.number, expiry: cardInfo.expiry } : null,
        recaptchaToken
      });
      setStep(3);
    } catch (err) {
      setErrors({ ...errors, general: 'Payment failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : v;
  };

  const formatExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      let month = v.substring(0, 2);
      if (parseInt(month) > 12) month = '12';
      if (parseInt(month) === 0) month = '01';
      return `${month} / ${v.substring(2, 4)}`;
    }
    return v;
  };

  const handleCardChange = (e) => {
    const { name, value } = e.target;
    if (name === 'number') {
      const formatted = formatCardNumber(value);
      if (formatted.replace(/\s/g, '').length <= 16) setCardInfo({ ...cardInfo, number: formatted });
    } else if (name === 'expiry') {
      const formatted = formatExpiry(value);
      if (formatted.replace(/[^0-9]/g, '').length <= 4) setCardInfo({ ...cardInfo, expiry: formatted });
    } else {
      setCardInfo({ ...cardInfo, [name]: value });
    }
    if (errors[name]) setErrors({ ...errors, [name]: null });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-slate-900 w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden relative border border-white/5"
      >
        <button onClick={onClose} className="absolute top-6 right-6 p-2 text-slate-500 hover:text-white transition-colors z-10">
          <X className="w-6 h-6" />
        </button>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-brand-500/10 text-brand-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 fill-current" />
                  </div>
                  <h2 className="text-2xl font-bold text-white font-outfit">Support Our NGOs</h2>
                  <p className="text-slate-400 mt-2">Your contribution helps provide food and medical care for stray animals.</p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {['10', '25', '50'].map((amt) => (
                    <button 
                      key={amt}
                      type="button"
                      onClick={() => {
                        setAmount(amt);
                        setErrors({ ...errors, amount: null });
                      }}
                      className={`py-4 rounded-2xl border-2 font-bold transition-all ${amount === amt ? 'border-brand-500 bg-brand-500 text-slate-950' : 'border-white/5 bg-slate-800 text-slate-400 hover:border-brand-500/30'}`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</div>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(e.target.value);
                      if (errors.amount) setErrors({ ...errors, amount: null });
                    }}
                    placeholder="Other Amount"
                    className={`w-full pl-8 pr-4 py-4 bg-slate-800 rounded-2xl text-white font-bold transition-all outline-none border ${errors.amount ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-transparent focus:ring-2 focus:ring-brand-500'}`}
                  />
                  {errors.amount && <p className="text-[10px] font-bold text-rose-500 mt-2 ml-1 uppercase tracking-widest">{errors.amount}</p>}
                </div>

                <button 
                  type="button"
                  onClick={handleDonate}
                  className="w-full bg-brand-500 text-slate-950 font-black py-5 rounded-2xl shadow-xl shadow-brand-500/20 hover:bg-brand-400 transition-all active:scale-95"
                >
                  Continue to Payment
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white font-outfit">Secure Checkout</h2>
                  <p className="text-slate-400 mt-2">Paying <span className="font-bold text-white">${amount}</span> to Community Pets</p>
                </div>

                <form 
                  noValidate
                  onSubmit={(e) => {
                    e.preventDefault();
                    handlePayment();
                  }} 
                  className="space-y-8"
                >
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Card Number</label>
                      <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input 
                          type="text"
                          name="number"
                          value={cardInfo.number}
                          onChange={handleCardChange}
                          placeholder="0000 0000 0000 0000"
                          className={`w-full pl-11 pr-4 py-4 bg-slate-800 rounded-2xl text-white focus:bg-slate-700 outline-none transition-all border ${errors.number ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-white/5 focus:ring-2 focus:ring-brand-500'}`}
                        />
                      </div>
                      {errors.number && <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1 uppercase tracking-widest">{errors.number}</p>}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">Expiry Date</label>
                        <input 
                          type="text"
                          name="expiry"
                          value={cardInfo.expiry}
                          onChange={handleCardChange}
                          placeholder="MM / YY"
                          className={`w-full px-4 py-4 bg-slate-800 rounded-2xl text-white focus:bg-slate-700 outline-none transition-all border ${errors.expiry ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-white/5 focus:ring-2 focus:ring-brand-500'}`}
                        />
                        {errors.expiry && <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1 uppercase tracking-widest">{errors.expiry}</p>}
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1">CVC</label>
                        <input 
                          type="password"
                          name="cvc"
                          value={cardInfo.cvc}
                          onChange={handleCardChange}
                          placeholder="***"
                          maxLength="3"
                          className={`w-full px-4 py-4 bg-slate-800 rounded-2xl text-white focus:bg-slate-700 outline-none transition-all border ${errors.cvc ? 'border-rose-500 ring-4 ring-rose-500/10' : 'border-white/5 focus:ring-2 focus:ring-brand-500'}`}
                        />
                        {errors.cvc && <p className="text-[10px] font-bold text-rose-500 mt-1.5 ml-1 uppercase tracking-widest">{errors.cvc}</p>}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 px-1">
                    <input 
                      type="checkbox" 
                      id="saveCard"
                      checked={saveCard}
                      onChange={(e) => setSaveCard(e.target.checked)}
                      className="w-5 h-5 rounded-lg bg-slate-800 border-white/10 text-brand-500 focus:ring-brand-500/20 transition-all cursor-pointer"
                    />
                    <label htmlFor="saveCard" className="text-xs font-bold text-slate-400 cursor-pointer hover:text-white transition-colors">
                      Save card details for future donations
                    </label>
                  </div>

                    </p>
                  )}

                  <div className="flex justify-center scale-90">
                    <ReCAPTCHA
                      sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY}
                      onChange={(token) => setRecaptchaToken(token)}
                      theme="dark"
                    />
                  </div>

                  <div className="space-y-3">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-brand-500 text-slate-950 font-black py-5 rounded-2xl shadow-xl shadow-brand-500/20 hover:bg-brand-400 transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <DollarSign className="w-5 h-5" />}
                      {loading ? 'Processing...' : `Pay $${amount} Now`}
                    </button>
                    <button type="button" onClick={() => setStep(1)} className="w-full text-sm font-bold text-slate-500 hover:text-white transition-colors">
                      Go Back
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10 space-y-6"
              >
                <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-bold text-white font-outfit">Thank You!</h2>
                <p className="text-slate-400 px-4">Your generous donation of <strong>${amount}</strong> will make a real difference in a pet's life today.</p>
                <button 
                  onClick={onClose}
                  className="w-full bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-colors"
                >
                  Close
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
