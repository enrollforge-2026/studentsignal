import React from 'react';
import { Link } from 'react-router-dom';
import { bestOfLists } from '../../data/mockData';
import { Trophy, Building2, DollarSign, TreePine, PartyPopper, Users } from 'lucide-react';

const BestOfIcon = ({ type }) => {
  const icons = {
    trophy: <Trophy className="w-7 h-7" />,
    building: <Building2 className="w-7 h-7" />,
    dollar: <DollarSign className="w-7 h-7" />,
    tree: <TreePine className="w-7 h-7" />,
    party: <PartyPopper className="w-7 h-7" />,
    users: <Users className="w-7 h-7" />
  };
  return icons[type] || icons.trophy;
};

const BestOfLists = () => {
  const getIconColor = (index) => {
    const colors = ['text-tangerine', 'text-turquoise', 'text-lavender', 'text-emerald-light', 'text-tangerine-light', 'text-turquoise-light'];
    return colors[index % colors.length];
  };

  const getGlowClass = (index) => {
    const glows = ['hover:shadow-glow-tangerine', 'hover:shadow-glow-turquoise', 'hover:shadow-glow-lavender', 'hover:shadow-glow-emerald', 'hover:shadow-glow-tangerine', 'hover:shadow-glow-turquoise'];
    return glows[index % glows.length];
  };

  return (
    <section className="py-24 bg-emerald relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 w-40 h-40 bg-turquoise/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 bg-lavender/10 rounded-full blur-3xl"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-sm font-bold tracking-widest text-turquoise mb-3 uppercase">
            2025 RANKINGS
          </p>
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white mb-5">
            Browse schools & colleges by "best of" lists.
          </h2>
          <p className="text-sand/80 max-w-2xl mx-auto text-lg">
            We combine the reviews and the data to put together these comprehensive lists to get you started.
          </p>
        </div>

        {/* Best of cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
          {bestOfLists.map((list, index) => (
            <Link
              key={list.id}
              to={`/rankings/${list.id}`}
              className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center transition-all duration-300 group hover:bg-white/20 hover:-translate-y-2 ${getGlowClass(index)}`}
            >
              <div className={`w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                <span className={getIconColor(index)}>
                  <BestOfIcon type={list.icon} />
                </span>
              </div>
              <p className="text-white font-semibold text-sm leading-tight">
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
