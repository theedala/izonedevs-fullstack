import { useState, useEffect } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import TeamMember from '../components/about/TeamMember';
import { CheckCircleIcon } from 'lucide-react';
import CodeBlock from '../components/ui/CodeBlock';
import { TeamMembersService } from '../services';

const AboutPage = () => {
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Fallback static data
  const fallbackTeamMembers = [
    {
      name: 'Moses Tinotenda Mukudu',
      role: 'Software Development Community Lead & Full-Stack Developer',
      bio: "Passionate website developer from Zimbabwe with expertise in React, Next.js, TypeScript, Django, and Flutter. Currently working on HiSeats - a ticketing app using React. Lead developer for iZone Devs platform and creator of multiple award-winning web applications including the National Schools Excellence Awards platform.",
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      social: {
        github: 'https://github.com/tinotendamukudu',
        linkedin: 'https://linkedin.com/in/moses%20mukudu'
      }
    },
    {
      name: 'Ronald Tinotenda Tsatsi',
      role: 'Hardware Development Community Lead & Electronics Engineer',
      bio: 'Expert in hardware innovation, embedded systems development, and IoT solutions. Leads the Hardware Development Community at iZonehub, mentoring members in electronics projects, Arduino programming, and circuit design. Passionate about creating practical hardware solutions for real-world challenges.',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      social: {}
    },
    {
      name: 'Takudzwa Chitsungo',
      role: 'Full-Stack Developer',
      bio: 'Motivated developer with strong skills in software, app development, and system design. Passionate about creating innovative solutions and continuous improvement. Based in Harare.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      social: {
        github: 'https://github.com/takudzwachitsungo',
        linkedin: 'https://www.linkedin.com/in/takudzwa-chitsungo-097523227/',
        twitter: 'https://twitter.com/dalathefirst'
      }
    },
    {
      name: 'Lmapunzwana',
      role: 'Mobile & Web Developer',
      bio: 'Active contributor to iZonehub projects including the Online Learning Platform, Events Management system, and mobile applications. Specializes in TypeScript, React Native, and CSS.',
      image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      social: {
        github: 'https://github.com/Lmapunzwana'
      }
    },
    {
      name: 'Audrey Sithole',
      role: 'Software Developer',
      bio: 'Software developer at APT Software Solutions based in Harare. Works on various projects including chatbots, web applications, and user authentication systems using Java and JavaScript.',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      social: {
        github: 'https://github.com/Audrey-Sithole'
      }
    },
    {
      name: 'Operations Team',
      role: 'Operations & Community Management',
      bio: 'Our dedicated operations team manages day-to-day activities, coordinates events, and ensures smooth community operations at iZonehub Makerspace.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
      social: {}
    }
  ];

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const response = await TeamMembersService.getTeamMembers({ 
        page: 1, 
        size: 50, 
        is_active: true 
      });
      
      // Convert API data to match the expected format
      const formattedMembers = response.items.map(member => ({
        name: member.name,
        role: member.role,
        bio: member.bio || '',
        image: member.image_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
        social: {
          github: member.github_url || undefined,
          linkedin: member.linkedin_url || undefined,
          twitter: member.twitter_url || undefined
        }
      }));
      
      // Use API data if available, otherwise fallback to static data
      setTeamMembers(formattedMembers.length > 0 ? formattedMembers : fallbackTeamMembers);
    } catch (error) {
      console.error('Error fetching team members:', error);
      // Use fallback data if API fails
      setTeamMembers(fallbackTeamMembers);
    } finally {
      setLoadingTeam(false);
    }
  };

  const missionCode = `
function iZonehubMission() {
  const core = {
    innovation: "Creating solutions for local challenges",
    education: "Providing accessible tech education",
    community: "Building a collaborative ecosystem",
    sustainability: "Developing self-reliant tech skills"
  };
  
  const impact = async () => {
    await trainDevelopers(500);
    await supportStartups(50);
    await buildProjects(100);
    await connectCommunities(5);
    return createTechEcosystem("Zimbabwe");
  };
  
  return {
    ...core,
    execute: impact
  };
}

// Our commitment to Zimbabwe's future
const mission = iZonehubMission();
mission.execute();
  `;

  return (
    <div className="min-h-screen bg-dark">
      {/* Hero section */}
      <div className="relative h-96 flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-5 bg-repeat" style={{
          backgroundImage: 'url("https://i.imgur.com/8MmE3tY.png")',
          backgroundSize: '300px'
        }}></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold mb-6">About iZonehub</h1>
            <p className="text-xl text-white/80">
              Building Zimbabwe's tech future through collaboration, innovation,
              and education.
            </p>
          </div>
        </div>
      </div>

      {/* Our Story section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <SectionTitle title="Our Story" subtitle="From idea to innovation hub: the journey of iZonehub Makerspace." centered={false} />
              <p className="text-white/70 mb-6">
                iZonehub Makerspace was founded in 2018 with a vision to create
                a collaborative space where Zimbabwe's tech enthusiasts, makers,
                and innovators could come together to learn, build, and grow.
              </p>
              <p className="text-white/70 mb-6">
                What started as a small community of passionate developers and
                makers has grown into a thriving innovation hub that serves
                hundreds of members across multiple specialized communities.
              </p>
              <p className="text-white/70">
                Today, iZonehub is at the forefront of Zimbabwe's tech
                ecosystem, providing resources, mentorship, and opportunities
                for individuals and teams working on solutions to local and
                global challenges.
              </p>
            </div>
            <div className="relative">
              <CodeBlock title="mission.js" code={missionCode} language="javascript" className="shadow-neon-sm" />
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/5 rounded-lg border border-primary/20 -z-10"></div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-primary/5 rounded-lg border border-primary/20 -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission and Values */}
      <section className="py-16 bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Mission & Values" subtitle="The principles that guide our work and community." />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <div className="bg-dark-lighter p-8 rounded-lg border border-neutral/20">
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-white/70 mb-6">
                To empower Zimbabwe's tech talent through accessible education,
                collaborative innovation, and practical project development,
                fostering a self-sustaining ecosystem of makers, developers,
                and entrepreneurs.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircleIcon size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-white/80">Build innovative solutions for local challenges</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-white/80">Provide accessible technology education</span>
                </div>
                <div className="flex items-center">
                  <CheckCircleIcon size={20} className="text-primary mr-3 flex-shrink-0" />
                  <span className="text-white/80">Foster collaborative learning environment</span>
                </div>
              </div>
            </div>
            
            <div className="bg-dark-lighter p-8 rounded-lg border border-neutral/20">
              <h3 className="text-2xl font-bold mb-4">Our Values</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-primary mb-2">Innovation</h4>
                  <p className="text-white/70 text-sm">We encourage creative thinking and experimental approaches to problem-solving.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Collaboration</h4>
                  <p className="text-white/70 text-sm">We believe in the power of community and shared knowledge to achieve greater impact.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Accessibility</h4>
                  <p className="text-white/70 text-sm">We strive to make technology education and resources available to everyone.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-primary mb-2">Impact</h4>
                  <p className="text-white/70 text-sm">We focus on creating meaningful solutions that benefit our local and global communities.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team section */}
      <section className="py-16 bg-dark">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Team" subtitle="Meet the passionate individuals behind iZonehub Makerspace." />
          
          {loadingTeam ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
              <p className="text-white/60 mt-2">Loading team members...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <TeamMember 
                  key={index} 
                  name={member.name} 
                  role={member.role} 
                  bio={member.bio} 
                  image={member.image} 
                  social={member.social} 
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Timeline section */}
      <section className="py-16 bg-dark-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <SectionTitle title="Our Journey" subtitle="Key milestones in the evolution of iZonehub Makerspace." />
          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 md:left-1/2 transform md:-translate-x-1/2 h-full w-0.5 bg-primary/30"></div>
            
            <div className="space-y-8">
              {/* 2018 */}
              <div className="relative pl-16 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                      <h3 className="text-xl font-bold mb-2">Foundation</h3>
                      <p className="text-white/70 mb-3">
                        iZonehub Makerspace was founded with the vision of creating Zimbabwe's premier innovation hub.
                      </p>
                      <div className="text-sm text-primary font-semibold">2018</div>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-dark-light flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              </div>

              {/* 2019 */}
              <div className="relative pl-16 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="hidden md:block md:w-1/2"></div>
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                      <h3 className="text-xl font-bold mb-2">First Communities</h3>
                      <p className="text-white/70 mb-3">
                        Launched our Software Development and Hardware Development communities, attracting our first 50 members.
                      </p>
                      <div className="text-sm text-primary font-semibold">2019</div>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-dark-light flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* 2020 */}
              <div className="relative pl-16 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                      <h3 className="text-xl font-bold mb-2">Digital Transformation</h3>
                      <p className="text-white/70 mb-3">
                        Adapted to remote collaboration during the pandemic, launching online workshops and virtual hackathons.
                      </p>
                      <div className="text-sm text-primary font-semibold">2020</div>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-dark-light flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              </div>

              {/* 2021 */}
              <div className="relative pl-16 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="hidden md:block md:w-1/2"></div>
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                      <h3 className="text-xl font-bold mb-2">Growth & Expansion</h3>
                      <p className="text-white/70 mb-3">
                        Reached 200+ active members and launched our mentorship program, connecting experienced developers with newcomers.
                      </p>
                      <div className="text-sm text-primary font-semibold">2021</div>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-dark-light flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* 2022 */}
              <div className="relative pl-16 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                      <h3 className="text-xl font-bold mb-2">Physical Space</h3>
                      <p className="text-white/70 mb-3">
                        Opened our first physical makerspace location in Harare, providing dedicated workspace and equipment for members.
                      </p>
                      <div className="text-sm text-primary font-semibold">2022</div>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-dark-light flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              </div>

              {/* 2023 */}
              <div className="relative pl-16 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="hidden md:block md:w-1/2"></div>
                  <div className="md:w-1/2 md:pl-8">
                    <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                      <h3 className="text-xl font-bold mb-2">Innovation Hub</h3>
                      <p className="text-white/70 mb-3">
                        Established partnerships with local universities and tech companies, becoming a recognized innovation hub in Zimbabwe.
                      </p>
                      <div className="text-sm text-primary font-semibold">2023</div>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-dark-light flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* 2024-Present */}
              <div className="relative pl-16 md:pl-0">
                <div className="md:flex md:items-center">
                  <div className="md:w-1/2 md:pr-8 md:text-right">
                    <div className="bg-dark-lighter p-6 rounded-lg border border-neutral/20">
                      <h3 className="text-xl font-bold mb-2">Scaling Impact</h3>
                      <p className="text-white/70 mb-3">
                        Now serving 500+ members across multiple communities, with plans for expansion and new program launches.
                      </p>
                      <div className="text-sm text-primary font-semibold">2024 - Present</div>
                    </div>
                  </div>
                  <div className="absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full border-4 border-dark-light flex items-center justify-center">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                  </div>
                  <div className="hidden md:block md:w-1/2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;