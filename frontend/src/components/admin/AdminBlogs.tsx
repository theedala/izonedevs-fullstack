import { useState, useEffect } from 'react';
import { BlogService, BlogPost, BlogPostCreateData } from '../../services';
import Button from '../ui/Button';
import { PlusIcon, EditIcon, TrashIcon, EyeIcon, FileTextIcon } from 'lucide-react';

const AdminBlogs = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [formData, setFormData] = useState<BlogPostCreateData>({
    title: '',
    excerpt: '',
    content: '',
    image_url: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('Fetching blog posts for admin...');
      console.log('Auth token:', localStorage.getItem('access_token') ? 'Present' : 'Missing');
      const response = await BlogService.getBlogPosts({ page: 1, size: 50 });
      console.log('Blog posts fetched:', response);
      console.log('Number of posts:', response.items.length);
      setPosts(response.items);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
      alert('Error fetching blog posts. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting blog post data:', formData);
      if (editingPost) {
        const result = await BlogService.updateBlogPost(editingPost.id, formData);
        console.log('Blog post updated successfully:', result);
      } else {
        const result = await BlogService.createBlogPost(formData);
        console.log('Blog post created successfully:', result);
      }
      setShowForm(false);
      setEditingPost(null);
      resetForm();
      console.log('Refreshing blog posts list...');
      await fetchPosts();
      
      // Also trigger a refresh of the public blog page if it's open
      if (window.location.pathname.includes('/blog')) {
        window.location.reload();
      }
    } catch (error) {
      console.error('Error saving blog post:', error);
      // Show user-friendly error message
      if (error instanceof Error && error.message.includes('401')) {
        alert('Authentication error. Please log in as admin first.');
      } else if (error instanceof Error && error.message.includes('403')) {
        alert('Permission denied. Admin access required.');
      } else {
        alert('Error saving blog post. Please check the console for details.');
      }
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      image_url: post.image_url || '',
      status: post.status
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      try {
        await BlogService.deleteBlogPost(id);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting blog post:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      image_url: '',
      status: 'draft'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading blog posts...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Blog Posts</h2>
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="flex items-center"
        >
          <PlusIcon size={20} className="mr-2" />
          New Post
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                required
                placeholder="Your blog post title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <textarea
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={2}
                placeholder="Brief description or excerpt"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={10}
                required
                placeholder="Write your blog post content here..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Featured Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
              >
                {editingPost ? 'Update Post' : 'Create Post'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingPost(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="bg-dark border border-neutral/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{post.title}</h3>
                {post.excerpt && (
                  <p className="text-white/70 mb-3">{post.excerpt}</p>
                )}
                
                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                  <div className="flex items-center">
                    <FileTextIcon size={16} className="mr-1" />
                    {post.content.length} characters
                  </div>
                  <div className="flex items-center">
                    <EyeIcon size={16} className="mr-1" />
                    {post.views} views
                  </div>
                  <div>
                    Created: {new Date(post.created_at).toLocaleDateString()}
                  </div>
                  <div className={`px-2 py-1 rounded text-xs ${
                    post.status === 'published' ? 'bg-green-500/20 text-green-300' :
                    post.status === 'draft' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {post.status}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="p-2 text-primary hover:bg-primary/20 rounded"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="text-center py-8 text-white/70">
          No blog posts found. Create your first post!
        </div>
      )}
    </div>
  );
};

export default AdminBlogs;