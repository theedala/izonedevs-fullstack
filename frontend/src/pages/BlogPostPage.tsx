import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, ArrowUpRightIcon, CalendarDaysIcon, EyeIcon, LoaderIcon, MessageCircleIcon, Share2Icon, UserRoundIcon } from '../components/ui/icons';
import { BlogService, BlogPost } from '../services';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE_URL.replace(/\/api\/?$/, '');
const fallbackImage = 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=1400&q=85';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) { setError('No blog post specified'); setLoading(false); return; }
      try {
        setLoading(true); setError(null);
        const response = await BlogService.getBlogPostBySlug(slug);
        setPost(response);
        try {
          const relatedResponse = await BlogService.getRecentPosts();
          setRelatedPosts(relatedResponse.items.filter(item => item.id !== response.id).slice(0, 3));
        } catch { setRelatedPosts([]); }
      } catch (err: any) {
        console.error('Error fetching blog post:', err);
        setError(err?.message || 'Failed to load blog post');
      } finally { setLoading(false); }
    };
    fetchPost();
  }, [slug]);

  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return fallbackImage;
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) return imageUrl;
    return `${BACKEND_URL}${imageUrl}`;
  };

  if (loading) return <div className="min-h-[70vh] bg-white flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><LoaderIcon className="animate-spin text-secondary" size={22} /><span className="text-sm font-medium">Loading story…</span></div></div>;
  if (error || !post) return <main className="min-h-[70vh] bg-slate-50 px-4 py-24"><div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card"><div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">!</div><h1 className="font-grotesk text-2xl font-bold text-slate-900">Story not found</h1><p className="mt-3 text-sm leading-6 text-slate-500">{error || 'The story you are looking for does not exist.'}</p><Link to="/blog" className="btn btn-primary mt-7 inline-flex items-center gap-2 bg-primary text-white"><ArrowLeftIcon size={16} /> Back to journal</Link></div></main>;

  const currentUrl = window.location.href;
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(post.title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${post.title} ${currentUrl}`)}`,
  };

  return <main className="min-h-screen bg-white"><section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 pb-12 pt-10 sm:px-6 lg:px-8"><div className="pointer-events-none absolute -right-28 -top-24 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl" /><div className="relative mx-auto max-w-5xl"><Link to="/blog" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary"><ArrowLeftIcon size={16} /> Back to journal</Link><div className="mt-10 max-w-4xl"><div className="flex flex-wrap items-center gap-3 text-[10px] font-bold uppercase tracking-[0.18em] text-secondary"><span>{post.featured ? 'Featured story' : 'Community notes'}</span><span className="h-1 w-1 rounded-full bg-slate-300" /><span>{post.status}</span></div><h1 className="mt-4 font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">{post.title}</h1>{post.excerpt && <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">{post.excerpt}</p>}<div className="mt-7 flex flex-wrap items-center gap-4 text-xs text-slate-500"><span className="inline-flex items-center gap-1.5"><UserRoundIcon size={15} className="text-primary" /> {post.author || 'iZonehub team'}</span><span className="inline-flex items-center gap-1.5"><CalendarDaysIcon size={15} className="text-primary" /> {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span><span className="inline-flex items-center gap-1.5"><EyeIcon size={15} className="text-primary" /> {post.views} views</span></div></div></div></section><section className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"><div className="overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-card"><img src={getImageUrl(post.image_url)} alt={post.title} className="max-h-[520px] w-full object-cover" onError={event => { event.currentTarget.src = fallbackImage; }} /></div><div className="mx-auto mt-10 max-w-3xl"><article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-10"><div className="whitespace-pre-wrap text-base leading-8 text-slate-700">{post.content}</div></article><div className="mt-8 flex flex-col gap-4 border-y border-slate-100 py-6 sm:flex-row sm:items-center sm:justify-between"><div className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500"><Share2Icon size={17} className="text-primary" /> Share this story</div><div className="flex gap-2"><a href={shareUrls.twitter} target="_blank" rel="noopener noreferrer" aria-label="Share on X" className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-primary/30 hover:text-primary">X</a><a href={shareUrls.facebook} target="_blank" rel="noopener noreferrer" aria-label="Share on Facebook" className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-primary/30 hover:text-primary">Facebook</a><a href={shareUrls.linkedin} target="_blank" rel="noopener noreferrer" aria-label="Share on LinkedIn" className="rounded-full border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 transition hover:border-primary/30 hover:text-primary">LinkedIn</a><a href={shareUrls.whatsapp} target="_blank" rel="noopener noreferrer" aria-label="Share on WhatsApp" className="rounded-full border border-emerald-200 px-3 py-2 text-xs font-bold text-emerald-700 transition hover:bg-emerald-50"><MessageCircleIcon size={14} /></a></div></div><div className="mt-8 rounded-3xl bg-gradient-to-br from-primary to-primary-dark p-7 text-white shadow-card-blue sm:p-8"><h2 className="font-grotesk text-2xl font-bold">Keep the conversation going.</h2><p className="mt-2 max-w-xl text-sm leading-6 text-white/75">Join the iZonehub community to share what you are learning and connect with other builders.</p><Link to="/communities" className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white transition hover:bg-white hover:text-primary">Join the community <ArrowUpRightIcon size={16} /></Link></div></div></section>{relatedPosts.length > 0 && <section className="border-t border-slate-100 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8"><div className="mx-auto max-w-5xl"><div className="flex items-end justify-between gap-4"><div><span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.18em] text-secondary">Continue reading</span><h2 className="mt-2 font-grotesk text-3xl font-bold text-slate-900">More from the journal</h2></div><Link to="/blog" className="hidden items-center gap-1 text-sm font-bold text-primary sm:inline-flex">All stories <ArrowUpRightIcon size={15} /></Link></div><div className="mt-7 grid gap-5 md:grid-cols-3">{relatedPosts.map(relatedPost => <Link key={relatedPost.id} to={`/blog/${relatedPost.slug}`} className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-card-hover"><img src={getImageUrl(relatedPost.image_url)} alt={relatedPost.title} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" onError={event => { event.currentTarget.src = fallbackImage; }} /><div className="p-5"><p className="text-[10px] font-bold uppercase tracking-wider text-secondary">{new Date(relatedPost.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p><h3 className="mt-2 font-grotesk text-lg font-bold leading-snug text-slate-900 transition group-hover:text-primary">{relatedPost.title}</h3><span className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-primary">Read more <ArrowUpRightIcon size={13} /></span></div></Link>)}</div></div></section>}</main>;
};

export default BlogPostPage;
