import React from 'react';
import StatCard from '../ui/StatCard';
import { motion } from 'framer-motion';
import { UsersIcon, CodeIcon, CalendarIcon, AwardIcon } from 'lucide-react';
const StatsSection = () => {
  const stats = [{
    value: '500+',
    label: 'Community Members',
    icon: <UsersIcon size={28} />
  }, {
    value: '50+',
    label: 'Completed Projects',
    icon: <CodeIcon size={28} />
  }, {
    value: '120+',
    label: 'Workshops Per Year',
    icon: <CalendarIcon size={28} />
  }, {
    value: '15+',
    label: 'Tech Awards',
    icon: <AwardIcon size={28} />
  }];
  return <section className="py-16 bg-dark relative overflow-hidden">
      {/* Animated background pattern */}
      <div className="absolute inset-0 opacity-5" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%232e348a' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      animation: 'patternFloat 40s linear infinite'
    }}></div>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" initial={{
        opacity: 0
      }} whileInView={{
        opacity: 1
      }} viewport={{
        once: true,
        margin: '-100px'
      }} transition={{
        duration: 0.6
      }}>
          {stats.map((stat, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 30
        }} whileInView={{
          opacity: 1,
          y: 0
        }} viewport={{
          once: true,
          margin: '-100px'
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }} whileHover={{
          scale: 1.05,
          y: -5
        }}>
              <StatCard value={stat.value} label={stat.label} icon={stat.icon} />
            </motion.div>)}
        </motion.div>
      </div>
    </section>;
};
export default StatsSection;