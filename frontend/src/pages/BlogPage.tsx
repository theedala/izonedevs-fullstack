import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle';
import { CalendarIcon, UserIcon, SearchIcon, TagIcon, LoaderIcon } from 'lucide-react';
import { BlogService, BlogPost } from '../services';

const BlogPage = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('BlogPage: Fetching published posts...');
      const response = await BlogService.getBlogPosts({ 
        page: 1, 
        size: 20,
        status: 'published'
      });
      console.log('BlogPage: Received response:', response);
      console.log('BlogPage: Number of published posts:', response.items.length);
      setPosts(response.items);
    } catch (err) {
      setError('Failed to load blog posts');
      console.error('Error fetching blog posts:', err);
    } finally {
      setLoading(false);
    }
  };

  // Create mock categories for filtering since the API doesn't have categories yet
  const allCategories = ['all', 'tutorials', 'hardware', 'software', 'ai', 'design', 'events', 'community', 'trends', 'iot', 'research'];
  
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex justify-center items-center">
        <div className="flex items-center">
          <LoaderIcon className="animate-spin text-primary mr-3" size={40} />
          <span className="text-white/70">Loading blog posts...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <div className="text-red-400 mb-4">⚠️ {error}</div>
            <button 
              onClick={fetchPosts}
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="iZonehub Blog" subtitle="Stay updated with the latest news, tutorials, and insights from the iZonehub community." />
        
        {/* Search and filters */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-2">
              {allCategories.map(category => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm capitalize transition-all duration-300 ${
                    activeCategory === category
                      ? 'bg-primary text-white'
                      : 'bg-dark-lighter text-white/70 hover:bg-dark-light'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:border-primary"
              />
              <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
          </div>
        </div>

        {/* Featured post */}
        {filteredPosts.length > 0 && (
          <div className="mb-12">
            <Link to={`/blog/${filteredPosts[0].id}`} className="block">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-dark-lighter rounded-lg overflow-hidden border border-neutral/20 hover:border-primary/40 transition-all duration-300">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img 
                    src={filteredPosts[0].image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                    alt={filteredPosts[0].title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
                  />
                </div>
                <div className="p-8 flex flex-col">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs capitalize">
                      {filteredPosts[0].status}
                    </span>
                    {filteredPosts[0].featured && (
                      <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-xs">
                        Featured
                      </span>
                    )}
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    {filteredPosts[0].title}
                  </h2>
                  <p className="text-white/70 mb-6">
                    {filteredPosts[0].excerpt || filteredPosts[0].content.substring(0, 150) + '...'}
                  </p>
                  <div className="flex items-center mt-auto">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center mr-4">
                      <UserIcon size={20} />
                    </div>
                    <div>
                      <p className="font-medium">Author #{filteredPosts[0].author_id}</p>
                      <div className="flex items-center text-sm text-white/60">
                        <CalendarIcon size={14} className="mr-1" />
                        <time dateTime={filteredPosts[0].created_at}>
                          {new Date(filteredPosts[0].created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </time>
                        <span className="mx-2">•</span>
                        <span>{filteredPosts[0].views} views</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* Blog posts grid */}
        {filteredPosts.length > 1 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.slice(1).map(post => (
              <article key={post.id} className="card hover:transform hover:-translate-y-1 hover:shadow-neon-sm">
                <Link to={`/blog/${post.id}`} className="block">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={post.title} 
                      className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
                    />
                    <div className="absolute top-4 right-4 bg-dark-lighter/80 backdrop-blur-sm text-white/80 text-xs px-3 py-1 rounded-full">
                      {post.views} views
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs capitalize flex items-center">
                        <TagIcon size={12} className="mr-1" />
                        {post.status}
                      </span>
                      {post.featured && (
                        <span className="bg-secondary/20 text-secondary px-2 py-1 rounded-full text-xs">
                          Featured
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                    <p className="text-white/70 mb-4 line-clamp-3">
                      {post.excerpt || post.content.substring(0, 120) + '...'}
                    </p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center mr-2">
                          <UserIcon size={16} />
                        </div>
                        <span className="text-sm">Author #{post.author_id}</span>
                      </div>
                      <div className="flex items-center text-sm text-white/60">
                        <CalendarIcon size={14} className="mr-1" />
                        <time dateTime={post.created_at}>
                          {new Date(post.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </time>
                      </div>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-dark rounded-full mb-4">
              <SearchIcon size={24} className="text-white/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No articles found</h3>
            <p className="text-white/70 mb-6">
              {searchQuery 
                ? "We couldn't find any articles matching your search criteria." 
                : "No articles have been published yet."}
            </p>
            <button
              onClick={() => {
                setActiveCategory('all');
                setSearchQuery('');
              }}
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default BlogPage;