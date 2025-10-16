import React from 'react';
import SectionTitle from '../ui/SectionTitle';
import CodeBlock from '../ui/CodeBlock';
import { motion } from 'framer-motion';
import { RocketIcon, CodeIcon, UsersIcon, GraduationCapIcon } from 'lucide-react';
const MissionSection = () => {
  return <section className="py-16 bg-dark-light">
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
          <SectionTitle title="Our Mission" subtitle="At iZonehub Makerspace, we're building Zimbabwe's tech future through collaboration, innovation, and education." />
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{
          opacity: 0,
          x: -30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true,
          margin: '-100px'
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }}>
            <div className="space-y-6">
              <motion.div className="flex items-start" whileHover={{
              x: 5
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}>
                <motion.div className="mt-1 mr-4 p-2 bg-primary/10 rounded-lg" whileHover={{
                rotate: 10,
                scale: 1.1
              }}>
                  <RocketIcon size={24} className="text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Innovation Hub</h3>
                  <p className="text-white/70">
                    We provide the tools, space, and community for innovators to
                    transform ideas into reality, driving technological
                    advancement in Zimbabwe.
                  </p>
                </div>
              </motion.div>
              <motion.div className="flex items-start" whileHover={{
              x: 5
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}>
                <motion.div className="mt-1 mr-4 p-2 bg-primary/10 rounded-lg" whileHover={{
                rotate: 10,
                scale: 1.1
              }}>
                  <CodeIcon size={24} className="text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Skills Development</h3>
                  <p className="text-white/70">
                    Through workshops, bootcamps, and mentorship, we equip the
                    next generation of tech talent with practical skills for the
                    digital economy.
                  </p>
                </div>
              </motion.div>
              <motion.div className="flex items-start" whileHover={{
              x: 5
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}>
                <motion.div className="mt-1 mr-4 p-2 bg-primary/10 rounded-lg" whileHover={{
                rotate: 10,
                scale: 1.1
              }}>
                  <UsersIcon size={24} className="text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Community Building</h3>
                  <p className="text-white/70">
                    We foster a collaborative ecosystem where developers,
                    makers, and entrepreneurs can connect, share knowledge, and
                    grow together.
                  </p>
                </div>
              </motion.div>
              <motion.div className="flex items-start" whileHover={{
              x: 5
            }} transition={{
              type: 'spring',
              stiffness: 400,
              damping: 10
            }}>
                <motion.div className="mt-1 mr-4 p-2 bg-primary/10 rounded-lg" whileHover={{
                rotate: 10,
                scale: 1.1
              }}>
                  <GraduationCapIcon size={24} className="text-primary" />
                </motion.div>
                <div>
                  <h3 className="text-xl font-bold mb-2">Tech Education</h3>
                  <p className="text-white/70">
                    We bridge the digital divide by making technology education
                    accessible to all Zimbabweans, regardless of background or
                    resources.
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
          <motion.div className="relative" initial={{
          opacity: 0,
          x: 30
        }} whileInView={{
          opacity: 1,
          x: 0
        }} viewport={{
          once: true,
          margin: '-100px'
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }}>
            <motion.div whileHover={{
            scale: 1.02,
            rotate: 1
          }} transition={{
            type: 'spring',
            stiffness: 400,
            damping: 10
          }}>
              <CodeBlock title="mission.js" code={`// iZonehub Makerspace Core Values
const coreValues = {
  innovation: "Creating solutions for local challenges",
  collaboration: "Working together across disciplines",
  education: "Sharing knowledge and skills freely",
  empowerment: "Building self-reliance in tech",
  inclusivity: "Making tech accessible to all"
};
function createImpact(community, skills, resources) {
  return community
    .map(member => member.learn(skills))
    .filter(member => member.innovate())
    .reduce((impact, innovation) => {
      return impact + innovation.solveLocalProblems();
    }, 0);
}
// Our commitment to Zimbabwe's tech future
export default function buildTechEcosystem() {
  return createImpact(
    communityMembers,
    technicalSkills,
    makerResources
  );
}`} language="javascript" className="shadow-neon-sm" />
            </motion.div>
            <motion.div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-lg border border-primary/20 -z-10" animate={{
            rotate: [0, 5, 0, -5, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          }} transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: 'loop'
          }} />
            <motion.div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-lg border border-primary/20 -z-10" animate={{
            rotate: [0, -5, 0, 5, 0],
            scale: [1, 1.05, 1, 1.05, 1]
          }} transition={{
            duration: 8,
            repeat: Infinity,
            repeatType: 'loop'
          }} />
          </motion.div>
        </div>
      </div>
    </section>;
};
export default MissionSection;