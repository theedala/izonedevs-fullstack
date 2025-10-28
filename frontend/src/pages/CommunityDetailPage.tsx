import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import JoinForm from '../components/communities/JoinForm';
import { CodeIcon, CpuIcon, CheckCircleIcon, User } from 'lucide-react';
import { ProjectsService, Project } from '../services';
const CommunityDetailPage = () => {
  const {
    id
  } = useParams<{
    id: string;
  }>();
  
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  // Map frontend community IDs to backend community IDs/names
  const communityMapping = {
    'sdc': 'Software Development Community',
    'hdc': 'Hardware Development Community'
  };

  useEffect(() => {
    if (id && communityMapping[id as keyof typeof communityMapping]) {
      fetchCommunityProjects();
    }
  }, [id]);

  const fetchCommunityProjects = async () => {
    try {
      setLoadingProjects(true);
      // For now, get all projects and filter by community name in the description or title
      // TODO: Update backend to support filtering by community_id
      const response = await ProjectsService.getProjects({ size: 50 });
      
      const communityKeywords = id === 'sdc' 
        ? ['software', 'web', 'app', 'api', 'react', 'javascript', 'python', 'development', 'frontend', 'backend']
        : ['hardware', 'iot', 'arduino', 'electronics', 'sensor', 'embedded', 'raspberry', 'circuit'];
      
      // Filter projects based on community relevance
      const filteredProjects = response.items.filter(project => {
        const searchText = `${project.title} ${project.description} ${project.technologies?.join(' ') || ''} ${project.category || ''}`.toLowerCase();
        return communityKeywords.some(keyword => searchText.includes(keyword));
      });
      
      setProjects(filteredProjects.slice(0, 6)); // Show max 6 projects
    } catch (error) {
      console.error('Error fetching community projects:', error);
    } finally {
      setLoadingProjects(false);
    }
  };
  
  const communities = {
    sdc: {
      title: 'Software Development Community',
      description: 'Foster a collaborative and innovative environment for software developers of all skill levels.',
      icon: <CodeIcon size={32} className="text-primary" />,
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      meetingSchedule: 'Every Saturday, 10:30 AM - 4:00 PM',
      location: 'iZonehub Makerspace, 4th Floor, Three Anchor House, 54 Jason Moyo Avenue, Harare',
      leadName: 'Moses Tinotenda Mukudu',
      leadTitle: 'Software Development Community Lead & Full-Stack Developer',
      leadBio: 'Passionate website developer from Zimbabwe with expertise in React, Next.js, TypeScript, Django, and Flutter. Lead developer for iZone Devs platform and creator of multiple award-winning applications. Currently mentors developers and leads the Software Development Community at iZonehub.',
      leadImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      benefits: [
        'Access to development tools and software licenses',
        'Code review sessions with experienced developers', 
        'Coding bootcamps and intensive workshops',
        'Hackathons and coding challenges',
        'Mentorship sessions with industry experts',
        'Networking events and career opportunities',
        'Collaborative project opportunities',
        'Regular workshops on latest technologies and trends'
      ]
    },
    hdc: {
      title: 'Hardware Development Community',
      description: 'Collaborate on innovative hardware projects and push the boundaries of technology through hands-on learning.',
      icon: <CpuIcon size={32} className="text-primary" />,
      image: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      meetingSchedule: 'Every Saturday, 10:30 AM - 4:00 PM',
      location: 'iZonehub Makerspace, 4th Floor, Three Anchor House, 54 Jason Moyo Avenue, Harare',
      leadName: 'Ronald Tinotenda Tsatsi',
      leadTitle: 'Hardware Development Community Lead & Electronics Engineer',
      leadBio: 'Expert in hardware innovation, embedded systems development, and IoT solutions. Leads hands-on workshops in electronics projects, Arduino programming, and circuit design. Passionate about mentoring members in creating practical hardware solutions for real-world challenges.',
      leadImage: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80',
      benefits: [
        'Access to electronics lab and state-of-the-art equipment',
        'Component library and resources', 
        'Hands-on workshops and skill-building sessions',
        'Prototyping support and guidance from experts',
        'Hardware design and development workshops',
        'Connections with manufacturing and industry partners',
        'Collaborative hardware innovation projects',
        'Access to tools for turning ideas into reality'
      ]
    }
  };
  const community = communities[id as keyof typeof communities];
  if (!community) {
    return <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Community Not Found</h1>
            <p className="text-white/70 mb-8">
              The community you're looking for doesn't exist.
            </p>
            <Button href="/communities" variant="primary">
              View All Communities
            </Button>
          </div>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-dark">
      {/* Hero section */}
      <div className="relative h-80 md:h-96 flex items-center" style={{
      backgroundImage: `linear-gradient(to bottom, rgba(18, 18, 18, 0.7), rgba(18, 18, 18, 0.9)), url(${community.image})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-primary/20 rounded-lg mr-4">
                {community.icon}
              </div>
              <h1 className="text-4xl font-bold">{community.title}</h1>
            </div>
            <p className="text-xl text-white/80 mb-6">
              {community.description}
            </p>
            <div className="flex flex-wrap gap-4">
              <Button href="#join" variant="primary" size="lg">
                Join Community
              </Button>
              <Button href="#projects" variant="outline" size="lg">
                View Projects
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Main content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main content */}
          <div className="lg:col-span-2">
            <section className="mb-16">
              <SectionTitle title="About This Community" centered={false} />
              <p className="text-white/70 mb-6">
                {community.description} Our meetings are held{' '}
                {community.meetingSchedule} at {community.location || 'iZonehub Makerspace, 4th Floor, Three Anchor House, 54 Jason Moyo Avenue, Harare'}.
              </p>
              <p className="text-white/70 mb-6">
                Whether you're a beginner looking to learn or an experienced
                professional wanting to collaborate and share knowledge, our
                community welcomes all skill levels and backgrounds.
              </p>
              <p className="text-white/70">
                Join us to work on exciting projects, develop new skills, and
                connect with other tech enthusiasts in Zimbabwe.
              </p>
            </section>
            <section className="mb-16" id="projects">
              <SectionTitle title="Current Projects" centered={false} />
              {loadingProjects ? (
                <div className="text-center py-8">
                  <div className="text-white/70">Loading community projects...</div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {projects.length > 0 ? (
                    projects.map((project) => (
                      <div key={project.id} className="bg-dark-lighter p-6 rounded-lg border border-neutral/20 hover:border-primary/40 transition-all duration-300">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="text-xl font-bold">{project.title}</h3>
                          {project.featured && (
                            <span className="bg-primary/20 text-primary px-2 py-1 rounded text-xs font-medium">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-white/70 mb-4">{project.description}</p>
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.slice(0, 4).map((tech: string, index: number) => (
                              <span key={index} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                                {tech}
                              </span>
                            ))}
                            {project.technologies.length > 4 && (
                              <span className="text-white/60 text-xs">+{project.technologies.length - 4} more</span>
                            )}
                          </div>
                        )}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              project.status === 'completed' ? 'bg-green-500/20 text-green-400' :
                              project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-orange-500/20 text-orange-400'
                            }`}>
                              {project.status?.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </span>
                            {project.difficulty && (
                              <span className="text-white/60 text-xs">{project.difficulty}</span>
                            )}
                          </div>
                          <Button href={`/projects/${project.id}`} variant="outline" size="sm">
                            Learn More
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12">
                      <div className="text-white/60 mb-4">
                        No projects found for this community yet.
                      </div>
                      <p className="text-white/40 text-sm mb-6">
                        Be the first to create a project for the {community.title}!
                      </p>
                      <Button href="/admin" variant="primary" size="sm">
                        Create Project
                      </Button>
                    </div>
                  )}
                </div>
              )}
            </section>
            <section>
              <SectionTitle title="Community Benefits" centered={false} />
              <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                <ul className="space-y-4">
                  {community.benefits.map((benefit, index) => <li key={index} className="flex items-start">
                      <CheckCircleIcon size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>)}
                </ul>
              </div>
            </section>
          </div>
          {/* Sidebar */}
          <div>
            <div className="sticky top-24">
              {/* Community lead */}
              <div className="bg-dark-lighter rounded-lg border border-neutral/20 overflow-hidden mb-8">
                <div className="p-6 border-b border-neutral/20">
                  <h3 className="text-xl font-bold">Community Lead</h3>
                </div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mr-4 border-2 border-primary"><User size={32} className="text-primary" /></div>
                    <div>
                      <h4 className="font-bold">{community.leadName}</h4>
                      <p className="text-primary text-sm">
                        {community.leadTitle}
                      </p>
                    </div>
                  </div>
                  <p className="text-white/70 text-sm">{community.leadBio}</p>
                </div>
              </div>
              {/* Meeting schedule */}
              <div className="bg-dark-lighter rounded-lg border border-neutral/20 overflow-hidden mb-8">
                <div className="p-6 border-b border-neutral/20">
                  <h3 className="text-xl font-bold">Meeting Schedule</h3>
                </div>
                <div className="p-6">
                  <p className="text-white/70">{community.meetingSchedule}</p>
                  <p className="text-white/70 mt-2">
                    Location: {community.location || 'iZonehub Makerspace, 4th Floor, Three Anchor House, 54 Jason Moyo Avenue, Harare'}
                  </p>
                </div>
              </div>
              {/* Join form */}
              <div id="join">
                <JoinForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default CommunityDetailPage;

