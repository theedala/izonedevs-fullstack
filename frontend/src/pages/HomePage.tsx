import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Hero from '../components/home/Hero';
import FeatureSection from '../components/home/FeatureSection';
import ProjectsCarousel from '../components/home/ProjectsCarousel';
import BlogPreview from '../components/home/BlogPreview';
import ContactSection from '../components/home/ContactSection';
import MissionSection from '../components/home/MissionSection';
import StatsSection from '../components/home/StatsSection';
import TestimonialsSection from '../components/home/TestimonialsSection';
import PartnerSection from '../components/home/PartnerSection';
import OfferingsSection from '../components/home/OfferingsSection';
// Animation wrapper component for page sections
const AnimatedSection = ({
  children,
  delay = 0
}) => {
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });
  useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);
  return <motion.div ref={ref} initial="hidden" animate={controls} variants={{
    hidden: {
      opacity: 0,
      y: 50
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay
      }
    }
  }}>
      {children}
    </motion.div>;
};
const HomePage = () => {
  return <div className="min-h-screen bg-dark">
      <Hero />
      <AnimatedSection>
        <MissionSection />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <OfferingsSection />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <FeatureSection />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <StatsSection />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <ProjectsCarousel />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <TestimonialsSection />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <BlogPreview />
      </AnimatedSection>
      <AnimatedSection delay={0.1}>
        <PartnerSection />
      </AnimatedSection>
      <AnimatedSection delay={0.2}>
        <ContactSection />
      </AnimatedSection>
    </div>;
};
export default HomePage;