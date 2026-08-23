import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertCircleIcon,
  ArrowRightIcon,
  EyeIcon,
  EyeOffIcon,
  LockKeyholeIcon,
  ShieldCheckIcon,
  UserRoundIcon,
} from '../components/ui/icons';
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
      if (!response.access_token) return;

      authManager.setTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
        token_type: response.token_type,
      });

      const user = await AuthService.getCurrentUser();
      navigate(user.role === 'admin' ? '/admin' : '/');
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

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-card-blue">
            <ShieldCheckIcon size={27} />
          </div>
          <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">iZonehub workspace</p>
          <h1 className="mt-3 font-grotesk text-3xl font-black tracking-tight text-slate-900">Admin sign in</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Access the content and operations workspace.</p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-card sm:p-8">
          {error && (
            <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-600">
              <AlertCircleIcon className="mt-0.5 shrink-0" size={17} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-semibold text-slate-700">Username or email</label>
              <div className="relative">
                <UserRoundIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  autoComplete="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter your username"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="relative">
                <LockKeyholeIcon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-900 outline-none transition focus:border-primary focus:bg-white focus:ring-4 focus:ring-primary/10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(previous => !previous)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-primary"
                >
                  {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-card-blue transition hover:-translate-y-0.5 hover:shadow-card-orange disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Signing in…
                </>
              ) : (
                <>Continue to workspace <ArrowRightIcon size={17} /></>
              )}
            </button>
          </form>

          <p className="mt-6 border-t border-slate-100 pt-5 text-center text-xs leading-5 text-slate-400">
            Admin accounts are provisioned by the iZonehub team.
          </p>
        </div>
      </div>
    </main>
  );
};

export default LoginPage;
