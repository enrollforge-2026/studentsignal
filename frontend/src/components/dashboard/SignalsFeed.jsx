import React from 'react';
import { AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const SignalsFeed = () => {
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
      ctaLabel: 'Continue',
      ctaHref: '/applications/uc-berkeley',
    },
    {
      id: '3',
      createdAt: '2025-11-26T14:00:00Z',
      severity: 'info',
      title: 'Profile strength increased',
      description: 'Adding your SAT score boosted your profile to 85%',
    },
    {
      id: '4',
      createdAt: '2025-11-25T09:00:00Z',
      severity: 'critical',
      title: 'Missing required documents',
      description: 'Stanford application needs your transcript',
      ctaLabel: 'Upload',
      ctaHref: '/applications/stanford/documents',
    },
  ];

  const groupedSignals = groupByDate(signals);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Signals</h2>
      <div className="space-y-6">
        {Object.entries(groupedSignals).map(([dateLabel, dateSignals]) => (
          <div key={dateLabel}>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{dateLabel}</div>
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
  const severityConfig = {
    info: { icon: Info, color: 'text-blue-600', bg: 'bg-blue-50' },
    success: { icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
    warning: { icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50' },
    critical: { icon: AlertCircle, color: 'text-red-600', bg: 'bg-red-50' },
  };

  const config = severityConfig[signal.severity];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
      <div className={`flex-shrink-0 p-2 rounded-lg ${config.bg}`}>
        <Icon size={18} className={config.color} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-semibold text-gray-900">{signal.title}</div>
        {signal.description && (
          <div className="text-sm text-gray-600 mt-1">{signal.description}</div>
        )}
      </div>
      {signal.ctaLabel && signal.ctaHref && (
        <a
          href={signal.ctaHref}
          className="flex-shrink-0 px-3 py-1.5 text-sm font-medium rounded-md transition-colors"
          style={{ backgroundColor: '#F0FDF4', color: '#004C3F' }}
        >
          {signal.ctaLabel}
        </a>
      )}
    </div>
  );
};

const groupByDate = (signals) => {
  const now = new Date();
  const groups = { Today: [], 'This Week': [] };

  signals.forEach((signal) => {
    const date = new Date(signal.createdAt);
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      groups.Today.push(signal);
    } else if (diffDays <= 7) {
      groups['This Week'].push(signal);
    }
  });

  Object.keys(groups).forEach((key) => {
    if (groups[key].length === 0) delete groups[key];
  });

  return groups;
};

export default SignalsFeed;
