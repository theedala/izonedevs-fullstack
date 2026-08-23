import { motion } from 'framer-motion';

const avatarColors = ['bg-primary', 'bg-secondary', 'bg-blue-400', 'bg-orange-400', 'bg-indigo-400'];
const avatarInitials = ['T', 'M', 'R', 'A', 'K'];

// Simple upward trend SVG path for the dark card background
const TrendLine = () => (
  <svg
    viewBox="0 0 260 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="absolute bottom-0 right-0 w-full opacity-20"
    preserveAspectRatio="none"
  >
    <path
      d="M0 90 L40 75 L80 80 L120 55 L160 45 L200 25 L240 15 L260 8"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0 90 L40 75 L80 80 L120 55 L160 45 L200 25 L240 15 L260 8 L260 100 L0 100 Z"
      fill="white"
      fillOpacity="0.05"
    />
  </svg>
);

const MissionSection = () => {
  return (
    <section className="py-24" style={{ background: '#f4f4f5' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header row */}
        <motion.div
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.55 }}
        >
          <div>
            {/* Label */}
            <span className="inline-block text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-4">
              Mission
            </span>

            {/* Two-line headline */}
            <h2 className="font-grotesk leading-tight text-slate-500 text-3xl md:text-4xl font-normal">
              Our mission is simple
            </h2>
            <h2 className="font-grotesk leading-tight text-slate-900 text-3xl md:text-4xl font-black">
              Build Africa's tech future.
            </h2>
          </div>

          {/* Right description */}
          <p className="text-slate-500 text-sm leading-relaxed max-w-xs md:text-right">
            We promise to grow Zimbabwe's tech ecosystem through innovation,
            education, and radical community building.
          </p>
        </motion.div>

        {/* Bento cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">

          {/* Card 1 — Community / social proof */}
          <motion.div
            className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[280px] border border-slate-100"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Top: avatar stack + label */}
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="flex -space-x-2">
                  {avatarColors.map((bg, i) => (
                    <div
                      key={i}
                      className={`w-8 h-8 rounded-full ${bg} border-2 border-white flex items-center justify-center`}
                    >
                      <span className="text-slate-900 text-[10px] font-bold">{avatarInitials[i]}</span>
                    </div>
                  ))}
                </div>
                <span className="text-xs font-grotesk font-semibold text-slate-400 tracking-wide uppercase">
                  500+ Members
                </span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed">
                Join a growing network of developers, makers, and entrepreneurs
                building the future of tech in Zimbabwe.
              </p>
            </div>

            {/* Bottom: big stat */}
            <div className="mt-6 pt-6 border-t border-slate-100">
              <div className="font-grotesk font-black text-5xl text-slate-900 leading-none mb-1">
                500<span className="text-secondary">+</span>
              </div>
              <div className="text-slate-400 text-sm">Community members</div>
            </div>
          </motion.div>

          {/* Card 2 — Workshops / activity */}
          <motion.div
            className="bg-white rounded-2xl p-6 flex flex-col justify-between min-h-[280px] border border-slate-100"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div>
              <p className="text-slate-700 text-sm font-medium leading-relaxed mb-6">
                Through our workshops, bootcamps, and mentorship programmes
              </p>

              {/* Big metric */}
              <div className="font-grotesk font-black text-6xl text-slate-900 leading-none mb-1">
                120<span className="text-primary">+</span>
              </div>
              <div className="text-slate-400 text-sm mb-6">Workshops per year</div>
            </div>

            {/* Bottom availability pill */}
            <div className="flex items-center gap-2 pt-5 border-t border-slate-100">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs font-grotesk font-semibold text-slate-400 tracking-wide uppercase">
                Open for new members
              </span>
            </div>
          </motion.div>

          {/* Card 3 — Dark card with trend line */}
          <motion.div
            className="rounded-2xl p-6 flex flex-col justify-between min-h-[280px] relative overflow-hidden"
            style={{ background: '#1e2130' }}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* Trend line bg graphic */}
            <TrendLine />

            {/* Top text */}
            <p className="relative z-10 text-slate-600 text-sm leading-relaxed font-medium max-w-[200px]">
              We've empowered developers and makers across Zimbabwe and beyond
            </p>

            {/* Bottom: rating + label */}
            <div className="relative z-10 flex items-end justify-between pt-6 mt-6 border-t border-white/10">
              <div>
                <div className="font-grotesk font-black text-slate-900 leading-none mb-1">
                  <span className="text-5xl">50</span>
                  <span className="text-3xl text-secondary">+</span>
                </div>
                <div className="text-slate-400 text-xs">Projects shipped</div>
              </div>
              <div className="text-right">
                <div className="text-slate-400 text-[10px] font-grotesk font-semibold tracking-widest uppercase leading-relaxed">
                  Trusted by<br />communities<br />nationwide
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default MissionSection;
