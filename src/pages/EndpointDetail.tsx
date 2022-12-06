import {TabContext, TabList, TabPanel} from "@mui/lab"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Container,
  Tab,
  Typography
} from "@mui/material"
import {Box} from "@mui/system"
import {EndpointSchema} from "api/genericSdk"
import {AuthContext} from "App"
import {EndpointForm} from "components/ModelForm/EndpointForm"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useContext, useMemo, useState} from "react"
import {useParams} from "react-router-dom"
import {LocalStorageKey} from "utils/constants"

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

      <div>
        {endpoints.map((endpoint) => (
          <Accordion key={`${endpoint.method} ${endpoint.path}`}>
            <AccordionSummary>
              <Typography fontWeight="bold">
                {endpoint.method.toUpperCase()} - {endpoint.path}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <EndpointContent endpoint={endpoint} />
            </AccordionDetails>
          </Accordion>
        ))}
      </div>
    </Container>
  )
}

function EndpointContent(props: {endpoint: EndpointSchema}): ReactElement {
  const {endpoint} = props

  const [responseJSON, setResponseJSON] = useState<string>()
  const [tabValue, setTabValue] = useState("request-body")

  const callEndpoint = async (
    endpoint: EndpointSchema,
    requestBody: string
  ) => {
    console.log({endpoint, requestBody})
    setResponseJSON(undefined)

    const backendURL = localStorage.getItem(
      LocalStorageKey.BACKEND_URL
    ) as string
    const userToken = localStorage.getItem(LocalStorageKey.USER_TOKEN) as string

    const response = await fetch(backendURL + endpoint.path, {
      method: endpoint.method,
      body: endpoint.method !== "GET" ? requestBody : undefined,
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json"
      }
    })

    const data = await response.json()

    setResponseJSON(data)
  }

  return (
    <>
      <TabContext value={tabValue}>
        <Box sx={{borderBottom: 1, borderColor: "divider"}}>
          <TabList
            onChange={(_e, value) => setTabValue(value)}
            aria-label="lab API tabs example"
          >
            <Tab label="Parameters" value="parameters" />
            <Tab label="Request Body" value="request-body" />
          </TabList>
        </Box>
        <TabPanel value="parameters">TODO!</TabPanel>
        <TabPanel value="request-body">
          <EndpointForm
            onSubmit={(inputValue) =>
              callEndpoint(endpoint, JSON.stringify(inputValue))
            }
            schema={endpoint.input}
            submitLabel={endpoint.method.toUpperCase()}
          />
        </TabPanel>
      </TabContext>

      <Box mt={3}>
        {responseJSON && <pre>{JSON.stringify(responseJSON, null, 2)}</pre>}
      </Box>
    </>
  )
}
