import React from 'react';
import { useAuth } from '../context/AuthContext';
import TopExperienceLayer from '../components/top/TopExperienceLayer';
import Footer from '../components/layout/Footer';
import MetricsRow from '../components/dashboard/MetricsRow';
import SignalsFeed from '../components/dashboard/SignalsFeed';
import NextBestActions from '../components/dashboard/NextBestActions';
import ApplicationPreview from '../components/dashboard/ApplicationPreview';
import TopCollegeMatches from '../components/dashboard/TopCollegeMatches';
import ScholarshipsToFocus from '../components/dashboard/ScholarshipsToFocus';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F5F7F9' }}>
      <TopExperienceLayer />
      
      <main className="flex-grow">
        <div className="max-w-[1280px] mx-auto px-6 py-8">
          {/* SECTION A — Metrics Row */}
          <MetricsRow />

          {/* SECTION B — Signals Feed */}
          <div className="mt-6">
            <SignalsFeed />
          </div>

          {/* SECTION C — Next Best Actions */}
          <div className="mt-6">
            <NextBestActions />
          </div>

          {/* SECTION D — Application Tracker Preview */}
          <div className="mt-6">
            <ApplicationPreview />
          </div>

          {/* SECTION E — Top College Matches */}
          <div className="mt-6">
            <TopCollegeMatches />
          </div>

          {/* SECTION F — Scholarships To Focus On */}
          <div className="mt-6">
            <ScholarshipsToFocus />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
