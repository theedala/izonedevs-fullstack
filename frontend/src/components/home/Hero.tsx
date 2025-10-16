import { useState } from 'react';
import TerminalBlock from '../ui/TerminalBlock';
import Button from '../ui/Button';
import { motion } from 'framer-motion';
const Hero = () => {
  const [typingComplete, setTypingComplete] = useState(false);
  return <div className="relative min-h-[600px] flex items-center overflow-hidden">
      {/* Modern Tech Grid Background */}
      <div className="absolute inset-0 z-0">
        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(rgba(46, 52, 138, 0.4) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46, 52, 138, 0.4) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'gridShift 20s linear infinite'
        }}></div>
        
        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-32 h-32 border border-primary/20 rounded-lg" style={{
            animation: 'techGrid 8s ease-in-out infinite'
          }}></div>
          <div className="absolute top-40 right-32 w-24 h-24 border border-secondary/20 rounded-full" style={{
            animation: 'techGrid 6s ease-in-out infinite 2s'
          }}></div>
          <div className="absolute bottom-32 left-1/4 w-16 h-16 bg-primary/10 rounded" style={{
            animation: 'circuitPulse 4s ease-in-out infinite'
          }}></div>
          <div className="absolute bottom-20 right-20 w-20 h-20 border border-secondary/30 transform rotate-45" style={{
            animation: 'techGrid 7s ease-in-out infinite 1s'
          }}></div>
        </div>
        
        {/* Data flow lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" style={{
            animation: 'dataFlow 8s ease-in-out infinite'
          }}></div>
          <div className="absolute top-2/3 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" style={{
            animation: 'dataFlow 10s ease-in-out infinite 3s'
          }}></div>
        </div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      </div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div initial={{
          y: -20,
          opacity: 0
        }} animate={{
          y: 0,
          opacity: 1
        }} transition={{
          duration: 0.6
        }}>
            <TerminalBlock text="Welcome to iZonehub Makerspace — Zimbabwe's innovation hub." typingSpeed={40} className="mb-6" onComplete={() => setTypingComplete(true)} />
          </motion.div>
          <motion.div initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: typingComplete ? 1 : 0,
          scale: typingComplete ? 1 : 0.9
        }} transition={{
          duration: 0.8,
          ease: 'easeOut',
          delay: 0.2
        }}>
            <p className="text-lg text-white/80 mb-8">
              A collaborative space for makers, developers, and innovators to
              learn, build, and grow through hands-on training and mentorship.
            </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button href="/communities" variant="primary" size="lg">
                  Join Our Community
                </Button>
                <Button href="/projects" variant="secondary" size="lg">
                  Explore Projects
                </Button>
                <Button href="/store" variant="outline" size="lg">
                  Visit Store
                </Button>
              </div>
          </motion.div>
        </div>
      </div>
    </div>;
};
export default Hero;