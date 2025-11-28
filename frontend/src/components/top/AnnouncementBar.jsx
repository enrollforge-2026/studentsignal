import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const AnnouncementBar = ({ onDismiss }) => {
  const [announcement, setAnnouncement] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Fetch current announcement from API
    const fetchAnnouncement = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/announcement/current`);
        if (response.data) {
          setAnnouncement(response.data);
          // Check if dismissed
          const dismissed = localStorage.getItem(`announcement_dismissed_${response.data.id}`);
          if (dismissed) {
            setIsVisible(false);
            if (onDismiss) onDismiss();
          }
        } else {
          setIsVisible(false);
          if (onDismiss) onDismiss();
        }
      } catch (error) {
        console.error('Failed to fetch announcement:', error);
        setIsVisible(false);
        if (onDismiss) onDismiss();
      }
    };

    fetchAnnouncement();
  }, []);

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

  // Color mapping
  const colorMap = {
    green: { bg: '#10614E', text: '#FFFFFF' },
    yellow: { bg: '#FCD34D', text: '#1A1A1A' },
    red: { bg: '#EF4444', text: '#FFFFFF' },
    blue: { bg: '#3B82F6', text: '#FFFFFF' }
  };

  const colors = colorMap[announcement.color] || colorMap.green;

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
        style={{ backgroundColor: colors.bg }}
      >
        <div className="w-full max-w-[1220px] mx-auto px-4 flex items-center justify-between">
          {/* Center: Message + Link */}
          <div className="flex-1 flex items-center justify-center gap-4 min-w-0">
            <span 
              className="text-sm font-medium truncate" 
              style={{ color: colors.text }}
              dangerouslySetInnerHTML={{ __html: announcement.body }}
            />
            {announcement.link_url && (
              <a
                href={announcement.link_url}
                className="text-sm font-medium underline hover:opacity-80 transition-opacity flex-shrink-0"
                style={{ 
                  color: colors.text,
                  textDecorationThickness: '1px', 
                  textUnderlineOffset: '2px' 
                }}
              >
                Learn More
              </a>
            )}
          </div>

          {/* Right: Dismiss */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 w-8 h-8 flex items-center justify-center hover:bg-white/20 rounded-lg transition-all duration-150"
            style={{ color: colors.text }}
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
