import { useState } from 'react';
import { sendMessage } from '../api';
import { X } from 'lucide-react';

export default function ContactModal({ listing, user, onClose }) {
  const [content, setContent] = useState('');
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    setStatus('sending');
    try {
      await sendMessage({
        receiver: listing.owner._id,
        listing: listing._id,
        content
      });
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setErrorMsg(err.response?.data?.message || 'Failed to send message.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-800">
            Contact {listing.owner.name}
          </h2>
          <button onClick={onClose} className="rounded-full p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-600 focus:outline-none">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        {status === 'success' ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-lg font-medium text-slate-800">Message Sent!</p>
            <p className="text-sm text-slate-500">They will see your message in their dashboard.</p>
            <button onClick={onClose} className="mt-4 w-full">Close</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-sm text-slate-600">
              Send a message regarding <span className="font-semibold text-slate-800">{listing.title}</span>.
            </p>
            <textarea
              rows="4"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Hi, I saw your listing and..."
              className="w-full p-3 resize-none border-slate-200 text-slate-900 focus:border-brand-400 focus:ring-brand-200"
              required
            />
            {status === 'error' && <p className="text-sm text-red-500">{errorMsg}</p>}
            <div className="flex gap-3 justify-end">
              <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 hover:bg-slate-200">
                Cancel
              </button>
              <button type="submit" disabled={status === 'sending' || !content.trim()}>
                {status === 'sending' ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
