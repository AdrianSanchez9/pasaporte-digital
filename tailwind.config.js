/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/views/**/*.ejs"],
  theme: {
    extend: {
      colors: {
        colorAzulFundacion: "#2D4764",
        azulFundacionHover: "#1E3248",
      },
      fontFamily: {
        bitter: ["Bitter", "serif"],
      },
    },
  },
  plugins: [],
};
