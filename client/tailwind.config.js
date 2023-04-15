/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#ebe5f0",
        secondary: {
          100: "#cdc1e0",
          200: "#ab9cc6",
          light: "#bfb2d4",
        },
        action: "#171b72",
        light: "#facaca",
        dark: "#d80c0c",
        receiver: "#fe9d9d",
      },
      keyframes: {
        move: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": {
            backgroundPosition: "100% 100%",
            animationTimingFunction: "ease-in-out!important",
          },
        },
      },

      animation: {
        move: "move 1s ease-in-out infinite",
      },
    },
    fontFamily: {
      general: ["Chakra Petch"],
      all: ["Yanone Kaffeesatz"],
      head: ["Orbitron"],
      name: ["Itim"],
    },
  },
  plugins: [],
};
