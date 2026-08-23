import { useEffect, useMemo, useState } from 'react';
import { CalendarDaysIcon, Code2Icon, LoaderIcon, MapPinnedIcon, SearchIcon, SparklesIcon, UsersRoundIcon } from 'lucide-react';
import EventCard from '../components/events/EventCard';
import EventRegistrationForm from '../components/events/EventRegistrationForm';
import Button from '../components/ui/Button';
import { EventsService, Event } from '../services';

const fallbackImage = 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1200&q=85';

const filters = [
  { id: 'all', label: 'All events' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'workshop', label: 'Workshops' },
  { id: 'hackathon', label: 'Hackathons' },
  { id: 'meetup', label: 'Meetups' },
  { id: 'panel', label: 'Panels' },
  { id: 'bootcamp', label: 'Bootcamps' },
];

const EventsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await EventsService.getEvents({
        page: 1,
        size: 20,
        ...(activeFilter === 'upcoming' && { upcoming: true }),
        ...(activeFilter !== 'all' && activeFilter !== 'upcoming' && { status: activeFilter }),
      });
      setEvents(response.items);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('We could not load the events calendar right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [activeFilter]);

  const filteredEvents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return events;
    return events.filter(event => event.title.toLowerCase().includes(query) || event.description.toLowerCase().includes(query));
  }, [events, searchQuery]);

  const handleRegister = (event: Event) => {
    setSelectedEvent(event);
    setShowRegistrationForm(true);
  };

  return (
    <main className="min-h-screen bg-white">
      <section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 pb-14 pt-20 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute -left-24 -top-28 h-80 w-80 rounded-full bg-orange-100/60 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-1/4 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
        <div className="relative mx-auto max-w-6xl text-center">
          <span className="font-grotesk text-[11px] font-bold uppercase tracking-[0.2em] text-secondary">Events & learning</span>
          <h1 className="mx-auto mt-4 max-w-3xl font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Make time to
            <span className="block text-secondary">learn together.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-500">
            Workshops, meetups, hackathons, and conversations for people building Zimbabwe’s next chapter in technology.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 text-xs font-semibold text-slate-500">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2"><CalendarDaysIcon size={15} className="text-primary" /> Hands-on sessions</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2"><UsersRoundIcon size={15} className="text-primary" /> Open to the community</span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2"><MapPinnedIcon size={15} className="text-primary" /> Harare & online</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap gap-2">
            {filters.map(filter => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`rounded-full border px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
                  activeFilter === filter.id
                    ? 'border-secondary bg-secondary text-white shadow-card-orange'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-secondary/30 hover:text-secondary'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
          <label className="relative block w-full lg:max-w-xs">
            <span className="sr-only">Search events</span>
            <SearchIcon size={17} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              placeholder="Search events…"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              className="w-full rounded-full border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition focus:border-secondary focus:ring-4 focus:ring-secondary/10"
            />
          </label>
        </div>

        {loading ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500"><LoaderIcon className="animate-spin text-secondary" size={22} /><span className="text-sm font-medium">Loading the events calendar…</span></div>
        ) : error ? (
          <div className="mx-auto mt-10 max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-500">!</div>
            <h2 className="font-grotesk text-2xl font-bold text-slate-900">Calendar unavailable</h2>
            <p className="mt-3 text-sm leading-6 text-slate-500">{error}</p>
            <button onClick={fetchEvents} className="btn btn-primary mt-7 bg-primary text-white">Try again</button>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredEvents.map(event => (
              <EventCard
                key={event.id}
                id={event.id.toString()}
                title={event.title}
                description={event.description}
                date={new Date(event.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                time={`${new Date(event.start_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – ${new Date(event.end_date).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`}
                location={event.is_online ? 'Online event' : (event.location || 'iZonehub Makerspace, Harare')}
                image={event.image_url || fallbackImage}
                category={event.status}
                attendees={0}
                featured={event.featured}
                registrationFee={event.registration_fee}
                onRegister={() => handleRegister(event)}
              />
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-3xl border border-dashed border-slate-200 bg-slate-50 px-6 py-20 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-slate-400 shadow-card"><SearchIcon size={22} /></div>
            <h2 className="mt-5 font-grotesk text-2xl font-bold text-slate-900">No events found</h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">Try another search or reset the filters to see every community session.</p>
            <button onClick={() => { setActiveFilter('all'); setSearchQuery(''); }} className="btn btn-outline mt-6">Reset filters</button>
          </div>
        )}

        <div className="relative mt-16 overflow-hidden rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-blue-50 px-6 py-10 text-center sm:px-10">
          <Code2Icon className="relative mx-auto mb-4 text-secondary" size={26} />
          <h2 className="relative font-grotesk text-2xl font-bold text-slate-900 sm:text-3xl">Have an idea for an event?</h2>
          <p className="relative mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-500">Bring a workshop, meetup, or community conversation to iZonehub.</p>
          <Button href="/contact" variant="primary" className="relative mt-7">Submit an event proposal</Button>
        </div>
      </section>

      {selectedEvent && (
        <EventRegistrationForm
          event={selectedEvent}
          isOpen={showRegistrationForm}
          onClose={() => { setShowRegistrationForm(false); setSelectedEvent(null); }}
          onSuccess={fetchEvents}
        />
      )}
    </main>
  );
};

export default EventsPage;
