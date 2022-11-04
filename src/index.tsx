import {CssBaseline} from "@mui/material"
import App from "App"
import React from "react"
import ReactDOM from "react-dom/client"
import "styles/index.css"

// Fonts designed to be used by MUI
import "@fontsource/roboto/300.css"
import "@fontsource/roboto/400.css"
import "@fontsource/roboto/500.css"
import "@fontsource/roboto/700.css"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)

root.render(
  <React.StrictMode>
    <CssBaseline />
    <App />
  </React.StrictMode>
)
