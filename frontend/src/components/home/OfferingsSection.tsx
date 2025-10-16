import React, { Children } from 'react';
import SectionTitle from '../ui/SectionTitle';
import { motion } from 'framer-motion';
import { CodeIcon, CalendarIcon, BookOpenIcon, UsersIcon, GraduationCapIcon, CheckCircleIcon, HeartIcon, BrainIcon } from 'lucide-react';
const OfferingsSection = () => {
  const offerings = [{
    title: 'Software Development',
    description: 'Collaborative coding sessions, hackathons, and software project development with modern tools and frameworks.',
    icon: <CodeIcon size={32} className="text-primary" />
  }, {
    title: 'Community Events',
    description: 'Regular meetups, workshops, and networking events to connect with like-minded innovators and industry experts.',
    icon: <UsersIcon size={32} className="text-primary" />
  }, {
    title: 'Interactive Calendar',
    description: 'Stay updated with our comprehensive events calendar featuring workshops, training sessions, and tech talks.',
    icon: <CalendarIcon size={32} className="text-primary" />
  }, {
    title: 'Knowledge Hub',
    description: 'Access our library of resources, tutorials, and documentation to accelerate your learning journey.',
    icon: <BookOpenIcon size={32} className="text-primary" />
  }, {
    title: 'Hardware Prototyping',
    description: 'Access to 3D printers, microcontrollers, and electronics equipment for building physical products.',
    icon: <div size={32} className="text-primary" />
  }, {
    title: 'Mentorship Programs',
    description: 'Learn from experienced professionals through our structured mentorship programs and skill-sharing initiatives.',
    icon: <GraduationCapIcon size={32} className="text-primary" />
  }];
  const benefits = [{
    title: 'Free Access',
    description: 'No membership fees required to join our community.',
    icon: <HeartIcon size={24} className="text-primary" />
  }, {
    title: 'All Skill Levels',
    description: 'From beginners to experts, everyone is welcome to learn and contribute.',
    icon: <BrainIcon size={24} className="text-primary" />
  }, {
    title: 'Mentorship',
    description: 'Get guidance from experienced professionals in your field.',
    icon: <GraduationCapIcon size={24} className="text-primary" />
  }];
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      y: 20,
      opacity: 0
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };
  return <section className="py-16 bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: '-100px'
      }} transition={{
        duration: 0.6
      }}>
          <SectionTitle title="What We Offer" subtitle="Everything you need to innovate, collaborate, and grow your skills" />
        </motion.div>
        {/* Main offerings grid */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
        once: true,
        margin: '-100px'
      }}>
          {offerings.map((offering, index) => <motion.div key={index} className="card p-6 hover:transform hover:-translate-y-1 hover:shadow-neon-sm transition-all duration-300" variants={itemVariants} whileHover={{
          scale: 1.03,
          boxShadow: '0 0 5px #2e348a, 0 0 15px #2e348a'
        }}>
              <motion.div className="mb-4" initial={{
            scale: 0.8,
            opacity: 0.5
          }} whileInView={{
            scale: 1,
            opacity: 1
          }} transition={{
            duration: 0.3,
            delay: index * 0.05
          }}>
                {offering.icon}
              </motion.div>
              <h3 className="text-xl font-bold mb-2">{offering.title}</h3>
              <p className="text-white/70">{offering.description}</p>
            </motion.div>)}
        </motion.div>
        {/* Open to Everyone section */}
        <motion.div className="bg-dark-lighter rounded-lg p-8 border border-primary/30" initial={{
        opacity: 0,
        y: 40
      }} whileInView={{
        opacity: 1,
        y: 0
      }} viewport={{
        once: true,
        margin: '-100px'
      }} transition={{
        duration: 0.7
      }}>
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-2">Open to Everyone</h3>
            <p className="text-white/70 max-w-2xl mx-auto">
              With no membership fees and a welcoming culture open to all skill
              levels, iZonehub is the perfect place to learn, collaborate, and
              grow your tech skills.
            </p>
          </div>
          <motion.div className="grid grid-cols-1 md:grid-cols-3 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{
          once: true,
          margin: '-100px'
        }}>
            {benefits.map((benefit, index) => <motion.div key={index} className="bg-dark p-6 rounded-lg border border-neutral/20" variants={itemVariants} whileHover={{
            scale: 1.03
          }}>
                <div className="flex items-center mb-4">
                  <motion.div className="p-2 bg-primary/10 rounded-full mr-3" whileHover={{
                rotate: 10,
                scale: 1.1
              }}>
                    {benefit.icon}
                  </motion.div>
                  <h4 className="text-lg font-bold">{benefit.title}</h4>
                </div>
                <p className="text-white/70">{benefit.description}</p>
              </motion.div>)}
          </motion.div>
        </motion.div>
      </div>
    </section>;
};
export default OfferingsSection;