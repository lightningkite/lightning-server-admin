import {createTheme} from "@mui/material"

// https://mui.com/material-ui/customization/theming/
export const theme = createTheme({
  // https://mui.com/material-ui/customization/typography/
  typography: {
    h1: {
      fontSize: 26,
      lineHeight: 1.2
    }
  },

  // https://mui.com/material-ui/customization/color/
  palette: {
    primary: {
      // This is the primary color used throughout the app. See: https://mui.com/material-ui/customization/palette/#using-a-color-object
      main: "#1c386b"
    },
    background: {
      default: "#F6F6F6"
    }
  },

  // https://mui.com/material-ui/customization/theme-components/
  components: {}
})
