import {CheckCircle, Error, Report, Warning} from "@mui/icons-material"
import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from "@mui/material"
import {Level, ServerHealth} from "api/genericSdk"
import {Context} from "App"
import Loading from "components/Loading"
import React, {FC, ReactNode, useContext, useEffect, useState} from "react"
import {camelCaseToTitle} from "utils/helpers/miscHelpers"

const StatusLevelIcons: Record<Level, ReactNode> = {
  [Level.OK]: <CheckCircle color="success" />,
  [Level.WARNING]: <Error color="warning" />,
  [Level.URGENT]: <Warning color="warning" />,
  [Level.ERROR]: <Report color="error" />
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes.toFixed(0) + " B"
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB"
  else if (bytes < 1073741824) return (bytes / 1048576).toFixed(1) + " MB"
  else return (bytes / 1073741824).toFixed(1) + " GB"
}

export const ServerHealthDisplay: FC = () => {
  const {session} = useContext(Context)

  const [serverHealth, setServerHealth] = useState<ServerHealth | null>()

  useEffect(() => {
    session
      .getServerHealth()
      .then(setServerHealth)
      .catch(() => setServerHealth(null))
  }, [session])

  if (serverHealth === undefined) {
    return <Loading />
  }

  if (serverHealth === null) {
    return (
      <Alert severity="error" variant="filled">
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
        <Alert severity="error" sx={{mb: 3}} variant="filled">
          <AlertTitle>Site Status</AlertTitle>
          Some services listed below are reporting anomalies. Contact Lightning
          Kite for additional information.
        </Alert>
      )}

      <Card sx={{mb: 2}}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Site Status
          </Typography>
          <List>
            {Object.entries(serverHealth.features).map(([key, value]) => (
              <ListItem key={key}>
                <ListItemIcon>{StatusLevelIcons[value.level]}</ListItemIcon>
                <ListItemText
                  primary={camelCaseToTitle(key)}
                  secondary={`${new Date(value.checkedAt).toLocaleString()} – ${
                    value.level
                  } ${
                    value.additionalMessage
                      ? " – " + value.additionalMessage
                      : ""
                  }`}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <Stack direction="row" gap={2} flexWrap={"wrap"}>
        <Card sx={{flexGrow: 1, minWidth: 200}}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
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
          </CardContent>
        </Card>

        <Card sx={{flexGrow: 1, minWidth: 200}}>
          <CardContent>
            {" "}
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              Memory
            </Typography>
            <List>
              <ListItem>
                <ListItemText
                  primary="Max"
                  secondary={formatBytes(serverHealth.memory.max)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Total"
                  secondary={formatBytes(serverHealth.memory.total)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Free"
                  secondary={formatBytes(serverHealth.memory.free)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="System Allocated"
                  secondary={formatBytes(serverHealth.memory.systemAllocated)}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary="Usage"
                  secondary={`${serverHealth.memory.usage.toString()}%`}
                />
              </ListItem>
            </List>
          </CardContent>
        </Card>
      </Stack>
    </>
  )
}
