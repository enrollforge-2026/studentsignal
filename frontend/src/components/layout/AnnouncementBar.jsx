import React, { useState, useEffect } from 'react';
import { X, Megaphone, Star, Bell, AlertCircle } from 'lucide-react';
import { topLayerTokens } from '../../styles/topLayerTokens';

const AnnouncementBar = ({ announcement, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  // Check localStorage to see if this announcement was dismissed
  useEffect(() => {
    if (announcement?.id) {
      const dismissed = localStorage.getItem(`announcement_dismissed_${announcement.id}`);
      if (dismissed) {
        setIsVisible(false);
      }
    }
  }, [announcement]);

  const handleDismiss = () => {
    setIsExiting(true);
    // Save to localStorage
    if (announcement?.id) {
      localStorage.setItem(`announcement_dismissed_${announcement.id}`, 'true');
    }
    // Wait for animation to complete
    setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, 180);
  };

  const getIcon = (type) => {
    const iconProps = { size: topLayerTokens.iconSize.small, className: 'text-white flex-shrink-0' };
    switch (type) {
      case 'alert':
        return <AlertCircle {...iconProps} />;
      case 'news':
        return <Megaphone {...iconProps} />;
      case 'featured':
        return <Star {...iconProps} />;
      default:
        return <Bell {...iconProps} />;
    }
  };

  if (!isVisible || !announcement) return null;

  const bgGradient = announcement.gradient || 'bg-gradient-to-r from-[#1a5d3a] to-[#14482d]';

  return (
    <div
      className={`w-full bg-white border-b border-gray-100 overflow-hidden transition-all ${
        isExiting ? 'animate-slideUp' : 'animate-slideDown'
      }`}
      style={{
        height: isExiting ? '0' : '42px',
        transition: 'height 0.18s ease-out',
      }}
    >
      <div className={`${bgGradient} h-[42px] flex items-center justify-between ${topLayerTokens.layout.padding}`}>
        {/* Left: Icon */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {getIcon(announcement.type)}
        </div>

        {/* Center: Message + CTA */}
        <div className="flex-1 flex items-center justify-center gap-4 min-w-0 px-4">
          <span className="text-sm font-medium text-white truncate">{announcement.message}</span>
          {announcement.ctaText && announcement.ctaUrl && (
            <a
              href={announcement.ctaUrl}
              className="text-xs font-bold text-white underline hover:text-gray-100 transition-colors flex-shrink-0"
            >
              {announcement.ctaText}
            </a>
          )}
        </div>

        {/* Right: Dismiss Button */}
        <button
          onClick={handleDismiss}
          className={`flex items-center justify-center w-8 h-8 text-white hover:bg-white/20 ${topLayerTokens.radius.button} ${topLayerTokens.animation.timing} ${topLayerTokens.animation.duration} flex-shrink-0`}
          aria-label="Dismiss announcement"
        >
          <X size={topLayerTokens.iconSize.small} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBar;
