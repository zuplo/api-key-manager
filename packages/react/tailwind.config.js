/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "consumers-header-background": "#4f566b",
        "consumers-keys-background": "#2a2f45",
        "consumer-menu-hover": "#697386",
        "key-action-background": "#3c4257",
        "menu-background": "#1a1f36",
        "menu-hover": "#2a2f45",
      },
    },
  },
  plugins: [],
  darkMode: "class",
};
