import { Link } from 'react-router-dom';
import {
  CalendarDaysIcon,
  Clock3Icon,
  DollarSignIcon,
  MapPinIcon,
  SparklesIcon,
  UsersIcon,
} from 'lucide-react';

interface EventCardProps {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  attendees: number;
  featured?: boolean;
  registrationFee?: number;
  className?: string;
  onRegister?: () => void;
}

const EventCard = ({
  id,
  title,
  description,
  date,
  time,
  location,
  image,
  category,
  attendees,
  featured = false,
  registrationFee = 0,
  className = '',
  onRegister,
}: EventCardProps) => {
  return (
    <article className={`group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-card-hover ${className}`}>
      <Link to={`/events/${id}`} className="block">
        <div className="relative h-52 overflow-hidden bg-slate-100">
          <img src={image} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
          {featured && (
            <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
              <SparklesIcon size={12} /> Featured
            </span>
          )}
          <span className="absolute right-4 top-4 rounded-full border border-white/50 bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary backdrop-blur">
            {category || 'Event'}
          </span>
        </div>
      </Link>

      <div className="p-6">
        <Link to={`/events/${id}`} className="block">
          <h3 className="font-grotesk text-xl font-bold leading-snug text-slate-900 transition-colors group-hover:text-primary">{title}</h3>
          <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{description}</p>
        </Link>

        <div className="mt-5 space-y-2.5 border-t border-slate-100 pt-5 text-xs text-slate-500">
          <div className="flex items-center gap-2"><CalendarDaysIcon size={15} className="text-primary" /><span>{date}</span></div>
          <div className="flex items-center gap-2"><Clock3Icon size={15} className="text-primary" /><span>{time}</span></div>
          <div className="flex items-center gap-2"><MapPinIcon size={15} className="text-primary" /><span className="line-clamp-1">{location}</span></div>
          {attendees > 0 && <div className="flex items-center gap-2"><UsersIcon size={15} className="text-primary" /><span>{attendees} attending</span></div>}
          {registrationFee > 0 && <div className="flex items-center gap-2"><DollarSignIcon size={15} className="text-primary" /><span>${registrationFee.toFixed(2)}</span></div>}
        </div>

        <div className="mt-6 flex items-center justify-between gap-3">
          <Link to={`/events/${id}`} className="inline-flex items-center gap-1 text-sm font-bold text-primary transition-colors hover:text-secondary">View details <span aria-hidden>↗</span></Link>
          <button onClick={onRegister} className="rounded-full bg-primary px-4 py-2.5 text-xs font-bold text-white shadow-card-blue transition-all hover:-translate-y-0.5 hover:bg-primary-dark active:scale-[0.98]">
            {registrationFee > 0 ? 'Register' : 'RSVP'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default EventCard;
