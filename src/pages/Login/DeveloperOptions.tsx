import {
  Alert,
  AlertTitle,
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  Typography
} from "@mui/material"
import {MockApi} from "api/mockApi"
import {LiveApi} from "api/sdk"
import {backendURLOptions} from "api/useSessionManager"
import {UnauthContext} from "App"
import React, {FC, useContext} from "react"
import {envBackendHTTP} from "utils/helpers/envHelpers"

const DeveloperOptions: FC = () => {
  const {changeBackendURL, api} = useContext(UnauthContext)

  const selectedBackendURL = (api as LiveApi | MockApi).httpUrl
  const isUsingCustomBackendURL = selectedBackendURL !== envBackendHTTP

  return (
    <Box sx={{textAlign: "left"}}>
      <Divider sx={{my: 2}} />
      <Typography variant="h6">Developer Settings</Typography>
      <Typography variant="subtitle2" lineHeight={1.2}>
        These options will not be shown by default on production or staging
        deployments
      </Typography>

      {isUsingCustomBackendURL && (
        <Alert severity="info" sx={{mt: 2}}>
          <AlertTitle>Custom Backend URL Selected</AlertTitle>
          You have selected different backend URL than the env variable set for
          this deployment.
        </Alert>
      )}

      <FormControl sx={{mt: 2}}>
        <FormLabel>Backend HTTP URL</FormLabel>
        <RadioGroup
          value={selectedBackendURL}
          onChange={(e) => changeBackendURL(e.target.value)}
          sx={{gap: 1, mt: 1}}
        >
          {backendURLOptions.map((option) => (
            <FormControlLabel
              key={option.url}
              value={option.url}
              control={<Radio />}
              label={
                <Stack>
                  <Typography fontWeight="bold" lineHeight={1}>
                    {option.label}
                    {option.url === envBackendHTTP && " *"}
                  </Typography>
                  <Typography variant="body2" lineHeight={1} mt="5px">
                    {option.url}
                  </Typography>
                </Stack>
              }
            />
          ))}
          <FormControlLabel
            value="mock"
            control={<Radio />}
            label={
              <Typography fontWeight="bold" lineHeight={1}>
                Mock API
              </Typography>
            }
          />
        </RadioGroup>
      </FormControl>
    </Box>
  )
}

export default DeveloperOptions
