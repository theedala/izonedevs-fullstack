import React from 'react';
interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}
const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = true,
  className = ''
}) => {
  return <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className="text-3xl font-bold mb-4 relative inline-block">
        {title}
        <span className="absolute -bottom-2 left-0 w-12 h-1 bg-primary"></span>
        {!centered && <span className="absolute -bottom-2 left-14 w-24 h-1 bg-primary/30"></span>}
      </h2>
      {subtitle && <p className="text-white/70 max-w-2xl mx-auto">{subtitle}</p>}
    </div>;
};
export default SectionTitle;