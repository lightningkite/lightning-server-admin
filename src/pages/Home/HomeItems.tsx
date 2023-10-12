import {
  Button,
  Card,
  CardContent,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {GenericLiveApi} from "api/genericSdk"
import {AuthContext} from "App"
import React, {FC, useContext, useState} from "react"

export const HomeItems: FC = () => {
  const [customToken, setCustomToken] = useState("")
  const [customEndpoint, setCustomEndpoint] = useState("")
  const {session} = useContext(AuthContext)

  console.log(customEndpoint, session.api)

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