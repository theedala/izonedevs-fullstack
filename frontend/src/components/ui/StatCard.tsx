import React from 'react';
interface StatCardProps {
  value: string | number;
  label: string;
  icon?: React.ReactNode;
  className?: string;
}
const StatCard: React.FC<StatCardProps> = ({
  value,
  label,
  icon,
  className = ''
}) => {
  return <div className={`bg-dark-lighter p-6 rounded-lg border border-primary/20 ${className}`}>
      <div className="flex items-center mb-4">
        {icon && <div className="text-primary mr-3">{icon}</div>}
        <h3 className="text-xl font-semibold">{label}</h3>
      </div>
      <p className="text-4xl font-bold text-primary">{value}</p>
    </div>;
};
export default StatCard;