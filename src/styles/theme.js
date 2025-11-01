/**
 * Theme Configuration for AutoService Application
 * IMPORTANT: Do NOT modify existing color values
 * These colors are used throughout the application
 */

export const theme = {
  colors: {
    // Primary colors (existing - DO NOT CHANGE)
    primary: "#0ea5e9", // Sky blue
    primaryDark: "#0284c7",
    primaryLight: "#38bdf8",
    
    // Secondary colors (existing - DO NOT CHANGE)
    secondary: "#6c757d", // Gray
    secondaryDark: "#495057",
    secondaryLight: "#adb5bd",
    
    // Status colors (existing - DO NOT CHANGE)
    success: "#10b981", // Green
    successDark: "#059669",
    successLight: "#34d399",
    
    warning: "#f59e0b", // Amber
    warningDark: "#d97706",
    warningLight: "#fbbf24",
    
    danger: "#ef4444", // Red
    dangerDark: "#dc2626",
    dangerLight: "#f87171",
    
    info: "#3b82f6", // Blue
    infoDark: "#2563eb",
    infoLight: "#60a5fa",
    
    // Neutral colors (existing - DO NOT CHANGE)
    white: "#ffffff",
    black: "#000000",
    gray100: "#f3f4f6",
    gray200: "#e5e7eb",
    gray300: "#d1d5db",
    gray400: "#9ca3af",
    gray500: "#6b7280",
    gray600: "#4b5563",
    gray700: "#374151",
    gray800: "#1f2937",
    gray900: "#111827",
    
    // Background colors
    background: "#f8f9fa",
    backgroundDark: "#e9ecef",
    surface: "#ffffff",
  },
  
  // Typography
  fonts: {
    primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    mono: "source-code-pro, Menlo, Monaco, Consolas, 'Courier New', monospace",
  },
  
  // Spacing (8px base)
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px",
  },
  
  // Border radius
  borderRadius: {
    sm: "4px",
    md: "8px",
    lg: "12px",
    xl: "16px",
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    xl: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  
  // Transitions
  transitions: {
    fast: "150ms ease-in-out",
    normal: "300ms ease-in-out",
    slow: "500ms ease-in-out",
  },
  
  // Breakpoints
  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1536px",
  },
};

// CSS Custom Properties for use in styled-components or CSS
export const cssVariables = `
  :root {
    --color-primary: ${theme.colors.primary};
    --color-primary-dark: ${theme.colors.primaryDark};
    --color-primary-light: ${theme.colors.primaryLight};
    
    --color-secondary: ${theme.colors.secondary};
    --color-secondary-dark: ${theme.colors.secondaryDark};
    --color-secondary-light: ${theme.colors.secondaryLight};
    
    --color-success: ${theme.colors.success};
    --color-warning: ${theme.colors.warning};
    --color-danger: ${theme.colors.danger};
    --color-info: ${theme.colors.info};
    
    --color-background: ${theme.colors.background};
    --color-surface: ${theme.colors.surface};
    
    --font-primary: ${theme.fonts.primary};
    --font-mono: ${theme.fonts.mono};
    
    --spacing-xs: ${theme.spacing.xs};
    --spacing-sm: ${theme.spacing.sm};
    --spacing-md: ${theme.spacing.md};
    --spacing-lg: ${theme.spacing.lg};
    --spacing-xl: ${theme.spacing.xl};
    
    --radius-sm: ${theme.borderRadius.sm};
    --radius-md: ${theme.borderRadius.md};
    --radius-lg: ${theme.borderRadius.lg};
    
    --shadow-sm: ${theme.shadows.sm};
    --shadow-md: ${theme.shadows.md};
    --shadow-lg: ${theme.shadows.lg};
    
    --transition-fast: ${theme.transitions.fast};
    --transition-normal: ${theme.transitions.normal};
  }
`;

export default theme;
