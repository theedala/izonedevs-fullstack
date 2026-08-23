import Hero from '../components/home/Hero';
import MissionSection from '../components/home/MissionSection';
import OfferingsSection from '../components/home/OfferingsSection';
import FeatureSection from '../components/home/FeatureSection';
import ProjectsCarousel from '../components/home/ProjectsCarousel';
import TestimonialsSection from '../components/home/TestimonialsSection';
import BlogPreview from '../components/home/BlogPreview';
import PartnerSection from '../components/home/PartnerSection';
import ContactSection from '../components/home/ContactSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Hero />
      <MissionSection />
      <OfferingsSection />
      <FeatureSection />
      <ProjectsCarousel />
      <TestimonialsSection />
      <BlogPreview />
      <PartnerSection />
      <ContactSection />
    </div>
  );
};

export default HomePage;
