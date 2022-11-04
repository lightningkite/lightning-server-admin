import {Login} from "pages/Login"
import React, {FC} from "react"
import {Navigate, Route, Routes} from "react-router-dom"

const UnauthRoutes: FC = () => {
  return (
    <Routes>
      <Route>
        <Route path="/login" element={<Login />} />
        {/* Add another route here if you want a sign-up screen, or any other unauthenticated routes */}

        {/* Redirect all other routed to the login page */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  )
}

export default UnauthRoutes
