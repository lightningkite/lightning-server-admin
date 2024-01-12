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
import {FC, useContext, useState} from "react"
import {LocalStorageKey} from "utils/constants"

export const HomeItems: FC = () => {
  const {session, lkSchema} = useContext(AuthContext)

  const [snackbarMessage, setSnackbarMessage] = useState<
    "Token" | "Server Url"
  >()
  const [customToken, setCustomToken] = useState("")
  const [customEndpoint, setCustomEndpoint] = useState(
    localStorage.getItem(LocalStorageKey.BACKEND_URL) ?? ""
  )

  const tempRef = () => lkSchema.models[customEndpoint]

  const changeToken = () => {
    session.userToken = customToken
    localStorage.setItem(LocalStorageKey.USER_TOKEN, customToken)
    setSnackbarMessage("Token")
  }

  const changeEndpoint = () => {
    session.api = new GenericLiveApi(customEndpoint, customEndpoint, {})
    localStorage.setItem(LocalStorageKey.BACKEND_URL, customEndpoint)
    setSnackbarMessage("Server Url")
    tempRef()
    window.location.reload()
  }

  return (
    <>
      <Card sx={{mb: 2}}>
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
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
              sx={{alignSelf: "flex-end"}}
              onClick={changeToken}
            >
              Save
            </Button>
          </Stack>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Stack gap={2}>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
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
              onClick={changeEndpoint}
              sx={{alignSelf: "flex-end"}}
            >
              Save
            </Button>
          </Stack>
        </CardContent>
      </Card>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={4500}
        onClose={() => setSnackbarMessage(undefined)}
      >
        <Alert severity="success">{`${snackbarMessage} has been changed`}</Alert>
      </Snackbar>
    </>
  )
}
