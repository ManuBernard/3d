module.exports = {
  purge: {
    content: ["./src/**/*.html"],
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend: {
      boxShadow: {
        focus: "0 0 0 4px rgba(255, 0, 2, .8)",
      },
      colors: {
        black: {
          default: "#000000",
          10: "rgba(0, 0, 0, 0.1)",
          50: "rgba(0, 0, 0, 0.5)",
          80: "rgba(0, 0, 0, 0.8)",
        },
        white: {
          default: "#FFFFFF",
        },
        grey: {
          100: "#F2F2F2",
          200: "#E5E5E5",
          400: "#BFBFBF",
          600: "#7F7F7F",
          800: "#343434",
          900: "#1A1A1A",
        },
        status: {
          info: "#FDD13A",
          warning: "#FF832B",
          danger: "#DA1E28",
          success: "#24A148",
        },
      },
    },
    fontSize: {
      xs: "0.8rem",
      sm: "0.875rem",
      base: "1rem",
      md: "1.125rem",
      xl: "1.375rem",
      "2xl": "1.625rem",
      "3xl": "2rem",
      "4xl": "2.625rem",
      "5xl": "3.5625rem",
      "6xl": "5.5rem",
    },
    fontFamily: {
      title: ["RockwellStd", "Open Sans", "Helvetica", "sans-serif"],
      sans: ["Open Sans", "Helvetica", "sans-serif"],
    },
    screens: {
      xs: "375px",
      "max-xs": { max: "479px" },
      sm: "480px",
      "max-sm": { max: "767px" },
      md: "768px",
      "max-md": { max: "1023px" },
      lg: "1024px",
      "max-lg": { max: "1279px" },
      xl: "1280px",
    },
  },
  corePlugins: {
    container: false,
  },
};
