import {Card, CardContent, Container, Stack} from "@mui/material"
import {EndpointSchema} from "api/genericSdk"
import {AuthContext} from "App"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useContext, useMemo} from "react"
import {useParams} from "react-router-dom"

export function EndpointDetail(): ReactElement {
  const {endpointIndex, endpointGroup} = useParams()
  const {lkSchema} = useContext(AuthContext)

  const endpoints: EndpointSchema[] = useMemo(() => {
    if (endpointIndex) return [lkSchema.endpoints[Number(endpointIndex)]]
    if (endpointGroup)
      return lkSchema.endpoints.filter((e) => e.group === endpointGroup)
    return []
  }, [endpointIndex, endpointGroup])

  return (
    <Container maxWidth="md">
      <PageHeader title={endpointIndex ?? endpointGroup ?? "Not Found"} />

      <Stack spacing={2}>
        {endpoints.map((endpoint) => (
          <Card key={`${endpoint.method} ${endpoint.path}`}>
            <CardContent>
              {endpoint.method.toUpperCase()} - {endpoint.path}
            </CardContent>
          </Card>
        ))}
      </Stack>
    </Container>
  )
}
