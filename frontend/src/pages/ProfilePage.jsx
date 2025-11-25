import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { colleges } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  User,
  GraduationCap,
  Heart,
  Settings,
  LogOut,
  MapPin,
  DollarSign,
  Star,
  Edit,
  Trash2,
  CheckCircle
} from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [savedColleges, setSavedColleges] = useState([]);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      // Get saved colleges
      const saved = colleges.filter(c => userData.savedColleges?.includes(c.id));
      setSavedColleges(saved);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const removeSavedCollege = (collegeId) => {
    const updatedSaved = savedColleges.filter(c => c.id !== collegeId);
    setSavedColleges(updatedSaved);
    
    // Update localStorage
    if (user) {
      const updatedUser = {
        ...user,
        savedColleges: updatedSaved.map(c => c.id)
      };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a5d3a]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow">
        {/* Profile header */}
        <div className="bg-[#1a5d3a] py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <span className="text-3xl font-bold text-[#1a5d3a]">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.firstName} {user.lastName}
                </h1>
                <p className="text-white/80">{user.email}</p>
                <p className="text-white/60 text-sm mt-1">
                  Member since {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="w-full justify-start bg-white border border-gray-200 rounded-xl p-1 mb-6">
              <TabsTrigger value="saved" className="rounded-lg">
                <Heart size={18} className="mr-2" /> Saved Schools ({savedColleges.length})
              </TabsTrigger>
              <TabsTrigger value="applications" className="rounded-lg">
                <GraduationCap size={18} className="mr-2" /> Applications
              </TabsTrigger>
              <TabsTrigger value="profile" className="rounded-lg">
                <User size={18} className="mr-2" /> Profile
              </TabsTrigger>
              <TabsTrigger value="settings" className="rounded-lg">
                <Settings size={18} className="mr-2" /> Settings
              </TabsTrigger>
            </TabsList>

            {/* Saved schools tab */}
            <TabsContent value="saved">
              {savedColleges.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedColleges.map(college => (
                    <div key={college.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                      <div className="relative h-40">
                        <img
                          src={college.image}
                          alt={college.name}
                          className="w-full h-full object-cover"
                        />
                        {college.directAdmission && (
                          <div className="absolute top-3 left-3 bg-[#1a5d3a] text-white text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={12} />
                            Direct Admission
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 bg-[#f5a623] text-white text-sm font-bold px-2 py-1 rounded">
                          {college.rating}
                        </div>
                      </div>
                      <div className="p-5">
                        <Link to={`/college/${college.id}`}>
                          <h3 className="font-bold text-lg text-gray-900 hover:text-[#1a5d3a] transition-colors">
                            {college.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                          <MapPin size={14} />
                          <span>{college.location}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                          <div className="flex items-center gap-2">
                            <DollarSign size={14} className="text-gray-400" />
                            <span className="text-gray-600">${college.tuitionInState.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Star size={14} className="text-gray-400" />
                            <span className="text-gray-600">#{college.ranking}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Link to={`/college/${college.id}`} className="flex-grow">
                            <Button className="w-full bg-[#1a5d3a] hover:bg-[#15472d] text-white">
                              View Details
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => removeSavedCollege(college.id)}
                            className="border-red-200 text-red-500 hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-2xl">
                  <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No saved schools yet</h3>
                  <p className="text-gray-500 mb-4">Start exploring colleges and save your favorites</p>
                  <Link to="/colleges">
                    <Button className="bg-[#1a5d3a] hover:bg-[#15472d] text-white">
                      Browse Colleges
                    </Button>
                  </Link>
                </div>
              )}
            </TabsContent>

            {/* Applications tab */}
            <TabsContent value="applications">
              <div className="bg-white rounded-2xl p-8 text-center">
                <GraduationCap size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applications yet</h3>
                <p className="text-gray-500 mb-4">Apply to colleges with Direct Admission and track your progress here</p>
                <Link to="/colleges?directAdmission=true">
                  <Button className="bg-[#f5a623] hover:bg-[#e09000] text-white">
                    Find Direct Admission Schools
                  </Button>
                </Link>
              </div>
            </TabsContent>

            {/* Profile tab */}
            <TabsContent value="profile">
              <div className="bg-white rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Profile Information</h2>
                  <Button variant="outline" size="sm">
                    <Edit size={16} className="mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-gray-500">First Name</label>
                    <p className="text-lg font-medium text-gray-900">{user.firstName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Last Name</label>
                    <p className="text-lg font-medium text-gray-900">{user.lastName}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Email</label>
                    <p className="text-lg font-medium text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm text-gray-500">Member Since</label>
                    <p className="text-lg font-medium text-gray-900">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Settings tab */}
            <TabsContent value="settings">
              <div className="bg-white rounded-2xl p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Account Settings</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates about new colleges and offers</p>
                    </div>
                    <Button variant="outline" size="sm">Configure</Button>
                  </div>

                  <div className="flex items-center justify-between py-4 border-b border-gray-100">
                    <div>
                      <p className="font-medium text-gray-900">Change Password</p>
                      <p className="text-sm text-gray-500">Update your account password</p>
                    </div>
                    <Button variant="outline" size="sm">Update</Button>
                  </div>

                  <div className="flex items-center justify-between py-4">
                    <div>
                      <p className="font-medium text-red-600">Delete Account</p>
                      <p className="text-sm text-gray-500">Permanently delete your account and data</p>
                    </div>
                    <Button variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50">
                      Delete
                    </Button>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-gray-600"
                  >
                    <LogOut size={18} className="mr-2" />
                    Log Out
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ProfilePage;
