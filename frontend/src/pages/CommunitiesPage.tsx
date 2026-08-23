import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import JoinForm from '../components/communities/JoinForm';
import { CodeIcon, CpuIcon, UsersIcon, ArrowRightIcon } from '../components/ui/icons';

const communities = [
  {
    id: 'sdc',
    Icon: CodeIcon,
    title: 'Software Development Community',
    description: 'Coding bootcamps, hackathons, mentorship, and real project collaborations for developers of every skill level.',
    memberCount: 150,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80',
    accent: '#2c378b',
    light: '#eef0f8',
    tags: ['React', 'Python', 'Node.js'],
  },
  {
    id: 'hdc',
    Icon: CpuIcon,
    title: 'Hardware Development Community',
    description: 'Hands-on access to 3D printers, microcontrollers, and an electronics lab to bring your ideas to life.',
    memberCount: 120,
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?auto=format&fit=crop&w=600&q=80',
    accent: '#f56e00',
    light: '#fff4ec',
    tags: ['Arduino', '3D Printing', 'IoT'],
  },
];

const CommunitiesPage = () => {
  return (
    <div className="min-h-screen bg-white">

      {/* Header */}
      <section className="pt-20 pb-14 text-center" style={{ background: '#f4f4f5' }}>
        <div className="max-w-xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 mb-5">
              <UsersIcon size={13} className="text-primary" />
              <span className="text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-primary">Community</span>
            </div>
            <h1 className="font-grotesk font-black text-slate-900 text-4xl md:text-5xl leading-tight mb-4">
              Find your people,<br />
              <span className="text-secondary">build together.</span>
            </h1>
            <p className="text-slate-500 text-sm leading-relaxed">
              Join a specialised community of makers and developers collaborating inside Zimbabwe's most active innovation hub.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cards */}
      <section className="py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {communities.map((c, i) => (
              <motion.div
                key={c.id}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-100 flex flex-col"
                style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
              >
                {/* Image */}
                <div className="relative overflow-hidden" style={{ height: 200 }}>
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  {/* Top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ background: c.accent }} />

                  {/* Member pill */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm rounded-full px-2.5 py-1 shadow-sm">
                    <UsersIcon size={10} style={{ color: c.accent }} />
                    <span className="text-[11px] font-grotesk font-bold text-slate-800">{c.memberCount} members</span>
                  </div>

                  {/* Icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: c.accent }}>
                    <c.Icon size={15} color="white" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="font-grotesk font-black text-slate-900 text-base leading-snug mb-2">{c.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed mb-4 flex-1">{c.description}</p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {c.tags.map(tag => (
                      <span key={tag}
                        className="px-2 py-0.5 rounded-md text-[10px] font-grotesk font-semibold"
                        style={{ background: c.light, color: c.accent }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA row */}
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <Link
                      to={`/communities/${c.id}`}
                      className="inline-flex items-center gap-1.5 text-sm font-grotesk font-semibold transition-colors"
                      style={{ color: c.accent }}
                    >
                      Learn more <ArrowRightIcon size={13} />
                    </Link>
                    <Link
                      to={`/communities/${c.id}#join`}
                      className="px-4 py-2 rounded-full text-xs font-grotesk font-semibold text-white transition-all hover:opacity-90"
                      style={{ background: c.accent }}
                    >
                      Join
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Coming soon */}
          <motion.div
            className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
            <p className="font-grotesk font-semibold text-slate-400 text-sm">More communities coming soon</p>
            <div className="flex flex-wrap gap-2">
              {['AI & ML', 'Design', 'Entrepreneurship'].map(n => (
                <span key={n} className="px-2.5 py-1 rounded-full text-[11px] font-grotesk font-semibold text-slate-400 bg-white border border-slate-200">{n}</span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Join form */}
      <section className="py-20" style={{ background: '#f4f4f5' }} id="join">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-10"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
            <span className="inline-block text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-4">Apply</span>
            <h2 className="font-grotesk font-normal text-slate-500 text-3xl leading-tight">Ready to get started?</h2>
            <h2 className="font-grotesk font-black text-slate-900 text-3xl leading-tight">Join a community today.</h2>
            <p className="text-slate-500 text-sm mt-4 max-w-md mx-auto leading-relaxed">
              Fill in your details and we'll get you connected with the right community.
            </p>
          </motion.div>
          <motion.div
            className="bg-white rounded-2xl border border-slate-100 p-8 shadow-[0_4px_32px_rgba(0,0,0,0.06)]"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.15 }}>
            <JoinForm />
          </motion.div>
        </div>
      </section>

    </div>
  );
};

export default CommunitiesPage;
