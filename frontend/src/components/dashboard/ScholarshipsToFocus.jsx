import React from 'react';
import { Clock, Award } from 'lucide-react';

const ScholarshipsToFocus = () => {
  // Mock scholarship data
  const scholarships = [
    {
      id: '1',
      name: 'STEM Excellence Scholarship',
      fitScore: 95,
      amount: '$5,000',
      deadline: 'Dec 15, 2025',
      urgency: 'high',
    },
    {
      id: '2',
      name: 'Community Leadership Award',
      fitScore: 88,
      amount: '$3,000',
      deadline: 'Jan 10, 2026',
      urgency: 'medium',
    },
    {
      id: '3',
      name: 'First Generation Scholar Grant',
      fitScore: 92,
      amount: '$10,000',
      deadline: 'Dec 1, 2025',
      urgency: 'critical',
    },
    {
      id: '4',
      name: 'Academic Merit Scholarship',
      fitScore: 85,
      amount: '$2,500',
      deadline: 'Feb 1, 2026',
      urgency: 'low',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900">Scholarships To Focus On</h2>
        <a
          href="/scholarships"
          className="text-sm font-medium transition-colors"
          style={{ color: '#004C3F' }}
        >
          Explore All
        </a>
      </div>
      <div className="space-y-3">
        {scholarships.map((scholarship) => (
          <ScholarshipItem key={scholarship.id} scholarship={scholarship} />
        ))}
      </div>
    </div>
  );
};

const ScholarshipItem = ({ scholarship }) => {
  const urgencyColors = {
    critical: { bg: '#FEE2E2', text: '#991B1B' },
    high: { bg: '#FEF3C7', text: '#92400E' },
    medium: { bg: '#DBEAFE', text: '#1E40AF' },
    low: { bg: '#F3F4F6', text: '#4B5563' },
  };

  const urgencyLabels = {
    critical: 'Due Soon',
    high: 'Closing Soon',
    medium: 'Upcoming',
    low: 'Open',
  };

  const colors = urgencyColors[scholarship.urgency];

  return (
    <a
      href={`/scholarships/${scholarship.id}`}
      className="block border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Award size={16} style={{ color: '#004C3F' }} />
            <div className="text-sm font-semibold text-gray-900">{scholarship.name}</div>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <div className="text-sm font-bold" style={{ color: '#004C3F' }}>
              {scholarship.amount}
            </div>
            <div className="text-xs text-gray-600">Fit Score: {scholarship.fitScore}</div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className="inline-block px-2 py-1 text-xs font-medium rounded"
            style={{ backgroundColor: colors.bg, color: colors.text }}
          >
            {urgencyLabels[scholarship.urgency]}
          </span>
          <div className="flex items-center gap-1 text-xs text-gray-600">
            <Clock size={12} />
            {scholarship.deadline}
          </div>
        </div>
      </div>
    </a>
  );
};

export default ScholarshipsToFocus;
