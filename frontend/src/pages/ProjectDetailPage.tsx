import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar, 
  Star,
  Clock,
  Tag,
  Users,
  BookOpen,
  Code,
  Zap
} from 'lucide-react';
import Button from '../components/ui/Button';
import { ProjectsService, Project } from '../services';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchProject(parseInt(id));
    }
  }, [id]);

  const fetchProject = async (projectId: number) => {
    try {
      setLoading(true);
      const projectData = await ProjectsService.getProject(projectId);
      setProject(projectData);
    } catch (err) {
      setError('Project not found');
      console.error('Error fetching project:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-dark flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-white/70">Loading project details...</p>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-dark py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-16">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
            <p className="text-white/70 mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/projects')} variant="primary">
              Back to Projects
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-8">
          <Button 
            onClick={() => navigate('/projects')} 
            variant="outline"
            className="flex items-center"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Projects
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Header */}
            <div className="mb-8">
              {project.featured && (
                <div className="inline-flex items-center bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium mb-4">
                  <Star size={16} className="mr-1" />
                  Featured Project
                </div>
              )}
              
              <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
              <p className="text-xl text-white/80 mb-6">{project.description}</p>

              {/* Technologies */}
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Project Image */}
            {project.image_url && (
              <div className="mb-8">
                <img
                  src={project.image_url}
                  alt={project.title}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}

            {/* Project Content */}
            {project.content && (
              <div className="bg-dark-lighter rounded-lg p-8 border border-white/10">
                <h2 className="text-2xl font-bold mb-6 flex items-center">
                  <BookOpen size={24} className="mr-3 text-primary" />
                  Project Details
                </h2>
                <div 
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: project.content.replace(/\n/g, '<br>') }}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Project Info Card */}
              <div className="bg-dark-lighter rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Code size={20} className="mr-2 text-primary" />
                  Project Info
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Status</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      project.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      project.status === 'in_progress' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-blue-500/20 text-blue-300'
                    }`}>
                      {project.status?.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>

                  {project.category && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Category</span>
                      <span className="flex items-center">
                        <Tag size={16} className="mr-1 text-primary" />
                        {project.category}
                      </span>
                    </div>
                  )}

                  {project.difficulty && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Difficulty</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        project.difficulty === 'beginner' ? 'bg-green-500/20 text-green-300' :
                        project.difficulty === 'intermediate' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {project.difficulty}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-white/70">Created</span>
                    <span className="flex items-center">
                      <Calendar size={16} className="mr-1 text-primary" />
                      {formatDate(project.created_at)}
                    </span>
                  </div>

                  {project.updated_at && (
                    <div className="flex items-center justify-between">
                      <span className="text-white/70">Last Updated</span>
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1 text-primary" />
                        {formatDate(project.updated_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Get Involved Card */}
              <div className="bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg p-6 border border-primary/30">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Zap size={20} className="mr-2 text-primary" />
                  Get Involved
                </h3>
                
                <p className="text-white/80 mb-4">
                  Interested in this project? Join our community and contribute to innovative projects like this one!
                </p>
                
                <div className="space-y-3">
                  <Button href="/communities" variant="primary" className="w-full">
                    Join Community
                  </Button>
                  <Button href="/contact" variant="outline" className="w-full">
                    Contact Us
                  </Button>
                </div>
              </div>

              {/* Related Projects */}
              <div className="bg-dark-lighter rounded-lg p-6 border border-white/10">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Users size={20} className="mr-2 text-primary" />
                  Explore More
                </h3>
                
                <div className="space-y-3">
                  <Button href="/projects" variant="outline" className="w-full">
                    All Projects
                  </Button>
                  <Button href="/events" variant="outline" className="w-full">
                    Upcoming Events
                  </Button>
                  <Button href="/blog" variant="outline" className="w-full">
                    Latest Blog Posts
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;