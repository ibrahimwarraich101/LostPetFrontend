import { useEffect, useState } from 'react';
import { fetchInbox, markMessageRead } from '../api';
import { Mail, Check, Inbox as InboxIcon, Reply, ExternalLink, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import ContactModal from './ContactModal';

export default function Inbox({ user }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyTo, setReplyTo] = useState(null);

  useEffect(() => {
    loadInbox();
  }, []);

  const loadInbox = async () => {
    try {
      const { data } = await fetchInbox();
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      setMessages(prev => prev.map(m => m._id === id ? { ...m, read: true } : m));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return (
    <div className="py-20 flex flex-col items-center justify-center text-slate-400">
      <InboxIcon className="w-10 h-10 animate-pulse mb-4" />
      <p className="font-medium">Opening your inbox...</p>
    </div>
  );

  if (messages.length === 0) {
    return (
      <div className="rounded-[3rem] border-2 border-dashed border-slate-200 bg-white p-16 text-center">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-[2rem] bg-slate-50 text-slate-300 mb-6">
          <InboxIcon className="h-10 w-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 font-outfit">Your inbox is clear</h3>
        <p className="mt-2 text-slate-500 max-w-sm mx-auto">Messages about your lost or found pet listings will appear here. We'll notify you when someone reaches out.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-slate-900 font-outfit flex items-center gap-3">
          <div className="p-2 bg-brand-50 rounded-xl text-brand-600">
            <Mail className="w-5 h-5" />
          </div>
          Recent Messages
        </h2>
        <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-[10px] font-bold uppercase tracking-widest">
          {messages.length} Total
        </span>
      </div>

      <div className="grid gap-4">
        {messages.map((msg) => {
          const isReceived = msg.receiver?._id === user?.id || msg.receiver === user?.id;
          const contactUser = isReceived ? msg.sender : msg.receiver;
          
          return (
            <div key={msg._id} className={`group rounded-[2rem] p-6 border transition-all ${isReceived && !msg.read ? 'border-brand-200 bg-brand-50/20 shadow-lg shadow-brand-500/5' : 'border-slate-100 bg-white hover:border-slate-200'}`}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1 space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 font-bold">
                      {contactUser?.name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{contactUser?.name}</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {new Date(msg.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <Link 
                    to={`/listing/${msg.listing?._id}`} 
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 px-3 py-1.5 rounded-full transition-colors"
                  >
                    Regarding: {msg.listing?.title}
                    <ExternalLink className="w-3 h-3" />
                  </Link>

                  <div className="relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-slate-100 rounded-full" />
                    <p className="pl-4 text-slate-600 leading-relaxed text-sm">
                      {msg.content}
                    </p>
                  </div>
                </div>

                <div className="flex md:flex-col gap-2 shrink-0">
                  {isReceived && !msg.read && (
                    <button 
                      onClick={() => handleMarkRead(msg._id)} 
                      className="flex items-center justify-center gap-2 bg-white border border-brand-200 text-brand-600 hover:bg-brand-500 hover:text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      <Check className="w-4 h-4" /> Mark Read
                    </button>
                  )}
                  {isReceived && (
                    <button 
                      onClick={() => setReplyTo(msg)}
                      className="flex items-center justify-center gap-2 bg-slate-900 text-white hover:bg-black px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-900/10"
                    >
                      <Reply className="w-4 h-4" /> Reply
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {replyTo && (
        <ContactModal 
          listing={replyTo.listing}
          user={user}
          onClose={() => setReplyTo(null)}
        />
      )}
    </div>
  );
}
