import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
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
  disabled = false,
}) => {
  const base = 'inline-flex items-center justify-center rounded-full font-grotesk font-semibold transition-all duration-300';

  const variants = {
    primary: disabled
      ? 'bg-primary/50 text-white cursor-not-allowed'
      : 'bg-primary text-white hover:brightness-110 hover:shadow-lg',
    secondary: disabled
      ? 'bg-secondary/50 text-white cursor-not-allowed'
      : 'bg-secondary text-white hover:shadow-card-orange hover:brightness-105',
    outline: disabled
      ? 'border border-slate-200 text-slate-400 cursor-not-allowed'
      : 'border-2 border-primary text-primary hover:bg-primary hover:text-white',
    ghost: disabled
      ? 'text-slate-300 cursor-not-allowed'
      : 'border border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50',
  };

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-6 py-2.5 text-sm',
    lg: 'px-8 py-3.5 text-base',
  };

  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href && !disabled) {
    return <Link to={href} className={classes}>{children}</Link>;
  }

  return (
    <button className={classes} onClick={disabled ? undefined : onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default Button;
