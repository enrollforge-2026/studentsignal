/**
 * TOP EXPERIENCE LAYER SYSTEM
 * Unified design tokens for all top-of-site components:
 * - Announcement Bar
 * - Navigation Bar
 * - Mega Menus
 * - Search Expansion Panel
 */

export const topLayerTokens = {
  // Shared corner radius
  radius: {
    panel: 'rounded-xl', // 0.75rem / 12px
    button: 'rounded-lg', // 0.5rem / 8px
  },

  // Shared shadows
  shadow: {
    panel: 'shadow-2xl', // Mega menus and search panel
    hover: 'hover:shadow-xl',
    button: 'hover:shadow-md',
  },

  // Shared padding
  padding: {
    panel: 'p-8', // Main panel content padding
    panelMobile: 'p-4',
    input: 'py-4 px-14', // Search input
    item: 'p-3', // Autocomplete items
  },

  // Shared spacing
  spacing: {
    section: 'gap-8', // Between sections in panels
    item: 'gap-2', // Between items
  },

  // Shared animation timing
  animation: {
    duration: 'duration-150', // 150ms
    durationLong: 'duration-180', // 180ms
    ease: 'ease-out',
    timing: 'transition-all',
  },

  // Typography scale
  typography: {
    sectionTitle: 'text-xs font-bold uppercase tracking-wider',
    itemTitle: 'text-sm font-semibold',
    itemSubtext: 'text-xs',
  },

  // Icon scale
  iconSize: {
    small: 16,
    medium: 20,
    large: 22,
  },

  // Width and alignment
  layout: {
    maxWidth: 'max-w-7xl',
    padding: 'px-4 sm:px-6 lg:px-8',
    panelMaxWidth: 'max-w-4xl',
  },

  // Brand colors
  colors: {
    primary: '#1a5d3a',
    primaryHover: '#14482d',
    accent: '#f5a623',
    accentHover: '#e09000',
  },
};

export default topLayerTokens;
