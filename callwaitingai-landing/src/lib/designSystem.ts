// Premium Design System - Deep Navy & Gold Theme
export const designSystem = {
  colors: {
    // Premium color palette
    primary: {
      navy: '#1E3A5F',
      navyLight: '#2D4A73',
      navyDark: '#0F2438',
      blue: '#1E3A5F', // Alias for gradual migration
      blueLight: '#2D4A73',
      blueDark: '#0F2438',
    },
    accent: {
      gold: '#D4AF37',
      goldLight: '#E5C158',
      goldDark: '#B8941F',
    },
    secondary: {
      green: '#10B981',
      greenLight: '#34D399',
      greenDark: '#059669',
    },
    // Neutral colors
    neutral: {
      white: '#FFFFFF',
      lightBg: '#F0F8FF',
      lightGray: '#E2E8F0',
      gray: '#A0AEC0',
      darkGray: '#4A5568',
      darker: '#2D3748',
      black: '#1A202C',
    },
    // Status colors
    status: {
      success: '#38A169',
      warning: '#ED8936',
      error: '#E53E3E',
      info: '#4299E1',
    },
  },
  
  gradients: {
    primary: 'linear-gradient(135deg, #1E3A5F 0%, #10B981 100%)',
    primaryHover: 'linear-gradient(135deg, #0F2438 0%, #059669 100%)',
    gold: 'linear-gradient(135deg, #D4AF37 0%, #F5A623 100%)',
    light: 'linear-gradient(135deg, #2D4A73 0%, #34D399 100%)',
    subtle: 'linear-gradient(135deg, rgba(30, 58, 95, 0.05) 0%, rgba(16, 185, 129, 0.05) 100%)',
  },
  
  typography: {
    headingFont: "'Playfair Display', 'Georgia', serif",
    bodyFont: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },
  
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '0.75rem',
    xl: '1rem',
    '2xl': '1.5rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },
  
  animations: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },
};

export type DesignSystem = typeof designSystem;
