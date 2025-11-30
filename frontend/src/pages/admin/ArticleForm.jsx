import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Save, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../services/api';
import SelectField from '../../components/ui/SelectField';

const ArticleForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    summary: '',
    body: '',
    main_image_url: '',
    video_url: '',
    category: 'Admissions',
    tags: [],
    is_featured: false,
    is_video: false,
    is_published: false
  });

  const [tagsInput, setTagsInput] = useState('');

  const loadArticle = useCallback(async () => {
    try {
      const response = await api.get(`/api/admin/articles/${id}`);
      const article = response.data;
      setFormData(article);
      setTagsInput(article.tags.join(', '));
    } catch (error) {
      console.error('Failed to load article:', error);
      toast.error('Failed to load article data');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (isEdit) {
      loadArticle();
    }
  }, [isEdit, loadArticle]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });

    // Auto-generate slug from title
    if (name === 'title' && !isEdit) {
      const slug = value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const dataToSubmit = {
        ...formData,
        tags: tagsInput.split(',').map((t) => t.trim()).filter(Boolean),
      };

      if (isEdit) {
        await api.put(`/api/admin/articles/${id}`, dataToSubmit);
        toast.success('Article updated successfully');
      } else {
        await api.post('/api/admin/articles', dataToSubmit);
        toast.success('Article created successfully');
      }

      navigate('/admin/articles');
    } catch (error) {
      console.error('Failed to save article:', error);
      toast.error(error.response?.data?.detail || 'Failed to save article. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          to="/admin/articles"
          className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEdit ? 'Edit Article' : 'Add New Article'}
          </h1>
          <p className="text-gray-600 mt-1">
            {isEdit ? 'Update article information' : 'Create a new blog post or advice article'}
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm p-8 space-y-8">
        {/* Basic Information */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                placeholder="e.g., 10 Tips for Writing a Strong College Essay"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Slug (URL) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                placeholder="10-tips-college-essay"
              />
              <p className="text-xs text-gray-500 mt-1">This will be the URL: /articles/{formData.slug}</p>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Summary <span className="text-red-500">*</span>
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                required
                rows={2}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                placeholder="Brief 1-2 sentence teaser for the article card"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Content</h2>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Article Body <span className="text-red-500">*</span>
            </label>
            <textarea
              name="body"
              value={formData.body}
              onChange={handleChange}
              required
              rows={15}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none font-mono text-sm"
              placeholder="Write your article content here. Use markdown-style formatting:
## Heading 2
# Heading 3
- Bullet point

Paragraphs are separated by blank lines."
            />
            <p className="text-xs text-gray-500 mt-1">
              Use ## for headings, # for subheadings, and - for bullet lists
            </p>
          </div>
        </div>

        {/* Media */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Media</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Main Image URL
              </label>
              <input
                type="url"
                name="main_image_url"
                value={formData.main_image_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Video URL (YouTube/Vimeo)
              </label>
              <input
                type="url"
                name="video_url"
                value={formData.video_url}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                placeholder="https://youtube.com/watch?v=..."
              />
              <p className="text-xs text-gray-500 mt-1">Opens in lightbox on article page</p>
            </div>
          </div>
        </div>

        {/* Classification */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Classification</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
              >
                <option value="Admissions">Admissions</option>
                <option value="Scholarships">Scholarships</option>
                <option value="Lists">Lists</option>
                <option value="Mental Health">Mental Health</option>
                <option value="College Life">College Life</option>
                <option value="Career">Career</option>
                <option value="Financial Aid">Financial Aid</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all outline-none"
                placeholder="Guide, Tips, Advice"
              />
            </div>
          </div>
        </div>

        {/* Options */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">Options</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_featured"
                checked={formData.is_featured}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-700">Featured Article</span>
                <p className="text-xs text-gray-500">Show in featured slider on Articles Hub</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_video"
                checked={formData.is_video}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-700">Video Article</span>
                <p className="text-xs text-gray-500">Show in "Videos & Deep Dives" section</p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="is_published"
                checked={formData.is_published}
                onChange={handleChange}
                className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <div>
                <span className="text-sm font-semibold text-gray-700">Published</span>
                <p className="text-xs text-gray-500">Make article visible to public</p>
              </div>
            </label>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:bg-gray-400 transition-colors font-medium shadow-lg"
          >
            <Save size={20} />
            <span>{saving ? 'Saving...' : isEdit ? 'Update Article' : 'Create Article'}</span>
          </button>
          <Link
            to="/admin/articles"
            className="flex items-center gap-2 px-8 py-3 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium"
          >
            <X size={20} />
            <span>Cancel</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;
