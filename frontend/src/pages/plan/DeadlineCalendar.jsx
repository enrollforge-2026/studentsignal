import React from 'react';
import { Calendar } from 'lucide-react';

const DeadlineCalendar = () => {
  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Calendar size={24} style={{ color: '#10614E' }} />
          <h1 className="text-2xl font-semibold" style={{ color: '#1A1A1A' }}>Deadlines</h1>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm" style={{ border: '1px solid #E2E5E7' }}>
          <p className="text-gray-600">Deadline calendar coming soon...</p>
        </div>
      </div>
    </div>
  );
};

export default DeadlineCalendar;