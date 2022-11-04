import {LoadingButton} from "@mui/lab"
import {Alert, Button, TextField, Typography} from "@mui/material"
import {UnauthContext} from "App"
import React, {createRef, FC, useContext, useEffect, useState} from "react"

export interface EnterCodeProps {
  tempUUID: string
  identifier: string
}

const EnterCode: FC<EnterCodeProps> = (props) => {
  const {identifier, tempUUID} = props

  const {api, authenticate} = useContext(UnauthContext)
  const submitCodeButton = createRef<HTMLButtonElement>()

  // The 7-digit code sent to the user
  const [code, setCode] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (code.length === 7) {
      submitCodeButton.current?.focus()
    }
  }, [code])

  return (
    <>
      <Typography variant="h1">Code Sent!</Typography>
      <Typography variant="subtitle1" mt={3} lineHeight={1.2}>
        Enter the 7-digit code that has been sent to &quot;
        {identifier}&quot;
      </Typography>

      <TextField
        value={code}
        onChange={(e) => setCode(e.target.value)}
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
        disabled={code.length < 7}
        fullWidth
        ref={submitCodeButton}
        onClick={() => {
          setSubmitting(true)
          setError("")
          api.auth
            .submitSSO({
              value: code,
              clientKey: tempUUID
            })
            .then((token) => {
              authenticate(token)
            })
            .catch(() => setError("Failed to sign-in using the code"))
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

export default EnterCode
