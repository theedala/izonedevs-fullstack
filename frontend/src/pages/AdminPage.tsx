import { useState, useEffect } from 'react';
import { authManager, User, UserService, EventsService, BlogService, StoreService } from '../services';
import { Navigate } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle';
import AdminEvents from '../components/admin/AdminEvents';
import AdminBlogs from '../components/admin/AdminBlogs';
import AdminGallery from '../components/admin/AdminGallery';
import AdminProjects from '../components/admin/AdminProjects';
import AdminStore from '../components/admin/AdminStore';
import AdminUsers from '../components/admin/AdminUsers';
import AdminCommunities from '../components/admin/AdminCommunities';
import AdminContacts from '../components/admin/AdminContacts';
import AdminEventRegistrations from '../components/admin/AdminEventRegistrations';
import AdminPartners from '../components/admin/AdminPartners';
import AdminTeamMembers from '../components/admin/AdminTeamMembers';
import { 
  UsersIcon, 
  CalendarIcon, 
  FileTextIcon, 
  ImageIcon, 
  FolderIcon, 
  ShoppingCartIcon,
  GroupIcon,
  MessageSquareIcon,
  BarChart3Icon,
  TicketIcon,
  HandshakeIcon,
  Users2Icon
} from 'lucide-react';

const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({
    totalUsers: 0,
    activeEvents: 0,
    blogPosts: 0,
    storeItems: 0
  });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      
      // Fetch real data from APIs
      const [usersResponse, eventsResponse, blogsResponse, storeResponse] = await Promise.all([
        UserService.getUsers({ page: 1, size: 1 }).catch(() => ({ total: 0 })),
        EventsService.getEvents({ page: 1, size: 1, status: 'upcoming' }).catch(() => ({ total: 0 })),
        BlogService.getBlogPosts({ page: 1, size: 1, status: 'published' }).catch(() => ({ total: 0 })),
        StoreService.getProducts({ page: 1, size: 1 }).catch(() => ({ total: 0 }))
      ]);

      setDashboardStats({
        totalUsers: usersResponse.total || 0,
        activeEvents: eventsResponse.total || 0,
        blogPosts: blogsResponse.total || 0,
        storeItems: storeResponse.total || 0
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      // Keep fallback values if API calls fail
      setDashboardStats({
        totalUsers: 124,
        activeEvents: 8,
        blogPosts: 42,
        storeItems: 28
      });
    } finally {
      setStatsLoading(false);
    }
  };

  const checkAdminAccess = async () => {
    try {
      if (!authManager.isAuthenticated()) {
        setLoading(false);
        return;
      }

      // This would fetch current user from API
      // For now, we'll check if user is authenticated
      const mockAdmin: User = {
        id: 1,
        email: 'admin@izonedevs.com',
        username: 'admin',
        full_name: 'iZone Administrator',
        role: 'admin',
        is_active: true,
        is_verified: true,
        created_at: new Date().toISOString()
      };
      
      setCurrentUser(mockAdmin);
    } catch (error) {
      console.error('Error checking admin access:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!authManager.isAuthenticated() || !currentUser || currentUser.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3Icon },
    { id: 'events', label: 'Events', icon: CalendarIcon },
    { id: 'registrations', label: 'Registrations', icon: TicketIcon },
    { id: 'blogs', label: 'Blog Posts', icon: FileTextIcon },
    { id: 'gallery', label: 'Gallery', icon: ImageIcon },
    { id: 'projects', label: 'Projects', icon: FolderIcon },
    { id: 'store', label: 'Store', icon: ShoppingCartIcon },
    { id: 'communities', label: 'Communities', icon: GroupIcon },
    { id: 'users', label: 'Users', icon: UsersIcon },
    { id: 'partners', label: 'Partners', icon: HandshakeIcon },
    { id: 'team', label: 'Team Members', icon: Users2Icon },
    { id: 'contacts', label: 'Messages', icon: MessageSquareIcon }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'events':
        return <AdminEvents />;
      case 'registrations':
        return <AdminEventRegistrations />;
      case 'blogs':
        return <AdminBlogs />;
      case 'gallery':
        return <AdminGallery />;
      case 'projects':
        return <AdminProjects />;
      case 'store':
        return <AdminStore />;
      case 'communities':
        return <AdminCommunities />;
      case 'users':
        return <AdminUsers />;
      case 'partners':
        return <AdminPartners />;
      case 'team':
        return <AdminTeamMembers />;
      case 'contacts':
        return <AdminContacts />;
      default:
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Dashboard Stats */}
            <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Total Users</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                    ) : (
                      dashboardStats.totalUsers
                    )}
                  </p>
                </div>
                <UsersIcon className="text-primary" size={32} />
              </div>
            </div>
            
            <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Active Events</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                    ) : (
                      dashboardStats.activeEvents
                    )}
                  </p>
                </div>
                <CalendarIcon className="text-secondary" size={32} />
              </div>
            </div>
            
            <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Blog Posts</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                    ) : (
                      dashboardStats.blogPosts
                    )}
                  </p>
                </div>
                <FileTextIcon className="text-accent" size={32} />
              </div>
            </div>
            
            <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Store Items</p>
                  <p className="text-2xl font-bold">
                    {statsLoading ? (
                      <div className="animate-pulse bg-white/20 h-8 w-16 rounded"></div>
                    ) : (
                      dashboardStats.storeItems
                    )}
                  </p>
                </div>
                <ShoppingCartIcon className="text-highlight" size={32} />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Admin Dashboard"
          subtitle="Manage your iZonehub Makerspace content and users"
        />
        {/* Logout Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={() => {
              authManager.logout();
              window.location.href = '/login';
            }}
            className="px-4 py-2 bg-danger text-white rounded-lg font-medium shadow hover:bg-danger/80 transition-all duration-200"
          >
            Logout
          </button>
        </div>

        {/* Admin Navigation */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-neon-sm'
                      : 'bg-dark-lighter text-white/70 hover:bg-dark-light hover:text-white'
                  }`}
                >
                  <Icon size={16} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-dark-lighter rounded-lg border border-neutral/20 p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;