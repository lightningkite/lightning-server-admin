import {LoadingButton} from "@mui/lab"
import {
  Alert,
  FormControlLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography
} from "@mui/material"
import {UnauthContext} from "App"
import React, {FC, useContext, useEffect, useState} from "react"

export type IdentifierType = "email" | "sms"

export interface EnterIdentifierProps {
  identifier: string
  setIdentifier: (identifier: string) => void
  setTempUUID: (tempUUID: string) => void
}

const EnterIdentifier: FC<EnterIdentifierProps> = (props) => {
  const {identifier, setIdentifier, setTempUUID} = props

  const {api} = useContext(UnauthContext)

  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [identifierType, setIdentifierType] = useState<IdentifierType>("email")

  useEffect(() => {
    // Remove whitespace and convert to lowercase
    if (identifierType === "email") {
      if (/\s/.test(identifier) || /[A-Z]/.test(identifier)) {
        setIdentifier(identifier.replace(/\s/g, "").toLowerCase())
      }
      return
    }

    // Remove whitespace and non-numeric characters
    if (identifierType === "sms") {
      if (/\s/.test(identifier) || /[^0-9]/.test(identifier)) {
        setIdentifier(identifier.replace(/\s/g, "").replace(/[^0-9]/g, ""))
      }
    }
  }, [identifier, identifierType])

  const sendCodeToUser = () => {
    setError("")

    if (identifierType === "email") {
      if (identifier.length === 0) {
        setError("Please enter an email address")
        return
      }

      if (
        !identifier
          .toLowerCase()
          .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          )
      ) {
        setError("Email address is invalid")
        return
      }
    }

    if (identifierType === "sms") {
      if (identifier.length === 0) {
        setError("Please enter a phone number")
        return
      }

      if (identifier.length < 10) {
        setError("Phone number must be at least 10 digits")
        return
      }
    }

    setSubmitting(true)

    api.auth
      .loginSSO(identifier)
      .then(setTempUUID)
      .catch(() => setError(`Error sending ${identifierType}`))
      .finally(() => setSubmitting(false))
  }

  return (
    <>
      <Typography variant="h1" textAlign="center">
        React App Starter
      </Typography>
      <Typography variant="subtitle1" lineHeight={1.2} mt={3}>
        Enter your email or phone number, and we&apos;ll send you a code to sign
        in.
      </Typography>
      <Stack spacing={2} mt={3}>
        <RadioGroup
          row
          value={identifierType}
          onChange={(e) => setIdentifierType(e.target.value as IdentifierType)}
        >
          <FormControlLabel value="email" control={<Radio />} label="Email" />
          <FormControlLabel
            value="sms"
            control={<Radio />}
            label="Text Message"
          />
        </RadioGroup>

        <TextField
          label={(() => {
            if (identifierType === "email") {
              return "Email"
            }
            if (identifierType === "sms") {
              return "Phone Number"
            }
          })()}
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          type={(() => {
            if (identifierType === "email") {
              return "email"
            }
            if (identifierType === "sms") {
              return "tel"
            }
          })()}
          fullWidth
        />

        {!!error && <Alert severity="error">{error}</Alert>}

        <LoadingButton
          variant="contained"
          color="primary"
          fullWidth
          loading={submitting}
          onClick={sendCodeToUser}
        >
          Send Code
        </LoadingButton>
      </Stack>
    </>
  )
}

export default EnterIdentifier
