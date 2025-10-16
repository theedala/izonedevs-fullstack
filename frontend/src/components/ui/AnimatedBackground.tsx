import React from 'react';

interface AnimatedBackgroundProps {
  className?: string;
  variant?: 'floating' | 'geometric' | 'grid' | 'waves' | 'stars';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  variant = 'floating'
}) => {
  const renderFloating = () => (
    <div className="absolute inset-0">
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute opacity-20"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${4 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 8}s`
          }}
        >
          <div 
            className="bg-primary rounded-full"
            style={{
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animation: `pulse ${2 + Math.random() * 2}s ease-in-out infinite`
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(-10px) rotate(180deg); }
          75% { transform: translateY(-30px) rotate(270deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
      `}</style>
    </div>
  );

  const renderGeometric = () => (
    <div className="absolute inset-0">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="absolute opacity-10"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `spin ${10 + Math.random() * 10}s linear infinite`,
            animationDelay: `${Math.random() * 6}s`
          }}
        >
          <div 
            className={`border-2 border-primary ${
              i % 3 === 0 ? 'rounded-full' : i % 3 === 1 ? 'rotate-45' : ''
            }`}
            style={{
              width: `${20 + Math.random() * 20}px`,
              height: `${20 + Math.random() * 20}px`
            }}
          />
        </div>
      ))}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );

  const renderGrid = () => (
    <div className="absolute inset-0 opacity-20">
      {/* Vertical lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`v-${i}`}
          className="absolute w-px bg-gradient-to-b from-transparent via-primary to-transparent h-full"
          style={{
            left: `${(i + 1) * 10}%`,
            animation: `gridPulse 3s ease-in-out infinite`,
            animationDelay: `${i * 0.2}s`
          }}
        />
      ))}
      {/* Horizontal lines */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={`h-${i}`}
          className="absolute h-px bg-gradient-to-r from-transparent via-primary to-transparent w-full"
          style={{
            top: `${(i + 1) * 16.66}%`,
            animation: `gridPulse 3s ease-in-out infinite`,
            animationDelay: `${i * 0.3}s`
          }}
        />
      ))}
      <style jsx>{`
        @keyframes gridPulse {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );

  const renderStars = () => (
    <div className="absolute inset-0">
      {/* Regular stars */}
      {Array.from({ length: 20 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 3}s`
          }}
        >
          <div className="w-1 h-1 bg-primary rounded-full" />
        </div>
      ))}
      {/* Accent stars */}
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={`accent-${i}`}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `ping 3s ease-in-out infinite`,
            animationDelay: `${i * 2}s`
          }}
        >
          <div className="w-2 h-2 bg-secondary rounded-full opacity-70" />
        </div>
      ))}
      <style jsx>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes ping {
          0% { transform: scale(1); opacity: 1; }
          75%, 100% { transform: scale(2); opacity: 0; }
        }
      `}</style>
    </div>
  );

  const renderWaves = () => (
    <div className="absolute inset-0">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-full opacity-5"
          style={{
            height: '200px',
            top: `${20 + i * 25}%`,
            animation: `wave 15s ease-in-out infinite`,
            animationDelay: `${i * 3}s`
          }}
        >
          <svg viewBox="0 0 1200 120" className="w-full h-full">
            <path
              d="M0,60 C300,120 600,0 900,60 C1050,90 1150,30 1200,60 L1200,120 L0,120 Z"
              fill="currentColor"
              className="text-primary"
            />
          </svg>
        </div>
      ))}
      <style jsx>{`
        @keyframes wave {
          0% { transform: translateX(-100%) scaleY(1); }
          50% { transform: translateX(0) scaleY(1.2); }
          100% { transform: translateX(100%) scaleY(1); }
        }
      `}</style>
    </div>
  );

  const renderVariant = () => {
    switch (variant) {
      case 'geometric':
        return renderGeometric();
      case 'grid':
        return renderGrid();
      case 'waves':
        return renderWaves();
      case 'stars':
        return renderStars();
      default:
        return renderFloating();
    }
  };

  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      {renderVariant()}
    </div>
  );
};

export default AnimatedBackground;