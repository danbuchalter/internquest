/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", // Include your HTML file
    "./src/**/*.{js,ts,jsx,tsx}", // Include all JavaScript and TypeScript files inside the src folder
    "./components/**/*.{js,ts,jsx,tsx}", // If you have a components folder, include it here
    "./pages/**/*.{js,ts,jsx,tsx}", // Include all pages (if you're using Next.js, or other frameworks with a pages directory)
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        // Add any other colors you want here
      },
    },
  },
  plugins: [],
};