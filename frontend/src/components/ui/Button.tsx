import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  href,
  className = '',
  onClick,
  disabled = false
}) => {
  const baseClasses = 'inline-flex items-center justify-center rounded-full font-medium transition-all duration-300';
  
  const variantClasses = {
    primary: disabled 
      ? 'bg-primary/50 text-white/50 cursor-not-allowed' 
      : 'bg-primary text-white hover:shadow-neon',
    secondary: disabled 
      ? 'bg-secondary/50 text-white/50 cursor-not-allowed' 
      : 'bg-secondary text-white hover:shadow-neon',
    outline: disabled 
      ? 'border border-primary/50 text-primary/50 cursor-not-allowed' 
      : 'border border-primary text-primary hover:bg-primary hover:text-white hover:shadow-neon'
  };
  
  const sizeClasses = {
    sm: 'px-4 py-1 text-sm',
    md: 'px-6 py-2',
    lg: 'px-8 py-3 text-lg'
  };
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  if (href && !disabled) {
    return (
      <Link to={href} className={classes}>
        {children}
      </Link>
    );
  }
  
  return (
    <button 
      className={classes} 
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;