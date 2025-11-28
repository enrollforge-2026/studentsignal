import React, { useState, useEffect, useRef } from 'react';
import AnnouncementBar from './AnnouncementBar';
import Header from './Header';
import SearchOverlay from './SearchOverlay';

const TopExperienceLayer = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [announcementHeight, setAnnouncementHeight] = useState(40);
  const [showAnnouncement, setShowAnnouncement] = useState(true);
  const containerRef = useRef(null);

  const currentAnnouncement = {
    id: 'spring-2025-deadline',
    emoji: '🎓',
    message: 'Spring 2025 Applications Close in 7 Days',
    ctaText: 'Browse Colleges',
    ctaUrl: '/colleges',
  };

  const handleAnnouncementDismiss = () => {
    setShowAnnouncement(false);
    setAnnouncementHeight(0);
  };

  const handleSearchOpen = () => {
    setIsSearchOpen(true);
  };

  const handleSearchClose = () => {
    setIsSearchOpen(false);
  };

  const topOffset = showAnnouncement ? 40 + 64 : 64;

  return (
    <>
      {/* Fixed Top Layer Container */}
      <div
        ref={containerRef}
        className="fixed top-0 left-0 right-0"
        style={{ zIndex: 60 }}
      >
        {/* Announcement Bar */}
        {showAnnouncement && (
          <div style={{ zIndex: 60 }}>
            <AnnouncementBar
              announcement={currentAnnouncement}
              onDismiss={handleAnnouncementDismiss}
            />
          </div>
        )}

        {/* Header */}
        <div style={{ zIndex: 50 }}>
          <Header onSearchOpen={handleSearchOpen} announcementVisible={showAnnouncement} />
        </div>
      </div>

      {/* Spacer to prevent content from going under fixed header */}
      <div style={{ height: `${topOffset}px` }} />

      {/* Search Overlay */}
      <SearchOverlay
        isOpen={isSearchOpen}
        onClose={handleSearchClose}
        topOffset={topOffset}
      />
    </>
  );
};

export default TopExperienceLayer;
