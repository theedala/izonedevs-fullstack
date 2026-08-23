import { motion } from 'framer-motion';
import { UsersIcon, CodeIcon, CalendarIcon, AwardIcon } from '../ui/icons';

const stats = [
  { value: '500+', label: 'Community Members', Icon: UsersIcon },
  { value: '50+', label: 'Completed Projects', Icon: CodeIcon },
  { value: '120+', label: 'Workshops Per Year', Icon: CalendarIcon },
  { value: '15+', label: 'Tech Awards', Icon: AwardIcon },
];

const StatsSection = () => {
  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          {stats.map(({ value, label, Icon }, i) => (
            <motion.div
              key={label}
              className="text-center"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className={`inline-flex p-3 rounded-xl mb-4 ${i % 2 === 0 ? 'bg-orange-50 text-secondary' : 'bg-blue-50 text-primary'}`}>
                <Icon size={22} />
              </div>
              <div className={`font-grotesk font-black text-5xl md:text-6xl mb-2 leading-none ${i % 2 === 0 ? 'text-primary' : 'text-secondary'}`}>
                {value}
              </div>
              <div className="font-grotesk text-slate-500 text-sm font-medium">{label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
