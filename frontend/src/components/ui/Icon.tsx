import React from 'react';
import { Lineicons } from '@lineiconshq/react-lineicons';

interface IconProps {
  icon: object;
  size?: number;
  color?: string;
  strokeWidth?: number;
  className?: string;
  style?: React.CSSProperties;
}

const Icon: React.FC<IconProps> = ({
  icon,
  size = 20,
  color = 'currentColor',
  strokeWidth = 1.5,
  className,
  style,
}) => (
  <span className={`inline-flex items-center justify-center leading-none${className ? ` ${className}` : ''}`} style={style}>
    <Lineicons icon={icon} size={size} color={color} strokeWidth={strokeWidth} />
  </span>
);

export default Icon;
