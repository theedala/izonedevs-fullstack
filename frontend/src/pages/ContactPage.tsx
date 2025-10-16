import SectionTitle from '../components/ui/SectionTitle';
import ContactForm from '../components/contact/ContactForm';
import FAQ from '../components/contact/FAQ';
import { MapPinIcon, ClockIcon, PhoneIcon, MailIcon, FacebookIcon, LinkedinIcon } from 'lucide-react';
const ContactPage = () => {
  const faqItems = [{
    question: 'How can I join iZonehub Makerspace?',
    answer: 'You can join by filling out the application form on our Communities page. We welcome members of all skill levels, from beginners to experts.'
  }, {
    question: 'Do you offer any free workshops or events?',
    answer: 'Yes, we regularly host free introductory workshops, tech talks, and community meetups. Check our Events page for upcoming free events.'
  }, {
    question: 'What equipment and resources are available at the makerspace?',
    answer: 'Our makerspace is equipped with 3D printers, electronics workbenches, soldering stations, development boards, robotics kits, and a computer lab with design and development software.'
  }, {
    question: 'Can I use the makerspace for my own projects?',
    answer: 'Absolutely! Members have access to our facilities and equipment for personal and collaborative projects during our operating hours.'
  }, {
    question: 'Do you offer mentorship for beginners?',
    answer: 'Yes, we have experienced community members who serve as mentors for newcomers. We also pair beginners with more experienced members on collaborative projects.'
  }, {
    question: 'How can my organization partner with iZonehub?',
    answer: 'We welcome partnerships with educational institutions, tech companies, and organizations that align with our mission. Please contact us at partnerships@izonedevs.co.zw to discuss collaboration opportunities.'
  }];
  return <div className="min-h-screen bg-dark">
      {/* Contact info section */}
      <section className="py-16 bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Contact Us" subtitle="Get in touch with the iZonehub team for inquiries, partnerships, or to learn more about our programs." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20 hover:border-primary/40 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <MapPinIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Visit Us</h3>
              <p className="text-white/70">
                4th Floor, Three Anchor House
                <br />
                54 Jason Moyo Avenue
                <br />
                Harare, Zimbabwe
              </p>
            </div>
            <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20 hover:border-primary/40 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <ClockIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Opening Hours</h3>
              <p className="text-white/70">
                Monday - Friday: 9:00 AM - 6:00 PM
                <br />
                Saturday: 10:00 AM - 4:00 PM
                <br />
                Sunday: Closed
              </p>
            </div>
            <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20 hover:border-primary/40 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <PhoneIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-white/70">
                  Calls: +263 778 440 344<br />
                  WhatsApp: +263 71 249 1104
                </p>
            </div>
            <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20 hover:border-primary/40 transition-all duration-300">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                <MailIcon size={24} className="text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Email Us</h3>
              <p className="text-white/70">
                General: izonedevs@izonedevs.co.zw
                <br />
                Support: izonedevs@izonedevs.co.zw
              </p>
            </div>
          </div>
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold mb-4">Connect With Us</h3>
            <div className="flex justify-center space-x-6">
              <a href="https://x.com/izonehub?lang=en" className="w-12 h-12 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://www.facebook.com/izonehub/" className="w-12 h-12 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <FacebookIcon size={24} />
              </a>
              <a href="https://www.tiktok.com/@izonehub8" className="w-12 h-12 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M19.321 5.562a5.124 5.124 0 01-.443-.258 6.228 6.228 0 01-1.137-.966c-.849-.849-1.254-1.892-1.254-2.892V1h-3.313v14.66c0 1.395-1.132 2.527-2.527 2.527S8.12 17.055 8.12 15.66c0-1.395 1.132-2.527 2.527-2.527.284 0 .556.047.812.133V9.952c-.265-.04-.537-.061-.812-.061-3.037 0-5.495 2.458-5.495 5.495S7.61 21.38 10.647 21.38s5.495-2.458 5.495-5.495V9.481a8.963 8.963 0 004.179.988V7.156a5.124 5.124 0 01-1-.594z"/>
                </svg>
              </a>
              <a href="https://zw.linkedin.com/company/izonehub" className="w-12 h-12 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <LinkedinIcon size={24} />
              </a>
              <a href="https://wa.me/263712491104" className="w-12 h-12 bg-dark-lighter rounded-full flex items-center justify-center hover:bg-primary/20 hover:text-primary transition-all duration-300">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.488"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* Map and form section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Send Us a Message</h2>
              <p className="text-white/70 mb-8">
                Have a question, suggestion, or want to learn more about
                iZonehub Makerspace? Fill out the form below and we'll get back
                to you as soon as possible.
              </p>
              <ContactForm />
            </div>
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Location</h2>
              <p className="text-white/70 mb-8">
                iZonehub Makerspace is centrally located in Harare, easily
                accessible by public transportation and with parking available
                on-site.
              </p>
              <div className="bg-dark-lighter rounded-lg overflow-hidden border border-neutral/20 h-96 mb-8">
                <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3798.4776087924373!2d31.044686315167476!3d-17.824058687625995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1931a4e5b8b6f6b7%3A0x8b8f8f8f8f8f8f8f!2s54%20Jason%20Moyo%20Ave%2C%20Harare%2C%20Zimbabwe!5e0!3m2!1sen!2sus!4v1682431149461!5m2!1sen!2sus" width="100%" height="100%" style={{
                border: 0
              }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="iZonehub location"></iframe>
              </div>
              <div id="event-proposal" className="bg-dark-lighter p-6 rounded-lg border border-primary/30">
                <h3 className="text-xl font-bold mb-4">Host an Event</h3>
                <p className="text-white/70 mb-4">
                  Interested in hosting a workshop, meetup, or tech event at
                  iZonehub? We welcome community-led initiatives and can provide
                  the space and resources you need.
                </p>
                <a href="mailto:events@izonedevs.co.zw?subject=Event%20Proposal" className="inline-flex items-center text-primary hover:text-primary/80">
                  Submit an event proposal
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* FAQ section */}
      <section className="py-16 bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Frequently Asked Questions" subtitle="Find answers to common questions about iZonehub Makerspace." />
          <div className="max-w-3xl mx-auto">
            <FAQ items={faqItems} />
          </div>
        </div>
      </section>
    </div>;
};
export default ContactPage;