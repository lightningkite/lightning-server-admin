import {ModelDetail} from "pages/ModelDetail"
import {ModelIndex} from "pages/ModelIndex"
import {ServerInformation} from "pages/ServerInformation"
import React, {FC} from "react"
import {Navigate, Route, Routes} from "react-router-dom"

const AuthRoutes: FC = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<ServerInformation />} />

        <Route path="/models/:endpointName" element={<ModelIndex />} />
        <Route
          path="/models/:endpointName/:modelId"
          element={<ModelDetail />}
        />

        {/* If page doesn't exist, redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default AuthRoutes
