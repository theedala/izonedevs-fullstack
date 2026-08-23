import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, ArrowUpRightIcon, BookOpenIcon, CalendarDaysIcon, Clock3Icon, GithubIcon, Layers3Icon, LinkIcon, RocketIcon, SparklesIcon, TagIcon, ZapIcon } from 'lucide-react';
import Button from '../components/ui/Button';
import { ProjectsService, Project } from '../services';

const fallbackImage = 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1400&q=85';

const ProjectDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const loadProject = async () => {
      try {
        setLoading(true);
        setError(null);
        setProject(await ProjectsService.getProject(parseInt(id, 10)));
      } catch (err) {
        console.error('Error fetching project:', err);
        setError('Project not found');
      } finally {
        setLoading(false);
      }
    };
    loadProject();
  }, [id]);

  const formatDate = (dateString?: string) => dateString ? new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not available';
  const statusLabel = project?.status?.replace('_', ' ') || 'in progress';

  if (loading) return <div className="min-h-[70vh] bg-white flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-secondary" /><span className="text-sm font-medium">Loading case study…</span></div></div>;
  if (error || !project) return <main className="min-h-[70vh] bg-slate-50 px-4 py-24"><div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">!</div><h1 className="font-grotesk text-2xl font-bold text-slate-900">Project not found</h1><p className="mt-3 text-sm leading-6 text-slate-500">The project you are looking for does not exist or has been removed.</p><button onClick={() => navigate('/projects')} className="btn btn-primary mt-7 bg-primary text-white">Back to projects</button></div></main>;

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 pb-12 pt-10 sm:px-6 lg:px-8"><div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" /><div className="relative mx-auto max-w-6xl"><button type="button" onClick={() => navigate('/projects')} className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary"><ArrowLeftIcon size={16} /> Back to projects</button><div className="mt-10 max-w-4xl">{project.featured && <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary"><SparklesIcon size={12} /> Featured build</span>}<h1 className="mt-4 font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">{project.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">{project.description}</p>{project.technologies && project.technologies.length > 0 && <div className="mt-7 flex flex-wrap gap-2">{project.technologies.map((tech, index) => <span key={`${tech}-${index}`} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">{tech}</span>)}</div>}</div></div></section>
      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[1fr_340px]"><div><div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-card"><img src={project.image_url || fallbackImage} alt={project.title} className="max-h-[520px] w-full object-cover" onError={event => { event.currentTarget.src = fallbackImage; }} /></div>{project.content && <article className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-9"><div className="flex items-center gap-3 border-b border-slate-100 pb-5"><div className="rounded-2xl bg-blue-50 p-2.5 text-primary"><BookOpenIcon size={19} /></div><h2 className="font-grotesk text-2xl font-bold text-slate-900">Inside the build</h2></div><div className="prose prose-slate mt-7 max-w-none text-sm leading-7" dangerouslySetInnerHTML={{ __html: project.content.replace(/\n/g, '<br />') }} /></article>}</div><aside className="space-y-5 lg:sticky lg:top-24 lg:self-start"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"><h2 className="font-grotesk text-xl font-bold text-slate-900">Project snapshot</h2><dl className="mt-6 space-y-4 text-sm"><div className="flex items-center justify-between gap-4"><dt className="inline-flex items-center gap-2 text-slate-500"><Layers3Icon size={16} /> Status</dt><dd className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold capitalize text-emerald-700">{statusLabel}</dd></div>{project.category && <div className="flex items-center justify-between gap-4"><dt className="inline-flex items-center gap-2 text-slate-500"><TagIcon size={16} /> Category</dt><dd className="font-semibold capitalize text-slate-700">{project.category}</dd></div>}{project.difficulty && <div className="flex items-center justify-between gap-4"><dt className="inline-flex items-center gap-2 text-slate-500"><ZapIcon size={16} /> Difficulty</dt><dd className="font-semibold capitalize text-slate-700">{project.difficulty}</dd></div>}<div className="flex items-center justify-between gap-4"><dt className="inline-flex items-center gap-2 text-slate-500"><CalendarDaysIcon size={16} /> Created</dt><dd className="text-right font-semibold text-slate-700">{formatDate(project.created_at)}</dd></div>{project.updated_at && <div className="flex items-center justify-between gap-4"><dt className="inline-flex items-center gap-2 text-slate-500"><Clock3Icon size={16} /> Updated</dt><dd className="text-right font-semibold text-slate-700">{formatDate(project.updated_at)}</dd></div>}</dl>{(project.github_url || project.demo_url) && <div className="mt-6 space-y-2 border-t border-slate-100 pt-5">{project.github_url && <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"><span className="inline-flex items-center gap-2"><GithubIcon size={16} /> View source</span><ArrowUpRightIcon size={15} /></a>}{project.demo_url && <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-primary/30 hover:text-primary"><span className="inline-flex items-center gap-2"><LinkIcon size={16} /> Open live demo</span><ArrowUpRightIcon size={15} /></a>}</div>}</div><div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-6 text-white shadow-card-blue"><RocketIcon className="text-secondary" size={23} /><h2 className="mt-4 font-grotesk text-xl font-bold">Want to contribute?</h2><p className="mt-2 text-sm leading-6 text-white/75">Join the people building practical, open, and locally relevant technology.</p><Button href="/communities" variant="outline" className="mt-6 w-full border-white/40 text-white hover:bg-white hover:text-primary">Join a community</Button><Button href="/contact" variant="outline" className="mt-2 w-full border-white/20 text-white/75 hover:bg-white hover:text-primary">Contact the team</Button></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-6"><h2 className="font-grotesk text-lg font-bold text-slate-900">Keep exploring</h2><div className="mt-4 space-y-2"><Button href="/projects" variant="outline" className="w-full justify-between">All projects <ArrowUpRightIcon size={15} /></Button><Button href="/events" variant="outline" className="w-full justify-between">Upcoming events <ArrowUpRightIcon size={15} /></Button><Button href="/blog" variant="outline" className="w-full justify-between">Latest stories <ArrowUpRightIcon size={15} /></Button></div></div></aside></div></section>
    </main>
  );
};

export default ProjectDetailPage;
