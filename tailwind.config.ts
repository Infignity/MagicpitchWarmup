import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      yellow: "#FFD600",
      green: "#28B446",
      red: "#FF0000",
      white: "#FFFFFF",
      blue: {
        DEFAULT: "rgb(var(--bg-blue))",
        "300": "#6B63C4",
        "500": "#584FBD",
        highlight: "#665BE3",
      },
      gray: {
        DEFAULT: "#F8F9FE",
        "100": "#F2F2F2",
        "150": "#F8F9FE",
        "200": "#E5E3FF",
        "500": "#747373",
        "800": "#2F2F2F",
      },
      green: {
        DEFAULT: "#28B446",
      },
    },
    extend: {
      fontSize: {
        "4xl": "2.25rem",
      },
    },
  },
  plugins: [],
};
export default config;
