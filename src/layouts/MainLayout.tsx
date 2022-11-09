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
  const {schemaSets, logout} = useContext(AuthContext)

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
          <Typography variant="h5">Admin Editor</Typography>

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
          {schemaSets.map((schemaSet) => (
            <Button
              key={schemaSet.jsonSchema.endpointName}
              component={NavLink}
              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
              to={`/models/${schemaSet.jsonSchema.endpointName}`}
              sx={{
                justifyContent: "start",
                "&.active": {
                  bgcolor: "primary.main",
                  color: "white"
                }
              }}
            >
              {schemaSet.jsonSchema.title}
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
