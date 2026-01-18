import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ArrowLeftIcon, ShareIcon, EyeIcon, LoaderIcon } from 'lucide-react';
import { BlogService, BlogPost } from '../services';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
const BACKEND_URL = API_BASE_URL.replace('/api', '');

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
        setError('No blog post specified');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        console.log('BlogPostPage: Fetching blog post with slug:', slug);
        const response = await BlogService.getBlogPostBySlug(slug);
        console.log('BlogPostPage: Blog post fetched successfully:', response);
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
        
      } catch (err: any) {
        const errorMessage = err?.message || 'Failed to load blog post';
        setError(errorMessage);
        console.error('BlogPostPage: Error fetching blog post:', err);
        console.error('BlogPostPage: Error details:', {
          message: err?.message,
          status: err?.status,
          slug: slug
        });
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
    // If it's a data URL or external URL, use it directly
    if (imageUrl.startsWith('data:') || imageUrl.startsWith('http')) return imageUrl;
    // For backend uploads (legacy), use the backend URL without /api
    return `${BACKEND_URL}${imageUrl}`;
  };

  // Get current page URL for sharing
  const currentUrl = window.location.href;
  const encodedUrl = encodeURIComponent(currentUrl);
  const encodedTitle = encodeURIComponent(post.title);
  const encodedExcerpt = encodeURIComponent(post.excerpt || post.title);

  // Social media share URLs
  const shareUrls = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    whatsapp: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`
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
                  {/* Twitter/X */}
                  <a 
                    href={shareUrls.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-dark-lighter rounded-full hover:bg-blue-400/20 hover:text-blue-400 transition-all duration-300"
                    title="Share on Twitter"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                  
                  {/* Facebook */}
                  <a 
                    href={shareUrls.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-dark-lighter rounded-full hover:bg-blue-600/20 hover:text-blue-600 transition-all duration-300"
                    title="Share on Facebook"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 3.667h-3.533v7.98H9.101z"/>
                    </svg>
                  </a>
                  
                  {/* LinkedIn */}
                  <a 
                    href={shareUrls.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-dark-lighter rounded-full hover:bg-blue-700/20 hover:text-blue-700 transition-all duration-300"
                    title="Share on LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.19a.66.66 0 000 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/>
                    </svg>
                  </a>
                  
                  {/* WhatsApp */}
                  <a 
                    href={shareUrls.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-dark-lighter rounded-full hover:bg-green-500/20 hover:text-green-500 transition-all duration-300"
                    title="Share on WhatsApp"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
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