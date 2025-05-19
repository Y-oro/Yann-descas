/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // adapte selon ta structure
  theme: {
    extend: {},
  },
  plugins: [
    // ici tu peux ajouter daisyUI ou d'autres plugins
    require('daisyui'),
  ],
};
