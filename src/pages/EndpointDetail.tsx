import {TabContext, TabList, TabPanel} from "@mui/lab"
import {Card, CardContent, Container, Tab, TextField} from "@mui/material"
import {Box} from "@mui/system"
import {Form} from "@rjsf/mui"
import {EndpointSchema} from "api/genericSdk"
import {Context} from "App"
import {EndpointForm} from "components/ModelForm/EndpointForm"
import PageHeader from "components/PageHeader"
import React, {
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react"
import {useParams} from "react-router-dom"
import {LocalStorageKey} from "utils/constants"
import {DataViewer} from "../components/DataViewer"
import {MyOneOfField} from "../components/ModelForm/MyOneOfField"
import {customTemplates, dummyValidator} from "../utils/helpers/dummyValidator"
import {keyOfEndpointSchema} from "../utils/helpers/miscHelpers"

export function EndpointDetail(): ReactElement {
  const {endpointIndex} = useParams()
  const {lkSchema} = useContext(Context)

  const endpoint: EndpointSchema = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return lkSchema.endpoints.find(
      (x) => keyOfEndpointSchema(x) === endpointIndex
    )!
  }, [endpointIndex])

  return (
    <Container maxWidth="md">
      <PageHeader
        title={endpoint.method.toUpperCase() + " - " + endpoint.path}
      />
      <Card sx={{mb: 2}}>
        <CardContent>
          <EndpointContent endpoint={endpoint} />
        </CardContent>
      </Card>
    </Container>
  )
}

function EndpointContent(props: {endpoint: EndpointSchema}): ReactElement {
  const {endpoint} = props

  const [responseJSON, setResponseJSON] = useState<any>()
  const [responseIsError, setResponseIsError] = useState(false)
  const [tabValue, setTabValue] = useState("request-body")
  const [parameters, setParameters] = useState({} as Record<string, string>)

  useEffect(() => {
    setResponseJSON(undefined)
    setResponseIsError(false)
    setParameters({})
  }, [endpoint])

  let finalPath = endpoint.path
  for (const e of Object.entries(parameters)) {
    finalPath = finalPath.replace(`{${e[0]}}`, e[1])
  }

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

    const response = await fetch(backendURL + finalPath, {
      method: endpoint.method,
      body: endpoint.method !== "GET" ? requestBody : undefined,
      headers: {
        Authorization: `Bearer ${userToken}`,
        "Content-Type": "application/json"
      }
    })

    setResponseIsError(!response.ok)

    const data = await response.json()

    setResponseJSON(data)
    setTabValue("response")
  }

  return (
    <>
      <p>{finalPath}</p>
      {Object.entries(endpoint.routes).map((x) => (
        <TextField
          key={x[0]}
          label={x[0]}
          value={parameters[x[0]] ?? ""}
          onChange={(ev) => {
            const p = Object.assign({}, parameters)
            p[x[0]] = ev.target.value
            return setParameters(p)
          }}
        />
      ))}

      <EndpointForm
        onSubmit={(inputValue) =>
          callEndpoint(endpoint, JSON.stringify(inputValue))
        }
        schema={endpoint.input}
        submitLabel={endpoint.method.toUpperCase()}
      />

      {responseIsError ? (
        <p>Error: {JSON.stringify(responseJSON)}</p>
      ) : responseJSON ? (
        <DataViewer value={responseJSON} type={endpoint.output} />
      ) : (
        <p>You have not made a request yet.</p>
      )}
    </>
  )
}
