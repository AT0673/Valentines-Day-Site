// Theme configuration for Valentine's Day Website
// Based on Soft Romantic Dreamscape aesthetic

export const theme = {
  colors: {
    // Primary Gradients
    gradients: {
      pinkLavender: 'linear-gradient(135deg, #FFD6E8 0%, #E8D6FF 100%)',
      peachyBlush: 'linear-gradient(135deg, #FFE5D9 0%, #FFB6C1 100%)',
      creamRose: 'linear-gradient(135deg, #FFF8F0 0%, #FFE4E1 100%)',
      cosmicNight: 'linear-gradient(180deg, #0F0E17 0%, #2E1F3E 100%)',
      twilightToCosmic: 'linear-gradient(180deg, #E8D6FF 0%, #16213E 50%, #0F0E17 100%)',
    },

    // Accent Colors
    primary: '#FF6B9D', // Deep romantic rose
    secondary: '#C8B6E2', // Soft lavender
    background: '#FFFAF0', // Warm cream
    surface: '#FFF8F0', // Cream

    // Soft colors
    softPink: '#FFD6E8',
    lavender: '#E8D6FF',
    peach: '#FFE5D9',
    blush: '#FFB6C1',
    rose: '#FFE4E1',

    // Special pages
    cosmicDark: '#0F0E17',
    cosmicPurple: '#2E1F3E',
    nightBlue: '#1A1A2E',
    deepPurple: '#16213E',

    // Utility
    white: '#FFFFFF',
    text: {
      primary: '#2C1810',
      secondary: '#6B5855',
      light: '#9B8B88',
    },

    // Glass morphism
    glass: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(255, 255, 255, 0.15)',
      strong: 'rgba(255, 255, 255, 0.25)',
      border: 'rgba(255, 255, 255, 0.18)',
    },

    // Gold accent
    gold: 'rgba(255, 215, 0, 0.2)',
  },

  typography: {
    fonts: {
      display: '"Playfair Display", "Cormorant Garamond", serif',
      body: '"Raleway", -apple-system, BlinkMacSystemFont, sans-serif',
      script: '"Dancing Script", "Parisienne", cursive',
    },

    sizes: {
      hero: '72px',
      h1: '48px',
      h2: '40px',
      h3: '32px',
      h4: '24px',
      body: '18px',
      bodyMobile: '18px',
      small: '16px',
      caption: '14px',
    },

    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
    },

    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.6,
      loose: 1.8,
    },
  },

  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
    '4xl': '96px',
    '5xl': '128px',
  },

  borderRadius: {
    sm: '8px',
    md: '16px',
    lg: '24px',
    full: '9999px',
  },

  shadows: {
    soft: '0 4px 16px rgba(255, 182, 193, 0.15)',
    medium: '0 8px 32px rgba(255, 182, 193, 0.2)',
    strong: '0 12px 48px rgba(255, 182, 193, 0.25)',
    glass: '0 8px 32px rgba(31, 38, 135, 0.15)',
  },

  breakpoints: {
    mobile: '768px',
    tablet: '1024px',
    desktop: '1440px',
  },

  container: {
    default: '1200px',
    narrow: '800px',
  },

  animations: {
    durations: {
      fast: '200ms',
      normal: '400ms',
      slow: '600ms',
      slower: '800ms',
      slowest: '1000ms',
      bloom: '2000ms',
    },

    easings: {
      easeOut: 'cubic-bezier(0.16, 1, 0.3, 1)',
      easeIn: 'cubic-bezier(0.7, 0, 0.84, 0)',
      easeInOut: 'cubic-bezier(0.87, 0, 0.13, 1)',
      spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
  },

  zIndex: {
    background: -1,
    normal: 1,
    dropdown: 10,
    sticky: 20,
    nav: 30,
    modal: 40,
    overlay: 50,
    cursor: 60,
  },
} as const;

export type Theme = typeof theme;
