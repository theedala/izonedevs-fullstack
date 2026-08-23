import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircleIcon, ArrowRightIcon, EyeIcon, EyeOffIcon, LockKeyholeIcon, SparklesIcon, UserRoundIcon } from 'lucide-react';
import { AuthService, authManager } from '../services';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await AuthService.login(formData);
      if (response.access_token) {
        authManager.setTokens({ access_token: response.access_token, refresh_token: response.refresh_token, token_type: response.token_type });
        const user = await AuthService.getCurrentUser();
        navigate(user.role === 'admin' ? '/admin' : '/');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.response?.data?.detail || 'Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(previous => ({ ...previous, [event.target.name]: event.target.value }));
    if (error) setError('');
  };

  return <main className="relative min-h-[80vh] overflow-hidden bg-slate-50 px-4 py-16 sm:px-6 lg:px-8"><div className="pointer-events-none absolute -left-20 top-10 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" /><div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" /><div className="relative mx-auto grid max-w-5xl items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]"><div className="hidden lg:block"><span className="inline-flex items-center gap-2 font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary"><SparklesIcon size={14} /> Welcome back</span><h1 className="mt-5 max-w-md font-grotesk text-5xl font-black leading-tight tracking-tight text-slate-900">Keep building what <span className="text-secondary">matters.</span></h1><p className="mt-5 max-w-md text-sm leading-7 text-slate-500">Sign in to keep up with the iZonehub community, your projects, events, and maker work.</p><div className="mt-8 flex items-center gap-3 text-xs font-semibold text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Your maker workspace is waiting.</div></div><div className="mx-auto w-full max-w-md"><div className="mb-7 text-center lg:hidden"><span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Welcome back</span><h1 className="mt-3 font-grotesk text-4xl font-black text-slate-900">Sign in and <span className="text-secondary">build.</span></h1></div><div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-9"><div className="mb-7"><h2 className="font-grotesk text-2xl font-bold text-slate-900">Sign in</h2><p className="mt-2 text-sm text-slate-500">Use your iZonehub account to continue.</p></div>{error && <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600"><AlertCircleIcon className="mt-0.5 shrink-0" size={17} /><span>{error}</span></div>}<form onSubmit={handleSubmit} className="space-y-5"><div><label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">Username or email</label><div className="relative"><UserRoundIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input id="username" name="username" type="text" required value={formData.username} onChange={handleInputChange} placeholder="you@example.com" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" /></div></div><div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><div className="relative"><LockKeyholeIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={handleInputChange} placeholder="Enter your password" className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10" /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-primary">{showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}</button></div></div><label className="flex items-center gap-2 text-xs font-medium text-slate-500"><input type="checkbox" className="h-4 w-4 rounded border-slate-300 accent-primary" /> Remember me</label><button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-card-blue transition hover:-translate-y-0.5 hover:shadow-card-orange disabled:cursor-not-allowed disabled:opacity-50">{loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Signing in…</> : <>Sign in <ArrowRightIcon size={17} /></>}</button></form><div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">New to iZonehub? <button type="button" onClick={() => navigate('/signup')} className="font-bold text-primary transition hover:text-secondary">Create an account</button></div></div></div></div></main>;
};

export default LoginPage;
