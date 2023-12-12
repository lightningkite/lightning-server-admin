import {
  Alert,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {GenericLiveApi} from "api/genericSdk"
import {AuthContext} from "App"
import React, {FC, useContext, useState} from "react"
import {LocalStorageKey} from "utils/constants"

export const HomeItems: FC = () => {
  const {session, lkSchema} = useContext(AuthContext)

  const [snackbarMessage, setSnackbarMessage] = useState("")
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [customToken, setCustomToken] = useState("")
  const [customEndpoint, setCustomEndpoint] = useState(
    localStorage.getItem(LocalStorageKey.BACKEND_URL) ?? ""
  )

  const handleClose = () => setSnackbarOpen(false)

  const tempRef = () => lkSchema.models[customEndpoint]

  const changeToken = () => {
    session.userToken = customToken
    localStorage.setItem(LocalStorageKey.USER_TOKEN, customToken)
    setSnackbarMessage("Token")
    setSnackbarOpen(true)
  }

  const changeEndpoint = () => {
    session.api = new GenericLiveApi(customEndpoint, customEndpoint, {})
    localStorage.setItem(LocalStorageKey.BACKEND_URL, customEndpoint)
    setSnackbarMessage("Server Url")
    setSnackbarOpen(true)
    tempRef()
    window.location.reload()
  }

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
              changeToken()
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
                changeEndpoint()
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
