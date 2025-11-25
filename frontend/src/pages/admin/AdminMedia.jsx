import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { toast } from 'sonner';
import {
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Search,
  Grid3X3,
  List,
  Eye,
  Download,
  Copy,
  X
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../../components/ui/dialog';

const AdminMedia = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [mediaItems] = useState([
    {
      id: 1,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800',
      name: 'UCLA Campus',
      size: '2.4 MB',
      dimensions: '1920x1080',
      uploadedAt: '2025-01-15'
    },
    {
      id: 2,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=800',
      name: 'UC Berkeley',
      size: '1.8 MB',
      dimensions: '1920x1080',
      uploadedAt: '2025-01-14'
    },
    {
      id: 3,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=800',
      name: 'Stanford University',
      size: '2.1 MB',
      dimensions: '1920x1080',
      uploadedAt: '2025-01-13'
    },
    {
      id: 4,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
      name: 'Students Campus',
      size: '1.5 MB',
      dimensions: '1920x1280',
      uploadedAt: '2025-01-12'
    },
    {
      id: 5,
      type: 'video',
      url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/0.jpg',
      name: 'Campus Tour Video',
      duration: '5:32',
      uploadedAt: '2025-01-11'
    },
    {
      id: 6,
      type: 'image',
      url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
      name: 'Student Testimonial',
      size: '850 KB',
      dimensions: '800x800',
      uploadedAt: '2025-01-10'
    }
  ]);

  const filteredItems = mediaItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const copyToClipboard = (url) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard!');
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Media Library</h1>
            <p className="text-gray-500">Manage images and videos for your site</p>
          </div>
          <Button className="bg-[#1a5d3a] hover:bg-[#15472d] text-white">
            <Upload size={18} className="mr-2" />
            Upload Media
          </Button>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-xl p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Search media..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[#1a5d3a] text-white' : 'text-gray-600'}`}
              >
                <Grid3X3 size={18} />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${viewMode === 'list' ? 'bg-[#1a5d3a] text-white' : 'text-gray-600'}`}
              >
                <List size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Media grid/list */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="relative aspect-video">
                  <img
                    src={item.type === 'video' ? item.thumbnail : item.url}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <Video className="text-white" size={32} />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100">
                      <Eye size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100">
                      <Download size={16} />
                    </button>
                    <button className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="p-3">
                  <p className="font-medium text-gray-900 text-sm truncate">{item.name}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.type === 'video' ? item.duration : item.size}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Preview</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Name</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Type</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Size</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <img
                        src={item.type === 'video' ? item.thumbnail : item.url}
                        alt={item.name}
                        className="w-16 h-10 object-cover rounded"
                      />
                    </td>
                    <td className="py-3 px-4 font-medium text-gray-900">{item.name}</td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full ${
                        item.type === 'image' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                      }`}>
                        {item.type === 'image' ? <ImageIcon size={12} /> : <Video size={12} />}
                        {item.type}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-gray-500">{item.type === 'video' ? item.duration : item.size}</td>
                    <td className="py-3 px-4 text-gray-500">{item.uploadedAt}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedImage(item)}>
                          <Eye size={16} className="text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => copyToClipboard(item.url)}>
                          <Copy size={16} className="text-gray-500" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Lightbox dialog */}
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>{selectedImage?.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedImage?.type === 'video' ? (
                <div className="aspect-video">
                  <iframe
                    src={selectedImage.url}
                    className="w-full h-full rounded-lg"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <img
                  src={selectedImage?.url}
                  alt={selectedImage?.name}
                  className="w-full rounded-lg"
                />
              )}
              <div className="flex items-center justify-between mt-4 pt-4 border-t">
                <div className="text-sm text-gray-500">
                  {selectedImage?.type === 'image' && (
                    <span>{selectedImage.dimensions} • {selectedImage.size}</span>
                  )}
                  {selectedImage?.type === 'video' && (
                    <span>Duration: {selectedImage.duration}</span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(selectedImage?.url)}>
                    <Copy size={14} className="mr-2" />
                    Copy URL
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download size={14} className="mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminMedia;
