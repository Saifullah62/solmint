/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        heading: ['Sora', 'Space Grotesk', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // SOLMINT brand colors
        solmint: {
          violet: "#8A2BE2", // Electric Violet
          violetLight: "#A35FEA",
          violetDark: "#6A1CB0",
          mint: "#00FFA3", // Solana Mint
          mintLight: "#33FFB7",
          mintDark: "#00CC82",
          black: "#0E0E2C", // Midnight Black
          blackLight: "#1A1A40",
          blackDark: "#050518",
          silver: "#DADADA", // Soft Silver
          silverLight: "#F0F0F0",
          silverDark: "#B0B0B0",
        },
        primary: {
          DEFAULT: "#8A2BE2", // Electric Violet
          foreground: "#FFFFFF",
          light: "#A35FEA",
          dark: "#6A1CB0",
        },
        secondary: {
          DEFAULT: "#00FFA3", // Solana Mint
          foreground: "#0E0E2C",
          light: "#33FFB7",
          dark: "#00CC82",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "#DADADA", // Soft Silver
          foreground: "#0E0E2C",
          light: "#F0F0F0",
          dark: "#B0B0B0",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
