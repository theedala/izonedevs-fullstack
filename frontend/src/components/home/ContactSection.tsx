import { MapPinIcon, ClockIcon, PhoneIcon, MailIcon, ArrowRightIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const contactDetails = [
  {
    Icon: MapPinIcon,
    label: 'Address',
    lines: ['4th Floor, Three Anchor House', '54 Jason Moyo Avenue, Harare'],
    color: 'bg-orange-50 text-secondary',
  },
  {
    Icon: ClockIcon,
    label: 'Opening Hours',
    lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Saturday: 10:00 AM – 4:00 PM'],
    color: 'bg-blue-50 text-primary',
  },
  {
    Icon: PhoneIcon,
    label: 'Phone',
    lines: ['+263 778 440 344'],
    color: 'bg-orange-50 text-secondary',
  },
  {
    Icon: MailIcon,
    label: 'Email',
    lines: ['info@izonedevs.co.zw'],
    color: 'bg-blue-50 text-primary',
  },
];

const ContactSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <motion.div
          className="text-center mb-14"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-block text-[11px] font-grotesk font-bold tracking-[0.18em] uppercase text-secondary mb-3">
            Visit Us
          </span>
          <h2 className="font-grotesk font-normal text-slate-500 text-3xl md:text-4xl leading-tight">We're right in the heart</h2>
          <h2 className="font-grotesk font-black text-slate-900 text-3xl md:text-4xl leading-tight">of Harare, Zimbabwe.</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Map */}
          <motion.div
            className="rounded-2xl overflow-hidden border border-slate-100"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)', minHeight: 320 }}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6 }}
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.4776087924373!2d31.044686315167476!3d-17.824058687625995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4e5b8b6f6b7%3A0x8b8f8f8f8f8f8f8f!2s54%20Jason%20Moyo%20Ave%2C%20Harare%2C%20Zimbabwe!5e0!3m2!1sen!2sus!4v1682431149461!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 320, display: 'block' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="iZonehub location"
            />
          </motion.div>

          {/* Contact info */}
          <motion.div
            className="bg-white rounded-2xl p-8 border border-slate-100 flex flex-col"
            style={{ boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-60px' }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-grotesk font-black text-slate-900 text-xl mb-7">Contact Information</h3>

            <div className="space-y-5 flex-1">
              {contactDetails.map(({ Icon, label, lines, color }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${color}`}>
                    <Icon size={16} />
                  </div>
                  <div>
                    <h4 className="font-grotesk font-semibold text-slate-900 text-sm mb-1">{label}</h4>
                    {lines.map(line => (
                      <p key={line} className="text-slate-500 text-sm">{line}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center gap-2 mt-8 px-6 py-3 rounded-full bg-primary text-white text-sm font-grotesk font-semibold hover:bg-primary/90 hover:shadow-[0_4px_20px_rgba(44,55,139,0.3)] transition-all duration-300 self-start"
            >
              Get in touch <ArrowRightIcon size={14} />
            </Link>
          </motion.div>
        </div>

      </div>
    </section>
  );
};

export default ContactSection;
