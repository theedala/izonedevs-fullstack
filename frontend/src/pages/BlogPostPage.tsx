import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CalendarIcon, UserIcon, ClockIcon, TagIcon, ArrowLeftIcon, ShareIcon, FacebookIcon, TwitterIcon, LinkedinIcon, LoaderIcon } from 'lucide-react';
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
      
      console.log('BlogPostPage: Attempting to fetch post with slug:', slug);
      
      try {
        setLoading(true);
        
        // Try to fetch by slug first, then by ID if slug is numeric
        let response: BlogPost;
        try {
          console.log('BlogPostPage: Trying to fetch by slug...');
          response = await BlogService.getBlogPostBySlug(slug);
          console.log('BlogPostPage: Successfully fetched by slug:', response);
        } catch (slugError) {
          console.log('BlogPostPage: Slug fetch failed:', slugError);
          // If slug fails, try to fetch by ID (in case slug is actually an ID)
          if (!isNaN(Number(slug))) {
            console.log('BlogPostPage: Trying to fetch by ID...');
            response = await BlogService.getBlogPost(parseInt(slug));
            console.log('BlogPostPage: Successfully fetched by ID:', response);
          } else {
            console.log('BlogPostPage: Slug is not numeric, throwing error');
            throw new Error('Blog post not found');
          }
        }
        
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
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-400 mb-4">⚠️ {error || 'Blog post not found'}</div>
            <Link 
              to="/blog"
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Back to Blog
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get proper image URL (handle both absolute and relative URLs)
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) return 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    return imageUrl.startsWith('http') ? imageUrl : `${window.location.origin}${imageUrl}`;
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
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Blog
          </Link>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm capitalize">
              {post.status === 'published' ? 'Published' : post.status}
            </span>
            {post.featured && (
              <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm">
                Featured
              </span>
            )}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{post.title}</h1>
          <div className="flex flex-wrap items-center gap-6">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                <UserIcon size={20} className="text-primary" />
              </div>
              <div>
                <p className="font-medium">Author #{post.author_id}</p>
              </div>
            </div>
            <div className="flex items-center text-white/70">
              <CalendarIcon size={18} className="mr-2" />
              <time dateTime={post.created_at}>
                {new Date(post.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </time>
            </div>
            <div className="flex items-center text-white/70">
              <UserIcon size={18} className="mr-2" />
              <span>{post.views} views</span>
            </div>
      
      {/* Article content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            {post.excerpt && (
              <div className="text-xl text-white/80 leading-relaxed mb-8 p-6 bg-dark-lighter rounded-lg border-l-4 border-primary">
                {post.excerpt}
              </div>
            )}
            
            <article className="prose prose-invert prose-lg max-w-none">
              <div 
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </article>

            {/* Tags/Categories */}
            <div className="mt-12 pt-8 border-t border-neutral/20">
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm">
                  Blog Post
                </span>
                <span className="bg-secondary/20 text-secondary px-3 py-1 rounded-full text-sm">
                  {post.status === 'published' ? 'Published' : post.status}
                </span>
              </div>
            </div>

            {/* Share buttons */}
            <div className="mt-8 pt-8 border-t border-neutral/20">
              <h3 className="text-lg font-semibold mb-4">Share this article</h3>
              <div className="flex space-x-4">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-dark-lighter hover:bg-primary/20 rounded-lg transition-colors duration-300">
                  <TwitterIcon size={20} />
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-dark-lighter hover:bg-primary/20 rounded-lg transition-colors duration-300">
                  <FacebookIcon size={20} />
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} target="_blank" rel="noopener noreferrer" className="p-3 bg-dark-lighter hover:bg-primary/20 rounded-lg transition-colors duration-300">
                  <LinkedinIcon size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author info */}
            <div className="bg-dark-lighter rounded-lg p-6 mb-8">
              <h3 className="text-lg font-bold mb-4">About the Author</h3>
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-4">
                  <UserIcon size={24} className="text-primary" />
                </div>
                <div>
                  <p className="font-semibold">Author #{post.author_id}</p>
                  <p className="text-white/70 text-sm">Content Creator</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">
                Creating valuable content for the iZonehub community.
              </p>
            </div>

            {/* Post metadata */}
            <div className="bg-dark-lighter rounded-lg p-6">
              <h3 className="text-lg font-bold mb-4">Post Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/70">Published:</span>
                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                </div>
                {post.updated_at && (
                  <div className="flex justify-between">
                    <span className="text-white/70">Updated:</span>
                    <span>{new Date(post.updated_at).toLocaleDateString()}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-white/70">Views:</span>
                  <span>{post.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Status:</span>
                  <span className="capitalize">{post.status}</span>
                </div>
              </div>
            </div>
          </div>
      
      {/* Related articles */}
      {relatedPosts && relatedPosts.length > 0 && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-neutral/20">
          <h2 className="text-3xl font-bold mb-8">Related Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedPosts.map(relatedPost => (
              <Link 
                key={relatedPost.id} 
                to={`/blog/${relatedPost.slug}`}
                className="bg-dark-lighter rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
              >
                {relatedPost.image_url && (
                  <img 
                    src={relatedPost.image_url.startsWith('http') ? relatedPost.image_url : `${API_BASE_URL}${relatedPost.image_url}`}
                    alt={relatedPost.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                  <p className="text-white/70 text-sm mb-4 line-clamp-3">{relatedPost.excerpt}</p>
                  <div className="flex items-center text-white/60 text-sm">
                    <CalendarIcon size={16} className="mr-2" />
                    {new Date(relatedPost.created_at).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
            {/* Article footer */}
            <div className="mt-12 pt-8 border-t border-neutral/20">
              <div className="flex flex-wrap justify-between items-center">
                <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
                  {post.categories.map((category, index) => <Link key={index} to={`/blog?category=${category}`} className="bg-dark-lighter text-white/80 hover:bg-primary/20 hover:text-primary px-3 py-1 rounded-full text-sm capitalize transition-all duration-300 flex items-center">
                      <TagIcon size={14} className="mr-1" />
                      {category}
                    </Link>)}
                </div>
                <div className="flex items-center">
                  <span className="mr-3 text-white/70">Share:</span>
                  <div className="flex space-x-2">
                    <a href="#" className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                      <FacebookIcon size={18} />
                    </a>
                    <a href="#" className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                      <TwitterIcon size={18} />
                    </a>
                    <a href="#" className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                      <LinkedinIcon size={18} />
                    </a>
                    <a href="#" className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300">
                      <ShareIcon size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* Author bio */}
            <div className="mt-12 bg-dark-lighter p-8 rounded-lg border border-neutral/20">
              <div className="flex items-start">
                <img src={post.authorImage} alt={post.author} className="w-16 h-16 rounded-full object-cover mr-6" />
                <div>
                  <h3 className="text-xl font-bold mb-2">
                    About {post.author}
                  </h3>
                  <p className="text-white/70 mb-4">{post.authorBio}</p>
                  <Link to={`/blog?author=${encodeURIComponent(post.author)}`} className="text-primary hover:text-primary/80">
                    View all posts by {post.author.split(' ')[0]}
                  </Link>
                </div>
              </div>
            </div>
            {/* Related articles */}
            {relatedPosts.length > 0 && <div className="mt-16">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedPosts.map(relatedPost => <Link key={relatedPost.id} to={`/blog/${relatedPost.id}`} className="bg-dark-lighter rounded-lg overflow-hidden border border-neutral/20 hover:border-primary/40 transition-all duration-300">
                      <div className="h-48 overflow-hidden">
                        <img src={relatedPost.image} alt={relatedPost.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      </div>
                      <div className="p-6">
                        <h3 className="text-xl font-bold mb-2">
                          {relatedPost.title}
                        </h3>
                        <p className="text-white/70 line-clamp-2">
                          {relatedPost.excerpt}
                        </p>
                      </div>
                    </Link>)}
                </div>
              </div>}
          </div>
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {/* Table of contents would go here - simplified for now */}
              <div className="bg-dark-lighter rounded-lg border border-neutral/20 overflow-hidden mb-8">
                <div className="p-6 border-b border-neutral/20">
                  <h3 className="text-xl font-bold">Table of Contents</h3>
                </div>
                <div className="p-6">
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        What is Arduino?
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        Why Arduino?
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        Getting Started
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        Your First Arduino Project
                      </a>
                      <ul className="ml-4 mt-2 space-y-2">
                        <li>
                          <a href="#" className="text-white/70 hover:text-primary">
                            Step 1: Set up your hardware
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-white/70 hover:text-primary">
                            Step 2: Write your code
                          </a>
                        </li>
                        <li>
                          <a href="#" className="text-white/70 hover:text-primary">
                            Step 3: Upload your code
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#" className="text-white/70 hover:text-primary">
                        Next Steps
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              {/* Join community */}
              <div className="bg-dark-lighter rounded-lg border border-neutral/20 overflow-hidden">
                <div className="p-6 border-b border-neutral/20">
                  <h3 className="text-xl font-bold">Join Our Community</h3>
                </div>
                <div className="p-6">
                  <p className="text-white/70 mb-6">
                    Interested in learning more about {post.categories[0]}? Join
                    our community at iZonehub Makerspace!
                  </p>
                  <Link to="/communities#join" className="inline-flex items-center justify-center w-full px-6 py-2 rounded-full bg-primary text-white hover:shadow-neon transition-all duration-300">
                    Join Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default BlogPostPage;