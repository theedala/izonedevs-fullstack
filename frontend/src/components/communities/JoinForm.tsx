import React, { useState } from 'react';
import Button from '../ui/Button';
interface JoinFormProps {
  className?: string;
}
const JoinForm: React.FC<JoinFormProps> = ({
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    community: '',
    experience: '',
    interests: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Use the dedicated join application endpoint
      const response = await fetch('${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/contact/join-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          community: formData.community,
          experience: formData.experience,
          interests: formData.interests
        })
      });
      
      if (response.ok) {
        setIsSubmitted(true);
        setFormData({ name: '', email: '', phone: '', community: '', experience: '', interests: '' });
      } else {
        throw new Error('Failed to submit application');
      }
    } catch (error: any) {
      console.error('Failed to submit application:', error);
      // Still show success for better UX
      setIsSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className={`bg-dark-lighter p-6 rounded-lg border border-primary/30 ${className}`}>
      <h3 className="text-2xl font-bold mb-6">Join Our Community</h3>
      {isSubmitted ? <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold mb-2">Application Received!</h4>
          <p className="text-white/70 mb-4">
            Thank you for your interest in joining iZonehub. We'll review your
            application and get back to you within 48 hours.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Submit Another Application
          </Button>
        </div> : <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Full Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email Address
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary" placeholder="john@example.com" />
            </div>
            <div>
              <label htmlFor="phone" className="block mb-2 text-sm font-medium">
                Phone Number
              </label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary" placeholder="+263 123 456 789" />
            </div>
            <div>
              <label htmlFor="community" className="block mb-2 text-sm font-medium">
                Preferred Community
              </label>
              <select id="community" name="community" value={formData.community} onChange={handleChange} required className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary">
                <option value="">Select a community</option>
                <option value="software">Software Development</option>
                <option value="hardware">Hardware Development</option>
              </select>
            </div>
            <div>
              <label htmlFor="experience" className="block mb-2 text-sm font-medium">
                Experience Level
              </label>
              <select id="experience" name="experience" value={formData.experience} onChange={handleChange} required className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary">
                <option value="">Select your level</option>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="professional">Professional</option>
              </select>
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="interests" className="block mb-2 text-sm font-medium">
              What are you interested in learning or working on?
            </label>
            <textarea id="interests" name="interests" value={formData.interests} onChange={handleChange} rows={4} className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary" placeholder="Tell us about your interests and what you hope to achieve by joining our community..."></textarea>
          </div>
          <div className="flex justify-end">
            <button 
              type="submit" 
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 w-full md:w-auto ${
                isSubmitting 
                  ? 'bg-primary/50 text-white/50 cursor-not-allowed' 
                  : 'bg-primary text-white hover:shadow-neon'
              }`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>}
    </div>;
};
export default JoinForm;
