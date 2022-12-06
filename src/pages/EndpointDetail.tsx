import {TabContext, TabList, TabPanel} from "@mui/lab"
import {
    Card, CardContent,
    Container,
    Tab,
} from "@mui/material"
import {Box} from "@mui/system"
import {EndpointSchema} from "api/genericSdk"
import {AuthContext} from "App"
import {EndpointForm} from "components/ModelForm/EndpointForm"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useContext, useMemo, useState} from "react"
import {useParams} from "react-router-dom"
import {LocalStorageKey} from "utils/constants"
import {keyOfEndpointSchema} from "../utils/helpers/miscHelpers";
import {MyOneOfField} from "../components/ModelForm/MyOneOfField";
import {customTemplates, dummyValidator} from "../utils/helpers/dummyValidator";
import {Form} from "@rjsf/mui";
import {DataViewer} from "../components/DataViewer";

export function EndpointDetail(): ReactElement {
    const {endpointIndex} = useParams()
    const {lkSchema} = useContext(AuthContext)

    const endpoint: EndpointSchema = useMemo(() => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return lkSchema.endpoints.find(x => keyOfEndpointSchema(x) === endpointIndex)!
    }, [endpointIndex])

    return (
        <Container maxWidth="md">
            <PageHeader title={endpoint.method.toUpperCase() + " - " + endpoint.path}/>
            <Card sx={{mb: 2}}>
                <CardContent>
                    <EndpointContent endpoint={endpoint}/>
                </CardContent>
            </Card>
        </Container>
    )
}

function EndpointContent(props: { endpoint: EndpointSchema }): ReactElement {
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
        setTabValue("response")
    }

    const submit = useMemo(() => (inputValue: any) => callEndpoint(endpoint, JSON.stringify(inputValue)), [endpoint])

    return (
        <>
            <TabContext value={tabValue}>
                <Box sx={{borderBottom: 1, borderColor: "divider"}}>
                    <TabList
                        onChange={(_e, value) => setTabValue(value)}
                        aria-label="lab API tabs example"
                    >
                        <Tab label="Parameters" value="parameters"/>
                        <Tab label="Request Body" value="request-body"/>
                        <Tab label="Response" value="response"/>
                    </TabList>
                </Box>
                <TabPanel value="parameters">TODO!</TabPanel>
                <TabPanel value="request-body">
                    <EndpointForm
                        onSubmit={submit}
                        schema={endpoint.input}
                        submitLabel={endpoint.method.toUpperCase()}
                    />
                </TabPanel>
                <TabPanel value="response">
                    {responseJSON ? <DataViewer
                      value={responseJSON}
                      type={endpoint.output}
                    /> : <p>You have not made a request yet.</p>}

                </TabPanel>
            </TabContext>
        </>
    )
}
