import SectionTitle from '../components/ui/SectionTitle';
import CommunityCard from '../components/communities/CommunityCard';
import JoinForm from '../components/communities/JoinForm';
import { CodeIcon, CpuIcon } from 'lucide-react';
const CommunitiesPage = () => {
  const communities = [{
    id: 'sdc',
    title: 'Software Development Community',
    description: 'The Software Development Community (SDC) Programs at iZonehub Makerspace are designed to foster a collaborative and innovative environment for software developers of all skill levels. Join our community to participate in coding bootcamps, hackathons, mentorship sessions, and networking events.',
    icon: <CodeIcon size={24} className="text-primary" />,
    memberCount: 150,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }, {
    id: 'hdc',
    title: 'Hardware Development Community',
    description: 'Join our Hardware Development Community to collaborate on innovative projects and push the boundaries of hardware technology. Engage with like-minded enthusiasts through workshops, hackathons, and hands-on projects. Access state-of-the-art tools and resources to turn your hardware ideas into reality.',
    icon: <CpuIcon size={24} className="text-primary" />,
    memberCount: 120,
    image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }];
  return <div className="min-h-screen bg-dark py-16 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionTitle title="Our Communities" subtitle="Join one of our specialized communities to collaborate, learn, and innovate with like-minded individuals." />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {communities.map(community => <CommunityCard key={community.id} id={community.id} title={community.title} description={community.description} icon={community.icon} memberCount={community.memberCount} image={community.image} />)}
        </div>
        <div className="max-w-4xl mx-auto" id="join">
          <SectionTitle title="Join Our Community" subtitle="Fill out the form below to apply for membership in one of our communities." />
          <JoinForm />
        </div>
      </div>
    </div>;
};
export default CommunitiesPage;