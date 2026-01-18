import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ArrowLeftIcon, ShareIcon, EyeIcon, LoaderIcon } from 'lucide-react';
import { BlogService, BlogPost } from '../services';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (!slug) {
        console.log('BlogPostPage: No slug provided');
        return;
      }
      
      try {
        setLoading(true);
        console.log('BlogPostPage: Fetching blog post with slug:', slug);
        const response = await BlogService.getBlogPostBySlug(slug);
        console.log('BlogPostPage: Blog post fetched:', response);
        setPost(response);
        
        // Fetch related posts
        try {
          const relatedResponse = await BlogService.getRecentPosts();
          const filteredRelated = relatedResponse.items
            .filter(p => p.id !== response.id)
            .slice(0, 3);
          setRelatedPosts(filteredRelated);
        } catch (relatedError) {
          console.error('Error fetching related posts:', relatedError);
          setRelatedPosts([]);
        }
        
      } catch (err) {
        setError('Failed to load blog post');
        console.error('BlogPostPage: Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex justify-center items-center">
        <div className="flex items-center">
          <LoaderIcon className="animate-spin text-primary mr-3" size={40} />
          <span className="text-white/70">Loading blog post...</span>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-dark flex justify-center items-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Blog Post Not Found</h1>
          <p className="text-white/70 mb-6">{error || 'The blog post you are looking for does not exist.'}</p>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
          >
            <ArrowLeftIcon className="mr-2" size={20} />
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  // Get proper image URL (handle both absolute and relative URLs)
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    if (imageUrl.startsWith('http')) return imageUrl;
    // For backend uploads, use the backend URL
    return `${API_BASE_URL}${imageUrl}`;
  };

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero section */}
      <div className="relative h-96 md:h-[500px] flex items-end" style={{
        backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.3), rgba(18, 18, 18, 0.9)), url(${getImageUrl(post.image_url)})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link to="/blog" className="inline-flex items-center text-white/80 hover:text-white mb-6">
            <ArrowLeftIcon className="mr-2" size={20} />
            Back to Blog
          </Link>
          
          <div className="max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {post.title}
            </h1>
            
            {post.excerpt && (
              <p className="text-xl text-white/90 mb-8 max-w-3xl">
                {post.excerpt}
              </p>
            )}
            
            <div className="flex flex-wrap items-center gap-6 text-white/80">
              {post.author && (
                <div className="flex items-center">
                  <UserIcon className="mr-2" size={20} />
                  <span>{post.author}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <CalendarIcon className="mr-2" size={20} />
                <span>{new Date(post.created_at).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center">
                <EyeIcon className="mr-2" size={20} />
                <span>{post.views} views</span>
              </div>
              
              <div className={`px-3 py-1 rounded-full text-sm ${
                post.status === 'published' ? 'bg-green-500/20 text-green-300' :
                post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                'bg-gray-500/20 text-gray-300'
              }`}>
                {post.status}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="prose prose-invert prose-lg max-w-none">
            <div className="bg-dark-lighter rounded-lg p-8 border border-neutral/20">
              <div 
                className="text-white/90 leading-relaxed"
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {post.content}
              </div>
            </div>
          </div>

          {/* Article footer */}
          <div className="mt-12 pt-8 border-t border-neutral/20">
            <div className="flex flex-wrap justify-between items-center">
              <div className="flex items-center text-white/70 mb-4 md:mb-0">
                <ShareIcon className="mr-2" size={20} />
                <span className="mr-4">Share this post:</span>
                <div className="flex space-x-3">
                  <button className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                    </svg>
                  </button>
                  <button className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <div className="mt-12">
            <h3 className="text-2xl font-bold text-white mb-6">Comments</h3>
            <div className="bg-dark-lighter rounded-lg p-8 border border-neutral/20">
              <p className="text-white/60 text-center">Comments coming soon! Join our community to discuss this post.</p>
              <div className="text-center mt-6">
                <Link 
                  to="/communities" 
                  className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
                >
                  Join Community
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <div className="bg-dark-lighter py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Related Posts
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {relatedPosts.map(relatedPost => (
                <Link 
                  key={relatedPost.id} 
                  to={`/blog/${relatedPost.slug}`}
                  className="bg-dark rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300 border border-neutral/20 hover:border-primary/50"
                >
                  {relatedPost.image_url && (
                    <img 
                      src={getImageUrl(relatedPost.image_url)}
                      alt={relatedPost.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 line-clamp-2">{relatedPost.title}</h3>
                    <p className="text-white/70 text-sm mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                    <div className="flex items-center justify-between text-white/60 text-sm">
                      <div className="flex items-center">
                        <CalendarIcon size={16} className="mr-2" />
                        {new Date(relatedPost.created_at).toLocaleDateString()}
                      </div>
                      {relatedPost.author && (
                        <div className="flex items-center">
                          <UserIcon size={16} className="mr-1" />
                          {relatedPost.author}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPostPage;