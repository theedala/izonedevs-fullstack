import { useState } from 'react';
import { CheckCircle2Icon, SendIcon } from '../ui/icons';
import Button from '../ui/Button';
import { apiClient } from '../../services/api';

interface JoinFormProps { className?: string; }

const JoinForm = ({ className = '' }: JoinFormProps) => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', community: '', experience: '', interests: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => setFormData(previous => ({ ...previous, [event.target.name]: event.target.value }));

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      await apiClient.post('/contact/join-application', formData);
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', community: '', experience: '', interests: '' });
    } catch (error) {
      console.error('Failed to submit application:', error);
      setSubmitError(error instanceof Error ? error.message : 'Failed to submit application');
    } finally { setIsSubmitting(false); }
  };

  const inputClass = 'w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10';

  return <div className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-card ${className}`}><div className="mb-6"><span className="font-grotesk text-[10px] font-bold uppercase tracking-[0.18em] text-secondary">Start here</span><h2 className="mt-2 font-grotesk text-2xl font-bold text-slate-900">Join our community</h2><p className="mt-2 text-sm leading-6 text-slate-500">Tell us a little about yourself and we will help you find the right room.</p></div>{isSubmitted ? <div className="py-8 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600"><CheckCircle2Icon size={28} /></div><h3 className="mt-5 font-grotesk text-xl font-bold text-slate-900">Application received</h3><p className="mt-2 text-sm leading-6 text-slate-500">Thanks for your interest. The team will be in touch within 48 hours.</p><Button onClick={() => setIsSubmitted(false)} variant="outline" className="mt-6">Submit another application</Button></div> : <form onSubmit={handleSubmit} className="space-y-4"><div><label htmlFor="name" className="mb-2 block text-xs font-bold text-slate-600">Full name</label><input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className={inputClass} placeholder="John Doe" /></div><div><label htmlFor="email" className="mb-2 block text-xs font-bold text-slate-600">Email address</label><input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="john@example.com" /></div><div><label htmlFor="phone" className="mb-2 block text-xs font-bold text-slate-600">Phone number</label><input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className={inputClass} placeholder="+263 123 456 789" /></div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="community" className="mb-2 block text-xs font-bold text-slate-600">Preferred community</label><select id="community" name="community" value={formData.community} onChange={handleChange} required className={inputClass}><option value="">Select a community</option><option value="software">Software Development</option><option value="hardware">Hardware Development</option></select></div><div><label htmlFor="experience" className="mb-2 block text-xs font-bold text-slate-600">Experience level</label><select id="experience" name="experience" value={formData.experience} onChange={handleChange} required className={inputClass}><option value="">Select your level</option><option value="beginner">Beginner</option><option value="intermediate">Intermediate</option><option value="advanced">Advanced</option><option value="professional">Professional</option></select></div></div><div><label htmlFor="interests" className="mb-2 block text-xs font-bold text-slate-600">What are you interested in?</label><textarea id="interests" name="interests" value={formData.interests} onChange={handleChange} rows={4} className={inputClass} placeholder="Tell us what you hope to learn or work on…" /></div>{submitError && <p role="alert" className="rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}<button type="submit" disabled={isSubmitting} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-card-blue transition hover:-translate-y-0.5 hover:shadow-card-orange disabled:cursor-not-allowed disabled:opacity-50">{isSubmitting ? 'Submitting…' : <>Submit application <SendIcon size={16} /></>}</button></form>}</div>;
};

export default JoinForm;
