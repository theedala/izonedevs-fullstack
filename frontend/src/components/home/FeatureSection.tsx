import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Lineicons } from '@lineiconshq/react-lineicons';
import {
  UserMultiple4Outlined,
  ArrowRightOutlined,
  Code1Outlined,
  Gears3Outlined,
} from '@lineiconshq/free-icons';

const communities = [
  {
    id: 'sdc',
    icon: Code1Outlined,
    title: 'Software Development Community',
    description: 'Coding bootcamps, hackathons, peer mentorship, and real project collaborations — for developers at every level.',
    memberCount: 150,
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
    accent: '#2c378b',
  },
  {
    id: 'hdc',
    icon: Gears3Outlined,
    title: 'Hardware Development Community',
    description: 'Hands-on access to 3D printers, microcontrollers, and a full electronics lab to prototype physical products.',
    memberCount: 120,
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=400&q=80',
    accent: '#f56e00',
  },
];

const FeatureSection = () => {
  return (
    <section className="py-24" style={{ background: '#f4f4f5' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 mb-5">
            <span className="text-primary">
              <Lineicons icon={UserMultiple4Outlined} size={13} color="currentColor" />
            </span>
            <span className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-primary">
              Communities
            </span>
          </div>

          <h2 className="font-grotesk font-black text-slate-900 text-3xl md:text-4xl lg:text-5xl leading-tight mb-4">
            Be part of iZonehub's growing<br className="hidden sm:block" />
            community of <span className="text-secondary">270+ makers.</span>
          </h2>

          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            Connect with developers and hardware engineers, share skills, collaborate on projects,
            and grow inside Zimbabwe's most active tech hub.
          </p>
        </motion.div>

        {/* 2-column community grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-10">
          {communities.map((c, i) => (
            <motion.div
              key={c.id}
              className="flex gap-5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.1 }}
            >
              {/* Thumbnail */}
              <div className="flex-shrink-0 w-[88px] h-[72px] rounded-xl overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>

              {/* Text */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-1.5">
                  <Lineicons icon={c.icon} size={14} color={c.accent} />
                  <h3 className="font-grotesk font-bold text-slate-900 text-base leading-snug">
                    {c.title}
                  </h3>
                </div>

                <p className="text-slate-500 text-sm leading-relaxed mb-3">
                  {c.description}
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <div className="flex items-center gap-1.5">
                    <Lineicons icon={UserMultiple4Outlined} size={11} color={c.accent} />
                    <span className="text-xs font-grotesk font-semibold" style={{ color: c.accent }}>
                      {c.memberCount} members
                    </span>
                  </div>
                  <Link
                    to={`/communities/${c.id}`}
                    className="inline-flex items-center gap-1 text-xs font-grotesk font-semibold text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    Learn more <Lineicons icon={ArrowRightOutlined} size={11} color="currentColor" />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-14"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Link
            to="/communities"
            className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-primary text-white text-sm font-grotesk font-semibold hover:bg-primary/90 hover:shadow-[0_4px_24px_rgba(44,55,139,0.3)] transition-all duration-300"
          >
            Explore all communities <Lineicons icon={ArrowRightOutlined} size={15} color="currentColor" />
          </Link>
        </motion.div>

      </div>
    </section>
  );
};

export default FeatureSection;
