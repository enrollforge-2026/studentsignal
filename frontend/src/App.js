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
import Dashboard from "./pages/Dashboard";
import OnboardingFlow from "./pages/OnboardingFlow";
import HowItWorks from "./pages/HowItWorks";
import PrivacyBasics from "./pages/PrivacyBasics";
import ForSchools from "./pages/ForSchools";
import ArticlesHub from "./pages/ArticlesHub";
import ArticleDetail from "./pages/ArticleDetail";

// Placeholder Pages
import OnlineColleges from "./pages/placeholders/OnlineColleges";
import MilitaryPrograms from "./pages/placeholders/MilitaryPrograms";
import InternationalStudents from "./pages/placeholders/InternationalStudents";
import TransferStudents from "./pages/placeholders/TransferStudents";

// Authenticated Student Pages
import AuthenticatedLayout from "./components/layout/AuthenticatedLayout";
import AccountProfile from "./pages/account/AccountProfile";
import AccountSettings from "./pages/account/AccountSettings";
import DocumentsVault from "./pages/account/DocumentsVault";
import ExploreColleges from "./pages/explore/ExploreColleges";
import ExploreScholarships from "./pages/explore/ExploreScholarships";
import ExploreMajors from "./pages/explore/ExploreMajors";
import ApplicationTracker from "./pages/plan/ApplicationTracker";
import DeadlineCalendar from "./pages/plan/DeadlineCalendar";
import TasksEssays from "./pages/plan/TasksEssays";
import AICoach from "./pages/tools/AICoach";
import CostCalculator from "./pages/tools/CostCalculator";
import CompareColleges from "./pages/tools/CompareColleges";

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
import AnnouncementBarCMS from "./pages/admin/AnnouncementBarCMS";

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
          
          {/* Authenticated Student Routes */}
          <Route element={<AuthenticatedLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/signal-hub" element={<SignalHub />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* Account Section */}
            <Route path="/account/profile" element={<AccountProfile />} />
            <Route path="/account/settings" element={<AccountSettings />} />
            <Route path="/account/documents" element={<DocumentsVault />} />
            
            {/* Explore Section */}
            <Route path="/explore/colleges" element={<ExploreColleges />} />
            <Route path="/explore/scholarships" element={<ExploreScholarships />} />
            <Route path="/explore/majors" element={<ExploreMajors />} />
            
            {/* Plan Section */}
            <Route path="/plan/applications" element={<ApplicationTracker />} />
            <Route path="/plan/deadlines" element={<DeadlineCalendar />} />
            <Route path="/plan/tasks" element={<TasksEssays />} />
            
            {/* Tools Section */}
            <Route path="/tools/coach" element={<AICoach />} />
            <Route path="/tools/cost" element={<CostCalculator />} />
            <Route path="/tools/compare" element={<CompareColleges />} />
          </Route>
          
          {/* Help & Info Pages */}
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/privacy" element={<PrivacyBasics />} />
          <Route path="/for-schools" element={<ForSchools />} />
          
          {/* Articles */}
          <Route path="/articles" element={<ArticlesHub />} />
          <Route path="/articles/:slug" element={<ArticleDetail />} />
          
          {/* Scholarships */}
          <Route path="/scholarships" element={<ScholarshipsPage />} />
          
          {/* Student Pathways */}
          <Route path="/online-colleges" element={<OnlineColleges />} />
          <Route path="/military-programs" element={<MilitaryPrograms />} />
          <Route path="/international-students" element={<InternationalStudents />} />
          <Route path="/transfer-students" element={<TransferStudents />} />
          
          {/* Tools & Resources - Placeholders for now */}
          <Route path="/career-finder" element={<HomePage />} />
          <Route path="/direct-admissions" element={<HomePage />} />
          <Route path="/school-match-quiz" element={<HomePage />} />
          <Route path="/rankings" element={<ArticlesHub />} />
          <Route path="/financial-aid" element={<ArticlesHub />} />
          <Route path="/test-alternatives" element={<ArticlesHub />} />
          <Route path="/application-tips" element={<ArticlesHub />} />
          <Route path="/student-stories" element={<ArticlesHub />} />
          
          {/* Admin routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="announcement-bar" element={<AnnouncementBarCMS />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="colleges" element={<CollegesList />} />
            <Route path="colleges/new" element={<CollegeForm />} />
            <Route path="colleges/:id/edit" element={<CollegeForm />} />
            <Route path="scholarships" element={<ScholarshipsList />} />
            <Route path="scholarships/new" element={<ScholarshipForm />} />
            <Route path="scholarships/:id/edit" element={<ScholarshipForm />} />
            <Route path="articles" element={<ArticlesList />} />
            <Route path="articles/new" element={<ArticleForm />} />
            <Route path="articles/:id/edit" element={<ArticleForm />} />
          </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </AuthProvider>
  );
}

export default App;
