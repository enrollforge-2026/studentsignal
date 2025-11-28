import React from 'react';
import { ArrowRight } from 'lucide-react';

const ApplicationPreview = () => {
  // Mock application data
  const applications = [
    {
      id: '1',
      collegeName: 'Stanford University',
      logoUrl: 'https://logo.clearbit.com/stanford.edu',
      stage: 'In Progress',
      progress: 65,
      deadline: 'Jan 5, 2026',
    },
    {
      id: '2',
      collegeName: 'MIT',
      logoUrl: 'https://logo.clearbit.com/mit.edu',
      stage: 'Essay Review',
      progress: 45,
      deadline: 'Jan 1, 2026',
    },
    {
      id: '3',
      collegeName: 'UC Berkeley',
      logoUrl: 'https://logo.clearbit.com/berkeley.edu',
      stage: 'Documents Needed',
      progress: 30,
      deadline: 'Nov 30, 2025',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Application Tracker</h2>
        <a
          href="/applications"
          className="text-sm font-medium flex items-center gap-1 transition-colors"
          style={{ color: '#004C3F' }}
        >
          Open Tracker
          <ArrowRight size={16} />
        </a>
      </div>
      <div className="space-y-4">
        {applications.map((app) => (
          <ApplicationItem key={app.id} app={app} />
        ))}
      </div>
    </div>
  );
};

const ApplicationItem = ({ app }) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex items-start gap-3">
      <img
        src={app.logoUrl}
        alt={app.collegeName}
        className="w-12 h-12 rounded-lg object-cover bg-gray-100"
        onError={(e) => {
          e.target.src = 'https://via.placeholder.com/48?text=' + app.collegeName.charAt(0);
        }}
      />
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">{app.collegeName}</div>
        <div className="flex items-center gap-2 mt-1">
          <span className="inline-block px-2 py-0.5 text-xs font-medium rounded" style={{ backgroundColor: '#F0FDF4', color: '#004C3F' }}>
            {app.stage}
          </span>
          <span className="text-xs text-gray-600">Due {app.deadline}</span>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{app.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{ width: `${app.progress}%`, backgroundColor: '#004C3F' }}
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default ApplicationPreview;
