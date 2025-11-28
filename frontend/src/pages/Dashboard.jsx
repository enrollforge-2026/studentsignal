import React from 'react';
import { useAuth } from '../context/AuthContext';
import MetricsRow from '../components/dashboard/MetricsRow';
import SignalsFeed from '../components/dashboard/SignalsFeed';
import NextBestActions from '../components/dashboard/NextBestActions';
import ApplicationPreview from '../components/dashboard/ApplicationPreview';
import TopCollegeMatches from '../components/dashboard/TopCollegeMatches';
import ScholarshipsToFocus from '../components/dashboard/ScholarshipsToFocus';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F5F7F9' }}>
      <div className="max-w-[1280px] mx-auto px-6 py-8 space-y-8">
        {/* A) Metrics Row */}
        <MetricsRow />

        {/* B) Signals Feed */}
        <SignalsFeed />

        {/* C) Next Best Actions */}
        <NextBestActions />

        {/* D) Application Tracker Preview */}
        <ApplicationPreview />

        {/* E) Top College Matches */}
        <TopCollegeMatches />

        {/* F) Scholarships To Focus On */}
        <ScholarshipsToFocus />
      </div>
    </div>
  );
};

export default Dashboard;
