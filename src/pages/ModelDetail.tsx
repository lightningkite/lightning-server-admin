import {
  HasId,
  makeObjectModification,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {Button, Card, CardContent, Container} from "@mui/material"
import Form from "@rjsf/mui"
import {RegistryWidgetsType} from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import {RequesterSession} from "api/sdk"
import {AuthContext} from "App"
import {CustomFileWidget} from "components/CustomFileWidget"
import ErrorAlert from "components/ErrorAlert"
import Loading from "components/Loading"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useContext, useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"

const log = (type: unknown) => console.log.bind(console, type)

export function ModelDetail<T extends HasId = HasId>(): ReactElement {
  const {endpointName, modelId} = useParams()
  const {session, schemas} = useContext(AuthContext)
  const navigate = useNavigate()

  const [item, setItem] = React.useState<T | null>()

  const endpoint = session[
    endpointName as keyof RequesterSession
  ] as unknown as SessionRestEndpoint<T>

  useEffect(() => {
    if (endpointName && modelId) {
      endpoint
        .detail(modelId)
        .then(setItem)
        .catch(() => setItem(null))
    }
  }, [endpointName, modelId])

  const schema = schemas.find((it) => it.endpointName === endpointName)

  if (!schema || !endpointName) {
    return <ErrorAlert>Model schema not found - {endpointName}</ErrorAlert>
  }

  if (item === null || modelId === undefined) {
    return <ErrorAlert>{endpointName} not found</ErrorAlert>
  }

  if (item === undefined) {
    return <Loading />
  }

  const handleSubmit = (data: T) => {
    const modification = makeObjectModification(item, data)

    modification &&
      endpoint
        .modify(modelId, modification)
        .then(() => setItem({...item, ...data}))
        .catch(() => alert("Failed to save"))
  }

  const handleDelete = () => {
    endpoint
      .delete(modelId)
      .then(() => navigate(`/models/${endpointName}`))
      .catch(() => alert("Failed to delete"))
  }

  const itemTitle = schema.titleFields
    .map((field) => item[field as keyof T])
    .join(" ")

  const customWidgets: RegistryWidgetsType = {
    FileWidget: CustomFileWidget
  }

  return (
    <Container maxWidth="md">
      <PageHeader
        breadcrumbs={[
          [schema.title, `/models/${endpointName}`],
          [itemTitle, ""]
        ]}
        title={itemTitle}
      >
        <Button color="error" onClick={handleDelete}>
          Delete {schema.title}
        </Button>
      </PageHeader>

      <Card>
        <CardContent>
          <Form
            schema={schema}
            formData={item}
            validator={validator}
            onSubmit={(e) => handleSubmit(e.formData)}
            onError={log("errors")}
            widgets={customWidgets}
          />
        </CardContent>
      </Card>
    </Container>
  )
}
