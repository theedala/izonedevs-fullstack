import React, { useState, useEffect } from 'react';
import { 
  Download, 
  Search, 
  Eye, 
  Trash2, 
  Filter,
  Calendar,
  User,
  Mail,
  Phone,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import Button from '../ui/Button';
import { EventRegistrationService } from '../../services';

interface EventRegistration {
  id: number;
  event_id: number;
  name: string;
  email: string;
  phone?: string;
  organization?: string;
  experience_level?: string;
  interests?: string;
  dietary_restrictions?: string;
  special_requirements?: string;
  registration_status: string;
  created_at: string;
  event?: {
    id: number;
    title: string;
    start_date: string;
    location?: string;
  };
}

const AdminEventRegistrations: React.FC = () => {
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRegistration, setSelectedRegistration] = useState<EventRegistration | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const statusOptions = [
    { value: 'all', label: 'All Statuses' },
    { value: 'confirmed', label: 'Confirmed' },
    { value: 'cancelled', label: 'Cancelled' },
    { value: 'attended', label: 'Attended' }
  ];

  useEffect(() => {
    fetchRegistrations();
  }, [page, statusFilter, eventFilter, searchQuery]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      
      const filters = {
        page,
        size: 10,
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(eventFilter !== 'all' && { event_id: parseInt(eventFilter) }),
        ...(searchQuery && { search: searchQuery })
      };

      const response = await EventRegistrationService.getRegistrations(filters);
      setRegistrations(response.items);
      setTotalPages(response.pages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load registrations');
    } finally {
      setLoading(false);
    }
  };

  const handleExportExcel = async () => {
    try {
      setError(null); // Clear any previous errors
      
      const filters = {
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(eventFilter !== 'all' && { event_id: parseInt(eventFilter) })
      };

      console.log('Exporting with filters:', filters); // Debug log
      
      const blob = await EventRegistrationService.exportRegistrations(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `event_registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      console.log('Export completed successfully'); // Debug log
    } catch (err) {
      console.error('Export error:', err); // Debug log
      const errorMessage = err instanceof Error ? err.message : 'Failed to export registrations';
      setError(`Export failed: ${errorMessage}`);
    }
  };

  const handleStatusUpdate = async (registrationId: number, newStatus: string) => {
    try {
      await EventRegistrationService.updateRegistrationStatus(registrationId, newStatus);
      fetchRegistrations(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async (registrationId: number) => {
    if (!confirm('Are you sure you want to delete this registration?')) return;

    try {
      await EventRegistrationService.deleteRegistration(registrationId);
      fetchRegistrations(); // Refresh data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete registration');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="text-green-400" size={16} />;
      case 'cancelled':
        return <XCircle className="text-red-400" size={16} />;
      case 'attended':
        return <Star className="text-yellow-400" size={16} />;
      default:
        return <AlertCircle className="text-gray-400" size={16} />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Event Registrations</h2>
          <p className="text-white/60">Manage event registrations and attendees</p>
        </div>
        <Button
          onClick={handleExportExcel}
          variant="secondary"
          className="flex items-center"
        >
          <Download size={20} className="mr-2" />
          Export Excel
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
          <input
            type="text"
            placeholder="Search registrations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-dark-lighter border border-white/20 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:border-primary"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-dark-lighter border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
        >
          {statusOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={eventFilter}
          onChange={(e) => setEventFilter(e.target.value)}
          className="bg-dark-lighter border border-white/20 rounded-lg px-4 py-2 focus:outline-none focus:border-primary"
        >
          <option value="all">All Events</option>
          {/* TODO: Add dynamic event options */}
        </select>

        <Button
          onClick={() => {
            setSearchQuery('');
            setStatusFilter('all');
            setEventFilter('all');
            setPage(1);
          }}
          variant="outline"
        >
          <Filter size={20} className="mr-2" />
          Clear Filters
        </Button>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-red-400 hover:text-red-300 mt-2 text-sm underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Registrations Table */}
      <div className="bg-dark-lighter rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-dark">
              <tr>
                <th className="text-left p-4 font-medium">Attendee</th>
                <th className="text-left p-4 font-medium">Event</th>
                <th className="text-left p-4 font-medium">Contact</th>
                <th className="text-left p-4 font-medium">Status</th>
                <th className="text-left p-4 font-medium">Registration Date</th>
                <th className="text-left p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {registrations.map((registration) => (
                <tr key={registration.id} className="border-t border-white/10 hover:bg-dark/50">
                  <td className="p-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center mr-3">
                        <User size={20} className="text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{registration.name}</div>
                        {registration.organization && (
                          <div className="text-sm text-white/60">{registration.organization}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div>
                      <div className="font-medium">{registration.event?.title || 'Unknown Event'}</div>
                      <div className="text-sm text-white/60">
                        {registration.event?.start_date && formatDate(registration.event.start_date)}
                      </div>
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="text-sm">
                      <div className="flex items-center mb-1">
                        <Mail size={14} className="mr-2 text-white/40" />
                        {registration.email}
                      </div>
                      {registration.phone && (
                        <div className="flex items-center">
                          <Phone size={14} className="mr-2 text-white/40" />
                          {registration.phone}
                        </div>
                      )}
                    </div>
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center">
                      {getStatusIcon(registration.registration_status)}
                      <span className="ml-2 capitalize">{registration.registration_status}</span>
                    </div>
                  </td>
                  
                  <td className="p-4 text-sm text-white/60">
                    {formatDate(registration.created_at)}
                  </td>
                  
                  <td className="p-4">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setSelectedRegistration(registration);
                          setShowDetails(true);
                        }}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      
                      <select
                        value={registration.registration_status}
                        onChange={(e) => handleStatusUpdate(registration.id, e.target.value)}
                        className="bg-dark border border-white/20 rounded px-2 py-1 text-xs"
                      >
                        <option value="confirmed">Confirmed</option>
                        <option value="cancelled">Cancelled</option>
                        <option value="attended">Attended</option>
                      </select>
                      
                      <button
                        onClick={() => handleDelete(registration.id)}
                        className="p-2 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                        title="Delete Registration"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {registrations.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="mx-auto text-white/30 mb-4" size={48} />
            <h3 className="text-lg font-medium mb-2">No registrations found</h3>
            <p className="text-white/60">No event registrations match your current filters.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-dark-lighter border border-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark transition-colors"
          >
            Previous
          </button>
          
          <span className="px-4 py-2">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(Math.min(totalPages, page + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 bg-dark-lighter border border-white/20 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-dark transition-colors"
          >
            Next
          </button>
        </div>
      )}

      {/* Registration Details Modal */}
      {showDetails && selectedRegistration && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-lighter rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold">Registration Details</h3>
                <button
                  onClick={() => setShowDetails(false)}
                  className="p-2 hover:bg-dark rounded-full transition-colors"
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Name</label>
                    <p className="text-white">{selectedRegistration.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Email</label>
                    <p className="text-white">{selectedRegistration.email}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Phone</label>
                    <p className="text-white">{selectedRegistration.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Organization</label>
                    <p className="text-white">{selectedRegistration.organization || 'Not provided'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Experience Level</label>
                    <p className="text-white capitalize">{selectedRegistration.experience_level || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Status</label>
                    <div className="flex items-center">
                      {getStatusIcon(selectedRegistration.registration_status)}
                      <span className="ml-2 capitalize">{selectedRegistration.registration_status}</span>
                    </div>
                  </div>
                </div>

                {selectedRegistration.interests && (
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Interests & Goals</label>
                    <p className="text-white">{selectedRegistration.interests}</p>
                  </div>
                )}

                {selectedRegistration.dietary_restrictions && (
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Dietary Restrictions</label>
                    <p className="text-white">{selectedRegistration.dietary_restrictions}</p>
                  </div>
                )}

                {selectedRegistration.special_requirements && (
                  <div>
                    <label className="block text-sm font-medium text-white/60 mb-1">Special Requirements</label>
                    <p className="text-white">{selectedRegistration.special_requirements}</p>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1">Registration Date</label>
                  <p className="text-white">{formatDate(selectedRegistration.created_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventRegistrations;