import React, { useState, useEffect } from 'react';
import { Calendar, Save, Eye, AlertCircle, Megaphone, Link as LinkIcon } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AnnouncementBarCMS = () => {
  const [loading, setLoading] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    body: '',
    start_date: '',
    end_date: '',
    color: 'green',
    link_url: '',
    status: 'active'
  });
  const [charCount, setCharCount] = useState(0);
  const [errors, setErrors] = useState({});

  const colorOptions = [
    { value: 'green', label: 'Green', bg: '#10614E', text: '#FFFFFF' },
    { value: 'yellow', label: 'Yellow', bg: '#FCD34D', text: '#1A1A1A' },
    { value: 'red', label: 'Red', bg: '#EF4444', text: '#FFFFFF' },
    { value: 'blue', label: 'Blue', bg: '#3B82F6', text: '#FFFFFF' }
  ];

  const commonEmojis = ['🎓', '📚', '💰', '🎉', '⚡', '🔥', '✨', '🎯', '📢', '🏆', '💡', '🚀', '⏰', '📅', '🎊'];

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/api/admin/announcements`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAnnouncements(response.data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    }
  };

  const handleInputChange = (field, value) => {
    if (field === 'body') {
      if (value.length <= 200) {
        setFormData(prev => ({ ...prev, [field]: value }));
        setCharCount(value.length);
        setErrors(prev => ({ ...prev, body: null }));
      }
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const insertEmoji = (emoji) => {
    if (formData.body.length + emoji.length <= 200) {
      handleInputChange('body', formData.body + emoji);
    }
    setShowEmojiPicker(false);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.body.trim()) newErrors.body = 'Body is required';
    if (!formData.start_date) newErrors.start_date = 'Start date is required';
    if (!formData.end_date) newErrors.end_date = 'End date is required';
    
    if (formData.start_date && formData.end_date) {
      if (new Date(formData.end_date) < new Date(formData.start_date)) {
        newErrors.end_date = 'End date must be after start date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const payload = {
        ...formData,
        start_date: new Date(formData.start_date).toISOString(),
        end_date: new Date(formData.end_date).toISOString()
      };

      await axios.post(`${API_BASE_URL}/api/announcement/create`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Reset form
      setFormData({
        title: '',
        body: '',
        start_date: '',
        end_date: '',
        color: 'green',
        link_url: '',
        status: 'active'
      });
      setCharCount(0);
      
      // Reload announcements
      await loadAnnouncements();
      
      alert('Announcement created successfully!');
    } catch (error) {
      console.error('Failed to create announcement:', error);
      alert('Failed to create announcement. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const selectedColor = colorOptions.find(c => c.value === formData.color);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#1A1A1A' }}>
            Announcement Bar Management
          </h1>
          <p style={{ color: '#6B7280' }}>Control the site-wide announcement banner</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="bg-white p-6" style={{ borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E2E5E7' }}>
          <div className="flex items-center gap-2 mb-6">
            <Megaphone size={20} style={{ color: '#10614E' }} />
            <h2 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>Create Announcement</h2>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g., Important Notice"
                className="w-full px-4 py-2 text-sm"
                style={{
                  border: errors.title ? '1px solid #EF4444' : '1px solid #E2E5E7',
                  borderRadius: '6px',
                  color: '#1A1A1A'
                }}
              />
              {errors.title && (
                <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.title}</p>
              )}
            </div>

            {/* Body with Emoji */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium" style={{ color: '#1A1A1A' }}>
                  Message
                </label>
                <span className="text-xs" style={{ color: charCount > 180 ? '#EF4444' : '#6B7280' }}>
                  {charCount}/200
                </span>
              </div>
              <textarea
                value={formData.body}
                onChange={(e) => handleInputChange('body', e.target.value)}
                placeholder="Your announcement message..."
                rows={3}
                className="w-full px-4 py-2 text-sm"
                style={{
                  border: errors.body ? '1px solid #EF4444' : '1px solid #E2E5E7',
                  borderRadius: '6px',
                  color: '#1A1A1A',
                  resize: 'none'
                }}
              />
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="px-3 py-1 text-xs transition-colors"
                  style={{
                    backgroundColor: '#F5F7F8',
                    color: '#1A1A1A',
                    borderRadius: '4px'
                  }}
                >
                  😊 Add Emoji
                </button>
              </div>
              {showEmojiPicker && (
                <div className="mt-2 p-3 bg-white" style={{ border: '1px solid #E2E5E7', borderRadius: '6px' }}>
                  <div className="grid grid-cols-8 gap-2">
                    {commonEmojis.map((emoji, idx) => (
                      <button
                        key={idx}
                        onClick={() => insertEmoji(emoji)}
                        className="text-xl hover:bg-gray-100 p-1 rounded"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {errors.body && (
                <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.body}</p>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                  Start Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.start_date}
                  onChange={(e) => handleInputChange('start_date', e.target.value)}
                  className="w-full px-4 py-2 text-sm"
                  style={{
                    border: errors.start_date ? '1px solid #EF4444' : '1px solid #E2E5E7',
                    borderRadius: '6px',
                    color: '#1A1A1A'
                  }}
                />
                {errors.start_date && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.start_date}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                  End Date
                </label>
                <input
                  type="datetime-local"
                  value={formData.end_date}
                  onChange={(e) => handleInputChange('end_date', e.target.value)}
                  className="w-full px-4 py-2 text-sm"
                  style={{
                    border: errors.end_date ? '1px solid #EF4444' : '1px solid #E2E5E7',
                    borderRadius: '6px',
                    color: '#1A1A1A'
                  }}
                />
                {errors.end_date && (
                  <p className="text-xs mt-1" style={{ color: '#EF4444' }}>{errors.end_date}</p>
                )}
              </div>
            </div>

            {/* Color Options */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                Color Theme
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => handleInputChange('color', color.value)}
                    className="px-4 py-2 text-sm font-medium transition-all"
                    style={{
                      backgroundColor: formData.color === color.value ? color.bg : '#F5F7F8',
                      color: formData.color === color.value ? color.text : '#1A1A1A',
                      borderRadius: '6px',
                      border: formData.color === color.value ? 'none' : '1px solid #E2E5E7'
                    }}
                  >
                    {color.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Link URL (Optional) */}
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#1A1A1A' }}>
                Link URL (optional)
              </label>
              <input
                type="url"
                value={formData.link_url}
                onChange={(e) => handleInputChange('link_url', e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-2 text-sm"
                style={{
                  border: '1px solid #E2E5E7',
                  borderRadius: '6px',
                  color: '#1A1A1A'
                }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full px-6 py-3 text-sm font-medium text-white transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: loading ? '#6B7280' : '#10614E',
                borderRadius: '6px',
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <Save size={18} />
              {loading ? 'Creating...' : 'Create Announcement'}
            </button>
          </div>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6" style={{ borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E2E5E7' }}>
            <div className="flex items-center gap-2 mb-4">
              <Eye size={20} style={{ color: '#10614E' }} />
              <h2 className="text-lg font-semibold" style={{ color: '#1A1A1A' }}>Live Preview</h2>
            </div>
            
            {formData.body ? (
              <div
                className="px-4 py-3 text-sm font-medium text-center"
                style={{
                  backgroundColor: selectedColor.bg,
                  color: selectedColor.text,
                  borderRadius: '4px'
                }}
              >
                {formData.body}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-center" style={{ color: '#6B7280', backgroundColor: '#F5F7F8', borderRadius: '4px' }}>
                Your announcement will appear here
              </div>
            )}
          </div>

          {/* Recent Announcements */}
          <div className="bg-white p-6" style={{ borderRadius: '6px', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #E2E5E7' }}>
            <h3 className="text-lg font-semibold mb-4" style={{ color: '#1A1A1A' }}>Recent Announcements</h3>
            <div className="space-y-3">
              {announcements.length === 0 ? (
                <p className="text-sm" style={{ color: '#6B7280' }}>No announcements yet</p>
              ) : (
                announcements.slice(0, 5).map((announcement) => (
                  <div
                    key={announcement.id}
                    className="p-3 text-sm"
                    style={{
                      backgroundColor: '#F5F7F8',
                      borderRadius: '4px',
                      borderLeft: `3px solid ${colorOptions.find(c => c.value === announcement.color)?.bg || '#10614E'}`
                    }}
                  >
                    <div className="font-medium mb-1" style={{ color: '#1A1A1A' }}>
                      {announcement.title}
                    </div>
                    <div className="text-xs" style={{ color: '#6B7280' }}>
                      {announcement.body.substring(0, 50)}...
                    </div>
                    <div className="text-xs mt-1" style={{ color: '#6B7280' }}>
                      Status: <span className={announcement.status === 'active' ? 'text-green-600' : 'text-gray-500'}>
                        {announcement.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBarCMS;
