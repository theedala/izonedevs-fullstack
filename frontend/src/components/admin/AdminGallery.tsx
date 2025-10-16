import { useState, useEffect } from 'react';
import { GalleryService, GalleryItem, GalleryItemCreateData, UploadService } from '../../services';
import Button from '../ui/Button';
import { PlusIcon, TrashIcon, ImageIcon, UploadIcon } from 'lucide-react';

const AdminGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<GalleryItemCreateData>({
    title: '',
    description: '',
    image_url: '',
    category: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    fetchGalleryItems();
  }, []);

  const fetchGalleryItems = async () => {
    try {
      setLoading(true);
      const response = await GalleryService.getGalleryItems({ page: 1, size: 50 });
      setItems(response.items);
    } catch (error) {
      console.error('Error fetching gallery items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!UploadService.validateImageFile(file)) {
      alert('Please select a valid image file (JPG, PNG, GIF, WebP)');
      return null;
    }

    if (!UploadService.validateFileSize(file)) {
      alert('File size must be less than 10MB');
      return null;
    }

    try {
      const response = await UploadService.uploadImage(file, 'gallery');
      return response.data?.url || null;
    } catch (error) {
      console.error('Error uploading file:', error);
      alert('Failed to upload image');
      return null;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    
    try {
      let imageUrl = formData.image_url;
      
      // Upload file if selected
      if (selectedFile) {
        const uploadedUrl = await handleFileUpload(selectedFile);
        if (!uploadedUrl) {
          setUploading(false);
          return;
        }
        imageUrl = uploadedUrl;
      }

      await GalleryService.createGalleryItem({
        ...formData,
        image_url: imageUrl
      });
      
      setShowForm(false);
      resetForm();
      fetchGalleryItems();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      alert('Failed to save gallery item');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this gallery item?')) {
      try {
        await GalleryService.deleteGalleryItem(id);
        fetchGalleryItems();
      } catch (error) {
        console.error('Error deleting gallery item:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      image_url: '',
      category: ''
    });
    setSelectedFile(null);
  };

  if (loading) {
    return <div className="text-center py-8">Loading gallery...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Manage Gallery</h2>
        <Button 
          onClick={() => setShowForm(true)} 
          variant="primary"
          className="flex items-center"
        >
          <PlusIcon size={20} className="mr-2" />
          Add Image
        </Button>
      </div>

      {showForm && (
        <div className="bg-dark border border-neutral/30 rounded-lg p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Gallery Image</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                required
                placeholder="Image title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                rows={3}
                placeholder="Image description"
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
                <option value="facility">Facility</option>
                <option value="projects">Projects</option>
                <option value="events">Events</option>
                <option value="community">Community</option>
                <option value="equipment">Equipment</option>
                <option value="workshops">Workshops</option>
              </select>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Upload Image</label>
                <div className="flex items-center space-x-4">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="block w-full text-sm text-white/70 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary/90"
                  />
                </div>
                {selectedFile && (
                  <p className="text-sm text-white/60 mt-2">
                    Selected: {selectedFile.name} ({UploadService.formatFileSize(selectedFile.size)})
                  </p>
                )}
              </div>

              <div className="text-center text-white/50">OR</div>

              <div>
                <label className="block text-sm font-medium mb-2">Image URL</label>
                <input
                  type="url"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-dark-lighter border border-neutral/30 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                  placeholder="https://example.com/image.jpg"
                  disabled={!!selectedFile}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button 
                type="submit" 
                disabled={uploading}
                className="px-6 py-2 bg-primary text-white rounded-lg hover:shadow-neon transition-all duration-300 disabled:opacity-50 flex items-center"
              >
                {uploading ? (
                  <>
                    <UploadIcon size={16} className="mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Add to Gallery'
                )}
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowForm(false);
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((item) => (
          <div key={item.id} className="bg-dark border border-neutral/30 rounded-lg overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img 
                src={item.image_url} 
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                <button
                  onClick={() => handleDelete(item.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  <TrashIcon size={16} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              <h3 className="font-bold mb-1 line-clamp-1">{item.title}</h3>
              {item.description && (
                <p className="text-white/70 text-sm mb-2 line-clamp-2">{item.description}</p>
              )}
              <div className="flex justify-between items-center">
                {item.category && (
                  <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded capitalize">
                    {item.category}
                  </span>
                )}
                <span className="text-xs text-white/50">
                  {new Date(item.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="text-center py-8 text-white/70">
          <ImageIcon size={48} className="mx-auto mb-4 opacity-50" />
          No gallery images found. Upload your first image!
        </div>
      )}
    </div>
  );
};

export default AdminGallery;