import {
  HasId,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {Button, Card, CardContent, Container} from "@mui/material"
import Form from "@rjsf/mui"
import validator from "@rjsf/validator-ajv8"
import {RequesterSession} from "api/sdk"
import {AuthContext} from "App"
import ErrorAlert from "components/ErrorAlert"
import Loading from "components/Loading"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useContext, useEffect} from "react"
import {useParams} from "react-router-dom"

const log = (type: unknown) => console.log.bind(console, type)

export function ModelDetail<T extends HasId = HasId>(): ReactElement {
  const {endpointName, modelId} = useParams()
  const {session, schemas} = useContext(AuthContext)

  const [item, setItem] = React.useState<T | null>()

  useEffect(() => {
    if (endpointName && modelId) {
      ;(
        session[
          endpointName as keyof RequesterSession
        ] as unknown as SessionRestEndpoint<T>
      )
        .detail(modelId)
        .then(setItem)
        .catch(() => setItem(null))
    }
  }, [endpointName, modelId])

  const schema = schemas.find((it) => it.endpointName === endpointName)

  if (!schema || !endpointName) {
    return <ErrorAlert>Model schema not found - {endpointName}</ErrorAlert>
  }

  if (item === null) {
    return <ErrorAlert>{endpointName} not found</ErrorAlert>
  }

  if (item === undefined) {
    return <Loading />
  }

  const itemTitle = schema.titleFields
    .map((field) => item[field as keyof T])
    .join(" ")

  return (
    <Container maxWidth="md">
      <PageHeader
        breadcrumbs={[
          [schema.title, `/models/${endpointName}`],
          [itemTitle, ""]
        ]}
        title={itemTitle}
      >
        <Button color="error">Delete {schema.title}</Button>
      </PageHeader>

      <Card>
        <CardContent>
          <Form
            schema={schema}
            validator={validator}
            // onChange={log("changed")}
            onSubmit={log("submitted")}
            onError={log("errors")}
          />
        </CardContent>
      </Card>
    </Container>
  )
}
