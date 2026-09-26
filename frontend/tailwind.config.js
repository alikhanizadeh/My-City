/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Vazirmatn", "sans-serif"],
      },
      colors: {
        primary: {
          from: "#0EA5E9",
          to: "#2563EB",
          DEFAULT: "#2563EB",
        },
        status: {
          new: "#F59E0B",
          progress: "#3B82F6",
          done: "#10B981",
          rejected: "#EF4444",
        },
        surface: {
          bg: "#F8FAFC",
          card: "#FFFFFF",
        },
        ink: {
          primary: "#0F172A",
          secondary: "#64748B",
        },
      },
      borderRadius: {
        card: "16px",
      },
      boxShadow: {
        soft: "0 4px 20px -4px rgba(15, 23, 42, 0.08)",
        "soft-hover": "0 8px 28px -4px rgba(15, 23, 42, 0.14)",
      },
      backgroundImage: {
        "gradient-primary": "linear-gradient(135deg, #0EA5E9 0%, #2563EB 100%)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
