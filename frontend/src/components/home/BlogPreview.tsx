import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';
import { BlogService, BlogPost } from '../../services';

const BlogPreview = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRecentPosts();
  }, []);

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

  if (loading) {
    return (
      <section className="py-16 bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-white/70">Loading latest blog posts...</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-dark-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Latest from Our Blog
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Stay updated with our latest insights, tutorials, and community stories.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <div key={post.id} className="bg-dark-lighter rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300">
              <img 
                src={post.image_url || 'https://images.unsplash.com/photo-1553406830-ef2513450d76?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                alt={post.title} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-white/60 mb-3">
                  <CalendarIcon className="w-4 h-4 mr-2" />
                  <time dateTime={post.created_at}>
                    {new Date(post.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <h3 className="text-xl font-semibold text-white mb-3 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-white/70 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link to={`/blog/${post.id}`} className="inline-flex items-center text-orange-400 hover:text-orange-300 font-medium transition-colors">
                  Read More
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {posts.length === 0 && !loading && (
          <div className="text-center text-white/70">
            No blog posts available yet.
          </div>
        )}

        <div className="text-center mt-12">
          <Link to="/blog" className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-colors">
            View All Posts
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;