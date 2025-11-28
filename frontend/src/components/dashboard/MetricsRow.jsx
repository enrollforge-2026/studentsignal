import React from 'react';

const MetricsRow = () => {
  const metrics = [
    { label: 'Profile Strength', value: '85%', color: '#004C3F' },
    { label: 'Major Fit Score', value: '92', color: '#004C3F' },
    { label: 'Scholarship Fit Score', value: '78', color: '#004C3F' },
    { label: 'College Interest Index', value: '4.2', color: '#004C3F' },
    { label: 'Momentum (7-day)', value: '12', color: '#004C3F' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <MetricCard key={index} label={metric.label} value={metric.value} color={metric.color} />
      ))}
    </div>
  );
};

const MetricCard = ({ label, value, color }) => (
  <div className="bg-white rounded-xl shadow-sm p-5">
    <div className="text-3xl font-bold" style={{ color }}>
      {value}
    </div>
    <div className="text-sm text-gray-600 mt-1">
      {label}
    </div>
  </div>
);

export default MetricsRow;
