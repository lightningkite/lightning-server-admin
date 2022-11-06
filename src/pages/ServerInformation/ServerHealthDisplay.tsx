import {CheckCircle, Error, Report, Warning} from "@mui/icons-material"
import {
  Alert,
  AlertTitle,
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from "@mui/material"
import {Level, ServerHealth} from "api/sdk"
import {AuthContext} from "App"
import Loading from "components/Loading"
import React, {FC, ReactNode, useContext, useEffect, useState} from "react"
import {lowerCamelCaseToTitleCase} from "utils/helpers/miscHelpers"

const StatusLevelIcons: Record<Level, ReactNode> = {
  [Level.OK]: <CheckCircle color="success" />,
  [Level.WARNING]: <Error color="warning" />,
  [Level.URGENT]: <Warning color="warning" />,
  [Level.ERROR]: <Report color="error" />
}

export const ServerHealthDisplay: FC = () => {
  const {session} = useContext(AuthContext)

  const [serverHealth, setServerHealth] = useState<ServerHealth | null>()

  useEffect(() => {
    session
      .getServerHealth()
      .then(setServerHealth)
      .catch(() => setServerHealth(null))
  }, [session])

  return (
    <Card>
      <CardContent>
        {(() => {
          if (serverHealth === undefined) {
            return <Loading />
          }

          if (serverHealth === null) {
            return (
              <Alert severity="error">
                Failed to get server health information
              </Alert>
            )
          }

          const featuresNotOK = Object.keys(serverHealth.features).filter(
            (feature) => serverHealth.features[feature].level !== Level.OK
          )

          return (
            <>
              {featuresNotOK.length > 0 && (
                <Alert severity="error" sx={{mb: 3}}>
                  <AlertTitle>Server Status Errors</AlertTitle>
                  Some features listed below are reporting errors. Contact
                  Lightning Kite for additional information.
                </Alert>
              )}

              <Stack direction="row" gap={2} mb={2} flexWrap={"wrap"}>
                <Box sx={{flexGrow: 1, minWidth: 200}}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    General Information
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Server ID"
                        secondary={serverHealth.serverId}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Server Version"
                        secondary={serverHealth.version}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Average CPU"
                        secondary={`${serverHealth.loadAverageCpu}%`}
                      />
                    </ListItem>
                  </List>
                </Box>

                <Box sx={{flexGrow: 1, minWidth: 200}}>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    color="primary.main"
                  >
                    Memory
                  </Typography>

                  <List>
                    <ListItem>
                      <ListItemText
                        primary="Max"
                        secondary={`${serverHealth.memory.maxMem} MB`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Total"
                        secondary={`${serverHealth.memory.totalMemory} MB`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Free"
                        secondary={`${serverHealth.memory.freeMemory} MB`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="System Allocated"
                        secondary={`${serverHealth.memory.systemAllocated} MB`}
                      />
                    </ListItem>
                    <ListItem>
                      <ListItemText
                        primary="Usage"
                        secondary={`${serverHealth.memory.memUsagePercent}%`}
                      />
                    </ListItem>
                  </List>
                </Box>
              </Stack>

              <Box>
                <Typography variant="h6" fontWeight="bold" color="primary.main">
                  Server Status
                </Typography>

                <List>
                  {Object.entries(serverHealth.features).map(([key, value]) => (
                    <ListItem key={key}>
                      <ListItemIcon>
                        {StatusLevelIcons[value.level]}
                      </ListItemIcon>
                      <ListItemText
                        primary={lowerCamelCaseToTitleCase(key)}
                        secondary={`${new Date(
                          value.checkedAt
                        ).toLocaleString()} – ${value.level} ${
                          value.additionalMessage
                            ? " – " + value.additionalMessage
                            : ""
                        }`}
                      />
                    </ListItem>
                  ))}
                </List>
              </Box>
            </>
          )
        })()}
      </CardContent>
    </Card>
  )
}
