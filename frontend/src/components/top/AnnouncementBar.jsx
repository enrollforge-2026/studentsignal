import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';

const AnnouncementBar = ({ announcement, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (announcement?.id) {
      const dismissed = localStorage.getItem(`announcement_dismissed_${announcement.id}`);
      if (dismissed) {
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }
    }
  }, [announcement]);

  const handleDismiss = () => {
    setIsExiting(true);
    if (announcement?.id) {
      localStorage.setItem(`announcement_dismissed_${announcement.id}`, 'true');
    }
    setTimeout(() => {
      setIsVisible(false);
      if (onDismiss) onDismiss();
    }, 180);
  };

  if (!isVisible || !announcement) return null;

  return (
    <div
      className="w-full overflow-hidden transition-all"
      style={{
        height: isExiting ? '0px' : '40px',
        opacity: isExiting ? 0 : 1,
        transition: 'height 180ms ease-out, opacity 180ms ease-out',
      }}
    >
      <div
        className="h-[40px] flex items-center justify-center"
        style={{ backgroundColor: '#004C3F' }}
      >
        <div className="w-full max-w-[1220px] mx-auto px-4 flex items-center justify-between">
          {/* Left: Emoji */}
          <div className="flex-shrink-0">
            <span className="text-base">{announcement.emoji || '🎓'}</span>
          </div>

          {/* Center: Message + CTA */}
          <div className="flex-1 flex items-center justify-center gap-4 min-w-0 px-4">
            <span className="text-sm font-medium text-white truncate">{announcement.message}</span>
            {announcement.ctaText && announcement.ctaUrl && (
              <a
                href={announcement.ctaUrl}
                className="text-sm font-medium text-white underline hover:text-gray-100 transition-colors flex-shrink-0"
                style={{ textDecorationThickness: '1px', textUnderlineOffset: '2px' }}
              >
                {announcement.ctaText}
              </a>
            )}
          </div>

          {/* Right: Dismiss */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center text-white hover:bg-white/20 rounded-lg transition-all duration-150"
            aria-label="Dismiss announcement"
          >
            <X size={16} strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
