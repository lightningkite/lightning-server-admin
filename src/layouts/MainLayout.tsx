import {HoverHelp} from "@lightningkite/mui-lightning-components"
import {Logout} from "@mui/icons-material"
import {
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography
} from "@mui/material"
import {AuthContext} from "App"
import React, {FC, ReactNode, useContext} from "react"
import {NavLink} from "react-router-dom"

const MainLayout: FC<{children: ReactNode}> = ({children}) => {
  const {lkSchema, logout} = useContext(AuthContext)

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
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="apart"
          sx={{pt: 2}}
        >
          <Typography variant="h5" sx={{ml: 1}}>
            Admin Editor
          </Typography>

          <HoverHelp description="Log out" enableWrapper sx={{ml: "auto"}}>
            <IconButton onClick={logout}>
              <Logout />
            </IconButton>
          </HoverHelp>
        </Stack>

        <Divider sx={{my: 2}} />

        <Button
          component={NavLink}
          fullWidth
          to={"/"}
          sx={{
            justifyContent: "start",
            "&.active": {
              bgcolor: "primary.main",
              color: "white"
            }
          }}
        >
          Server Information
        </Button>

        <Divider sx={{my: 2}} />

        <Stack spacing={1}>
          {Object.entries(lkSchema.models).map(
            ([endpointName, modelSchema]) => (
              <Button
                key={endpointName}
                component={NavLink}
                to={`/models/${endpointName}`}
                sx={{
                  justifyContent: "start",
                  "&.active": {
                    bgcolor: "primary.main",
                    color: "white"
                  }
                }}
              >
                {modelSchema.title}
              </Button>
            )
          )}
        </Stack>
      </Box>
      <Box bgcolor="background.default" width="100%" pt={3} pb={7}>
        {children}
      </Box>
    </Stack>
  )
}

export default MainLayout
