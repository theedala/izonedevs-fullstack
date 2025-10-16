import { useState, useEffect } from 'react';
import { PartnersService, Partner, PartnerCreateData } from '../../services';
import Button from '../ui/Button';
import { PlusIcon, EditIcon, TrashIcon, ExternalLinkIcon, StarIcon, EyeIcon, EyeOffIcon } from 'lucide-react';

const AdminPartners = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPartner, setEditingPartner] = useState<Partner | null>(null);
  const [formData, setFormData] = useState<PartnerCreateData>({
    name: '',
    description: '',
    logo_url: '',
    website_url: '',
    category: ''
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const response = await PartnersService.getPartners({ page: 1, size: 100 });
      setPartners(response.items);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPartner) {
        await PartnersService.updatePartner(editingPartner.id, formData);
      } else {
        await PartnersService.createPartner(formData);
      }
      setShowForm(false);
      setEditingPartner(null);
      resetForm();
      fetchPartners();
    } catch (error) {
      console.error('Error saving partner:', error);
    }
  };

  const handleEdit = (partner: Partner) => {
    setEditingPartner(partner);
    setFormData({
      name: partner.name,
      description: partner.description || '',
      logo_url: partner.logo_url || '',
      website_url: partner.website_url || '',
      category: partner.category || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this partner?')) {
      try {
        await PartnersService.deletePartner(id);
        fetchPartners();
      } catch (error) {
        console.error('Error deleting partner:', error);
      }
    }
  };

  const toggleFeatured = async (id: number) => {
    try {
      await PartnersService.toggleFeatured(id);
      fetchPartners();
    } catch (error) {
      console.error('Error toggling featured status:', error);
    }
  };

  const toggleActive = async (id: number) => {
    try {
      await PartnersService.toggleActive(id);
      fetchPartners();
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      logo_url: '',
      website_url: '',
      category: ''
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingPartner(null);
    resetForm();
  };

  if (loading) {
    return <div className="text-center py-8">Loading partners...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Partners</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center"
        >
          <PlusIcon size={16} className="mr-2" />
          Add Partner
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingPartner ? 'Edit Partner' : 'Add New Partner'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Partner Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                  placeholder="Partner name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                >
                  <option value="">Select category</option>
                  <option value="tech">Technology</option>
                  <option value="education">Education</option>
                  <option value="government">Government</option>
                  <option value="ngo">NGO</option>
                  <option value="corporate">Corporate</option>
                  <option value="startup">Startup</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={3}
                placeholder="Brief description of the partnership"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Logo URL</label>
                <input
                  type="url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Website URL</label>
                <input
                  type="url"
                  value={formData.website_url}
                  onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://partner-website.com"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
              >
                {editingPartner ? 'Update Partner' : 'Add Partner'}
              </button>
              <button 
                type="button" 
                onClick={handleCancel}
                className="px-6 py-2 bg-neutral text-white rounded-lg hover:bg-neutral/80 transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Partners List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {partners.map((partner) => (
          <div key={partner.id} className="bg-dark border border-neutral/30 rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center">
                {partner.logo_url && (
                  <img 
                    src={partner.logo_url} 
                    alt={partner.name}
                    className="w-12 h-12 object-contain mr-3 rounded bg-white/5 p-1"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <h3 className="font-bold text-lg">{partner.name}</h3>
                  {partner.category && (
                    <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                      {partner.category}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => toggleFeatured(partner.id)}
                  className={`p-2 rounded ${
                    partner.featured 
                      ? 'text-yellow-400 bg-yellow-400/20' 
                      : 'text-gray-400 hover:text-yellow-400'
                  }`}
                  title={partner.featured ? 'Remove from featured' : 'Mark as featured'}
                >
                  <StarIcon size={16} />
                </button>
                
                <button
                  onClick={() => toggleActive(partner.id)}
                  className={`p-2 rounded ${
                    partner.is_active 
                      ? 'text-green-400 bg-green-400/20' 
                      : 'text-red-400 bg-red-400/20'
                  }`}
                  title={partner.is_active ? 'Deactivate' : 'Activate'}
                >
                  {partner.is_active ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                </button>
              </div>
            </div>
            
            {partner.description && (
              <p className="text-white/70 text-sm mb-3 line-clamp-2">{partner.description}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {partner.website_url && (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:bg-primary/20 rounded"
                    title="Visit website"
                  >
                    <ExternalLinkIcon size={16} />
                  </a>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(partner)}
                  className="p-2 text-primary hover:bg-primary/20 rounded"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(partner.id)}
                  className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-white/50 mt-2">
              Created: {new Date(partner.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {partners.length === 0 && (
        <div className="text-center py-8 text-white/70">
          No partners found. Add your first partner!
        </div>
      )}
    </div>
  );
};

export default AdminPartners;