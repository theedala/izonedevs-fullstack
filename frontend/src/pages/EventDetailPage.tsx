import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeftIcon, CalendarDaysIcon, CheckCircle2Icon, DollarSignIcon, LoaderIcon, MapPinIcon, UsersRoundIcon, XCircleIcon } from '../components/ui/icons';
import { EventsService, Event, authManager } from '../services';
import Button from '../components/ui/Button';
import { getMediaUrl } from '../utils/media';

const fallbackImage = 'https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?auto=format&fit=crop&w=1400&q=85';

const EventDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRegistering, setIsRegistering] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [registrationError, setRegistrationError] = useState<string | null>(null);

  const fetchEvent = async (eventId: number) => {
    try {
      setLoading(true);
      setError(null);
      setEvent(await EventsService.getEvent(eventId));
    } catch (err) {
      console.error('Error fetching event:', err);
      setError('Failed to load event details');
    } finally { setLoading(false); }
  };

  useEffect(() => {
    if (id) fetchEvent(parseInt(id, 10));
    if (window.location.hash === '#rsvp') setTimeout(() => document.getElementById('rsvp-section')?.scrollIntoView({ behavior: 'smooth' }), 100);
  }, [id]);

  const handleRSVP = async () => {
    if (!event || !authManager.isAuthenticated()) { window.location.href = '/login'; return; }
    try {
      setIsRegistering(true); setRegistrationError(null);
      await EventsService.registerForEvent(event.id);
      setRegistrationSuccess(true);
      await fetchEvent(event.id);
    } catch (err: any) {
      setRegistrationError(err.message || 'Failed to register for event');
    } finally { setIsRegistering(false); }
  };

  if (loading) return <div className="min-h-[70vh] bg-white flex items-center justify-center"><div className="flex items-center gap-3 text-slate-500"><LoaderIcon className="animate-spin text-secondary" size={22} /><span className="text-sm font-medium">Loading event brief…</span></div></div>;
  if (error || !event) return <main className="min-h-[70vh] bg-slate-50 px-4 py-24"><div className="mx-auto max-w-xl rounded-3xl border border-red-100 bg-white p-10 text-center shadow-card"><XCircleIcon className="mx-auto text-red-400" size={42} /><h1 className="mt-5 font-grotesk text-2xl font-bold text-slate-900">Event not found</h1><p className="mt-3 text-sm leading-6 text-slate-500">{error || 'The event you are looking for does not exist.'}</p><Button href="/events" variant="primary" className="mt-7">Back to events</Button></div></main>;

  const startDate = new Date(event.start_date);
  const endDate = new Date(event.end_date);
  const isUpcoming = startDate > new Date();
  const isPast = endDate < new Date();
  const rawDurationHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
  const startMinutes = startDate.getHours() * 60 + startDate.getMinutes();
  const endMinutes = endDate.getHours() * 60 + endDate.getMinutes();
  const timeOnlyMinutes = endMinutes >= startMinutes ? endMinutes - startMinutes : endMinutes + 24 * 60 - startMinutes;
  const duration = rawDurationHours > 0 && rawDurationHours <= 72 ? Math.max(1, Math.ceil(rawDurationHours)) : Math.max(1, Math.ceil(timeOnlyMinutes / 60));

  return <main className="min-h-screen bg-white"><section className="relative overflow-hidden border-b border-slate-100 bg-slate-50 px-4 pb-12 pt-10 sm:px-6 lg:px-8"><div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-orange-100/70 blur-3xl" /><div className="relative mx-auto max-w-6xl"><Link to="/events" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-primary"><ArrowLeftIcon size={16} /> Back to events</Link><div className="mt-10 max-w-4xl">{event.featured && <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-100 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-secondary"><CalendarDaysIcon size={12} /> Featured session</span>}<h1 className="mt-4 font-grotesk text-4xl font-black leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">{event.title}</h1><p className="mt-5 max-w-3xl text-lg leading-8 text-slate-500">{event.description}</p></div></div></section><section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8"><div className="grid gap-8 lg:grid-cols-[1fr_350px]"><div><div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-100 shadow-card"><img src={getMediaUrl(event.image_url) || fallbackImage} alt={event.title} className="max-h-[460px] w-full object-cover" onError={imageEvent => { imageEvent.currentTarget.src = fallbackImage; }} /><span className={`absolute left-5 top-5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white ${isPast ? 'bg-slate-600' : 'bg-emerald-600'}`}>{isPast ? 'Past event' : isUpcoming ? 'Upcoming' : event.status}</span></div><article className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-card sm:p-9"><h2 className="font-grotesk text-2xl font-bold text-slate-900">What to expect</h2>{event.content ? <div className="prose prose-slate mt-6 max-w-none text-sm leading-7" dangerouslySetInnerHTML={{ __html: event.content.replace(/\n/g, '<br />') }} /> : <p className="mt-4 text-sm leading-7 text-slate-500">Join the community for an engaging session with practical ideas, shared learning, and time to connect with other builders.</p>}</article></div><aside className="space-y-5 lg:sticky lg:top-24 lg:self-start"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-card"><h2 className="font-grotesk text-xl font-bold text-slate-900">Event details</h2><div className="mt-6 space-y-5"><div className="flex gap-3"><CalendarDaysIcon className="mt-0.5 shrink-0 text-primary" size={19} /><div><p className="text-sm font-bold text-slate-800">{startDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p><p className="mt-1 text-xs text-slate-500">{startDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} – {endDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })} · {duration} hours</p></div></div><div className="flex gap-3"><MapPinIcon className="mt-0.5 shrink-0 text-primary" size={19} /><div><p className="text-sm font-bold text-slate-800">{event.is_online ? 'Online event' : event.location || 'iZonehub Makerspace, Harare'}</p>{event.is_online && event.meeting_url && <a href={event.meeting_url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex text-xs font-semibold text-primary hover:underline">Join meeting ↗</a>}</div></div>{event.registration_fee > 0 && <div className="flex gap-3"><DollarSignIcon className="mt-0.5 shrink-0 text-primary" size={19} /><div><p className="text-sm font-bold text-slate-800">${event.registration_fee.toFixed(2)}</p><p className="mt-1 text-xs text-slate-500">Registration fee</p></div></div>}{event.max_attendees && <div className="flex gap-3"><UsersRoundIcon className="mt-0.5 shrink-0 text-primary" size={19} /><div><p className="text-sm font-bold text-slate-800">Limited to {event.max_attendees}</p><p className="mt-1 text-xs text-slate-500">Spots available</p></div></div>}</div></div>{isUpcoming ? <div id="rsvp-section" className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-card">{registrationSuccess ? <div className="text-center"><CheckCircle2Icon className="mx-auto text-emerald-500" size={42} /><h2 className="mt-4 font-grotesk text-xl font-bold text-slate-900">You are on the list.</h2><p className="mt-2 text-sm leading-6 text-slate-500">Registration is confirmed. We will send the next details to your account email.</p></div> : <><h2 className="font-grotesk text-xl font-bold text-slate-900">{event.registration_fee > 0 ? 'Register for this event' : 'Save your spot'}</h2><p className="mt-2 text-sm leading-6 text-slate-500">{authManager.isAuthenticated() ? 'Ready to join the room?' : 'Sign in to register for this event.'}</p>{registrationError && <p className="mt-4 rounded-2xl border border-red-100 bg-red-50 p-3 text-xs text-red-600">{registrationError}</p>}{authManager.isAuthenticated() ? <Button variant="primary" className="mt-5 w-full" onClick={handleRSVP} disabled={isRegistering}>{isRegistering ? <span className="inline-flex items-center gap-2"><LoaderIcon className="animate-spin" size={16} /> Registering…</span> : event.registration_fee > 0 ? 'Register & pay' : 'RSVP now'}</Button> : <Button href="/login" variant="primary" className="mt-5 w-full">Sign in to register</Button>}<p className="mt-3 text-center text-[11px] text-slate-400">{event.registration_fee > 0 ? 'Payment details follow registration.' : 'Free event · no payment required.'}</p></>}</div> : <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6"><h2 className="font-grotesk text-xl font-bold text-slate-900">Event completed</h2><p className="mt-2 text-sm leading-6 text-slate-500">This session has passed. Explore the upcoming calendar for another opportunity to connect.</p><Button href="/events" variant="outline" className="mt-5 w-full">View upcoming events</Button></div>}</aside></div></section></main>;
};

export default EventDetailPage;
