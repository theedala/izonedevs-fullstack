import React, { useState } from 'react';
import Button from '../ui/Button';
import { ContactService } from '../../services';
interface ContactFormProps {
  className?: string;
}
const ContactForm: React.FC<ContactFormProps> = ({
  className = ''
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
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
    setError('');
    
    try {
      await ContactService.sendMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error: any) {
      setError(error.response?.data?.detail || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return <div className={`bg-dark-lighter p-6 rounded-lg border border-neutral/20 ${className}`}>
      <h3 className="text-2xl font-bold mb-6">Get In Touch</h3>
      {isSubmitted ? <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/20 rounded-full mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h4 className="text-xl font-bold mb-2">Message Sent!</h4>
          <p className="text-white/70 mb-4">
            Thank you for contacting us. We'll get back to you as soon as
            possible.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Send Another Message
          </Button>
        </div> : <form onSubmit={handleSubmit}>
          {error && <div className="mb-6 p-4 bg-danger/20 border border-danger/30 rounded-lg text-white">
              {error}
            </div>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block mb-2 text-sm font-medium">
                Your Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary" placeholder="John Doe" />
            </div>
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium">
                Email Address
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary" placeholder="john@example.com" />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="subject" className="block mb-2 text-sm font-medium">
              Subject
            </label>
            <input type="text" id="subject" name="subject" value={formData.subject} onChange={handleChange} required className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary" placeholder="How can we help you?" />
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 text-sm font-medium">
              Message
            </label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} required rows={5} className="w-full bg-dark border border-neutral/30 rounded-lg p-3 focus:outline-none focus:border-primary" placeholder="Your message here..."></textarea>
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
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </div>
        </form>}
    </div>;
};
export default ContactForm;