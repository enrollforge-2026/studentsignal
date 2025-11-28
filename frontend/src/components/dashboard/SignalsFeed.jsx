import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const SignalsFeed = () => {
  // Mock signals - grouped by date
  const signals = [
    {
      id: '1',
      createdAt: '2025-11-28T10:00:00Z',
      severity: 'success',
      title: 'New scholarship match found',
      description: 'You qualify for the STEM Excellence Scholarship ($5,000)',
      ctaLabel: 'View Details',
      ctaHref: '/scholarships/stem-excellence',
    },
    {
      id: '2',
      createdAt: '2025-11-28T08:30:00Z',
      severity: 'warning',
      title: 'Application deadline approaching',
      description: 'UC Berkeley application due in 7 days',
      ctaLabel: 'Continue Application',
      ctaHref: '/applications/uc-berkeley',
    },
    {
      id: '3',
      createdAt: '2025-11-27T14:00:00Z',
      severity: 'info',
      title: 'Profile strength increased',
      description: 'Adding your SAT score boosted your profile to 85%',
    },
    {
      id: '4',
      createdAt: '2025-11-27T09:00:00Z',
      severity: 'critical',
      title: 'Missing required documents',
      description: 'Stanford application needs your transcript',
      ctaLabel: 'Upload Documents',
      ctaHref: '/applications/stanford/documents',
    },
  ];

  const groupedSignals = groupByDate(signals);

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Signals</h2>
      <div className="space-y-6">
        {Object.entries(groupedSignals).map(([dateLabel, dateSignals]) => (
          <div key={dateLabel}>
            <div className="text-xs font-semibold text-gray-500 mb-3">{dateLabel}</div>
            <div className="space-y-3">
              {dateSignals.map((signal) => (
                <SignalItem key={signal.id} signal={signal} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SignalItem = ({ signal }) => {
  const icons = {
    info: <Info size={20} className="text-blue-600" />,
    success: <CheckCircle size={20} className="text-green-600" />,
    warning: <AlertTriangle size={20} className="text-yellow-600" />,
    critical: <AlertCircle size={20} className="text-red-600" />,
  };

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="flex-shrink-0 mt-0.5">{icons[signal.severity]}</div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">{signal.title}</div>
        {signal.description && (
          <div className="text-sm text-gray-600 mt-1">{signal.description}</div>
        )}
      </div>
      {signal.ctaLabel && signal.ctaHref && (
        <a
          href={signal.ctaHref}
          className="flex-shrink-0 text-sm font-medium transition-colors"
          style={{ color: '#004C3F' }}
        >
          {signal.ctaLabel}
        </a>
      )}
    </div>
  );
};

const groupByDate = (signals) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const grouped = { Today: [], Yesterday: [], Earlier: [] };

  signals.forEach((signal) => {
    const signalDate = new Date(signal.createdAt);
    const diffDays = Math.floor((today - signalDate) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      grouped.Today.push(signal);
    } else if (diffDays === 1) {
      grouped.Yesterday.push(signal);
    } else {
      grouped.Earlier.push(signal);
    }
  });

  // Remove empty groups
  Object.keys(grouped).forEach((key) => {
    if (grouped[key].length === 0) delete grouped[key];
  });

  return grouped;
};

export default SignalsFeed;
