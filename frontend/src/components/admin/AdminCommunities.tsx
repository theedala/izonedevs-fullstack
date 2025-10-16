import { useState, useEffect } from 'react';
import { CommunitiesService, Community, CommunityCreateData } from '../../services';
import Button from '../ui/Button';
import { PlusIcon, EditIcon, TrashIcon, UsersIcon } from 'lucide-react';

const AdminCommunities = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState<Community | null>(null);
  const [formData, setFormData] = useState<CommunityCreateData>({
    name: '',
    description: '',
    category: '',
    image_url: ''
  });

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      const response = await CommunitiesService.getCommunities({ page: 1, size: 50 });
      setCommunities(response.items);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCommunity) {
        await CommunitiesService.updateCommunity(editingCommunity.id, formData);
      } else {
        await CommunitiesService.createCommunity(formData);
      }
      setShowForm(false);
      setEditingCommunity(null);
      resetForm();
      fetchCommunities();
    } catch (error) {
      console.error('Error saving community:', error);
    }
  };

  const handleEdit = (community: Community) => {
    setEditingCommunity(community);
    setFormData({
      name: community.name,
      description: community.description,
      category: community.category,
      image_url: community.image_url || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this community?')) {
      try {
        await CommunitiesService.deleteCommunity(id);
        fetchCommunities();
      } catch (error) {
        console.error('Error deleting community:', error);
      }
    }
  };

  const toggleActive = async (id: number, isActive: boolean) => {
    try {
      await CommunitiesService.toggleActive(id, !isActive);
      fetchCommunities();
    } catch (error) {
      console.error('Error toggling community status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      image_url: ''
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading communities...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Communities</h2>
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="flex items-center"
        >
          <PlusIcon size={20} className="mr-2" />
          New Community
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingCommunity ? 'Edit Community' : 'Create New Community'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                  placeholder="Community name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                >
                  <option value="">Select Category</option>
                  <option value="technology">Technology</option>
                  <option value="maker">Maker Space</option>
                  <option value="programming">Programming</option>
                  <option value="hardware">Hardware</option>
                  <option value="design">Design</option>
                  <option value="entrepreneurship">Entrepreneurship</option>
                  <option value="education">Education</option>
                  <option value="social">Social</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={4}
                required
                placeholder="Community description and purpose"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
              >
                {editingCommunity ? 'Update Community' : 'Create Community'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingCommunity(null);
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {communities.map((community) => (
          <div key={community.id} className="bg-dark border border-neutral/30 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-start space-x-4 flex-1">
                {community.image_url && (
                  <img 
                    src={community.image_url} 
                    alt={community.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                
                <div className="flex-1">
                  <h3 className="text-lg font-bold mb-2">{community.name}</h3>
                  <p className="text-white/70 mb-3 line-clamp-2">{community.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-white/60">
                      <span className="bg-secondary/20 text-secondary px-2 py-1 rounded text-xs capitalize">
                        {community.category}
                      </span>
                      <div className="flex items-center">
                        <UsersIcon size={16} className="mr-1" />
                        {community.member_count} members
                      </div>
                    </div>
                    
                    <button
                      onClick={() => toggleActive(community.id, community.is_active)}
                      className={`px-3 py-1 rounded text-xs font-medium ${
                        community.is_active 
                          ? 'bg-green-500/20 text-green-300 hover:bg-green-500/30' 
                          : 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30'
                      } transition-colors`}
                    >
                      {community.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  
                  <div className="text-xs text-white/50 mt-2">
                    Created: {new Date(community.created_at).toLocaleDateString()}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(community)}
                  className="p-2 text-primary hover:bg-primary/20 rounded"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(community.id)}
                  className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="text-center py-8 text-white/70">
          <UsersIcon size={48} className="mx-auto mb-4 opacity-50" />
          No communities found. Create your first community!
        </div>
      )}
    </div>
  );
};

export default AdminCommunities;