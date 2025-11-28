import React from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

const TopCollegeMatches = () => {
  const colleges = [
    {
      id: '1',
      name: 'Stanford University',
      logoUrl: 'https://logo.clearbit.com/stanford.edu',
      matchScore: 95,
      status: 'saved',
    },
    {
      id: '2',
      name: 'MIT',
      logoUrl: 'https://logo.clearbit.com/mit.edu',
      matchScore: 92,
      status: 'in-progress',
    },
    {
      id: '3',
      name: 'Harvard University',
      logoUrl: 'https://logo.clearbit.com/harvard.edu',
      matchScore: 89,
      status: 'none',
    },
    {
      id: '4',
      name: 'UC Berkeley',
      logoUrl: 'https://logo.clearbit.com/berkeley.edu',
      matchScore: 87,
      status: 'saved',
    },
    {
      id: '5',
      name: 'Carnegie Mellon',
      logoUrl: 'https://logo.clearbit.com/cmu.edu',
      matchScore: 85,
      status: 'none',
    },
    {
      id: '6',
      name: 'Caltech',
      logoUrl: 'https://logo.clearbit.com/caltech.edu',
      matchScore: 83,
      status: 'none',
    },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Top College Matches</h2>
        <a
          href="/colleges"
          className="text-sm font-medium transition-colors"
          style={{ color: '#004C3F' }}
        >
          View All
        </a>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {colleges.map((college) => (
          <a
            key={college.id}
            href={`/colleges/${college.id}`}
            className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-gray-200 transition-colors block"
          >
            <div className="flex items-start gap-3">
              <img
                src={college.logoUrl}
                alt={college.name}
                className="w-12 h-12 rounded-lg object-cover bg-gray-100"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/48?text=' + college.name.charAt(0);
                }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-gray-900 mb-1">{college.name}</div>
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-2xl font-bold" style={{ color: '#004C3F' }}>
                    {college.matchScore}
                  </div>
                  <div className="text-xs text-gray-600">Match</div>
                </div>
                {college.status === 'saved' && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium" style={{ color: '#004C3F' }}>
                    <BookmarkCheck size={14} />
                    Saved
                  </span>
                )}
                {college.status === 'in-progress' && (
                  <span className="inline-block px-2 py-0.5 text-xs font-medium rounded" style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                    In Progress
                  </span>
                )}
                {college.status === 'none' && (
                  <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                    <Bookmark size={14} />
                    Not Saved
                  </span>
                )}
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
};

export default TopCollegeMatches;
