import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UsersIcon, 
  DollarSignIcon,
  ArrowLeftIcon,
  StarIcon,
  LoaderIcon,
  CheckCircleIcon,
  XCircleIcon
} from 'lucide-react';
import { EventsService, Event, authManager } from '../services';
import Button from '../components/ui/Button';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchEvent(parseInt(id));
    }
    
    // Check if we should show RSVP form (from URL hash)
    if (window.location.hash === '#rsvp') {
      // Scroll to RSVP section
      setTimeout(() => {
        const rsvpSection = document.getElementById('rsvp-section');
        if (rsvpSection) {
          rsvpSection.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [id]);

  const fetchEvent = async (eventId: number) => {
    try {
      setLoading(true);
      const eventData = await EventsService.getEvent(eventId);
      setEvent(eventData);
    } catch (err) {
      setError('Failed to load event details');
      console.error('Error fetching event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRSVP = async () => {
    if (!event || !authManager.isAuthenticated()) {
      // Redirect to login if not authenticated
      window.location.href = '/login';
      return;
    }

    try {
      setIsRegistering(true);
      setRegistrationError(null);
      
      await EventsService.registerForEvent(event.id);
      setRegistrationSuccess(true);
      
      // Refresh event data to get updated attendee count
      await fetchEvent(event.id);
    } catch (err: any) {
      setRegistrationError(err.message || 'Failed to register for event');
      console.error('Registration error:', err);
    } finally {
      setIsRegistering(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <LoaderIcon className="animate-spin text-primary" size={40} />
          <span className="text-white/70 text-lg">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="text-center">
          <XCircleIcon className="mx-auto text-red-400 mb-4" size={64} />
          <h1 className="text-2xl font-bold mb-4">Event Not Found</h1>
          <p className="text-white/70 mb-6">{error || 'The event you\'re looking for doesn\'t exist.'}</p>
          <Link to="/events">
            <Button variant="primary">Back to Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const isUpcoming = eventDate > new Date();
  const isPast = endDate < new Date();

  return (
    <div className="min-h-screen bg-dark py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <div className="mb-8">
          <Link 
            to="/events" 
            className="inline-flex items-center text-primary hover:text-primary/80 transition-colors duration-200"
          >
            <ArrowLeftIcon size={20} className="mr-2" />
            Back to Events
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative h-64 md:h-80 rounded-lg overflow-hidden mb-6">
              <img 
                src={event.image_url || 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              
              {/* Event Status Badges */}
              <div className="absolute top-4 left-4 flex space-x-2">
                {event.featured && (
                  <div className="bg-secondary text-white text-sm px-3 py-1 rounded-full flex items-center">
                    <StarIcon size={14} className="mr-1" />
                    Featured
                  </div>
                )}
                <div className={`text-white text-sm px-3 py-1 rounded-full capitalize ${
                  isPast ? 'bg-gray-500' : isUpcoming ? 'bg-green-500' : 'bg-blue-500'
                }`}>
                  {isPast ? 'Past Event' : event.status}
                </div>
              </div>
            </div>

            {/* Event Title and Description */}
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{event.title}</h1>
              <p className="text-white/80 text-lg mb-6">{event.description}</p>
              
              {event.content && (
                <div className="prose prose-invert max-w-none">
                  <div className="text-white/70 whitespace-pre-wrap">{event.content}</div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Event Details Card */}
              <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                <h3 className="text-xl font-bold mb-4">Event Details</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <CalendarIcon size={20} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {eventDate.toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <ClockIcon size={20} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {eventDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })} - {endDate.toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit'
                        })}
                      </div>
                      <div className="text-sm text-white/60">
                        {Math.ceil((endDate.getTime() - eventDate.getTime()) / (1000 * 60 * 60))} hours
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <MapPinIcon size={20} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium">
                        {event.is_online ? 'Online Event' : (event.location || 'iZonehub Makerspace, 4th Floor, Three Anchor House')}
                      </div>
                      {event.is_online && event.meeting_url && (
                        <a 
                          href={event.meeting_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 text-sm"
                        >
                          Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {event.registration_fee > 0 && (
                    <div className="flex items-start">
                      <DollarSignIcon size={20} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">${event.registration_fee.toFixed(2)}</div>
                        <div className="text-sm text-white/60">Registration fee</div>
                      </div>
                    </div>
                  )}
                  
                  {event.max_attendees && (
                    <div className="flex items-start">
                      <UsersIcon size={20} className="text-primary mr-3 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="font-medium">
                          Limited to {event.max_attendees} attendees
                        </div>
                        <div className="text-sm text-white/60">
                          {/* This would show current registrations if available from backend */}
                          Spots available
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* RSVP Section */}
              {isUpcoming && (
                <div id="rsvp-section" className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                  {registrationSuccess ? (
                    <div className="text-center">
                      <CheckCircleIcon className="mx-auto text-green-400 mb-3" size={48} />
                      <h3 className="text-xl font-bold mb-2">Registration Successful!</h3>
                      <p className="text-white/70 mb-4">
                        You're registered for this event. We'll send you a confirmation email with more details.
                      </p>
                    </div>
                  ) : (
                    <>
                      <h3 className="text-xl font-bold mb-4">
                        {event.registration_fee > 0 ? 'Register for Event' : 'RSVP'}
                      </h3>
                      
                      {!authManager.isAuthenticated() ? (
                        <div className="text-center">
                          <p className="text-white/70 mb-4">
                            Please sign in to register for this event.
                          </p>
                          <Link to="/login">
                            <Button variant="primary" size="lg" className="w-full">
                              Sign In to Register
                            </Button>
                          </Link>
                        </div>
                      ) : (
                        <div>
                          {registrationError && (
                            <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-4">
                              <p className="text-red-300 text-sm">{registrationError}</p>
                            </div>
                          )}
                          
                          <div className="space-y-4">
                            {event.registration_fee > 0 && (
                              <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                                <div className="flex justify-between items-center">
                                  <span>Registration Fee:</span>
                                  <span className="font-bold text-primary">
                                    ${event.registration_fee.toFixed(2)}
                                  </span>
                                </div>
                              </div>
                            )}
                            
                            <Button
                              variant="primary"
                              size="lg"
                              className="w-full"
                              onClick={handleRSVP}
                              disabled={isRegistering}
                            >
                              {isRegistering ? (
                                <div className="flex items-center justify-center">
                                  <LoaderIcon className="animate-spin mr-2" size={20} />
                                  Registering...
                                </div>
                              ) : (
                                event.registration_fee > 0 ? 'Register & Pay' : 'RSVP Now'
                              )}
                            </Button>
                            
                            <p className="text-xs text-white/60 text-center">
                              {event.registration_fee > 0 
                                ? 'You will be redirected to payment after registration.'
                                : 'Free event - no payment required.'
                              }
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Past Event Notice */}
              {isPast && (
                <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                  <h3 className="text-xl font-bold mb-2">Event Completed</h3>
                  <p className="text-white/70">
                    This event has already taken place. Check out our upcoming events for more opportunities to learn and connect!
                  </p>
                  <Link to="/events" className="mt-4 inline-block">
                    <Button variant="outline">View Upcoming Events</Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPage;