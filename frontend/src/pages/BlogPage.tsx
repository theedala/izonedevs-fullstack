import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, BookOpenIcon, CalendarDaysIcon, EyeIcon, LoaderIcon, SearchIcon, UserRoundIcon } from '../components/ui/icons';
import { BlogService, BlogPost } from '../services';
import Button from '../components/ui/Button';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');
const fallbackImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1200&q=85';

const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return fallbackImage;
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) return imageUrl;
  return `${BACKEND_URL}${imageUrl}`;
};

const filters = [
  { id: 'all', label: 'All stories' },
  { id: 'featured', label: 'Featured' },
  { id: 'latest', label: 'Latest' },
];

const BlogPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await BlogService.getBlogPosts({ page: 1, size: 20, status: 'published' });
      setPosts(response.items);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('We could not load the editorial feed right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const matchesQuery = posts.filter(post => !query || post.title.toLowerCase().includes(query) || post.excerpt?.toLowerCase().includes(query) || post.content.toLowerCase().includes(query));
    if (activeFilter === 'featured') return matchesQuery.filter(post => post.featured);
    if (activeFilter === 'latest') return [...matchesQuery].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    return matchesQuery;
  }, [activeFilter, posts, searchQuery]);

  const articleExcerpt = (post: BlogPost, length = 150) => post.excerpt || `${post.content.slice(0, length).trim()}…`;

  if (loading) {
    return <div className="min-h-[70vh] bg-white flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><LoaderIcon className="animate-spin text-secondary" size={22} /><span className="text-sm font-medium">Loading the editorial feed…</span></div></div>;
  }

  if (error) {
    return (
      <main className="min-h-[70vh] bg-slate-50 px-4 py-24">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">!</div>
          <h1 className="font-grotesk text-2xl font-bold text-slate-900">Editorial feed unavailable</h1>
          <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
          <button onClick={fetchPosts} className="btn btn-primary mt-7 bg-primary text-white">Try again</button>
        </div>
      </main>
    );
  }

  const featuredPost = filteredPosts[0];

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 pb-14 pt-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="relative mx-auto max-w-6xl text-center">
          <span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">The iZonehub journal</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">Insights from the <span className="text-secondary">room.</span></h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">Ideas, lessons, and field notes from the people turning curiosity into useful technology.</p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button key={filter.id} onClick={() => setActiveFilter(filter.id)} className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${activeFilter === filter.id ? 'border-primary bg-primary text-white shadow-card-blue' : 'border-slate-200 bg-white text-slate-500 hover:border-primary/30 hover:text-primary'}`}>{filter.label}</button>
            ))}
          </div>
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search articles</span>
            <SearchIcon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="search" placeholder="Search articles…" value={searchQuery} onChange={event => setSearchQuery(event.target.value)} className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/10" />
          </label>
        </div>

        {filteredPosts.length > 0 ? (
          <>
            <Link to={`/blog/${featuredPost.slug}`} className="group mt-10 grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:border-slate-300 hover:shadow-card-hover lg:grid-cols-[1.1fr_0.9fr]">
              <div className="relative min-h-72 overflow-hidden bg-slate-100 lg:min-h-[360px]">
                <img src={getImageUrl(featuredPost.image_url)} alt={featuredPost.title} onError={event => { event.currentTarget.src = fallbackImage; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <span className="absolute left-5 top-5 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white"><BookOpenIcon size={12} /> Featured story</span>
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-10">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">Editor’s pick</span>
                <h2 className="mt-4 font-grotesk text-3xl font-bold leading-tight text-slate-900 transition-colors group-hover:text-primary sm:text-4xl">{featuredPost.title}</h2>
                <p className="mt-4 text-sm leading-7 text-slate-500">{articleExcerpt(featuredPost, 190)}</p>
                <div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                  <span className="inline-flex items-center gap-1.5"><UserRoundIcon size={14} /> {featuredPost.author || 'iZonehub team'}</span>
                  <span className="inline-flex items-center gap-1.5"><CalendarDaysIcon size={14} /> {new Date(featuredPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <span className="inline-flex items-center gap-1.5"><EyeIcon size={14} /> {featuredPost.views} views</span>
                </div>
                <span className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-primary">Read the story <ArrowUpRightIcon size={16} /></span>
              </div>
            </Link>

            {filteredPosts.length > 1 && (
              <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.slice(1).map(post => (
                  <article key={post.id} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover">
                    <Link to={`/blog/${post.slug}`} className="block">
                      <div className="relative h-48 overflow-hidden bg-slate-100"><img src={getImageUrl(post.image_url)} alt={post.title} onError={event => { event.currentTarget.src = fallbackImage; }} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold text-slate-600 backdrop-blur"><EyeIcon size={12} /> {post.views}</span></div>
                      <div className="p-6"><div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-secondary"><span>{post.featured ? 'Featured' : 'Community notes'}</span><span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span></div><h2 className="mt-3 font-grotesk text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary">{post.title}</h2><p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">{articleExcerpt(post, 120)}</p><span className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-primary">Read more <ArrowUpRightIcon size={14} /></span></div>
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-card"><SearchIcon size={22} /></div><h2 className="mt-5 font-grotesk text-2xl font-bold text-slate-900">No stories found</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Try another search or reset the journal filters.</p><button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} className="btn btn-outline mt-6">Reset filters</button></div>
        )}

        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-primary-dark px-6 py-10 text-center text-white shadow-card-blue sm:px-10"><div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-secondary/30 blur-3xl" /><h2 className="relative font-grotesk text-2xl font-bold sm:text-3xl">Have a story to share?</h2><p className="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-white/75">Tell the community what you are learning, building, or exploring.</p><Button href="/contact" variant="outline" className="relative mt-7 border-white/40 text-white hover:bg-white hover:text-primary">Talk to the team</Button></div>
      </section>
    </main>
  );
};

export default BlogPage;
