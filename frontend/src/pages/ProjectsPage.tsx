import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowUpRightIcon,
  BrainIcon,
  CalendarDaysIcon,
  CheckCircle2Icon,
  Code2Icon,
  CpuIcon,
  ExternalLinkIcon,
  GithubIcon,
  LoaderIcon,
  PencilRulerIcon,
  SearchIcon,
  SparklesIcon,
} from 'lucide-react';
import Button from '../components/ui/Button';
import { ProjectsService, Project } from '../services';

const fallbackImage =
  'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=85';

const filters = [
  { id: 'all', label: 'All projects', icon: Code2Icon },
  { id: 'active', label: 'Active', icon: CpuIcon },
  { id: 'completed', label: 'Completed', icon: CheckCircle2Icon },
  { id: 'in_progress', label: 'In progress', icon: BrainIcon },
];

const statusStyles: Record<string, string> = {
  completed: 'bg-emerald-50 text-emerald-700 border-emerald-100',
  active: 'bg-blue-50 text-primary border-blue-100',
  in_progress: 'bg-amber-50 text-amber-700 border-amber-100',
  planning: 'bg-slate-100 text-slate-600 border-slate-200',
};

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await ProjectsService.getProjects({
        page: 1,
        size: 20,
        ...(activeFilter !== 'all' && { status: activeFilter }),
      });
      setProjects(response.items);
    } catch (err) {
      setError('We could not load the project library right now.');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [activeFilter]);

  const filteredProjects = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return projects;
    return projects.filter(
      project =>
        project.title.toLowerCase().includes(query) ||
        project.description.toLowerCase().includes(query) ||
        project.category?.toLowerCase().includes(query),
    );
  }, [projects, searchQuery]);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-slate-500">
          <LoaderIcon className="animate-spin text-secondary" size={22} />
          <span className="text-sm font-medium">Loading the project library…</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">!</div>
          <h1 className="font-grotesk text-2xl font-bold text-slate-900">Project library unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <button onClick={fetchProjects} className="btn btn-primary mt-7 bg-primary text-white">
            Try again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 pb-14 pt-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-blue-100/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/3 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="relative mx-auto max-w-6xl text-center">
          <span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Projects</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Things worth building.
            <span className="block text-secondary">Together.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
            Explore practical ideas being shaped by developers, makers, and entrepreneurs inside the iZonehub community.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => {
              const Icon = filter.icon;
              const active = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                    active
                      ? 'border-primary bg-primary text-white shadow-card-blue'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary'
                  }`}
                >
                  <Icon size={15} />
                  {filter.label}
                </button>
              );
            })}
          </div>
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search projects</span>
            <SearchIcon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search projects…"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10"
            />
          </label>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProjects.map(project => {
              const status = project.status?.toLowerCase() || 'planning';
              return (
                <article key={project.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover">
                  <Link to={`/projects/${project.id}`} className="block">
                    <div className="relative h-52 overflow-hidden bg-slate-100">
                      <img
                        src={project.image_url || fallbackImage}
                        alt={project.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/55 via-transparent to-transparent" />
                      <span className={`absolute right-4 top-4 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${statusStyles[status] || statusStyles.planning}`}>
                        {status.replace('_', ' ')}
                      </span>
                      {project.featured && (
                        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
                          <SparklesIcon size={12} /> Featured
                        </span>
                      )}
                    </div>
                  </Link>

                  <div className="p-6">
                    <div className="flex items-center justify-between gap-3 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      <span>{project.category || 'General'}</span>
                      {project.difficulty && <span className="text-secondary">{project.difficulty}</span>}
                    </div>
                    <Link to={`/projects/${project.id}`} className="mt-3 block">
                      <h2 className="font-grotesk text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary">{project.title}</h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{project.description}</p>
                    </Link>

                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map(technology => (
                          <span key={technology} className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-500">{technology}</span>
                        ))}
                        {project.technologies.length > 3 && <span className="rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-medium text-slate-400">+{project.technologies.length - 3}</span>}
                      </div>
                    )}

                    <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                      <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
                        <CalendarDaysIcon size={14} />
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center gap-2">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} GitHub`} onClick={event => event.stopPropagation()} className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-primary/30 hover:text-primary">
                            <GithubIcon size={15} />
                          </a>
                        )}
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} demo`} onClick={event => event.stopPropagation()} className="rounded-full border border-slate-200 p-2 text-slate-400 transition hover:border-secondary/30 hover:text-secondary">
                            <ExternalLinkIcon size={15} />
                          </a>
                        )}
                        <Link to={`/projects/${project.id}`} className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:text-secondary">
                          Explore <ArrowUpRightIcon size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-card"><SearchIcon size={22} /></div>
            <h2 className="mt-5 font-grotesk text-2xl font-bold text-slate-900">No projects found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Try a different search or clear the filters to see the full community project library.</p>
            <button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} className="btn btn-outline mt-6">Reset filters</button>
          </div>
        )}

        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-center text-white shadow-card-blue sm:px-10">
          <div className="pointer-events-none absolute -right-8 -top-14 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" />
          <PencilRulerIcon className="relative mx-auto mb-4 text-orange-200" size={26} />
          <h2 className="relative font-grotesk text-2xl font-bold sm:text-3xl">Have a project idea?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75">Bring your next experiment, prototype, or community solution into the room.</p>
          <div className="relative mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/communities" variant="primary">Join the community</Button>
            <Button href="/contact" variant="outline" className="border-white/40 text-white hover:bg-white hover:text-primary">Propose a project</Button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProjectsPage;
