module.exports = {
  theme: {
    theme: {
      spacing: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px"
      }
    },
    screens: {
      lg: { max: "1200px" },
      md: { max: "768px" },
      sm: { max: "450px" }
    },
    extend: {
      colors: {
        "regal-blue": "#243c5a"
      }
    },

    customForms: theme => ({
      default: {
        input: {
          borderRadius: theme("borderRadius.lg"),
          backgroundColor: theme("colors.gray.200"),
          "&:focus": {
            backgroundColor: theme("colors.white")
          }
        },
        select: {
          borderRadius: theme("borderRadius.lg"),
          boxShadow: theme("boxShadow.default")
        },
        checkbox: {
          width: theme("spacing.6"),
          height: theme("spacing.6"),
          "&:focus": {
            boxShadow: undefined
          }
        }
      }
    })
  },
  plugins: [require("@tailwindcss/custom-forms")]
};
