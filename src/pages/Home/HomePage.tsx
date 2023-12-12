import {Container} from "@mui/material"
import PageHeader from "components/PageHeader"
import React, {FC} from "react"
import {HomeItems} from "./HomeItems"

export const HomePage: FC = () => {
  return (
    <Container maxWidth="md">
      <PageHeader title="Home" />
      <HomeItems />
    </Container>
  )
}
