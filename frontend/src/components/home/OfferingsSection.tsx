import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
  Code1Outlined,
  Book1Outlined,
  UserMultiple4Outlined,
  GraduationCap1Outlined,
  Gears3Outlined,
  CheckOutlined,
} from '@lineiconshq/free-icons';

const offerings = [
  {
    num: '01', icon: UserMultiple4Outlined,
    title: 'Find Your Community',
    tagline: 'It starts with people.',
    description: 'Every great thing built at iZonehub started with the right room. Regular meetups, workshops, and networking events connect you with developers, engineers, founders, and industry voices from across Zimbabwe and beyond. This is where your journey begins.',
    bullets: ['Weekly developer meetups', 'Industry speaker sessions', 'Cross-discipline networking'],
    accent: '#f56e00', light: '#fde8d5',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '02', icon: Book1Outlined,
    title: 'Knowledge Hub',
    tagline: 'Then, level up.',
    description: 'Once you\'re connected, the learning starts. Our library of tutorials, documentation, and curated learning paths — built by the community, for the community — gives you everything you need to go from curious to capable, at your own pace.',
    bullets: ['Curated learning paths', 'Video tutorials & docs', 'Open resource library'],
    accent: '#2c378b', light: '#dde1f5',
    image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '03', icon: GraduationCap1Outlined,
    title: 'Mentorship Programs',
    tagline: 'Guided at every step.',
    description: 'Knowledge moves faster with someone who\'s been there. Get matched 1-on-1 with experienced practitioners for structured mentorship, honest career direction, and skill-building sessions designed around exactly where you want to go — not a generic syllabus.',
    bullets: ['1-on-1 mentor matching', 'Career path guidance', 'Structured skill-building'],
    accent: '#f56e00', light: '#fde8d5',
    image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '04', icon: Code1Outlined,
    title: 'Software Development',
    tagline: 'Now, build something real.',
    description: 'Armed with community, knowledge, and mentorship — it\'s time to ship. Join hackathons, coding sprints, and real-world software collaborations using modern tools and frameworks. Work alongside peers, push code that matters, and grow your portfolio with projects that actually exist in the world.',
    bullets: ['Hackathons & coding sprints', 'Open-source collaborations', 'Real project deployments'],
    accent: '#2c378b', light: '#dde1f5',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80',
  },
  {
    num: '05', icon: Gears3Outlined,
    title: 'Hardware Prototyping',
    tagline: 'Or build something you can hold.',
    description: 'If your idea lives beyond the screen, our hardware lab brings it to life. 3D printers, microcontrollers, soldering stations, and a full electronics bench — everything you need to go from napkin sketch to working prototype. Because some of Zimbabwe\'s best ideas are physical ones.',
    bullets: ['3D printing & fabrication', 'Microcontroller kits', 'Full electronics lab'],
    accent: '#f56e00', light: '#fde8d5',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  },
];

