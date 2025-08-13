/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  // Tambahkan bagian plugins ini
  plugins: [
    require('@tailwindcss/forms'),
  ],
}