import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        civy: {
          light: {
            primary: {
              100: "#F9F4EB",
              200: "#E0DCD4",
              300: "#C7C3BC",
              400: "#AEABA5",
              500: "#95928D"
            },
            secondary: {
              100: "#747068",
              200: "#5D584F",
              300: "#454036",
              400: "#2E281D",
              500: "#171004"
            },
            accent: {
              100: "#F0C112",
              200: "#D8AE10",
              300: "#C09A0E",
              400: "#A8870D",
              500: "#90740B",
              600: "#786109",
            }
          }
        }
      },
    },
  },
  plugins: [],
};
export default config;
