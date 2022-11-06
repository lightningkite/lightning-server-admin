import {Button, Container} from "@mui/material"
import {AuthContext} from "App"
import PageHeader from "components/PageHeader"
import React, {FC, useContext} from "react"

export const Home: FC = () => {
  const {logout} = useContext(AuthContext)

  return (
    <Container maxWidth="md">
      <PageHeader title="Home Page" />

      <Button onClick={logout}>Sign Out</Button>
    </Container>
  )
}
