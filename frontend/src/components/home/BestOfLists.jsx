import React from 'react';
import { Link } from 'react-router-dom';
import { bestOfLists } from '../../data/mockData';
import { Trophy, Building2, DollarSign, TreePine, PartyPopper, Users } from 'lucide-react';

const BestOfIcon = ({ type }) => {
  const icons = {
    trophy: <Trophy className="w-6 h-6" />,
    building: <Building2 className="w-6 h-6" />,
    dollar: <DollarSign className="w-6 h-6" />,
    tree: <TreePine className="w-6 h-6" />,
    party: <PartyPopper className="w-6 h-6" />,
    users: <Users className="w-6 h-6" />
  };
  return icons[type] || icons.trophy;
};

const BestOfLists = () => {
  return (
    <section className="py-20 bg-[#1a5d3a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm font-semibold tracking-wider text-white/80 mb-2">
            2025 RANKINGS
          </p>
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Browse schools & colleges by "best of" lists.
          </h2>
          <p className="text-white/80 max-w-2xl mx-auto">
            We combine the reviews and the data to put together these comprehensive lists to get you started.
          </p>
        </div>

        {/* Best of cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {bestOfLists.map((list) => (
            <Link
              key={list.id}
              to={`/rankings/${list.id}`}
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all group"
            >
              <div className="w-16 h-16 bg-[#f5a623] rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                <span className="text-white">
                  <BestOfIcon type={list.icon} />
                </span>
              </div>
              <p className="text-white font-medium text-sm leading-tight">
                {list.title}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BestOfLists;
