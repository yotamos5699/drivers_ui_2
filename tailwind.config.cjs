/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx,ts,tsx}"],
  theme: {
    extend: {},
    flex: {
      "1/3": "1 1 33%",
      "1/4": "1 1 25%",
      "1/2": "1 1 50%",
      "1/8": "1 1 12%",
      "1/16": "1 1 6%",
      
      "1/10": "1 1 10%",
    },
  },
  plugins: [],
};
