/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Do NOT use this for colors, as a bug in the tailwind css export will
        // prevent the tailwind.css from picking these up
        // Instead use selectors and values directly
        // Ex. for dark mode use
        /**
         * .dark .simple-menu-dialog:hover {
         *     background-color: #1a1f36;
         *  }
         */
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
