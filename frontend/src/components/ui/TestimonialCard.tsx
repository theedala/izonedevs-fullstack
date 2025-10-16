import React from 'react';
interface TestimonialCardProps {
  quote: string;
  name: string;
  role: string;
  image?: string;
  className?: string;
}
const TestimonialCard: React.FC<TestimonialCardProps> = ({
  quote,
  name,
  role,
  className = ''
}) => {
  return <div className={`bg-dark-lighter p-6 rounded-lg border border-neutral/20 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="text-primary text-4xl font-serif">"</div>
      </div>
      <p className="text-white/80 mb-6 italic">{quote}</p>
      <div className="flex items-center">
        <div>
          <h4 className="font-bold">{name}</h4>
          <p className="text-white/60 text-sm">{role}</p>
        </div>
      </div>
    </div>;
};
export default TestimonialCard;