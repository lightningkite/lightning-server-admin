import {Alert, AlertProps} from "@mui/material"
import React, {FC} from "react"

const ErrorAlert: FC<AlertProps> = ({children, sx, ...rest}) => {
  return (
    <Alert variant="filled" severity="error" sx={{m: 3, ...sx}} {...rest}>
      {children}
    </Alert>
  )
}

export default ErrorAlert
