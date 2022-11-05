import {Box, Button, Divider, Stack} from "@mui/material"
import {AuthContext} from "App"
import React, {FC, ReactNode, useContext} from "react"
import {NavLink} from "react-router-dom"
import MyUserMenu from "./MyUserMenu"

const navItems: Array<{label: string; to: string}> = [
  {label: "Home", to: "/"},
  {label: "Users", to: "/users"},
  {label: "Formik Input Demo", to: "/input-demo"}
]

const MainLayout: FC<{children: ReactNode}> = ({children}) => {
  const {schemas} = useContext(AuthContext)

  console.log({schemas})

  return (
    <Stack direction="row" minHeight="100vh">
      <Box
        sx={{
          p: 1,
          zIndex: 1,
          backgroundColor: "white",
          width: "20rem",
          boxShadow: "0 3px 6px rgba(0,0,0,0.16)"
        }}
      >
        <MyUserMenu />

        <Divider sx={{m: 2}} />

        <Stack spacing={1}>
          {navItems.map(({label, to}) => (
            <Button
              key={to}
              component={NavLink}
              to={to}
              sx={{
                justifyContent: "start",
                "&.active": {
                  bgcolor: "primary.main",
                  color: "white"
                }
              }}
            >
              {label}
            </Button>
          ))}
        </Stack>

        <Divider sx={{m: 2}} />

        <Stack spacing={1}>
          {schemas.map((schema) => (
            <Button
              key={schema.endpointName}
              component={NavLink}
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              to={`/models/${schema.endpointName}`}
              sx={{
                justifyContent: "start",
                "&.active": {
                  bgcolor: "primary.main",
                  color: "white"
                }
              }}
            >
              {schema.title}
            </Button>
          ))}
        </Stack>
      </Box>
      <Box bgcolor="background.default" width="100%" pt={3} pb={7}>
        {children}
      </Box>
    </Stack>
  )
}

export default MainLayout
