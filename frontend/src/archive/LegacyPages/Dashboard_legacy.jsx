// ARCHIVED: Legacy Dashboard with double AuthenticatedLayout wrapper (pre-cleanup).
// Do not use in production.

import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthenticatedLayout from '../components/layout/AuthenticatedLayout';
import MetricsRow from '../components/dashboard/MetricsRow';
import SignalsFeed from '../components/dashboard/SignalsFeed';
import NextBestActions from '../components/dashboard/NextBestActions';
import ApplicationPreview from '../components/dashboard/ApplicationPreview';
import TopCollegeMatches from '../components/dashboard/TopCollegeMatches';
import ScholarshipsToFocus from '../components/dashboard/ScholarshipsToFocus';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <AuthenticatedLayout>
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
    </AuthenticatedLayout>
  );
};

export default Dashboard;
