// SOLMINT Theme Configuration

export const theme = {
  colors: {
    // Primary brand colors
    primary: {
      main: '#8A2BE2', // Electric Violet
      light: '#A35FEA',
      dark: '#6A1CB0',
    },
    secondary: {
      main: '#00FFA3', // Solana Mint
      light: '#33FFB7',
      dark: '#00CC82',
    },
    background: {
      main: '#0E0E2C', // Midnight Black
      light: '#1A1A40',
      dark: '#050518',
    },
    accent: {
      main: '#DADADA', // Soft Silver
      light: '#F0F0F0',
      dark: '#B0B0B0',
    },
    // Functional colors
    success: '#00C853',
    warning: '#FFD600',
    error: '#FF3D00',
    info: '#2196F3',
  },
  
  // Typography
  typography: {
    fontFamily: {
      heading: "'Sora', 'Space Grotesk', sans-serif",
      body: "'Inter', sans-serif",
    },
    fontWeight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
    },
  },
  
  // Spacing
  spacing: {
    xs: '0.25rem',  // 4px
    sm: '0.5rem',   // 8px
    md: '1rem',     // 16px
    lg: '1.5rem',   // 24px
    xl: '2rem',     // 32px
    '2xl': '2.5rem', // 40px
    '3xl': '3rem',   // 48px
  },
  
  // Borders
  borders: {
    radius: {
      sm: '0.25rem',  // 4px
      md: '0.5rem',   // 8px
      lg: '0.75rem',  // 12px
      xl: '1rem',     // 16px
      full: '9999px', // Circular
    },
  },
  
  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },
  
  // Transitions
  transitions: {
    default: '0.3s ease',
    fast: '0.15s ease',
    slow: '0.5s ease',
  },
};

export default theme;
