module.exports = {
  mode: "jit",
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#2D007A",
          "primary-focus": "#1A0047",
          "primary-light": "#6A2FE8",
          "primary-lowopacity": "#E4E4E4",
          secondary: "#E93458",
          accent: "#2D007A",
          neutral: "#3D4451",
          "base-100": "#FFFFFF",
          "base-200": "#F4F4F4",
        },
      },
      "light",
    ],
    screens: {
      '2xl': {'max': '1535px'},
      // => @media (max-width: 1535px) { ... }

      'xl': {'max': '1279px'},
      // => @media (max-width: 1279px) { ... }

      'lg': {'max': '1023px'},
      // => @media (max-width: 1023px) { ... }

      'md': {'max': '767px'},
      // => @media (max-width: 767px) { ... }

      'sm': {'max': '639px'},
      // => @media (max-width: 639px) { ... }
    },
  },
  plugins: [require("daisyui")],
};
