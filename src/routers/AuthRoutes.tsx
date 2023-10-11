import {EndpointDetail} from "pages/EndpointDetail"
import {HomePage} from "pages/Home/HomePage"
import {ModelDetail} from "pages/ModelDetail"
import {ModelIndex} from "pages/ModelIndex"
import {ServerInformation} from "pages/ServerInformation"
import React, {FC} from "react"
import {Navigate, Route, Routes} from "react-router-dom"

const AuthRoutes: FC = () => {
  return (
    <Routes>
      <Route>
        <Route path="/" element={<HomePage />} />

        <Route path="ServerInformation" element={<ServerInformation />} />

        <Route path="/models/:endpointName" element={<ModelIndex />} />
        <Route
          path="/models/:endpointName/:modelId"
          element={<ModelDetail />}
        />
        <Route
          path="/endpoints/detail/:endpointIndex"
          element={<EndpointDetail />}
        />

        {/* If page doesn't exist, redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default AuthRoutes
