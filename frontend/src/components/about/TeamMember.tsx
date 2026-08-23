import React from 'react';
import { LinkedinIcon, TwitterIcon, GithubIcon } from '../ui/icons';
interface TeamMemberProps {
  name: string;
  role: string;
  bio: string;
  image: string;
  social?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
  className?: string;
}
const fallbackTeamImage = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=85';

const TeamMember: React.FC<TeamMemberProps> = ({
  name,
  role,
  bio,
  image,
  social = {},
  className = ''
}) => {
  return <div className={`card overflow-hidden ${className}`}>
      <div className="aspect-square overflow-hidden">
        <img src={image} alt={name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" onError={event => { event.currentTarget.src = fallbackTeamImage; }} />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className="text-primary font-medium mb-4">{role}</p>
        <p className="text-slate-500 mb-4 line-clamp-3">{bio}</p>
        <div className="flex space-x-3">
          {social.twitter && <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary">
              <TwitterIcon className="w-5 h-5" />
            </a>}
          {social.linkedin && <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary">
<LinkedinIcon className="w-5 h-5" />
            </a>}
          {social.github && <a href={social.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-primary">
              <GithubIcon className="w-5 h-5" />
            </a>}
        </div>
      </div>
    </div>;
};
export default TeamMember;