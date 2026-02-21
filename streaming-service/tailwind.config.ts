import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        'login': "url('/assets/login-background.png')",
      },
    },
  },
  plugins: [],
} satisfies Config;
