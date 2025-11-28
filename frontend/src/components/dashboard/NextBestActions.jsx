import React from 'react';
import { User, TrendingUp, FileText, Target } from 'lucide-react';

const NextBestActions = () => {
  const actions = [
    {
      id: '1',
      icon: <Target size={20} />,
      title: 'Add your GPA',
      description: 'Improve match accuracy',
      ctaLabel: 'Add Now',
      ctaHref: '/profile/academics',
    },
    {
      id: '2',
      icon: <TrendingUp size={20} />,
      title: 'Compare colleges',
      description: '8 saved colleges',
      ctaLabel: 'Compare',
      ctaHref: '/compare',
    },
    {
      id: '3',
      icon: <FileText size={20} />,
      title: 'Start an application',
      description: 'MIT ready to start',
      ctaLabel: 'Begin',
      ctaHref: '/applications/mit',
    },
    {
      id: '4',
      icon: <User size={20} />,
      title: 'Complete profile',
      description: '3 items remaining',
      ctaLabel: 'Finish',
      ctaHref: '/profile',
    },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Next Best Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <div key={action.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-2" style={{ color: '#004C3F' }}>
              {action.icon}
              <div className="text-sm font-semibold text-gray-900">{action.title}</div>
            </div>
            <div className="text-xs text-gray-600 mb-3">{action.description}</div>
            <a
              href={action.ctaHref}
              className="inline-block text-xs font-medium px-3 py-1.5 rounded-md transition-colors"
              style={{ backgroundColor: '#F0FDF4', color: '#004C3F' }}
            >
              {action.ctaLabel}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NextBestActions;
