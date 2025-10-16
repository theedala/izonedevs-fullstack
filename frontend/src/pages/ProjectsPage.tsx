import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SectionTitle from '../components/ui/SectionTitle';
import Button from '../components/ui/Button';
import { CodeIcon, CpuIcon, PencilRulerIcon, BrainIcon, SearchIcon, LoaderIcon, ExternalLinkIcon, GithubIcon } from 'lucide-react';
import { ProjectsService, Project } from '../services';
import ParticlesBackground from '../components/ui/ParticlesBackground';

const ProjectsPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [activeFilter]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await ProjectsService.getProjects({
        page: 1,
        size: 20,
        ...(activeFilter !== 'all' && { status: activeFilter })
      });
      setProjects(response.items);
    } catch (err) {
      setError('Failed to load projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filters = [
    { id: 'all', label: 'All Projects', icon: CodeIcon },
    { id: 'active', label: 'Active', icon: CpuIcon },
    { id: 'completed', label: 'Completed', icon: PencilRulerIcon },
    { id: 'in_progress', label: 'In Progress', icon: BrainIcon }
  ];

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex justify-center items-center">
        <div className="flex items-center">
          <LoaderIcon className="animate-spin text-primary mr-3" size={40} />
          <span className="text-white/70">Loading projects...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <div className="text-red-400 mb-4">⚠️ {error}</div>
            <button 
              onClick={fetchProjects}
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-16 relative">
      <ParticlesBackground variant="neural" className="opacity-20" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Community Projects"
          subtitle="Explore innovative projects created by our community members. From IoT solutions to web applications, see what we're building together."
        />

        {/* Filters and Search */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-6">
            {/* Filter buttons */}
            <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
              {filters.map((filter) => {
                const IconComponent = filter.icon;
                return (
                  <button
                    key={filter.id}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`flex items-center px-6 py-3 rounded-full transition-all duration-300 ${
                      activeFilter === filter.id
                        ? 'bg-primary text-white shadow-neon-sm'
                        : 'bg-dark-lighter text-white/70 hover:bg-dark-light hover:text-white'
                    }`}
                  >
                    <IconComponent size={18} className="mr-2" />
                    {filter.label}
                  </button>
                );
              })}
            </div>

            {/* Search bar */}
            <div className="relative w-full lg:w-80">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-full py-3 pl-12 pr-4 focus:outline-none focus:border-primary focus:shadow-neon-sm transition-all duration-300"
              />
              <SearchIcon size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/50" />
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link key={project.id} to={`/projects/${project.id}`} className="block">
                <div className="card group hover:transform hover:-translate-y-2 hover:shadow-neon-lg transition-all duration-300">
                  <div className="relative h-48 overflow-hidden rounded-t-lg">
                    <img
                      src={project.image_url || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-transparent to-transparent" />
                    
                    {/* Project Status Badge */}
                    <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
                      project.status === 'active' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
                    }`}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-primary/20 text-primary border border-primary/30 rounded-full text-xs font-medium">
                        Featured
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        project.category === 'software' ? 'bg-blue-500/20 text-blue-300' :
                        project.category === 'hardware' ? 'bg-green-500/20 text-green-300' :
                        'bg-purple-500/20 text-purple-300'
                      }`}>
                        {project.category || 'General'}
                      </span>
                      
                      {project.difficulty && (
                        <span className={`text-xs px-2 py-1 rounded ${
                          project.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                          project.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>
                          {project.difficulty}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    
                    <p className="text-white/70 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Technologies */}
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.technologies.slice(0, 3).map((tech, index) => (
                            <span key={index} className="bg-dark text-white/80 px-2 py-1 rounded text-xs">
                              {tech}
                            </span>
                          ))}
                          {project.technologies.length > 3 && (
                            <span className="bg-dark text-white/60 px-2 py-1 rounded text-xs">
                              +{project.technologies.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Project Links */}
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex space-x-2">
                        {project.github_url && (
                          <a
                            href={project.github_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300"
                          >
                            <GithubIcon size={16} />
                          </a>
                        )}
                        {project.demo_url && (
                          <a
                            href={project.demo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="p-2 bg-dark-lighter rounded-full hover:bg-primary/20 hover:text-primary transition-all duration-300"
                          >
                            <ExternalLinkIcon size={16} />
                          </a>
                        )}
                      </div>
                      
                      <div className="text-xs text-white/60">
                        Created: {new Date(project.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-lighter rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-dark rounded-full mb-4">
              <SearchIcon size={24} className="text-white/50" />
            </div>
            <h3 className="text-xl font-bold mb-2">No projects found</h3>
            <p className="text-white/70 mb-6">
              {searchQuery
                ? "We couldn't find any projects matching your search criteria."
                : "No projects have been created yet."}
            </p>
            <button
              onClick={() => {
                setActiveFilter('all');
                setSearchQuery('');
              }}
              className="px-6 py-2 bg-primary text-white rounded-full hover:shadow-neon transition-all duration-300"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 text-center bg-dark-lighter rounded-lg p-8 border border-neutral/20">
          <h3 className="text-2xl font-bold mb-4">Have a Project Idea?</h3>
          <p className="text-white/70 mb-6 max-w-2xl mx-auto">
            Join our community and bring your ideas to life. Whether you're working on hardware, software, 
            or research projects, we're here to support your innovation journey.
          </p>
          <Button href="/communities" variant="primary" className="mr-4">
            Join Community
          </Button>
          <Button href="/contact" variant="outline">
            Propose Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectsPage;