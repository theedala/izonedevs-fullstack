import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import Button from '../ui/Button';
import { ProjectsService, Project } from '../../services';

const ProjectsCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProjects();
  }, []);

  const fetchFeaturedProjects = async () => {
    try {
      setLoading(true);
      const response = await ProjectsService.getFeaturedProjects();
      setProjects(response.items.slice(0, 3)); // Get only first 3 projects
    } catch (error) {
      console.error('Error fetching featured projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide(prev => prev === projects.length - 1 ? 0 : prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(prev => prev === 0 ? projects.length - 1 : prev - 1);
  };

  if (loading) {
    return (
      <section className="py-16 bg-dark relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-white/70">Loading featured projects...</div>
          </div>
        </div>
      </section>
    );
  }
  return <section className="py-16 bg-dark relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Featured Projects</h2>
          <div className="flex space-x-2">
            <button onClick={prevSlide} className="p-2 rounded-full border border-white/20 hover:border-primary hover:text-primary">
              <ChevronLeftIcon size={20} />
            </button>
            <button onClick={nextSlide} className="p-2 rounded-full border border-white/20 hover:border-primary hover:text-primary">
              <ChevronRightIcon size={20} />
            </button>
          </div>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex transition-transform duration-500 ease-in-out" style={{
          transform: `translateX(-${currentSlide * 100}%)`
        }}>
            {projects.map(project => <div key={project.id} className="w-full flex-shrink-0 px-4">
                <div className="bg-dark-lighter rounded-lg overflow-hidden flex flex-col md:flex-row border border-neutral/20">
                  <div className="md:w-1/2">
                    <img 
                      src={project.image_url || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'} 
                      alt={project.title} 
                      className="w-full h-64 md:h-full object-cover" 
                    />
                  </div>
                  <div className="md:w-1/2 p-6 flex flex-col">
                    <h3 className="text-2xl font-bold mb-2">{project.title}</h3>
                    <p className="text-white/70 mb-4">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-6">
                      {(project.technologies || []).map((tag: string) => <span key={tag} className="bg-primary/20 text-primary px-2 py-1 rounded-full text-xs">
                          {tag}
                        </span>)}
                    </div>
                    <div className="mt-auto">
                      <Button href={`/projects/${project.id}`} variant="outline">
                        View Project
                      </Button>
                    </div>
                  </div>
                </div>
              </div>)}
          </div>
        </div>
        
        {projects.length === 0 && !loading && (
          <div className="text-center text-white/70">
            No featured projects available yet.
          </div>
        )}

        <div className="flex justify-center mt-8">
          <Button href="/projects" variant="secondary">
            View All Projects
          </Button>
        </div>
      </div>
    </section>;
};
export default ProjectsCarousel;