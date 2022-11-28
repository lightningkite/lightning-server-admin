import {LoadingButton} from "@mui/lab"
import {Alert, Button, TextField, Typography} from "@mui/material"
import {UnauthContext} from "App"
import React, {createRef, FC, useContext, useEffect, useState} from "react"

export interface EnterPinProps {
  email: string
}

const EnterPin: FC<EnterPinProps> = (props) => {
  const {email} = props

  const {api, authenticate} = useContext(UnauthContext)
  const submitPinButton = createRef<HTMLButtonElement>()

  // The 6-digit pin sent to the user
  const [pin, setPin] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (pin.length === 6) {
      submitPinButton.current?.focus()
    }
  }, [pin])

  return (
    <>
      <Typography variant="h1">Pin Sent!</Typography>
      <Typography variant="subtitle1" mt={3} lineHeight={1.2}>
        Enter the 6-digit pin that has been sent to &quot;
        {email}&quot;
      </Typography>

      <TextField
        value={pin}
        onChange={(e) => setPin(e.target.value)}
        fullWidth
        sx={{my: 2}}
      />

      {!!error && (
        <Alert severity="error" sx={{mb: 2}}>
          {error}
        </Alert>
      )}

      <LoadingButton
        loading={submitting}
        variant="contained"
        disabled={pin.length < 6}
        fullWidth
        ref={submitPinButton}
        onClick={() => {
          setSubmitting(true)
          setError("")

          if (!api) {
            setError("API not set")
            setSubmitting(false)
            return
          }

          api.auth
            .emailPINLogin({
              email,
              pin
            })
            .then((token) => {
              authenticate(token)
            })
            .catch(() => setError("Failed to sign-in using the pin"))
            .finally(() => setSubmitting(false))
        }}
      >
        Submit
      </LoadingButton>

      <Button onClick={() => window.location.reload()} fullWidth sx={{mt: 1}}>
        Try Again
      </Button>
    </>
  )
}

export default EnterPin
