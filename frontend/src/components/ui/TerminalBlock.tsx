import React, { useEffect, useState, useRef } from 'react';
interface TerminalBlockProps {
  text: string;
  typingSpeed?: number;
  showCursor?: boolean;
  className?: string;
  onComplete?: () => void;
}
const TerminalBlock: React.FC<TerminalBlockProps> = ({
  text,
  typingSpeed = 50,
  showCursor = true,
  className = '',
  onComplete
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let currentIndex = 0;
    let timer: NodeJS.Timeout;
    const typeNextChar = () => {
      if (currentIndex < text.length) {
        setDisplayedText(text.substring(0, currentIndex + 1));
        currentIndex++;
        timer = setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsTyping(false);
        if (onComplete) onComplete();
      }
    };
    // Start typing
    timer = setTimeout(typeNextChar, typingSpeed);
    return () => {
      clearTimeout(timer);
    };
  }, [text, typingSpeed, onComplete]);
  return <div ref={containerRef} className={`font-mono bg-dark-lighter p-4 rounded-lg border border-primary/30 ${className}`}>
      <div className="flex items-center mb-2 text-white/60">
        <div className="w-3 h-3 rounded-full bg-danger mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
        <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
        <span className="text-xs">terminal@izonedev:~</span>
      </div>
      <div className="flex">
        <span className="text-primary mr-2">$</span>
        <div>
          {displayedText}
          {isTyping && showCursor && <span className="terminal-cursor"></span>}
        </div>
      </div>
    </div>;
};
export default TerminalBlock;