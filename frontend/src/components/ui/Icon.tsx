import React from 'react';

interface IconProps {
  icon: React.ElementType;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({
  icon: IconComponent,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.5,
  className,
  style,
}) => (
  <span className={`inline-flex items-center justify-center leading-none${className ? ` ${className}` : ''}`} style={style}>
    <IconComponent size={size} color={color} strokeWidth={strokeWidth} variant="Linear" />
  </span>
);

export default Icon;
