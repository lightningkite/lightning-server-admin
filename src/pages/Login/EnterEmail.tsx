import {useThrottle} from "@lightningkite/mui-lightning-components"
import {LoadingButton} from "@mui/lab"
import {Alert, Autocomplete, Stack, TextField, Typography} from "@mui/material"
import {UnauthContext} from "App"
import React, {FC, useContext, useEffect, useState} from "react"
import {LocalStorageKey} from "utils/constants"

const backendOptions: string[] =
  JSON.parse(
    localStorage.getItem(LocalStorageKey.BACKEND_URL_OPTIONS) ?? "[]"
  ) ?? []

export interface EnterEmailProps {
  email: string
  setEmail: (email: string) => void
  sendEmail: () => Promise<void>
}

const EnterEmail: FC<EnterEmailProps> = (props) => {
  const {email, setEmail, sendEmail} = props
  const {api, authenticate, changeBackendURL} = useContext(UnauthContext)

  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [backendURL, setBackendURL] = useState(
    localStorage.getItem(LocalStorageKey.BACKEND_URL) ?? ""
  )

  const throttledBackendURL = useThrottle(backendURL, 100)

  useEffect(() => {
    changeBackendURL(throttledBackendURL)
  }, [throttledBackendURL])

  const onSubmit = () => {
    setError("")

    if (email.length === 0) {
      setError("Please enter an email address")
      return
    }

    if(email.includes(".") && !email.includes("@")) {
      console.log("Maybe a JWT?")
      const header = email.substring(0, email.indexOf("."))
      console.log("Header check:", header)
      try {
        const parsed = JSON.parse(atob(header))
        console.log("Parsed is ", parsed)
        if(typeof parsed.typ === "string") {
          api?.getServerHealth(email).then(() => {
            authenticate(email)
          }).catch(e => setError("Failed to get health"))
          return
        }
      } catch (e) {
        // Squish, just means it wasn't a jwt.
      }
    }

    if (
      !email
        .toLowerCase()
        .match(
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        )
    ) {
      setError("Email address is invalid")
      return
    }

    if (!backendURL) {
      setError("Please enter a server URL")
      return
    }

    setSubmitting(true)

    sendEmail()
      .catch(() => setError("Error sending email"))
      .finally(() => setSubmitting(false))
  }

  return (
    <>
      <Typography variant="h1" textAlign="center">
        Admin Editor
      </Typography>
      <Typography variant="subtitle1" lineHeight={1.2} mt={3}>
        We&apos;ll send you a code to sign in and get started!
      </Typography>
      <Stack spacing={4} mt={4}>
        <TextField
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          fullWidth
        />

        <Autocomplete
          options={backendOptions}
          fullWidth
          disableClearable
          freeSolo
          value={backendURL}
          onInputChange={(_, value) => setBackendURL(value)}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Server URL"
              type="url"
              placeholder="api.example.com"
            />
          )}
        />

        {!!error && <Alert severity="error">{error}</Alert>}

        <LoadingButton
          variant="contained"
          color="primary"
          fullWidth
          loading={submitting}
          onClick={onSubmit}
        >
          Send Code
        </LoadingButton>
      </Stack>
    </>
  )
}

export default EnterEmail
