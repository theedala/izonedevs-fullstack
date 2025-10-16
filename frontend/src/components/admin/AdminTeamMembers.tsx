import { useState, useEffect } from 'react';
import { TeamMembersService, TeamMember, TeamMemberCreateData } from '../../services';
import Button from '../ui/Button';
import { PlusIcon, EditIcon, TrashIcon, UserIcon, GithubIcon, LinkedinIcon, TwitterIcon, MailIcon, EyeIcon, EyeOffIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';

const AdminTeamMembers = () => {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [formData, setFormData] = useState<TeamMemberCreateData>({
    name: '',
    role: '',
    bio: '',
    image_url: '',
    email: '',
    github_url: '',
    linkedin_url: '',
    twitter_url: '',
    order_priority: 0
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await TeamMembersService.getTeamMembers({ page: 1, size: 100 });
      setMembers(response.items);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMember) {
        await TeamMembersService.updateTeamMember(editingMember.id, formData);
      } else {
        await TeamMembersService.createTeamMember(formData);
      }
      setShowForm(false);
      setEditingMember(null);
      resetForm();
      fetchMembers();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleEdit = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role,
      bio: member.bio || '',
      image_url: member.image_url || '',
      email: member.email || '',
      github_url: member.github_url || '',
      linkedin_url: member.linkedin_url || '',
      twitter_url: member.twitter_url || '',
      order_priority: member.order_priority
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this team member?')) {
      try {
        await TeamMembersService.deleteTeamMember(id);
        fetchMembers();
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  const toggleActive = async (id: number) => {
    try {
      await TeamMembersService.toggleActive(id);
      fetchMembers();
    } catch (error) {
      console.error('Error toggling active status:', error);
    }
  };

  const updateOrder = async (id: number, newOrder: number) => {
    try {
      await TeamMembersService.updateOrder(id, newOrder);
      fetchMembers();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      role: '',
      bio: '',
      image_url: '',
      email: '',
      github_url: '',
      linkedin_url: '',
      twitter_url: '',
      order_priority: 0
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingMember(null);
    resetForm();
  };

  if (loading) {
    return <div className="text-center py-8">Loading team members...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Team Members</h2>
        <Button 
          onClick={() => setShowForm(true)}
          className="flex items-center"
        >
          <PlusIcon size={16} className="mr-2" />
          Add Team Member
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingMember ? 'Edit Team Member' : 'Add New Team Member'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Role/Position *</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                  placeholder="Lead Developer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Bio</label>
              <textarea
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={4}
                placeholder="Brief bio or description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Profile Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://example.com/photo.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://github.com/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">LinkedIn URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Twitter URL</label>
                <input
                  type="url"
                  value={formData.twitter_url}
                  onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://twitter.com/username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Display Order (higher numbers appear first)</label>
              <input
                type="number"
                value={formData.order_priority}
                onChange={(e) => setFormData({ ...formData, order_priority: parseInt(e.target.value) || 0 })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="0"
              />
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
              >
                {editingMember ? 'Update Member' : 'Add Member'}
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

      {/* Team Members List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {members.map((member) => (
          <div key={member.id} className="bg-dark border border-neutral/30 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center">
                {member.image_url ? (
                  <img 
                    src={member.image_url} 
                    alt={member.name}
                    className="w-16 h-16 object-cover rounded-full mr-4"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      target.nextElementSibling?.classList.remove('hidden');
                    }}
                  />
                ) : (
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mr-4">
                    <UserIcon size={24} className="text-primary" />
                  </div>
                )}
                
                <div>
                  <h3 className="font-bold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm">{member.role}</p>
                  <div className="flex items-center mt-1 text-xs text-white/60">
                    <span>Order: {member.order_priority}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => toggleActive(member.id)}
                  className={`p-2 rounded ${
                    member.is_active 
                      ? 'text-green-400 bg-green-400/20' 
                      : 'text-red-400 bg-red-400/20'
                  }`}
                  title={member.is_active ? 'Deactivate' : 'Activate'}
                >
                  {member.is_active ? <EyeIcon size={16} /> : <EyeOffIcon size={16} />}
                </button>
              </div>
            </div>
            
            {member.bio && (
              <p className="text-white/70 text-sm mb-4 line-clamp-3">{member.bio}</p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex space-x-2">
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="p-2 text-primary hover:bg-primary/20 rounded"
                    title="Send email"
                  >
                    <MailIcon size={16} />
                  </a>
                )}
                {member.github_url && (
                  <a
                    href={member.github_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:bg-primary/20 rounded"
                    title="GitHub"
                  >
                    <GithubIcon size={16} />
                  </a>
                )}
                {member.linkedin_url && (
                  <a
                    href={member.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:bg-primary/20 rounded"
                    title="LinkedIn"
                  >
                    <LinkedinIcon size={16} />
                  </a>
                )}
                {member.twitter_url && (
                  <a
                    href={member.twitter_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-primary hover:bg-primary/20 rounded"
                    title="Twitter"
                  >
                    <TwitterIcon size={16} />
                  </a>
                )}
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => updateOrder(member.id, member.order_priority + 1)}
                  className="p-2 text-blue-400 hover:bg-blue-400/20 rounded"
                  title="Increase order"
                >
                  <ArrowUpIcon size={16} />
                </button>
                <button
                  onClick={() => updateOrder(member.id, Math.max(0, member.order_priority - 1))}
                  className="p-2 text-blue-400 hover:bg-blue-400/20 rounded"
                  title="Decrease order"
                >
                  <ArrowDownIcon size={16} />
                </button>
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 text-primary hover:bg-primary/20 rounded"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            
            <div className="text-xs text-white/50 mt-3">
              Created: {new Date(member.created_at).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      {members.length === 0 && (
        <div className="text-center py-8 text-white/70">
          No team members found. Add your first team member!
        </div>
      )}
    </div>
  );
};

export default AdminTeamMembers;