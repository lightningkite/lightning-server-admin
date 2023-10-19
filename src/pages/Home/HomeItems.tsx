import {
  Alert,
  Button,
  Card,
  CardContent,
  colors,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {GenericLiveApi} from "api/genericSdk"
import {AuthContext} from "App"
import React, {FC, useContext, useEffect, useState} from "react"
import {LocalStorageKey} from "utils/constants"
import {useCurrentSchema} from "utils/hooks/useCurrentSchema"

export const HomeItems: FC = () => {
  const {session, lkSchema} = useContext(AuthContext)

  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [customToken, setCustomToken] = useState("")
  const [customEndpoint, setCustomEndpoint] = useState(
    (session.api as GenericLiveApi).httpUrl
  )

  const handleClose = () => setSnackbarOpen(false)

  const tempRef = () => lkSchema.models[customEndpoint]

  // useEffect(() => {
  //   window.location.reload()
  // }, [customEndpoint])

  console.log(
    customEndpoint,
    (session.api as GenericLiveApi).httpUrl,
    session.getRestEndpoint
  )

  console.log(customToken, session.userToken)

  return (
    <>
      <Card sx={{mb: 2}}>
        <CardContent>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={4500}
            onClose={handleClose}
          >
            <Alert severity="success">{`${snackbarMessage} has been changed`}</Alert>
          </Snackbar>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={3}
            color="primary.main"
          >
            Token
          </Typography>

          <TextField
            label="Token"
            value={customToken}
            onChange={(e) => setCustomToken(e.target.value)}
            fullWidth
          />
          <Button
            variant="contained"
            onClick={() => {
              session.userToken = customToken
              setSnackbarMessage("Token")
              setSnackbarOpen(true)
            }}
          >
            Submit
          </Button>
        </CardContent>
      </Card>

      <Stack direction="column" gap={2} flexWrap={"wrap"}>
        <Card sx={{flexGrow: 1, minWidth: 200}}>
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={3}
              color="primary.main"
            >
              Base Server
            </Typography>
            <TextField
              label="Server"
              value={customEndpoint}
              onChange={(e) => setCustomEndpoint(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={() => {
                session.api = new GenericLiveApi(
                  customEndpoint,
                  customEndpoint,
                  {}
                )
                setSnackbarMessage("Server Url")
                setSnackbarOpen(true)
                tempRef()
                window.location.reload()
              }}
            >
              Submit
            </Button>
          </CardContent>
        </Card>
      </Stack>
    </>
  )
}
