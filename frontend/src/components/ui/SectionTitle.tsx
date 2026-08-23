import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
  light?: boolean;
}

const SectionTitle: React.FC<SectionTitleProps> = ({
  title,
  subtitle,
  centered = true,
  className = '',
  light = false,
}) => {
  return (
    <div className={`mb-12 ${centered ? 'text-center' : ''} ${className}`}>
      <h2 className={`font-grotesk font-black text-3xl md:text-4xl tracking-tight relative inline-block mb-2 ${light ? 'text-white' : 'text-slate-900'}`}>
        {title}
        <span className="absolute -bottom-2 left-0 w-12 h-[3px] rounded-full bg-gradient-to-r from-primary to-secondary" />
      </h2>
      {subtitle && (
        <p className={`max-w-2xl mx-auto mt-5 text-base leading-relaxed ${light ? 'text-white/65' : 'text-slate-500'}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
