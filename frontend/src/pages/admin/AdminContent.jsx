import React, { useState } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { adminContent } from '../../data/mockData';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { toast } from 'sonner';
import {
  Save,
  Eye,
  RotateCcw,
  FileText,
  Layout,
  Type,
  Image
} from 'lucide-react';

const AdminContent = () => {
  const [content, setContent] = useState(adminContent);
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  const handleSave = () => {
    // In real implementation, this would save to backend
    toast.success('Content saved successfully!');
    setUnsavedChanges(false);
  };

  const handleReset = () => {
    setContent(adminContent);
    setUnsavedChanges(false);
    toast.info('Content reset to original');
  };

  const updateContent = (section, field, value) => {
    setContent(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setUnsavedChanges(true);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Page header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Content Management</h1>
            <p className="text-gray-500">Edit page text, titles, and descriptions</p>
          </div>
          <div className="flex items-center gap-3">
            {unsavedChanges && (
              <span className="text-sm text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
                Unsaved changes
              </span>
            )}
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw size={16} className="mr-2" />
              Reset
            </Button>
            <Button variant="outline">
              <Eye size={16} className="mr-2" />
              Preview
            </Button>
            <Button className="bg-[#1a5d3a] hover:bg-[#15472d] text-white" onClick={handleSave}>
              <Save size={16} className="mr-2" />
              Save Changes
            </Button>
          </div>
        </div>

        {/* Content editor tabs */}
        <Tabs defaultValue="hero" className="w-full">
          <TabsList className="bg-white border border-gray-200 rounded-xl p-1 mb-6">
            <TabsTrigger value="hero" className="rounded-lg">
              <Layout size={16} className="mr-2" /> Hero Section
            </TabsTrigger>
            <TabsTrigger value="direct" className="rounded-lg">
              <FileText size={16} className="mr-2" /> Direct Admissions
            </TabsTrigger>
            <TabsTrigger value="search" className="rounded-lg">
              <Type size={16} className="mr-2" /> Search Section
            </TabsTrigger>
            <TabsTrigger value="features" className="rounded-lg">
              <Image size={16} className="mr-2" /> Features
            </TabsTrigger>
          </TabsList>

          {/* Hero Section */}
          <TabsContent value="hero">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Hero Section Content</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Title (Small Text)</Label>
                  <Input
                    value={content.heroSection.title}
                    onChange={(e) => updateContent('heroSection', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Subtitle (Main Headline)</Label>
                  <Input
                    value={content.heroSection.subtitle}
                    onChange={(e) => updateContent('heroSection', 'subtitle', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.heroSection.description}
                  onChange={(e) => updateContent('heroSection', 'description', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>

              <div>
                <Label className="mb-3 block">CTA Buttons</Label>
                <div className="space-y-3">
                  {content.heroSection.ctaButtons.map((btn, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                      <Input
                        value={btn.label}
                        placeholder="Button label"
                        className="flex-grow"
                        onChange={(e) => {
                          const newButtons = [...content.heroSection.ctaButtons];
                          newButtons[idx].label = e.target.value;
                          setContent(prev => ({
                            ...prev,
                            heroSection: { ...prev.heroSection, ctaButtons: newButtons }
                          }));
                          setUnsavedChanges(true);
                        }}
                      />
                      <Input
                        value={btn.href}
                        placeholder="Link URL"
                        className="flex-grow"
                        onChange={(e) => {
                          const newButtons = [...content.heroSection.ctaButtons];
                          newButtons[idx].href = e.target.value;
                          setContent(prev => ({
                            ...prev,
                            heroSection: { ...prev.heroSection, ctaButtons: newButtons }
                          }));
                          setUnsavedChanges(true);
                        }}
                      />
                      <span className={`text-xs px-2 py-1 rounded ${
                        btn.variant === 'primary' ? 'bg-[#f5a623] text-white' : 'bg-gray-200 text-gray-700'
                      }`}>
                        {btn.variant}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Direct Admissions */}
          <TabsContent value="direct">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Direct Admissions Section</h2>
              
              <div>
                <Label>Section Title</Label>
                <Input
                  value={content.directAdmissions.title}
                  onChange={(e) => updateContent('directAdmissions', 'title', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Tagline</Label>
                <Input
                  value={content.directAdmissions.tagline}
                  onChange={(e) => updateContent('directAdmissions', 'tagline', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.directAdmissions.description}
                  onChange={(e) => updateContent('directAdmissions', 'description', e.target.value)}
                  className="mt-1"
                  rows={4}
                />
              </div>
            </div>
          </TabsContent>

          {/* Search Section */}
          <TabsContent value="search">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Search Section Content</h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label>Tagline</Label>
                  <Input
                    value={content.searchSection.tagline}
                    onChange={(e) => updateContent('searchSection', 'tagline', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Title</Label>
                  <Input
                    value={content.searchSection.title}
                    onChange={(e) => updateContent('searchSection', 'title', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>

              <div>
                <Label>Subtitle</Label>
                <Input
                  value={content.searchSection.subtitle}
                  onChange={(e) => updateContent('searchSection', 'subtitle', e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={content.searchSection.description}
                  onChange={(e) => updateContent('searchSection', 'description', e.target.value)}
                  className="mt-1"
                  rows={3}
                />
              </div>
            </div>
          </TabsContent>

          {/* Features */}
          <TabsContent value="features">
            <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-gray-900 border-b pb-4">Features Content</h2>
              
              <div className="space-y-6">
                {content.features.map((feature, idx) => (
                  <div key={idx} className="p-4 border border-gray-200 rounded-lg space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Feature {idx + 1}</h3>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded">Icon: {feature.icon}</span>
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={feature.title}
                        className="mt-1"
                        onChange={(e) => {
                          const newFeatures = [...content.features];
                          newFeatures[idx].title = e.target.value;
                          setContent(prev => ({ ...prev, features: newFeatures }));
                          setUnsavedChanges(true);
                        }}
                      />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea
                        value={feature.description}
                        className="mt-1"
                        rows={2}
                        onChange={(e) => {
                          const newFeatures = [...content.features];
                          newFeatures[idx].description = e.target.value;
                          setContent(prev => ({ ...prev, features: newFeatures }));
                          setUnsavedChanges(true);
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
