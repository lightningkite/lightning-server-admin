import {HoverHelp} from "@lightningkite/mui-lightning-components"
import {
  ExpandLess,
  ExpandMore,
  Folder,
  Home,
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
import {Context} from "App"
import React, {FC, ReactElement, ReactNode, useContext, useState} from "react"
import {NavLink} from "react-router-dom"
import {
  keyOfEndpointSchema,
  stringOfEndpointSchema
} from "utils/helpers/miscHelpers"

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

const GroupButton: FC<{
  name: string
  children?: React.ReactNode
}> = (props) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <ListItemButton
        onClick={() => setOpen(!open)}
        style={{paddingLeft: "24px"}}
      >
        <ListItemIcon>
          <Folder />
        </ListItemIcon>
        <ListItemText primary={props.name} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto">
        {props.children}
      </Collapse>
    </>
  )
}

const MainLayout: FC<{children: ReactNode}> = ({children}) => {
  const {lkSchema, logout} = useContext(Context)

  const [modelsOpen, setModelsOpen] = useState(true)
  const [endpointsOpen, setEndpointsOpen] = useState(false)

  const [endpointGrouping] = useState(() => {
    const result: Record<string, Array<EndpointSchema>> = {}

    lkSchema.endpoints.forEach((endpoint, index) => {
      const list: Array<EndpointSchema> =
        result[endpoint.group ?? "Top"] ??
        (() => {
          const arr: Array<EndpointSchema> = []
          result[endpoint.group ?? "Top"] = arr
          return arr
        })()
      list.push(endpoint)
    })

    for (const key in result) {
      result[key].sort((a, b) => {
        const as = keyOfEndpointSchema(a)
        const bs = keyOfEndpointSchema(b)
        return as < bs ? -1 : as === bs ? 0 : 1
      })
    }

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

        <NavButton to="/" label="Home" icon={<Home />} />

        <NavButton
          to="ServerInformation"
          label="Server Information"
          icon={<Info />}
        />

        <ListItemButton onClick={() => setEndpointsOpen(!endpointsOpen)}>
          <ListItemIcon>
            <Lan />
          </ListItemIcon>
          <ListItemText primary="Endpoints" />
          {endpointsOpen ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={endpointsOpen} timeout="auto">
          <List component="div" disablePadding>
            {Object.keys(endpointGrouping)
              .sort()
              .map((groupName) => {
                const inside = endpointGrouping[groupName].map(
                  (endpointSchema) => (
                    <NavButton
                      inset
                      key={stringOfEndpointSchema(endpointSchema)}
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      to={`/endpoints/detail/${keyOfEndpointSchema(
                        endpointSchema
                      )}`}
                      label={stringOfEndpointSchema(endpointSchema)}
                    />
                  )
                )
                return (
                  <GroupButton name={groupName} key={groupName}>
                    {inside}
                  </GroupButton>
                )
              })}
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
            {Object.entries(lkSchema.models)
              .sort((a, b) => a[0].localeCompare(b[0]))
              .map(([endpointName, modelSchema]) => (
                <NavButton
                  inset
                  key={endpointName}
                  to={`/models/${endpointName}`}
                  label={modelSchema.collectionName ?? modelSchema.title}
                />
              ))}
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
