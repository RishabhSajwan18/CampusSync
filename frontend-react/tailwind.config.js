/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        surface: {
          DEFAULT: "#0B1220",
          card: "#141B2D",
          elevated: "#1A2338",
        },
        primary: {
          DEFAULT: "#4F8CFF",
          hover: "#3d7aef",
        },
        accent: {
          DEFAULT: "#8FB3FF",
          muted: "#6B8FC7",
        },
        content: {
          DEFAULT: "#E6EDF7",
          muted: "#8B9BB4",
          faint: "#5C6B82",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      maxWidth: {
        report: "850px",
      },
      transitionDuration: {
        DEFAULT: "200ms",
      },
    },
  },
  plugins: [],
};
