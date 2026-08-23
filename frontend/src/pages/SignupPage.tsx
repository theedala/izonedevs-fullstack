import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AlertCircleIcon, ArrowRightIcon, CheckCircle2Icon, EyeIcon, EyeOffIcon, LockKeyholeIcon, MailIcon, SparklesIcon, UserRoundIcon } from 'lucide-react';
import { AuthService, authManager } from '../services';

interface FormErrors { username?: string; email?: string; password?: string; confirmPassword?: string; fullName?: string; }

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', fullName: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [success, setSuccess] = useState('');

  const validateForm = () => {
    const nextErrors: FormErrors = {};
    if (!formData.username) nextErrors.username = 'Username is required';
    else if (formData.username.length < 3) nextErrors.username = 'Username must be at least 3 characters';
    else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) nextErrors.username = 'Username can only contain letters, numbers, and underscores';
    if (!formData.email) nextErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) nextErrors.email = 'Please enter a valid email address';
    if (!formData.fullName) nextErrors.fullName = 'Full name is required';
    else if (formData.fullName.length < 2) nextErrors.fullName = 'Full name must be at least 2 characters';
    if (!formData.password) nextErrors.password = 'Password is required';
    else if (formData.password.length < 6) nextErrors.password = 'Password must be at least 6 characters';
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) nextErrors.password = 'Use at least one lowercase letter, uppercase letter, and number';
    if (!formData.confirmPassword) nextErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm()) return;
    setLoading(true); setErrors({}); setSuccess('');
    try {
      await AuthService.register({ username: formData.username, email: formData.email, full_name: formData.fullName, password: formData.password });
      setSuccess('Account created successfully. Signing you in…');
      setTimeout(async () => {
        try {
          const loginResponse = await AuthService.login({ username: formData.username, password: formData.password });
          if (loginResponse.access_token) { authManager.setTokens({ access_token: loginResponse.access_token, refresh_token: loginResponse.refresh_token, token_type: loginResponse.token_type }); navigate('/'); }
        } catch { navigate('/login'); }
      }, 1200);
    } catch (err: any) {
      console.error('Registration error:', err);
      const detail = err.response?.data?.detail;
      if (detail?.includes('username')) setErrors({ username: 'Username already exists' });
      else if (detail?.includes('email')) setErrors({ email: 'Email already registered' });
      else setErrors({ username: detail || 'Registration failed. Please try again.' });
    } finally { setLoading(false); }
  };

  const updateField = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData(previous => ({ ...previous, [name]: value }));
    if (errors[name as keyof FormErrors]) setErrors(previous => ({ ...previous, [name]: undefined }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;
    return strength <= 2 ? { label: 'Weak', color: 'bg-red-500' } : strength <= 3 ? { label: 'Fair', color: 'bg-amber-500' } : strength <= 4 ? { label: 'Good', color: 'bg-blue-500' } : { label: 'Strong', color: 'bg-emerald-500' };
  };
  const passwordStrength = getPasswordStrength(formData.password);
  const inputClass = (field: keyof FormErrors) => `w-full rounded-2xl border bg-slate-50 py-3.5 text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${errors[field] ? 'border-red-300 focus:border-red-400 focus:ring-red-100' : 'border-slate-200 focus:border-primary focus:ring-primary/10'}`;
  const errorMessage = (field: keyof FormErrors) => errors[field] ? <p className="mt-1.5 flex items-center gap-1 text-xs text-red-500"><AlertCircleIcon size={13} /> {errors[field]}</p> : null;

  return <main className="relative min-h-[80vh] overflow-hidden bg-slate-50 px-4 py-14 sm:px-6 lg:px-8"><div className="pointer-events-none absolute -left-20 top-0 h-72 w-72 rounded-full bg-blue-100/70 blur-3xl" /><div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full bg-orange-100/70 blur-3xl" /><div className="relative mx-auto grid max-w-5xl items-start gap-12 lg:grid-cols-[0.85fr_1.15fr]"><div className="hidden pt-12 lg:block"><span className="inline-flex items-center gap-2 font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary"><SparklesIcon size={14} /> Join the room</span><h1 className="mt-5 max-w-md font-grotesk text-5xl font-black leading-tight tracking-tight text-slate-900">Make something <span className="text-secondary">useful.</span></h1><p className="mt-5 max-w-md text-sm leading-7 text-slate-500">Create an account and find a community of people learning, making, and sharing what they know.</p><div className="mt-8 grid max-w-sm grid-cols-2 gap-3"><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"><p className="font-grotesk text-2xl font-black text-primary">01</p><p className="mt-1 text-xs text-slate-500">Find your people</p></div><div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-card"><p className="font-grotesk text-2xl font-black text-secondary">02</p><p className="mt-1 text-xs text-slate-500">Start building</p></div></div></div><div className="mx-auto w-full max-w-xl"><div className="mb-7 text-center lg:hidden"><span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Join the room</span><h1 className="mt-3 font-grotesk text-4xl font-black text-slate-900">Start <span className="text-secondary">building.</span></h1></div><div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-9"><div className="mb-7"><h2 className="font-grotesk text-2xl font-bold text-slate-900">Create your account</h2><p className="mt-2 text-sm text-slate-500">A few details and you are in.</p></div>{success && <div className="mb-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700"><CheckCircle2Icon className="mt-0.5 shrink-0" size={17} /> <span>{success}</span></div>}<form onSubmit={handleSubmit} className="space-y-4"><div><label htmlFor="fullName" className="mb-2 block text-sm font-semibold text-slate-700">Full name</label><input id="fullName" name="fullName" type="text" required value={formData.fullName} onChange={updateField} placeholder="Your full name" className={`${inputClass('fullName')} px-4`} />{errorMessage('fullName')}</div><div className="grid gap-4 sm:grid-cols-2"><div><label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">Username</label><div className="relative"><UserRoundIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input id="username" name="username" type="text" required value={formData.username} onChange={updateField} placeholder="your_handle" className={`${inputClass('username')} pl-11 pr-4`} /></div>{errorMessage('username')}</div><div><label htmlFor="email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label><div className="relative"><MailIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input id="email" name="email" type="email" required value={formData.email} onChange={updateField} placeholder="you@example.com" className={`${inputClass('email')} pl-11 pr-4`} /></div>{errorMessage('email')}</div></div><div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><div className="relative"><LockKeyholeIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input id="password" name="password" type={showPassword ? 'text' : 'password'} required value={formData.password} onChange={updateField} placeholder="At least 6 characters" className={`${inputClass('password')} pl-11 pr-12`} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label="Toggle password visibility" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">{showPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}</button></div>{formData.password && <div className="mt-2"><div className="mb-1 flex justify-between text-[11px] font-semibold text-slate-400"><span>Password strength</span><span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span></div><div className="flex gap-1">{[1,2,3,4,5].map(level => <span key={level} className={`h-1 flex-1 rounded-full ${level <= (passwordStrength.label === 'Strong' ? 5 : passwordStrength.label === 'Good' ? 4 : passwordStrength.label === 'Fair' ? 3 : 2) ? passwordStrength.color : 'bg-slate-100'}`} />)}</div></div>}{errorMessage('password')}</div><div><label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label><div className="relative"><LockKeyholeIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={17} /><input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} required value={formData.confirmPassword} onChange={updateField} placeholder="Repeat your password" className={`${inputClass('confirmPassword')} pl-11 pr-12`} /><button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} aria-label="Toggle confirmation visibility" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary">{showConfirmPassword ? <EyeOffIcon size={17} /> : <EyeIcon size={17} />}</button></div>{errorMessage('confirmPassword')}</div><label className="flex items-start gap-2 pt-2 text-xs leading-5 text-slate-500"><input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-primary" /> <span>I agree to the <Link to="/terms" className="font-semibold text-primary hover:underline">Terms</Link> and <Link to="/privacy" className="font-semibold text-primary hover:underline">Privacy Policy</Link>.</span></label><button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-card-blue transition hover:-translate-y-0.5 hover:shadow-card-orange disabled:cursor-not-allowed disabled:opacity-50">{loading ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Creating account…</> : <>Create account <ArrowRightIcon size={17} /></>}</button></form><div className="mt-7 border-t border-slate-100 pt-6 text-center text-sm text-slate-500">Already have an account? <button type="button" onClick={() => navigate('/login')} className="font-bold text-primary transition hover:text-secondary">Sign in</button></div></div></div></div></main>;
};

export default SignupPage;
