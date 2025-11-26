import React from 'react';
import { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from './context/AuthContext';

// Pages
import HomePage from "./pages/HomePage";
import CollegesPage from "./pages/CollegesPageNew";
import CollegeDetailPage from "./pages/CollegeDetailPage";
import ScholarshipsPage from "./pages/ScholarshipsPage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import SignalHub from "./pages/SignalHub";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminColleges from "./pages/admin/AdminColleges";
import AdminContent from "./pages/admin/AdminContent";
import AdminMedia from "./pages/admin/AdminMedia";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Toaster position="top-right" richColors />
        <BrowserRouter>
          <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/colleges" element={<CollegesPage />} />
          <Route path="/college/:id" element={<CollegeDetailPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<SignalHub />} />
          <Route path="/signal-hub" element={<SignalHub />} />
          
          {/* Placeholder routes */}
          <Route path="/graduate" element={<CollegesPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/quiz" element={<HomePage />} />
          <Route path="/direct-admissions" element={<HomePage />} />
          <Route path="/for-schools" element={<HomePage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/colleges" element={<AdminColleges />} />
          <Route path="/admin/content" element={<AdminContent />} />
          <Route path="/admin/media" element={<AdminMedia />} />
          <Route path="/admin/users" element={<AdminDashboard />} />
          <Route path="/admin/settings" element={<AdminDashboard />} />
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
