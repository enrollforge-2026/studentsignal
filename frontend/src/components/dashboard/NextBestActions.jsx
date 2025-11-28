import React from 'react';
import { User, GraduationCap, FileText, TrendingUp, Edit } from 'lucide-react';

const NextBestActions = () => {
  const actions = [
    {
      id: '1',
      icon: <User size={20} />,
      title: 'Complete your profile',
      description: '3 items remaining',
      ctaLabel: 'Finish Profile',
      ctaHref: '/profile',
    },
    {
      id: '2',
      icon: <Edit size={20} />,
      title: 'Add your GPA',
      description: 'Improve match accuracy',
      ctaLabel: 'Add GPA',
      ctaHref: '/profile/academics',
    },
    {
      id: '3',
      icon: <FileText size={20} />,
      title: 'Start your first application',
      description: 'MIT application ready',
      ctaLabel: 'Start Application',
      ctaHref: '/applications/mit',
    },
    {
      id: '4',
      icon: <TrendingUp size={20} />,
      title: 'Compare colleges',
      description: '8 saved colleges',
      ctaLabel: 'Compare Now',
      ctaHref: '/compare',
    },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm p-5">
      <h2 className="text-base font-semibold text-gray-900 mb-4">Next Best Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => (
          <ActionCard key={action.id} action={action} />
        ))}
      </div>
    </div>
  );
};

const ActionCard = ({ action }) => (
  <div className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
    <div className="flex items-center gap-2 mb-2">
      <div style={{ color: '#004C3F' }}>{action.icon}</div>
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
);

export default NextBestActions;
