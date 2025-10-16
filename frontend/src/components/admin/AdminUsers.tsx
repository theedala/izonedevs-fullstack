import { useState, useEffect } from 'react';
import { UserService, User } from '../../services';
import { UserIcon, EditIcon, TrashIcon, ShieldIcon, CrownIcon, UserCheckIcon } from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showEditForm, setShowEditForm] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUsers({ page: 1, size: 100 });
      setUsers(response.items);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: number, newRole: string) => {
    try {
      await UserService.updateUserRole(userId, newRole);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      try {
        await UserService.deleteUser(userId);
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowEditForm(true);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await UserService.updateUser(editingUser.id, {
        email: editingUser.email,
        full_name: editingUser.full_name
      });
      setShowEditForm(false);
      setEditingUser(null);
      fetchUsers();
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = !roleFilter || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <CrownIcon size={16} className="text-yellow-400" />;
      case 'moderator':
        return <ShieldIcon size={16} className="text-blue-400" />;
      default:
        return <UserCheckIcon size={16} className="text-green-400" />;
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'moderator':
        return 'bg-blue-500/20 text-blue-300';
      default:
        return 'bg-green-500/20 text-green-300';
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading users...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Users</h2>
        <div className="text-sm text-white/60">
          Total Users: {users.length}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-dark border border-neutral/30 rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Search Users</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
              placeholder="Search by name, email, or username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Filter by Role</label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="moderator">Moderator</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>
      </div>

      {/* Edit User Form */}
      {showEditForm && editingUser && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Edit User</h3>
          
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={editingUser.full_name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="Full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
              >
                Update User
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowEditForm(false);
                  setEditingUser(null);
                }}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Users List */}
      <div className="bg-dark border border-neutral/30 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark-lighter border-b border-neutral/30">
              <tr>
                <th className="text-left px-6 py-3 font-medium">User</th>
                <th className="text-left px-6 py-3 font-medium">Role</th>
                <th className="text-left px-6 py-3 font-medium">Status</th>
                <th className="text-left px-6 py-3 font-medium">Joined</th>
                <th className="text-right px-6 py-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-b border-neutral/30 hover:bg-dark-lighter">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                        <UserIcon size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{user.full_name || 'No name set'}</div>
                        <div className="text-sm text-white/60">{user.email}</div>
                        {user.username && (
                          <div className="text-xs text-white/50">@{user.username}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      {getRoleIcon(user.role)}
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={`ml-2 px-2 py-1 rounded text-xs border-none bg-transparent ${getRoleBadgeColor(user.role)}`}
                      >
                        <option value="member" className="bg-dark text-white">Member</option>
                        <option value="moderator" className="bg-dark text-white">Moderator</option>
                        <option value="admin" className="bg-dark text-white">Admin</option>
                      </select>
                    </div>
                  </td>
                  
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs ${
                      user.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 text-sm text-white/60">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  
                  <td className="px-6 py-4">
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => handleEditUser(user)}
                        className="p-2 text-primary hover:bg-primary/20 rounded"
                        title="Edit user"
                      >
                        <EditIcon size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                        title="Delete user"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-8 text-white/70">
          {searchTerm || roleFilter ? (
            <div>
              <UserIcon size={48} className="mx-auto mb-4 opacity-50" />
              No users found matching your filters.
            </div>
          ) : (
            <div>
              <UserIcon size={48} className="mx-auto mb-4 opacity-50" />
              No users found.
            </div>
          )}
        </div>
      )}
      
      {/* User Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-dark border border-neutral/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-primary">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="text-sm text-white/60">Admins</div>
        </div>
        
        <div className="bg-dark border border-neutral/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-400">
            {users.filter(u => u.role === 'moderator').length}
          </div>
          <div className="text-sm text-white/60">Moderators</div>
        </div>
        
        <div className="bg-dark border border-neutral/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-400">
            {users.filter(u => u.role === 'member').length}
          </div>
          <div className="text-sm text-white/60">Members</div>
        </div>
        
        <div className="bg-dark border border-neutral/30 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-400">
            {users.filter(u => u.is_active).length}
          </div>
          <div className="text-sm text-white/60">Active Users</div>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;