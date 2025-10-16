import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../ui/Button';
interface CommunityCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  memberCount: number;
  image: string;
  className?: string;
}
const CommunityCard: React.FC<CommunityCardProps> = ({
  id,
  title,
  description,
  icon,
  memberCount,
  image,
  className = ''
}) => {
  return <div className={`card overflow-hidden ${className}`}>
      <div className="h-48 relative overflow-hidden">
        <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent"></div>
        <div className="absolute bottom-4 left-4 bg-primary/90 text-white text-sm px-3 py-1 rounded-full">
          {memberCount} members
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-primary/10 rounded-lg mr-4">{icon}</div>
          <h3 className="text-xl font-bold">{title}</h3>
        </div>
        <p className="text-white/70 mb-6">{description}</p>
        <div className="flex justify-between items-center">
          <Button href={`/communities/${id}`} variant="outline" size="sm">
            Learn More
          </Button>
          <Link to={`/communities/${id}#join`} className="text-primary hover:text-primary/80 font-medium">
            Join Community
          </Link>
        </div>
      </div>
    </div>;
};
export default CommunityCard;