const OfferingsSection = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive(i => (i + 1) % offerings.length), 3500);
    return () => clearInterval(t);
  }, []);

  const current = offerings[active];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <span className="inline-block text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-4">
              What We Offer
            </span>
            <h2 className="font-grotesk font-normal text-slate-500 text-3xl md:text-4xl leading-tight">Everything you need to</h2>
            <h2 className="font-grotesk font-black text-slate-900 text-3xl md:text-4xl leading-tight">innovate and grow.</h2>
          </div>
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs md:text-right">
            Five steps that take you from curious newcomer to confident maker — no prior experience needed.
          </p>
        </motion.div>

        {/* Main showcase */}
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_4px_32px_rgba(0,0,0,0.06)]">
          <div className="flex flex-col lg:flex-row min-h-[440px]">

            {/* ── Left: tab list ── */}
            <div className="lg:w-[280px] flex-shrink-0 border-b lg:border-b-0 lg:border-r border-slate-100 flex flex-row overflow-x-auto lg:flex-col lg:overflow-visible">
              {offerings.map((o, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={o.title}
                    onClick={() => setActive(i)}
                    className="relative flex-shrink-0 lg:flex-1 flex flex-col lg:flex-row items-center lg:items-center gap-1.5 lg:gap-3 px-5 lg:px-6 py-4 lg:py-0 text-left transition-all duration-200"
                    style={{ background: isActive ? o.light : 'transparent' }}
                  >
                    {/* Active bar — left side on desktop */}
                    {isActive && (
                      <motion.div
                        layoutId="activeBar"
                        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-r-full hidden lg:block"
                        style={{ background: o.accent }}
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}

                    {/* Active bar — bottom on mobile */}
                    {isActive && (
                      <div
                        className="absolute bottom-0 left-0 right-0 h-[3px] lg:hidden"
                        style={{ background: o.accent }}
                      />
                    )}

                    <span
                      className="font-grotesk font-black text-xs flex-shrink-0 w-6 hidden lg:block"
                      style={{ color: isActive ? o.accent : '#94a3b8' }}
                    >
                      {o.num}
                    </span>

                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors duration-200"
                      style={{ background: isActive ? o.accent + '22' : '#f1f5f9' }}
                    >
                      <Lineicons icon={o.icon} size={15} color={isActive ? o.accent : '#94a3b8'} />
                    </div>

                    {/* Title — first word only on mobile, full on desktop */}
                    <span className="lg:hidden font-grotesk font-semibold text-[10px] leading-tight text-center max-w-[56px] transition-colors duration-200"
                      style={{ color: isActive ? o.accent : '#94a3b8' }}>
                      {o.title.split(' ')[0]}
                    </span>
                    <span className="hidden lg:block font-grotesk font-semibold text-sm leading-tight transition-colors duration-200"
                      style={{ color: isActive ? '#0f172a' : '#64748b' }}>
                      {o.title}
                    </span>

                    {isActive && (
                      <motion.div
                        key={active}
                        className="absolute bottom-0 left-0 h-[2px] rounded-full hidden lg:block"
                        style={{ background: o.accent, opacity: 0.25 }}
                        initial={{ width: '0%' }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 3.5, ease: 'linear' }}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Right: showcase panel ── */}
            <div className="flex-1 p-8 md:p-10 flex flex-col lg:flex-row gap-8 items-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  className="flex-1 flex flex-col justify-center"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.35, ease: [0.25, 0.46, 0.45, 0.94] }}
                >
                  <p className="font-grotesk font-bold text-xs tracking-widest uppercase mb-3" style={{ color: current.accent }}>
                    {current.tagline}
                  </p>

                  <h3 className="font-grotesk font-black text-slate-900 text-2xl md:text-3xl mb-4 leading-tight">
                    {current.title}
                  </h3>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 max-w-md">
                    {current.description}
                  </p>

                  <div className="flex flex-col gap-2.5">
                    {current.bullets.map(b => (
                      <div key={b} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: current.accent + '18' }}>
                          <Lineicons icon={CheckOutlined} size={11} color={current.accent} />
                        </div>
                        <span className="font-grotesk text-slate-600 text-sm">{b}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Image panel */}
              <div className="lg:w-56 lg:flex-shrink-0 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`img-${active}`}
                    className="w-full rounded-2xl overflow-hidden"
                    style={{ boxShadow: `0 8px 32px ${current.accent}28` }}
                    initial={{ opacity: 0, scale: 0.94, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.94, y: -10 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    <div className="h-[3px] w-full" style={{ background: current.accent }} />
                    <img
                      src={current.image}
                      alt={current.title}
                      className="w-full object-cover"
                      style={{ height: 220 }}
                      loading="lazy"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom strip */}
        <motion.div
          className="mt-4 bg-white rounded-2xl px-8 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-slate-100"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="font-grotesk font-black text-slate-900 text-lg">
            Open to <span className="text-secondary">Everyone</span> — always free.
          </p>
          <div className="flex items-center gap-8">
            {[['$0', 'Membership'], ['500+', 'Members'], ['All', 'Skill levels']].map(([v, l]) => (
              <div key={l} className="text-center">
                <div className="font-grotesk font-black text-slate-900 text-lg leading-none">{v}</div>
                <div className="font-grotesk text-slate-400 text-xs mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
};

export default OfferingsSection;
