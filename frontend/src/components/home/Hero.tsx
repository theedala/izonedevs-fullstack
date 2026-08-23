import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRightIcon, CalendarIcon, CodeIcon, UsersIcon } from '../ui/icons';

const stats = [
  { value: '500+', label: 'Members', icon: UsersIcon },
  { value: '50+', label: 'Projects', icon: CodeIcon },
  { value: '120+', label: 'Workshops/yr', icon: CalendarIcon },
];

const cyclingWords = ['Create.', 'Innovate.', 'Disrupt.', 'Impact.'];

const Hero = () => {
  const [ready, setReady] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 180);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex(i => (i + 1) % cyclingWords.length);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-[92vh] flex items-center overflow-hidden bg-white">

      {/* Gradient orb — blue, top-left behind headline */}
      <div
        className="absolute -top-20 -left-20 w-[560px] h-[560px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 40% 40%, rgba(44,55,139,0.28) 0%, rgba(44,55,139,0.10) 45%, transparent 70%)',
          filter: 'blur(16px)',
          animation: 'orbDrift 10s ease-in-out infinite',
        }}
      />

      {/* Gradient orb — orange, bottom-right */}
      <div
        className="absolute -bottom-16 -right-16 w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 55% 55%, rgba(245,110,0,0.24) 0%, rgba(245,110,0,0.08) 45%, transparent 70%)',
          filter: 'blur(16px)',
          animation: 'orbDrift 13s ease-in-out infinite reverse',
        }}
      />

      {/* Accent orb — amber, right-center */}
      <div
        className="absolute top-1/3 right-0 w-[280px] h-[280px] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, rgba(243,165,22,0.18) 0%, transparent 65%)',
          filter: 'blur(12px)',
          animation: 'orbDrift 8s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-24 lg:py-32">
        <div className="max-w-2xl">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/8 border border-primary/20 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-primary font-grotesk font-semibold text-sm">
              Zimbabwe's Premier Innovation Hub
            </span>
          </motion.div>

          {/* Headline with cycling word */}
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 24 }}
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-grotesk font-black text-5xl sm:text-6xl lg:text-[4.5rem] xl:text-[5.25rem] leading-[0.93] tracking-tight text-slate-900 mb-6"
          >
            Build.{' '}
            <span className="inline-block relative" style={{ minWidth: '6ch' }}>
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIndex}
                  className="text-secondary inline-block"
                  initial={{ opacity: 0, y: 28, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -28, filter: 'blur(4px)' }}
                  transition={{ duration: 0.42, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  {cyclingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
            <br />
            Lead Africa.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-500 leading-relaxed mb-10"
          >
            A collaborative makerspace for developers, makers, and entrepreneurs
            to learn, build, and launch — right here in Harare.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 12 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-wrap gap-3 mb-14"
          >
            <Link
              to="/communities"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-primary text-white font-grotesk font-semibold text-base hover:bg-primary/90 hover:shadow-[0_4px_24px_rgba(44,55,139,0.3)] transition-all duration-300"
            >
              Join the Hub
              <ArrowRightIcon size={17} />
            </Link>
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full border-2 border-slate-200 text-slate-700 hover:border-secondary hover:text-secondary font-grotesk font-semibold text-base transition-all duration-300"
            >
              See Our Work
            </Link>
          </motion.div>

          {/* Stats row */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: ready ? 1 : 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap gap-8 pt-6 border-t border-slate-100"
          >
            {stats.map(({ value, label, icon: Icon }, i) => (
              <div key={label} className="flex items-center gap-2.5">
                <span className={i % 2 === 0 ? 'text-primary' : 'text-secondary'}>
                  <Icon size={15} />
                </span>
                <span className="font-grotesk font-black text-slate-900 text-base">{value}</span>
                <span className="text-slate-400 text-sm">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
