import {UnauthContext} from "App"
import React, {FC, useContext, useState} from "react"
import EnterEmail from "./EnterEmail"
import EnterPin from "./EnterPin"

export const Login: FC = () => {
  const {api, authenticate} = useContext(UnauthContext)

  const [isEmailSent, setIsEmailSent] = useState(false)
  const [email, setEmail] = useState("")
  const [jwt, setJwt] = useState<string>()

  const sendEmail = () => {
    if (!api) {
      throw new Error("API not set")
    }

    if (jwt !== undefined) {
      authenticate(jwt)
      return Promise.resolve()
    }

    return api.auth.emailLoginLink(email).then(() => setIsEmailSent(true))
  }

  return isEmailSent ? (
    <EnterPin email={email} />
  ) : (
    <EnterEmail
      email={email}
      jwt={jwt}
      setJwt={setJwt}
      setEmail={setEmail}
      sendEmail={sendEmail}
    />
  )
}
