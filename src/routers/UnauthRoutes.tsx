import {Home} from "@mui/icons-material"
import {HomePage} from "pages/Home/HomePage"
import {Login} from "pages/Login"
import React, {FC} from "react"
import {Navigate, Route, Routes} from "react-router-dom"

const UnauthRoutes: FC = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<HomePage />} />
        {/* Add another route here if you want a sign-up screen, or any other unauthenticated routes */}

        {/* Redirect all other routed to the login page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default UnauthRoutes
