/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokeDark: "#020617",
        pokeCard: "rgba(30, 41, 59, 0.5)",
        pokeBlue: "#3b82f6",
        pokeRose: "#f43f5e"
      }
    },
  },
  plugins: [],
}