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
import StaffLogin from "./pages/StaffLogin";
import ProfilePage from "./pages/ProfilePage";
import SignalHub from "./pages/SignalHubPremium";
import OnboardingFlow from "./pages/OnboardingFlow";
import HowItWorks from "./pages/HowItWorks";
import PrivacyBasics from "./pages/PrivacyBasics";
import ForSchools from "./pages/ForSchools";
import ArticlesHub from "./pages/ArticlesHub";
import ArticleDetail from "./pages/ArticleDetail";

// Admin Pages
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Analytics from "./pages/admin/Analytics";
import CollegesList from "./pages/admin/CollegesList";
import CollegeForm from "./pages/admin/CollegeForm";
import ScholarshipsList from "./pages/admin/ScholarshipsList";
import ScholarshipForm from "./pages/admin/ScholarshipForm";
import ArticlesList from "./pages/admin/ArticlesList";
import ArticleForm from "./pages/admin/ArticleForm";

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
          <Route path="/staff-login" element={<StaffLogin />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/dashboard" element={<SignalHub />} />
          <Route path="/signal-hub" element={<SignalHub />} />
          
          {/* Help & Info Pages */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/privacy" element={<PrivacyBasics />} />
          <Route path="/for-schools" element={<ForSchools />} />
          
          {/* Articles */}
          <Route path="/articles" element={<ArticlesHub />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          
          {/* Placeholder routes */}
          <Route path="/graduate" element={<CollegesPage />} />
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          <Route path="/quiz" element={<HomePage />} />
          <Route path="/direct-admissions" element={<HomePage />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="colleges" element={<CollegesList />} />
            <Route path="colleges/new" element={<CollegeForm />} />
            <Route path="colleges/:id/edit" element={<CollegeForm />} />
            <Route path="scholarships" element={<ScholarshipsList />} />
            <Route path="scholarships/new" element={<ScholarshipForm />} />
            <Route path="scholarships/:id/edit" element={<ScholarshipForm />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
