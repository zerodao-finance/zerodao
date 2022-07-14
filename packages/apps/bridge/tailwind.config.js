module.exports = {
  content: ["./src/**/*.{js,jsx}", "./node_modules/flowbite/**/*.js"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "main-green": "#52B76C",
        "hover-green": "#3D8951",
        "alert-red": "#CF6679",
        "badger-black": {
          400: "#4a4a4a",
          500: "#363636",
          700: "#1e1e1e",
          800: "#121212",
        },
        "badger-yellow-neon": {
          400: "#ffcf4d",
          500: "#e6ba45",
        },
        "badger-yellow": {
          300: "#f2bc1b",
          400: "#ffb84d",
          500: "#e6a645",
          600: "#cc933e",
        },
        "badger-gray": {
          200: "#a5a5a5",
          300: "#afafaf",
          400: "#404040",
          500: "#666666",
          600: "#8a8a8a",
        },
        "badger-blue": {
          400: "#91cdff",
          600: "#83b9e6",
        },
        "badger-white": {
          400: "#e6e6e6",
        },
        "badger-text-secondary": {
          400: "#FFFFFF99",
        },
        "error-red": {
          400: "#EC4B4B",
        },
        "zero-green": {
          DEFAULT: "#2D9E32",
          50: "#9FE4A2",
          100: "#8FDF93",
          200: "#6FD674",
          300: "#50CD55",
          400: "#36BE3C",
          500: "#2D9E32",
          600: "#217224",
          700: "#144716",
          800: "#006837",
          900: "#000000",
        },
        "zero-neon-green": {
          DEFAULT: "#0DD60D",
          50: "#A1F9A1",
          100: "#8EF88E",
          200: "#68F668",
          300: "#41F341",
          400: "#1BF11B",
          500: "#0DD60D",
          600: "#0AA10A",
          700: "#076C07",
          800: "#033703",
          900: "#000200",
        },
      },
      fontFamily: {
        header: [
          "Satoshi",
          "IBM Plex Sans",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        caption: [
          "Satoshi",
          "IBM Plex Sans",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        sans: ["Satoshi", "IBM Plex Sans", "Helvetica", "Arial", "sans-serif"],
      },
      animation: {
        "jello-horizontal": "jello-horizontal 0.8s ease   both",
        "trace-path": "trace-path 4s",
        fade: "fade 6s",
        "swing-in-top-fwd":
          "swing-in-top-fwd 0.5s cubic-bezier(0.175, 0.885, 0.320, 1.275)   both",
        "scale-in-hor-center":
          "scale-in-hor-center 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "swing-out-top-bck":
          "swing-out-top-bck 0.55s cubic-bezier(0.600, -0.280, 0.735, 0.045)   both",
        "jello-vertical": "jello-vertical 0.8s ease   both",
        "flip-in-hor-top":
          "flip-in-hor-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "scale-in-bottom":
          "scale-in-bottom 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940)   both",
        "slide-in-from-left": "slide-in-from-left .5s steps(1000)",
        "slide-out-to-left": "slide-out-to-left .5s steps(1000)",
        "fade-in": "fade-in 0.8s",
      },
      keyframes: {
        "slide-in-from-left": {
          from: {
            left: "-1000px",
          },
          to: {
            left: "10px",
          },
        },
        "slide-out-to-left": {
          from: {
            left: "10px",
          },
          to: {
            left: "-1000px",
          },
        },
        "scale-in-bottom": {
          "0%": {
            transform: "scale(0)",
            "transform-origin": "50% 100%",
            opacity: "1",
          },
          to: {
            transform: "scale(1)",
            "transform-origin": "50% 100%",
            opacity: "1",
          },
        },
        "flip-in-hor-top": {
          "0%": {
            transform: "rotateX(-80deg)",
            opacity: "0",
          },
          to: {
            transform: "rotateX(0)",
            opacity: "1",
          },
        },
        "jello-vertical": {
          "0%,to": {
            transform: "scale3d(1, 1, 1)",
          },
          "30%": {
            transform: "scale3d(.75, 1.25, 1)",
          },
          "40%": {
            transform: "scale3d(1.25, .75, 1)",
          },
          "50%": {
            transform: "scale3d(.85, 1.15, 1)",
          },
          "65%": {
            transform: "scale3d(1.05, .95, 1)",
          },
          "75%": {
            transform: "scale3d(.95, 1.05, 1)",
          },
        },
        "swing-out-top-bck": {
          "0%": {
            transform: "rotateX(0deg)",
            "transform-origin": "top",
            opacity: "1",
          },
          to: {
            transform: "rotateX(-100deg)",
            "transform-origin": "top",
            opacity: "0",
          },
        },
        "scale-in-hor-center": {
          "0%": {
            transform: "scaleX(0)",
            opacity: "1",
          },
          to: {
            transform: "scaleX(1)",
            opacity: "1",
          },
        },
        "jello-horizontal": {
          "0%,to": {
            transform: "scale3d(1, 1, 1)",
            opacity: 1,
          },
          "30%": {
            transform: "scale3d(1.25, .75, 1)",
          },
          "40%": {
            transform: "scale3d(.75, 1.25, 1)",
          },
          "50%": {
            transform: "scale3d(1.15, .85, 1)",
          },
          "65%": {
            transform: "scale3d(.95, 1.05, 1)",
          },
          "75%": {
            transform: "scale3d(1.05, .95, 1)",
            opacity: 0,
          },
        },
        "swing-in-top-fwd": {
          "0%": {
            transform: "rotateX(-100deg)",
            "transform-origin": "top",
            opacity: "0",
          },
          to: {
            transform: "rotateX(0deg)",
            "transform-origin": "top",
            opacity: "1",
          },
        },
        "trace-path": {
          "0%, to": {
            strokeDashoffset: "130",
            opacity: 0,
          },
          "1%": {
            strokeDashoffset: "130",
            opacity: 1,
          },

          "50%": {
            strokeDashoffset: "0",
            opacity: 1,
          },

          "100%": {
            strokeDashoffset: "130",
            opacity: 0,
          },
        },

        fade: {
          "0%, to": {
            backdropFilter: "blur(24px)",
          },
          "50%": {
            backdropFilter: "blur(24px)",
          },
          "75%": {
            backdropFilter: "blur(24px)",
          },
          "100%": {
            backdropFilter: "blur(0)",
          },
        },
        "fade-in": {
          "0%": {
            opacity: 0,
          },
          "50%": {
            opacity: 0,
          },
          "100%": {
            opacity: 1,
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    require("flowbite/plugin"),
    require("tailwind-scrollbar-hide"),
  ],
};
