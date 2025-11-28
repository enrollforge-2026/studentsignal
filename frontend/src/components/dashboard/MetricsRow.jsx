import React from 'react';

const MetricsRow = () => {
  const metrics = [
    { label: 'Profile Strength', value: '85%' },
    { label: 'Major Fit Score', value: '92' },
    { label: 'Scholarship Fit Score', value: '78' },
    { label: 'College Interest Index', value: '4.2' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric, index) => (
        <div key={index} className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
          <div className="text-sm text-gray-600 mb-2">{metric.label}</div>
          <div className="text-3xl font-bold text-gray-900">{metric.value}</div>
        </div>
      ))}
    </div>
  );
};

export default MetricsRow;
