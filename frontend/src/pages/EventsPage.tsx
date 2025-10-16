import { useState, useEffect } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import EventCard from '../components/events/EventCard';
import EventRegistrationForm from '../components/events/EventRegistrationForm';
import { SearchIcon, LoaderIcon } from 'lucide-react';
import { EventsService, Event } from '../services';

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const filters = [
    { id: 'all', label: 'All Events' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'workshop', label: 'Workshops' },
    { id: 'hackathon', label: 'Hackathons' },
    { id: 'meetup', label: 'Meetups' },
    { id: 'panel', label: 'Panels' },
    { id: 'bootcamp', label: 'Bootcamps' }
  ];

  useEffect(() => {
    fetchEvents();
  }, [activeFilter]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching events with filter:', activeFilter);
      const response = await EventsService.getEvents({
        page: 1,
        size: 20,
        ...(activeFilter === 'upcoming' && { upcoming: true }),
        ...(activeFilter !== 'all' && activeFilter !== 'upcoming' && { status: activeFilter })
      });
      console.log('Events response:', response);
      setEvents(response.items);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please check if the backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter(event => {
    if (!searchQuery) return true;
    return event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           event.description.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  const handleRegistrationSuccess = () => {
    // Refresh events to get updated attendee count if needed
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle 
          title="Upcoming Events" 
          subtitle="Join our workshops, hackathons, and meetups to learn new skills and connect with the community." 
        />
        
        {/* Filters and Search */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              {filters.map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-4 py-2 rounded-full text-sm transition-all duration-300 ${
                    activeFilter === filter.id 
                      ? 'bg-primary text-white shadow-neon-sm' 
                      : 'bg-dark-lighter text-white/70 hover:bg-dark-light hover:text-white'
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
            
            {/* Search bar */}
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder="Search events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:shadow-neon-sm transition-all duration-300"
              />
              <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
          </div>
        </div>

        {/* Events Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoaderIcon className="animate-spin text-primary" size={40} />
            <span className="ml-3 text-white/70">Loading events...</span>
          </div>
        ) : error ? (
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <div className="text-red-400 mb-4">⚠️ {error}</div>
            <button 
              onClick={fetchEvents}
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                id={event.id.toString()}
                title={event.title}
                description={event.description}
                date={new Date(event.start_date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
                time={`${new Date(event.start_date).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })} - ${new Date(event.end_date).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: '2-digit'
                })}`}
                location={event.is_online ? 'Online Event' : (event.location || 'iZonehub Makerspace, 4th Floor, Three Anchor House')}
                image={event.image_url || 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                category={event.status}
                attendees={0} // Will be implemented with attendee count from backend
                featured={event.featured}
                registrationFee={event.registration_fee}
                onRegister={() => handleRegister(event)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-dark rounded-full mb-4">
              <SearchIcon size={24} className="text-white/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No events found</h3>
            <p className="text-white/70 mb-6">
              {searchQuery 
                ? "We couldn't find any events matching your search criteria." 
                : "No events available for the selected filter."}
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Event Registration Form */}
      {selectedEvent && (
        <EventRegistrationForm
          event={selectedEvent}
          isOpen={showRegistrationForm}
          onClose={() => {
            setShowRegistrationForm(false);
            setSelectedEvent(null);
          }}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </div>
  );
};

export default EventsPage;