import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "var(--primary)",
                    hover: "var(--primary-hover)",
                    foreground: "var(--primary-foreground)"
                },
                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)"
                },
                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)"
                },
                surface: "var(--surface)",
                border: "var(--border)",
            },
            borderRadius: {
                DEFAULT: "var(--radius)"
            },
            fontFamily: {
                heading: ["var(--font-outfit)", "sans-serif"],
                body: ["var(--font-outfit)", "sans-serif"],
            },
        },
        container: {
            center: true,
            padding: "1rem",
            screens: {
                "2xl": "1200px",
            }
        }
    },
    plugins: [],
};
export default config;
