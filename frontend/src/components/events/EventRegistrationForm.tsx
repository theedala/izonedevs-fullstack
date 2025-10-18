import React, { useState } from 'react';
import { X, Calendar, MapPin, Clock, DollarSign, CheckCircle } from 'lucide-react';
import Button from '../ui/Button';

interface Event {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string;
  location?: string;
  is_online: boolean;
  meeting_url?: string;
  max_attendees?: number;
  registration_fee: number;
}

interface EventRegistrationFormProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  organization: string;
  experience_level: string;
  interests: string;
  dietary_restrictions: string;
  special_requirements: string;
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  event,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    organization: '',
    experience_level: '',
    interests: '',
    dietary_restrictions: '',
    special_requirements: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) newErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email is invalid';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateStep(2)) return;

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/events/${event.id}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Registration failed');
      }

      setStep(3); // Success step
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 3000);

    } catch (error) {
      console.error('Registration error:', error);
      setErrors({
        submit: error instanceof Error ? error.message : 'Failed to register for event'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-lighter rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Register for Event</h2>
              <h3 className="text-lg text-primary font-semibold">{event.title}</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-dark rounded-full transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Event Details */}
          <div className="bg-dark rounded-lg p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Calendar className="text-primary mr-2" size={16} />
                <span>{formatDate(event.start_date)}</span>
              </div>
              <div className="flex items-center">
                <Clock className="text-primary mr-2" size={16} />
                <span>{formatTime(event.start_date)} - {formatTime(event.end_date)}</span>
              </div>
              <div className="flex items-center">
                <MapPin className="text-primary mr-2" size={16} />
                <span>{event.is_online ? 'Online Event' : event.location}</span>
              </div>
              <div className="flex items-center">
                <DollarSign className="text-primary mr-2" size={16} />
                <span>${event.registration_fee.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center space-x-4">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-primary text-white' : 'bg-dark border border-white/20'
              }`}>
                1
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-primary' : 'bg-white/20'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-primary text-white' : 'bg-dark border border-white/20'
              }`}>
                2
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-primary' : 'bg-white/20'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3 ? 'bg-green-500 text-white' : 'bg-dark border border-white/20'
              }`}>
                <CheckCircle size={16} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold mb-4">Basic Information</h4>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full bg-dark border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors ${
                      errors.name ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Enter your full name"
                  />
                  {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full bg-dark border rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors ${
                      errors.email ? 'border-red-500' : 'border-white/20'
                    }`}
                    placeholder="Enter your email address"
                  />
                  {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Organization/Company</label>
                  <input
                    type="text"
                    name="organization"
                    value={formData.organization}
                    onChange={handleInputChange}
                    className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Enter your organization or company"
                  />
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={nextStep}
                    variant="primary"
                  >
                    Next Step
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Additional Information */}
            {step === 2 && (
              <div className="space-y-4">
                <h4 className="text-lg font-semibold mb-4">Additional Information</h4>

                <div>
                  <label className="block text-sm font-medium mb-2">Experience Level</label>
                  <select
                    name="experience_level"
                    value={formData.experience_level}
                    onChange={handleInputChange}
                    className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Select your experience level</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Interests & Goals</label>
                  <textarea
                    name="interests"
                    value={formData.interests}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Tell us about your interests and what you hope to gain from this event..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dietary Restrictions</label>
                  <input
                    type="text"
                    name="dietary_restrictions"
                    value={formData.dietary_restrictions}
                    onChange={handleInputChange}
                    className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Any dietary restrictions or food allergies?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Special Requirements</label>
                  <textarea
                    name="special_requirements"
                    value={formData.special_requirements}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full bg-dark border border-white/20 rounded-lg px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Any accessibility needs or special requirements?"
                  />
                </div>

                {errors.submit && (
                  <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4">
                    <p className="text-red-400">{errors.submit}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <Button
                    onClick={() => setStep(1)}
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Registering...' : 'Complete Registration'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="text-green-400" size={32} />
                </div>
                <h4 className="text-xl font-semibold mb-2">Registration Successful!</h4>
                <p className="text-white/70 mb-4">
                  Thank you for registering! You'll receive a confirmation email with your QR code shortly.
                </p>
                <p className="text-sm text-white/60">
                  Please bring your QR code to the event for quick check-in.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventRegistrationForm;
