import { useState } from 'react';
import { AlertCircleIcon, CheckCircle2Icon, SendIcon } from '../ui/icons';
import Button from '../ui/Button';
import { ContactService } from '../../services';

interface ContactFormProps { className?: string; }

const ContactForm = ({ className = '' }: ContactFormProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const inputClass = 'w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10';
  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData(previous => ({ ...previous, [event.target.name]: event.target.value }));
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); setIsSubmitting(true); setError('');
    try { await ContactService.sendMessage(formData); setIsSubmitted(true); setFormData({ name: '', email: '', subject: '', message: '' }); }
    catch (err: any) { setError(err.response?.data?.detail || 'Failed to send message. Please try again.'); }
    finally { setIsSubmitting(false); }
  };
  return <div className={className}>{isSubmitted ? <div className="py-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2Icon size={28} /></div><h3 className="mt-5 font-grotesk text-xl font-bold text-slate-900">Message sent</h3><p className="mt-2 text-sm leading-6 text-slate-500">Thank you for reaching out. We will get back to you as soon as possible.</p><Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-6">Send another message</Button></div> : <form onSubmit={handleSubmit} className="space-y-5"><div>{error && <div className="mb-5 flex items-start gap-2 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-600"><AlertCircleIcon size={15} className="mt-0.5 shrink-0" /> {error}</div>}<div className="grid gap-5 sm:grid-cols-2"><div><label htmlFor="name" className="mb-2 block text-xs font-bold text-slate-600">Your name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="John Doe" /></div><div><label htmlFor="email" className="mb-2 block text-xs font-bold text-slate-600">Email address</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="john@example.com" /></div></div></div><div><label htmlFor="subject" className="mb-2 block text-xs font-bold text-slate-600">Subject</label><input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className={inputClass} placeholder="How can we help you?" /></div><div><label htmlFor="message" className="mb-2 block text-xs font-bold text-slate-600">Message</label><textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={6} className={inputClass} placeholder="Your message here…" /></div><button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-card-blue transition hover:-translate-y-0.5 hover:shadow-card-orange disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Sending…</> : <>Send message <SendIcon size={16} /></>}</button></form>}</div>;
};

export default ContactForm;
