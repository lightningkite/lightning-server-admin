import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {GenericLiveApi} from "api/genericSdk"
import {Context} from "App"
import React, {FC, useContext, useState} from "react"
import {LocalStorageKey} from "utils/constants"

export const HomeItems: FC = () => {
  const [customToken, setCustomToken] = useState("")
  const [customEndpoint, setCustomEndpoint] = useState("https://localhost:8080")
  const {session} = useContext(Context)

  console.log(customEndpoint, session.api)

  console.log(customEndpoint)

  // if customToken !== "" &&

  return (
    <>
      <Card sx={{mb: 2}}>
        <CardContent>
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
