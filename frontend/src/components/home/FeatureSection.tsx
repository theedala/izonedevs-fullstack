import React from 'react';
import { Link } from 'react-router-dom';
import { CodeIcon, CpuIcon } from 'lucide-react';
const FeatureSection = () => {
  const features = [{
    title: 'Software Development Community',
    description: 'Join our community of developers working on web, mobile, AI, and other software projects. Access mentorship, resources, and collaborative opportunities.',
    icon: <CodeIcon size={32} className="text-primary" />,
    link: '/communities/sdc'
  }, {
    title: 'Hardware Development Community',
    description: 'Explore electronics, IoT, robotics, and physical computing. Get hands‑on with our equipment and learn from experienced makers.',
    icon: <CpuIcon size={32} className="text-primary" />,
    link: '/communities/hdc'
  }];
  return <section className="py-16 bg-dark-light">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Our Communities</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            iZonehub Makerspace provides a platform for tech enthusiasts to
            collaborate, learn, and innovate together.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => <div key={index} className="card p-6 hover:transform hover:-translate-y-1 hover:shadow-neon-sm">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-white/70 mb-4">{feature.description}</p>
              <Link to={feature.link} className="text-primary hover:text-primary/80 font-medium inline-flex items-center">
                Learn more
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </Link>
            </div>)}
        </div>
      </div>
    </section>;
};
export default FeatureSection;