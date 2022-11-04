import {Container} from "@mui/material"
import PageHeader from "components/PageHeader"
import React, {FC} from "react"

export const Home: FC = () => {
  return (
    <Container maxWidth="md">
      <PageHeader title="Home Page" />
    </Container>
  )
}
