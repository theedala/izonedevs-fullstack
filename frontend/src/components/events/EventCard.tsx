import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ClockIcon, MapPinIcon, UsersIcon, DollarSignIcon, StarIcon } from 'lucide-react';

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

const EventCard: React.FC<EventCardProps> = ({
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
  onRegister
}) => {
  return (
    <div className={`card overflow-hidden hover:transform hover:-translate-y-1 transition-all duration-300 relative ${className}`}>
      {featured && (
        <div className="absolute top-4 left-4 bg-secondary text-white text-xs px-2 py-1 rounded-full flex items-center z-10">
          <StarIcon size={12} className="mr-1" />
          Featured
        </div>
      )}
      
      <div className="h-48 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute top-4 right-4 bg-primary/90 text-white text-xs px-3 py-1 rounded-full capitalize">
          {category}
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold mb-2 line-clamp-1">{title}</h3>
        <p className="text-white/70 mb-4 line-clamp-2">{description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm">
            <CalendarIcon size={16} className="text-primary mr-2 flex-shrink-0" />
            <span>{date}</span>
          </div>
          <div className="flex items-center text-sm">
            <ClockIcon size={16} className="text-primary mr-2 flex-shrink-0" />
            <span>{time}</span>
          </div>
          <div className="flex items-center text-sm">
            <MapPinIcon size={16} className="text-primary mr-2 flex-shrink-0" />
            <span className="line-clamp-1">{location}</span>
          </div>
          {attendees > 0 && (
            <div className="flex items-center text-sm">
              <UsersIcon size={16} className="text-primary mr-2 flex-shrink-0" />
              <span>{attendees} attending</span>
            </div>
          )}
          {registrationFee > 0 && (
            <div className="flex items-center text-sm">
              <DollarSignIcon size={16} className="text-primary mr-2 flex-shrink-0" />
              <span>${registrationFee.toFixed(2)}</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center">
          <Link 
            to={`/events/${id}`} 
            className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
          >
            View Details
          </Link>
          <button 
            onClick={onRegister}
            className="bg-primary text-white px-4 py-2 rounded-full text-sm hover:shadow-neon-sm transition-all duration-300"
          >
            {registrationFee > 0 ? 'Register' : 'RSVP'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;