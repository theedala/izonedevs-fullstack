import React, { useState } from 'react';
import SectionTitle from '../ui/SectionTitle';
import TestimonialCard from '../ui/TestimonialCard';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = [{
    quote: 'iZonehub Makerspace gave me the skills and confidence to launch my own tech startup. The mentorship and resources were invaluable to my journey.',
    name: 'Tatenda M.',
    role: 'Software Developer & Entrepreneur',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }, {
    quote: "The hardware development community at iZonehub helped me prototype my agricultural IoT solution. Now we're implementing it in rural communities across Zimbabwe.",
    name: 'Chido R.',
    role: 'Agricultural Engineer',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }, {
    quote: "From knowing nothing about coding to becoming a professional web developer in 6 months - that's what iZonehub's training program did for me.",
    name: 'Tendai K.',
    role: 'Web Developer',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'
  }];
  const nextTestimonial = () => {
    setCurrentIndex(prev => prev === testimonials.length - 1 ? 0 : prev + 1);
  };
  const prevTestimonial = () => {
    setCurrentIndex(prev => prev === 0 ? testimonials.length - 1 : prev - 1);
  };
  return <section className="py-16 bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle title="Success Stories" subtitle="Hear from our community members about how iZonehub has helped them achieve their tech goals." />
        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}>
              {testimonials.map((testimonial, index) => <div key={index} className="w-full flex-shrink-0 px-4">
                  <TestimonialCard quote={testimonial.quote} name={testimonial.name} role={testimonial.role} image={testimonial.image} />
                </div>)}
            </div>
          </div>
          <div className="flex justify-center mt-8">
            <button onClick={prevTestimonial} className="p-2 rounded-full border border-white/20 hover:border-primary hover:text-primary mr-4" aria-label="Previous testimonial">
              <ChevronLeftIcon size={20} />
            </button>
            <div className="flex space-x-2">
              {testimonials.map((_, index) => <button key={index} onClick={() => setCurrentIndex(index)} className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-primary' : 'bg-white/30'}`} aria-label={`Go to testimonial ${index + 1}`} />)}
            </div>
            <button onClick={nextTestimonial} className="p-2 rounded-full border border-white/20 hover:border-primary hover:text-primary ml-4" aria-label="Next testimonial">
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
      </div>
    </section>;
};
export default TestimonialsSection;