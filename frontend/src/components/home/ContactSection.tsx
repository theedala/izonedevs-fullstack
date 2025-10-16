import { MapPinIcon, ClockIcon, PhoneIcon, MailIcon } from 'lucide-react';
import Button from '../ui/Button';
const ContactSection = () => {
  return <section className="py-16 bg-dark">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Visit Us</h2>
          <p className="text-white/70 max-w-2xl mx-auto">
            Drop by our makerspace to see our facilities, meet the community,
            and learn more about our programs.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-dark-lighter rounded-lg overflow-hidden border border-neutral/20 h-80">
            {/* Google Maps embed would go here */}
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.4776087924373!2d31.044686315167476!3d-17.824058687625995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4e5b8b6f6b7%3A0x8b8f8f8f8f8f8f8f!2s54%20Jason%20Moyo%20Ave%2C%20Harare%2C%20Zimbabwe!5e0!3m2!1sen!2sus!4v1682431149461!5m2!1sen!2sus" width="100%" height="100%" style={{
            border: 0
          }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="iZonehub location"></iframe>
          </div>
          <div className="bg-dark-lighter rounded-lg p-8 border border-neutral/20">
            <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <MapPinIcon size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Address</h4>
                  <p className="text-white/70">
                    4th Floor, Three Anchor House<br />
                    54 Jason Moyo Avenue<br />
                    Harare, Zimbabwe
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <ClockIcon size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Opening Hours</h4>
                  <p className="text-white/70">
                    Monday - Friday: 9:00 AM - 6:00 PM
                  </p>
                  <p className="text-white/70">Saturday: 10:00 AM - 4:00 PM</p>
                  <p className="text-white/70">Sunday: Closed</p>
                </div>
              </div>
              <div className="flex items-start">
                <PhoneIcon size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Phone</h4>
                  <p className="text-white/70">+263 778 440 344</p>
                </div>
              </div>
              <div className="flex items-start">
                <MailIcon size={24} className="text-primary mr-4 mt-1 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold">Email</h4>
                  <p className="text-white/70">info@izonedevs.co.zw</p>
                </div>
              </div>
            </div>
            <div className="mt-8">
              <Button href="/contact" variant="primary">
                Contact Us
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default ContactSection;