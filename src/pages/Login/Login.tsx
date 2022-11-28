import {UnauthContext} from "App"
import React, {FC, useContext, useState} from "react"
import EnterEmail from "./EnterEmail"
import EnterPin from "./EnterPin"

export const Login: FC = () => {
  const {api} = useContext(UnauthContext)

  const [isEmailSent, setIsEmailSent] = useState(false)
  const [email, setEmail] = useState("")

  const sendEmail = () => {
    if (!api) {
      throw new Error("API not set")
    }

    return api.auth.emailLoginLink(email).then(() => setIsEmailSent(true))
  }

  return !isEmailSent ? (
    <>
      <EnterEmail email={email} setEmail={setEmail} sendEmail={sendEmail} />
    </>
  ) : (
    <EnterPin email={email} />
  )
}
