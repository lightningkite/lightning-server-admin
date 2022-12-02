import {HoverHelp} from "@lightningkite/mui-lightning-components"
import {
  ExpandLess,
  ExpandMore,
  Folder,
  Info,
  Lan,
  Logout,
  Storage
} from "@mui/icons-material"
import {
  Box,
  Collapse,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from "@mui/material"
import {EndpointSchema} from "api/genericSdk"
import {AuthContext} from "App"
import React, {FC, ReactElement, ReactNode, useContext, useState} from "react"
import {NavLink} from "react-router-dom"

const NavButton: FC<{
  to: string
  label: string
  inset?: boolean
  icon?: ReactElement
}> = (props) => (
  <ListItemButton
    component={NavLink}
    to={props.to}
    sx={{
      pl: props.inset ? 4 : undefined,
      "&.active": {
        bgcolor: "grey.200"
      }
    }}
  >
    {props.icon && <ListItemIcon>{props.icon}</ListItemIcon>}
    <ListItemText primary={props.label} />
  </ListItemButton>
)

const MainLayout: FC<{children: ReactNode}> = ({children}) => {
  const {lkSchema, logout} = useContext(AuthContext)

  const [modelsOpen, setModelsOpen] = useState(true)
  const [endpointsOpen, setEndpointsOpen] = useState(false)

  const [endpointGrouping] = useState(() => {
    interface IndexEndpointSchema extends EndpointSchema {
      index: number
    }
    const result = {
      individual: [] as IndexEndpointSchema[],
      groupNames: new Set<string>()
    }

    lkSchema.endpoints.forEach((endpoint, index) => {
      if (endpoint.group) {
        result.groupNames.add(endpoint.group)
      } else {
        result.individual.push({...endpoint, index})
      }
    })

    return result
  })

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

        <NavButton to="/" label="Server Information" icon={<Info />} />

        <ListItemButton onClick={() => setEndpointsOpen(!endpointsOpen)}>
          <ListItemIcon>
            <Lan />
          </ListItemIcon>
          <ListItemText primary="Endpoints" />
          {endpointsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={endpointsOpen} timeout="auto">
          <List component="div" disablePadding>
            {[...endpointGrouping.groupNames].map((groupName) => (
              <NavButton
                inset
                key={groupName}
                to={`/endpoints/group/${groupName}`}
                label={groupName}
                icon={<Folder />}
              />
            ))}
            {endpointGrouping.individual.map((endpointSchema) => (
              <NavButton
                inset
                key={endpointSchema.index}
                to={`/endpoints/detail/${endpointSchema.index}`}
                label={endpointSchema.path}
              />
            ))}
          </List>
        </Collapse>

        <ListItemButton onClick={() => setModelsOpen(!modelsOpen)}>
          <ListItemIcon>
            <Storage />
          </ListItemIcon>
          <ListItemText primary="Models" />
          {modelsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={modelsOpen} timeout="auto">
          <List component="div" disablePadding>
            {Object.entries(lkSchema.models).map(
              ([endpointName, modelSchema]) => (
                <NavButton
                  inset
                  key={endpointName}
                  to={`/models/${endpointName}`}
                  label={modelSchema.title}
                />
              )
            )}
          </List>
        </Collapse>
      </Box>
      <Box bgcolor="background.default" width="100%" pt={3} pb={7}>
        {children}
      </Box>
    </Stack>
  )
}

export default MainLayout
