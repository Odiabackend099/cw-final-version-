// New Design System - Blue-Green Gradient Theme
export const designSystem = {
  colors: {
    // Primary gradient colors
    primary: {
      blue: '#4299E1',
      blueLight: '#63B3ED',
      blueDark: '#3182CE',
      green: '#38A169',
      greenLight: '#48BB78',
      greenDark: '#2F855A',
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
    primary: 'linear-gradient(135deg, #4299E1 0%, #38A169 100%)',
    primaryHover: 'linear-gradient(135deg, #3182CE 0%, #2F855A 100%)',
    light: 'linear-gradient(135deg, #63B3ED 0%, #48BB78 100%)',
    subtle: 'linear-gradient(135deg, rgba(66, 153, 225, 0.1) 0%, rgba(56, 161, 105, 0.1) 100%)',
  },
  
  typography: {
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
