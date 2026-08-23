import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lineicons } from '@lineiconshq/react-lineicons';
import { DoubleQuotesEnd1Outlined, User4Outlined, ChevronLeftOutlined } from '@lineiconshq/free-icons';

interface Testimonial {
  id: number;
  quote: string;
  name: string;
  role: string;
  accent: string;
}

const fallbackTestimonials: Testimonial[] = [
  {
    id: 1,
    quote: 'iZonehub Makerspace gave me the skills and confidence to launch my own tech startup. The mentorship and resources were invaluable to my journey.',
    name: 'Tatenda M.',
    role: 'Software Developer & Entrepreneur',
    accent: '#2c378b',
  },
  {
    id: 2,
    quote: "The hardware development community helped me prototype my agricultural IoT solution. Now we're implementing it in rural communities across Zimbabwe.",
    name: 'Chido R.',
    role: 'Agricultural Engineer',
    accent: '#f56e00',
  },
  {
    id: 3,
    quote: "From knowing nothing about coding to becoming a professional web developer in 6 months — that's what iZonehub's training program did for me.",
    name: 'Tendai K.',
    role: 'Web Developer',
    accent: '#2c378b',
  },
];

const AUTOPLAY_MS = 5000;

const TestimonialsSection = () => {
  const [testimonials] = useState<Testimonial[]>(fallbackTestimonials);
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);

  useEffect(() => {
    const t = setInterval(() => {
      setDirection(1);
      setCurrent(i => (i + 1) % testimonials.length);
    }, AUTOPLAY_MS);
    return () => clearInterval(t);
  }, [testimonials.length]);

  const go = (idx: number) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
  };

  const prev = () => {
    setDirection(-1);
    setCurrent(i => (i === 0 ? testimonials.length - 1 : i - 1));
  };

  const next = () => {
    setDirection(1);
    setCurrent(i => (i === testimonials.length - 1 ? 0 : i + 1));
  };

  const t = testimonials[current];

  return (
    <section className="py-24" style={{ background: '#f4f4f5' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-4">
            Testimonials
          </span>
          <h2 className="font-grotesk font-normal text-slate-500 text-3xl md:text-4xl leading-tight">Hear from our</h2>
          <h2 className="font-grotesk font-black text-slate-900 text-3xl md:text-4xl leading-tight">community members.</h2>
        </motion.div>

        {/* Carousel card */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl border border-slate-100" style={{ boxShadow: '0 4px 32px rgba(0,0,0,0.07)' }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={t.id}
                custom={direction}
                variants={{
                  enter: (d: number) => ({ opacity: 0, x: d * 48 }),
                  center: { opacity: 1, x: 0 },
                  exit: (d: number) => ({ opacity: 0, x: d * -48 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.38, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="relative bg-white p-10 md:p-14"
              >
                {/* Top accent stripe */}
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-2xl" style={{ background: t.accent }} />

                {/* Quote icon */}
                <div className="mb-6">
                  <Lineicons icon={DoubleQuotesEnd1Outlined} size={28} color={t.accent} strokeWidth={1.5} />
                </div>

                {/* Quote text */}
                <p className="text-slate-700 text-lg md:text-xl leading-relaxed font-grotesk mb-10">
                  "{t.quote}"
                </p>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: `${t.accent}18`, border: `2px solid ${t.accent}30` }}
                  >
                    <Lineicons icon={User4Outlined} size={20} color={t.accent} />
                  </div>
                  <div>
                    <div className="font-grotesk font-bold text-slate-900 text-sm">{t.name}</div>
                    <div className="font-grotesk text-xs mt-0.5" style={{ color: t.accent }}>{t.role}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Prev / Next — hidden on mobile, visible sm+ */}
          <button
            onClick={prev}
            className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <Lineicons icon={ChevronLeftOutlined} size={16} color="currentColor" />
          </button>
          <button
            onClick={next}
            className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 w-10 h-10 rounded-full bg-white border border-slate-200 items-center justify-center shadow-sm text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-200"
            style={{ transform: 'translateY(-50%) translateX(20px) scaleX(-1)' }}
          >
            <Lineicons icon={ChevronLeftOutlined} size={16} color="currentColor" />
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mt-6">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === current ? 'w-8 bg-primary' : 'w-2 bg-slate-300'}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
