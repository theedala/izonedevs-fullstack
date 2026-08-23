import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRightIcon, ChevronLeftIcon } from '../ui/icons';
import { ProjectsService, Project } from '../../services';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE_URL.replace('/api', '');

const getImageUrl = (url?: string) => {
  if (!url) return 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80';
  if (url.startsWith('data:') || url.startsWith('http')) return url;
  return `${BACKEND_URL}${url}`;
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row"
    style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', minHeight: 340 }}>
    <div className="md:w-[45%] skeleton" style={{ minHeight: 220 }} />
    <div className="flex-1 p-8 flex flex-col gap-4">
      <div className="skeleton h-3 w-20 rounded" />
      <div className="skeleton h-7 w-3/4 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-5/6 rounded" />
      <div className="flex gap-2 mt-2">
        <div className="skeleton h-6 w-16 rounded-full" />
        <div className="skeleton h-6 w-20 rounded-full" />
      </div>
      <div className="skeleton h-10 w-32 rounded-full mt-auto" />
    </div>
  </div>
);

const ProjectsCarousel = () => {
  const [current, setCurrent] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFeaturedProjects(); }, []);

  const fetchFeaturedProjects = async () => {
    try {
      const response = await ProjectsService.getFeaturedProjects();
      setProjects(response.items.slice(0, 3));
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const prev = () => setCurrent(i => (i === 0 ? projects.length - 1 : i - 1));
  const next = () => setCurrent(i => (i === projects.length - 1 ? 0 : i + 1));

  return (
    <section className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="inline-block text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-3">
              Projects
            </span>
            <h2 className="font-grotesk font-normal text-slate-500 text-3xl md:text-4xl leading-tight">See what our community</h2>
            <h2 className="font-grotesk font-black text-slate-900 text-3xl md:text-4xl leading-tight">has been building.</h2>
          </div>

          {/* Nav arrows */}
          <div className="flex gap-2 mb-1">
            <button
              onClick={prev}
              disabled={loading || projects.length === 0}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-30 shadow-sm text-slate-500"
            >
              <ChevronLeftIcon size={18} />
            </button>
            <button
              onClick={next}
              disabled={loading || projects.length === 0}
              className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center hover:border-primary hover:text-primary transition-all duration-200 disabled:opacity-30 shadow-sm text-slate-500"
              style={{ transform: 'scaleX(-1)' }}
            >
              <ChevronLeftIcon size={18} />
            </button>
          </div>
        </motion.div>

        {/* Slide */}
        {loading ? (
          <SkeletonCard />
        ) : projects.length === 0 ? (
          <div className="bg-white rounded-2xl p-16 text-center text-slate-400 text-sm font-grotesk border border-slate-100">
            No featured projects available yet.
          </div>
        ) : (
          <>
            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col md:flex-row"
                  style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.08)', minHeight: 340 }}
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {/* Image */}
                  <div className="md:w-[45%] overflow-hidden relative flex-shrink-0" style={{ minHeight: 220 }}>
                    <img
                      src={getImageUrl(projects[current].image_url)}
                      alt={projects[current].title}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-secondary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 md:p-10 flex flex-col justify-center">
                    <span className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-3">
                      Featured Project
                    </span>
                    <h3 className="font-grotesk font-black text-slate-900 text-2xl md:text-3xl mb-3 leading-snug">
                      {projects[current].title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed mb-5">
                      {projects[current].description}
                    </p>

                    {(projects[current].technologies || []).length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-7">
                        {(projects[current].technologies || []).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-3 py-1 rounded-full text-[11px] font-grotesk font-semibold bg-primary/8 text-primary border border-primary/15"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <Link
                      to={`/projects/${projects[current].id}`}
                      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-white text-sm font-grotesk font-semibold hover:bg-primary/90 hover:shadow-[0_4px_20px_rgba(44,55,139,0.3)] transition-all duration-300 self-start"
                    >
                      View Project <ArrowRightIcon size={14} />
                    </Link>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dot indicators + all projects link */}
            <div className="flex items-center justify-between mt-5">
              <div className="flex gap-2">
                {projects.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrent(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary' : 'w-2 bg-slate-300'}`}
                  />
                ))}
              </div>
              <Link
                to="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-grotesk font-semibold text-slate-400 hover:text-slate-700 transition-colors"
              >
                View all projects <ArrowRightIcon size={13} />
              </Link>
            </div>
          </>
        )}

      </div>
    </section>
  );
};

export default ProjectsCarousel;
