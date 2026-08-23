import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRightIcon, UsersIcon } from '../ui/icons';

interface CommunityCardProps {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  memberCount: number;
  image: string;
  accent?: string;
  light?: string;
  className?: string;
}

const CommunityCard: React.FC<CommunityCardProps> = ({
  id,
  title,
  description,
  icon,
  memberCount,
  image,
  accent = '#2c378b',
  light = '#eef0f8',
  className = '',
}) => {
  return (
    <motion.div
      className={`group bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col ${className}`}
      whileHover={{ y: -6 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
      onHoverStart={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 48px rgba(0,0,0,0.12), 0 0 0 1px ${accent}22`;
      }}
      onHoverEnd={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 16px rgba(0,0,0,0.06)';
      }}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden flex-shrink-0">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0" style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.1) 50%, transparent 100%)'
        }} />

        {/* Member count badge */}
        <div className="absolute bottom-4 left-4 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-sm">
          <UsersIcon size={12} style={{ color: accent }} />
          <span className="text-xs font-grotesk font-bold text-slate-800">{memberCount} members</span>
        </div>

        {/* Accent top stripe */}
        <div className="absolute top-0 left-0 right-0 h-1" style={{ background: accent }} />
      </div>

      {/* Content */}
      <div className="p-7 flex flex-col flex-1">
        {/* Icon + title */}
        <div className="flex items-start gap-4 mb-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
            style={{ background: light }}>
            {icon}
          </div>
          <h3 className="font-grotesk font-black text-slate-900 text-lg leading-snug">{title}</h3>
        </div>

        {/* Description */}
        <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-1 line-clamp-3">{description}</p>

        {/* Divider */}
        <div className="h-px bg-slate-100 mb-5" />

        {/* CTAs */}
        <div className="flex items-center justify-between">
          <Link
            to={`/communities/${id}#join`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-grotesk font-semibold text-slate-900 transition-all duration-300 hover:opacity-90 hover:shadow-lg"
            style={{ background: accent }}
          >
            Join Community
            <ArrowRightIcon size={14} />
          </Link>
          <Link
            to={`/communities/${id}`}
            className="text-sm font-grotesk font-semibold text-slate-400 hover:text-slate-700 transition-colors duration-200"
          >
            Learn more →
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default CommunityCard;
