import {Container} from "@mui/material"
import PageHeader from "components/PageHeader"
import React, {FC} from "react"
import {ServerHealthDisplay} from "./ServerHealthDisplay"

export const ServerInformation: FC = () => {
  return (
    <Container maxWidth="md">
      <PageHeader title="Server Information" />

      <ServerHealthDisplay />
    </Container>
  )
}
