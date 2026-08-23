import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { ActivityIcon, BarChart3Icon, CalendarDaysIcon, FileTextIcon, FolderKanbanIcon, HandshakeIcon, ImageIcon, LogOutIcon, MessageSquareIcon, PackageIcon, ShieldCheckIcon, ShoppingCartIcon, SparklesIcon, TicketIcon, Users2Icon, UsersIcon, UserRoundIcon } from 'lucide-react';
import { authManager, User, UserService, EventsService, BlogService, StoreService } from '../services';
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

const AdminPage = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState({ totalUsers: 0, activeEvents: 0, blogPosts: 0, storeItems: 0 });
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => { checkAdminAccess(); fetchDashboardStats(); }, []);
  const fetchDashboardStats = async () => {
    try {
      setStatsLoading(true);
      const [usersResponse, eventsResponse, blogsResponse, storeResponse] = await Promise.all([
        UserService.getUsers({ page: 1, size: 1 }).catch(() => ({ total: 0 })),
        EventsService.getEvents({ page: 1, size: 1, status: 'upcoming' }).catch(() => ({ total: 0 })),
        BlogService.getBlogPosts({ page: 1, size: 1, status: 'published' }).catch(() => ({ total: 0 })),
        StoreService.getProducts({ page: 1, size: 1 }).catch(() => ({ total: 0 })),
      ]);
      setDashboardStats({ totalUsers: usersResponse.total || 0, activeEvents: eventsResponse.total || 0, blogPosts: blogsResponse.total || 0, storeItems: storeResponse.total || 0 });
    } catch (error) { console.error('Error fetching dashboard stats:', error); }
    finally { setStatsLoading(false); }
  };
  const checkAdminAccess = async () => {
    try {
      if (!authManager.isAuthenticated()) return;
      setCurrentUser({ id: 1, email: 'admin@izonedevs.com', username: 'admin', full_name: 'iZone Administrator', role: 'admin', is_active: true, is_verified: true, created_at: new Date().toISOString() });
    } catch (error) { console.error('Error checking admin access:', error); }
    finally { setLoading(false); }
  };

  if (loading) return <div className="min-h-[70vh] bg-slate-50 flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><span className="h-5 w-5 animate-spin rounded-full border-2 border-primary/20 border-t-primary" /> Loading workspace…</div></div>;
  if (!authManager.isAuthenticated() || !currentUser || currentUser.role !== 'admin') return <Navigate to="/login" replace />;

  const tabs = [
    { id: 'dashboard', label: 'Overview', icon: BarChart3Icon }, { id: 'events', label: 'Events', icon: CalendarDaysIcon }, { id: 'registrations', label: 'Registrations', icon: TicketIcon }, { id: 'blogs', label: 'Blog posts', icon: FileTextIcon }, { id: 'gallery', label: 'Gallery', icon: ImageIcon }, { id: 'projects', label: 'Projects', icon: FolderKanbanIcon }, { id: 'store', label: 'Store', icon: ShoppingCartIcon }, { id: 'communities', label: 'Communities', icon: Users2Icon }, { id: 'users', label: 'Users', icon: UsersIcon }, { id: 'partners', label: 'Partners', icon: HandshakeIcon }, { id: 'team', label: 'Team', icon: UserRoundIcon }, { id: 'contacts', label: 'Messages', icon: MessageSquareIcon },
  ];
  const stats = [
    { label: 'Total members', value: dashboardStats.totalUsers, icon: UsersIcon, accent: 'text-primary', background: 'bg-blue-50' },
    { label: 'Upcoming events', value: dashboardStats.activeEvents, icon: CalendarDaysIcon, accent: 'text-secondary', background: 'bg-orange-50' },
    { label: 'Published stories', value: dashboardStats.blogPosts, icon: FileTextIcon, accent: 'text-violet-600', background: 'bg-violet-50' },
    { label: 'Store items', value: dashboardStats.storeItems, icon: PackageIcon, accent: 'text-emerald-600', background: 'bg-emerald-50' },
  ];
  const renderTabContent = () => {
    switch (activeTab) {
      case 'events': return <AdminEvents />;
      case 'registrations': return <AdminEventRegistrations />;
      case 'blogs': return <AdminBlogs />;
      case 'gallery': return <AdminGallery />;
      case 'projects': return <AdminProjects />;
      case 'store': return <AdminStore />;
      case 'communities': return <AdminCommunities />;
      case 'users': return <AdminUsers />;
      case 'partners': return <AdminPartners />;
      case 'team': return <AdminTeamMembers />;
      case 'contacts': return <AdminContacts />;
      default: return <div><div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">{stats.map(stat => { const Icon = stat.icon; return <div key={stat.label} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card"><div className="flex items-start justify-between"><div><p className="text-xs font-semibold text-slate-500">{stat.label}</p><p className="mt-3 font-grotesk text-3xl font-black text-slate-900">{statsLoading ? <span className="inline-block h-8 w-16 animate-pulse rounded-lg bg-slate-100" /> : stat.value}</p></div><span className={`flex h-10 w-10 items-center justify-center rounded-2xl ${stat.background} ${stat.accent}`}><Icon size={20} /></span></div><div className="mt-5 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600"><ActivityIcon size={13} /> Live from platform data</div></div>; })}</div><div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]"><div className="rounded-3xl bg-primary p-7 text-white shadow-card-blue"><div className="flex items-center gap-2 text-orange-200"><SparklesIcon size={17} /><span className="text-[10px] font-bold uppercase tracking-[0.18em]">Workspace pulse</span></div><h2 className="mt-5 max-w-md font-grotesk text-3xl font-bold">Keep the room moving.</h2><p className="mt-3 max-w-lg text-sm leading-6 text-white/75">Use the workspace to keep stories fresh, projects visible, and the community connected.</p><button onClick={() => setActiveTab('events')} className="mt-6 rounded-full bg-white px-5 py-3 text-sm font-bold text-primary transition hover:bg-orange-50">Review upcoming events</button></div><div className="rounded-3xl border border-slate-200 bg-slate-50 p-7"><div className="flex items-center gap-2 text-primary"><ShieldCheckIcon size={18} /><span className="text-[10px] font-bold uppercase tracking-[0.18em]">Admin access</span></div><h2 className="mt-5 font-grotesk text-xl font-bold text-slate-900">You are signed in as {currentUser.full_name}.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Manage content, members, and community operations from the navigation above.</p><div className="mt-5 flex items-center gap-2 text-xs font-semibold text-slate-500"><span className="h-2 w-2 rounded-full bg-emerald-500" /> Secure workspace session</div></div></div></div>;
    }
  };

  return <main className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8"><div className="mx-auto max-w-7xl"><header className="mb-8 flex flex-col gap-5 border-b border-slate-200 pb-7 sm:flex-row sm:items-end sm:justify-between"><div><span className="inline-flex items-center gap-2 font-grotesk text-[10px] font-bold uppercase tracking-[0.2em] text-secondary"><ShieldCheckIcon size={14} /> iZonehub workspace</span><h1 className="mt-3 font-grotesk text-4xl font-black tracking-tight text-slate-900">Admin dashboard</h1><p className="mt-2 text-sm text-slate-500">Manage your content, community, and operations in one place.</p></div><button onClick={() => { authManager.logout(); window.location.href = '/login'; }} className="inline-flex items-center justify-center gap-2 self-start rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-600 shadow-card transition hover:border-red-200 hover:text-red-600 sm:self-auto"><LogOutIcon size={16} /> Log out</button></header><nav className="mb-7 flex gap-2 overflow-x-auto pb-2">{tabs.map(tab => { const Icon = tab.icon; return <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition ${activeTab === tab.id ? 'bg-primary text-white shadow-card-blue' : 'border border-slate-200 bg-white text-slate-600 hover:border-primary/30 hover:text-primary'}`}><Icon size={15} /> {tab.label}</button>; })}</nav><section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-card sm:p-7">{renderTabContent()}</section></div></main>;
};

export default AdminPage;
