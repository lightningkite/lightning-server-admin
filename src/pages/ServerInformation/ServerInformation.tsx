import {Button, Container} from "@mui/material"
import {AuthContext} from "App"
import PageHeader from "components/PageHeader"
import React, {FC, useContext} from "react"
import {ServerHealthDisplay} from "./ServerHealthDisplay"

export const ServerInformation: FC = () => {
  const {logout} = useContext(AuthContext)

  return (
    <Container maxWidth="md">
      <PageHeader title="Server Information">
        <Button onClick={logout} variant="contained">
          Sign Out
        </Button>
      </PageHeader>

      <ServerHealthDisplay />
    </Container>
  )
}
