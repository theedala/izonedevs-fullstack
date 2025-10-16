import { useState, useEffect } from 'react';
import { ProjectsService, Project, ProjectCreateData } from '../../services';
import Button from '../ui/Button';
import { PlusIcon, EditIcon, TrashIcon, ExternalLinkIcon, GithubIcon, CodeIcon } from 'lucide-react';

const AdminProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<ProjectCreateData>({
    title: '',
    description: '',
    content: '',
    image_url: '',
    github_url: '',
    demo_url: '',
    technologies: [],
    category: '',
    status: 'in_progress',
    featured: false,
    difficulty: ''
  });
  const [techInput, setTechInput] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await ProjectsService.getProjects({ page: 1, size: 50 });
      setProjects(response.items);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting project data:', formData);
      if (editingProject) {
        await ProjectsService.updateProject(editingProject.id, formData);
        console.log('Project updated successfully');
      } else {
        const result = await ProjectsService.createProject(formData);
        console.log('Project created successfully:', result);
      }
      setShowForm(false);
      setEditingProject(null);
      resetForm();
      fetchProjects();
    } catch (error) {
      console.error('Error saving project:', error);
      // Show user-friendly error message
      alert('Error saving project. Please check the console for details.');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      content: project.content || '',
      image_url: project.image_url || '',
      github_url: project.github_url || '',
      demo_url: project.demo_url || '',
      technologies: project.technologies || [],
      category: project.category || '',
      status: project.status,
      featured: project.featured,
      difficulty: project.difficulty || ''
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await ProjectsService.deleteProject(id);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const addTechnology = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData({
        ...formData,
        technologies: [...formData.technologies, techInput.trim()]
      });
      setTechInput('');
    }
  };

  const removeTechnology = (tech: string) => {
    setFormData({
      ...formData,
      technologies: formData.technologies.filter(t => t !== tech)
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      content: '',
      image_url: '',
      github_url: '',
      demo_url: '',
      technologies: [],
      category: '',
      status: 'in_progress',
      featured: false,
      difficulty: ''
    });
    setTechInput('');
  };

  if (loading) {
    return <div className="text-center py-8">Loading projects...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Projects</h2>
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="flex items-center"
        >
          <PlusIcon size={20} className="mr-2" />
          New Project
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">
            {editingProject ? 'Edit Project' : 'Create New Project'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  required
                  placeholder="Project title"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                >
                  <option value="">Select Category</option>
                  <option value="web">Web Development</option>
                  <option value="mobile">Mobile App</option>
                  <option value="iot">IoT/Hardware</option>
                  <option value="ai">AI/Machine Learning</option>
                  <option value="game">Game Development</option>
                  <option value="tool">Development Tool</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={3}
                required
                placeholder="Brief project description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Content (Optional)</label>
              <textarea
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={6}
                placeholder="Detailed project description, features, goals, etc."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">GitHub URL</label>
                <input
                  type="url"
                  value={formData.github_url}
                  onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://github.com/username/repo"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Demo URL</label>
                <input
                  type="url"
                  value={formData.demo_url}
                  onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://demo.example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Technologies</label>
              <div className="flex space-x-2 mb-2">
                <input
                  type="text"
                  value={techInput}
                  onChange={(e) => setTechInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTechnology())}
                  className="flex-1 bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="Add technology (React, Python, etc.)"
                />
                <button
                  type="button"
                  onClick={addTechnology}
                  className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary/90"
                >
                  Add
                </button>
              </div>
              {formData.technologies.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.technologies.map((tech, index) => (
                    <span 
                      key={index}
                      className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                    >
                      {tech}
                      <button
                        type="button"
                        onClick={() => removeTechnology(tech)}
                        className="ml-2 text-primary/70 hover:text-primary"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                >
                  <option value="planning">Planning</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on_hold">On Hold</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                >
                  <option value="">Select Difficulty</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div className="flex items-center">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">Featured Project</span>
                </label>
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300"
              >
                {editingProject ? 'Update Project' : 'Create Project'}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
                  setEditingProject(null);
                  resetForm();
                }}
                className="px-6 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-all duration-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-dark border border-neutral/30 rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <h3 className="text-lg font-bold mr-3">{project.title}</h3>
                  {project.featured && (
                    <span className="bg-yellow-500/20 text-yellow-300 px-2 py-1 rounded text-xs">
                      Featured
                    </span>
                  )}
                </div>
                
                <p className="text-white/70 mb-3 line-clamp-3">{project.description}</p>
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {project.technologies.map((tech, index) => (
                      <span key={index} className="bg-secondary/20 text-secondary px-2 py-1 rounded text-xs">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
                
                <div className="flex items-center justify-between text-sm text-white/60">
                  <div className="flex items-center space-x-4">
                    {project.category && (
                      <span className="capitalize">{project.category}</span>
                    )}
                    <span className={`px-2 py-1 rounded text-xs ${
                      project.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                      project.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300' :
                      project.status === 'planning' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-gray-500/20 text-gray-300'
                    }`}>
                      {project.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex space-x-2">
                    {project.github_url && (
                      <a 
                        href={project.github_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-primary"
                      >
                        <GithubIcon size={16} />
                      </a>
                    )}
                    {project.demo_url && (
                      <a 
                        href={project.demo_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white/60 hover:text-primary"
                      >
                        <ExternalLinkIcon size={16} />
                      </a>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(project)}
                  className="p-2 text-primary hover:bg-primary/20 rounded"
                >
                  <EditIcon size={16} />
                </button>
                <button
                  onClick={() => handleDelete(project.id)}
                  className="p-2 text-red-400 hover:bg-red-400/20 rounded"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-8 text-white/70">
          <CodeIcon size={48} className="mx-auto mb-4 opacity-50" />
          No projects found. Create your first project!
        </div>
      )}
    </div>
  );
};

export default AdminProjects;