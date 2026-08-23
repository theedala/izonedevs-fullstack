import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, CalendarDaysIcon } from '../ui/icons';
import { BlogService, BlogPost } from '../../services';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE_URL.replace('/api', '');

const getImageUrl = (imageUrl?: string) => {
  if (!imageUrl) return 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
  if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) return imageUrl;
  return `${BACKEND_URL}${imageUrl}`;
};

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-100" style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
    <div className="skeleton h-48 w-full" />
    <div className="p-6 flex flex-col gap-3">
      <div className="skeleton h-3 w-24 rounded" />
      <div className="skeleton h-5 w-full rounded" />
      <div className="skeleton h-5 w-4/5 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-4 w-20 rounded mt-1" />
    </div>
  </div>
);

const BlogPreview = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchRecentPosts(); }, []);

  const fetchRecentPosts = async () => {
    try {
      setLoading(true);
      const response = await BlogService.getRecentPosts();
      setPosts(response.items.slice(0, 3));
    } catch (error) {
      console.error('Error fetching recent blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <span className="inline-block text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-3">
              Blog
            </span>
            <h2 className="font-grotesk font-normal text-slate-500 text-3xl md:text-4xl leading-tight">Insights, tutorials</h2>
            <h2 className="font-grotesk font-black text-slate-900 text-3xl md:text-4xl leading-tight">&amp; community stories.</h2>
          </div>
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-sm font-grotesk font-semibold text-slate-400 hover:text-slate-700 transition-colors mb-1"
          >
            View all posts <ArrowRightIcon size={13} />
          </Link>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading
            ? [0, 1, 2].map(i => <SkeletonCard key={i} />)
            : posts.map((post, i) => (
                <motion.div
                  key={post.id}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col"
                  style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.45, delay: i * 0.08 }}
                  whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
                >
                  <div className="overflow-hidden h-48 relative">
                    <img
                      src={getImageUrl(post.image_url)}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => {
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-0 left-0 right-0 h-[3px] bg-secondary" />
                  </div>

                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-3 font-grotesk">
                      <CalendarDaysIcon size={11} />
                      <time dateTime={post.created_at}>
                        {new Date(post.created_at).toLocaleDateString('en-US', {
                          year: 'numeric', month: 'long', day: 'numeric',
                        })}
                      </time>
                    </div>

                    <h3 className="font-grotesk font-bold text-slate-900 text-base mb-2 line-clamp-2 leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
                      {post.excerpt}
                    </p>

                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-secondary hover:text-secondary/80 font-grotesk font-semibold text-sm transition-colors duration-200"
                    >
                      Read More <ArrowRightIcon size={13} />
                    </Link>
                  </div>
                </motion.div>
              ))}
        </div>

        {!loading && posts.length === 0 && (
          <div className="bg-white rounded-2xl p-16 text-center text-slate-400 text-sm font-grotesk border border-slate-100">
            No blog posts available yet.
          </div>
        )}

      </div>
    </section>
  );
};

export default BlogPreview;
