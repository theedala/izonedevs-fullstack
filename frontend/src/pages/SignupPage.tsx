import { useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, ShieldCheckIcon } from '../components/ui/icons';

const SignupPage = () => {
  const navigate = useNavigate();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-card sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-white shadow-card-blue">
          <ShieldCheckIcon size={27} />
        </div>
        <p className="mt-5 text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">iZonehub workspace</p>
        <h1 className="mt-3 font-grotesk text-3xl font-black tracking-tight text-slate-900">Admin access only</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          New administrator accounts are created by the iZonehub team. Use the sign-in page if you already have access.
        </p>
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3.5 text-sm font-bold text-white shadow-card-blue transition hover:-translate-y-0.5 hover:shadow-card-orange"
        >
          <ArrowLeftIcon size={17} />
          Back to admin sign in
        </button>
      </div>
    </main>
  );
};

export default SignupPage;
