import { useState, useEffect } from 'react';
import { EventsService, Event, EventCreateData } from '../../services';
import Button from '../ui/Button';
import { PlusIcon, EditIcon, TrashIcon, CalendarIcon, MapPinIcon, DollarSignIcon } from 'lucide-react';

const AdminEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventCreateData>({
    title: '',
    description: '',
    content: '',
    image_url: '',
    start_date: '',
    end_date: '',
    location: '',
    is_online: false,
    meeting_url: '',
    max_attendees: undefined,
    registration_fee: 0,
    community_id: undefined
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await EventsService.getEvents({ page: 1, size: 50 });
      setEvents(response.items);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingEvent) {
        await EventsService.updateEvent(editingEvent.id, formData);
      } else {
        await EventsService.createEvent(formData);
      }
      setShowForm(false);
      setEditingEvent(null);
      resetForm();
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleEdit = (event: Event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      content: event.content || '',
      image_url: event.image_url || '',
      start_date: event.start_date.slice(0, 16), // Format for datetime-local input
      end_date: event.end_date.slice(0, 16),
      location: event.location || '',
      is_online: event.is_online,
      meeting_url: event.meeting_url || '',
      max_attendees: event.max_attendees,
      registration_fee: event.registration_fee,
      community_id: event.community_id
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await EventsService.deleteEvent(id);
        fetchEvents();
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      image_url: '',
      start_date: '',
      end_date: '',
      location: '',
      is_online: false,
      meeting_url: '',
      max_attendees: undefined,
      registration_fee: 0,
      community_id: undefined
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading events...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Events</h2>
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="flex items-center"
        >
          <PlusIcon size={20} className="mr-2" />
          Add Event
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingEvent ? 'Edit Event' : 'Create New Event'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Registration Fee ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.registration_fee}
                  onChange={(e) => setFormData({ ...formData, registration_fee: parseFloat(e.target.value) || 0 })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={3}
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">End Date & Time</label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="iZonehub Makerspace, 4th Floor, Three Anchor House"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Max Attendees</label>
                <input
                  type="number"
                  value={formData.max_attendees || ''}
                  onChange={(e) => setFormData({ ...formData, max_attendees: e.target.value ? parseInt(e.target.value) : undefined })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="Unlimited"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.is_online}
                  onChange={(e) => setFormData({ ...formData, is_online: e.target.checked })}
                  className="mr-2"
                />
                Online Event
              </label>
            </div>

            {formData.is_online && (
              <div>
                <label className="block text-sm font-medium mb-2">Meeting URL</label>
                <input
                  type="url"
                  value={formData.meeting_url}
                  onChange={(e) => setFormData({ ...formData, meeting_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://meet.izonedevs.com/event"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                placeholder="https://example.com/event-image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Full Content (Optional)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={4}
                placeholder="Detailed event description, agenda, requirements, etc."
              />
            </div>

            <div className="flex space-x-4">
              <Button variant="primary" onClick={() => handleSubmit({} as React.FormEvent)}>
                {editingEvent ? 'Update Event' : 'Create Event'}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowForm(false);
                  setEditingEvent(null);
                  resetForm();
                }}
              >
                Cancel
              </Button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {events.map((event) => (
          <div key={event.id} className="bg-dark border border-neutral/30 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{event.title}</h3>
                <p className="text-white/70 mb-3">{event.description}</p>
                
                <div className="flex flex-wrap gap-4 text-sm text-white/60">
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-1" />
                    {new Date(event.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon size={16} className="mr-1" />
                    {event.is_online ? 'Online' : event.location || 'iZonehub'}
                  </div>
                  {event.registration_fee > 0 && (
                    <div className="flex items-center">
                      <DollarSignIcon size={16} className="mr-1" />
                      ${event.registration_fee}
                    </div>
                  )}
                  <div className={`px-2 py-1 rounded text-xs ${
                    event.status === 'upcoming' ? 'bg-green-500/20 text-green-300' :
                    event.status === 'ongoing' ? 'bg-blue-500/20 text-blue-300' :
                    'bg-gray-500/20 text-gray-300'
                  }`}>
                    {event.status}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(event)}
                  className="p-2 text-primary hover:bg-primary/20 rounded"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {events.length === 0 && (
        <div className="text-center py-8 text-white/70">
          No events found. Create your first event!
        </div>
      )}
    </div>
  );
};

export default AdminEvents;