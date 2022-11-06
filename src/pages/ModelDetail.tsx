import {
  HasId,
  makeObjectModification
} from "@lightningkite/lightning-server-simplified"
import {Button, Card, CardContent, Container} from "@mui/material"
import ErrorAlert from "components/ErrorAlert"
import Loading from "components/Loading"
import {ModelForm} from "components/ModelForm"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useEffect} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {useCurrentSchema} from "utils/hooks/useCurrentSchema"

export function ModelDetail<T extends HasId = HasId>(): ReactElement {
  const {endpointName, modelId} = useParams()
  const navigate = useNavigate()
  const {endpoint, schema} = useCurrentSchema<T>()

  const [item, setItem] = React.useState<T | null>()

  useEffect(() => {
    if (endpointName && modelId) {
      endpoint
        .detail(modelId)
        .then(setItem)
        .catch(() => setItem(null))
    }
  }, [endpointName, modelId])

  if (!schema || !endpointName) {
    return <ErrorAlert>Model schema not found - {endpointName}</ErrorAlert>
  }

  if (item === null || modelId === undefined) {
    return <ErrorAlert>{endpointName} not found</ErrorAlert>
  }

  if (item === undefined) {
    return <Loading />
  }

  const onSubmit = (data: T) => {
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
          <ModelForm
            schema={schema}
            initialValues={item}
            onSubmit={onSubmit}
            type="save"
          />
        </CardContent>
      </Card>
    </Container>
  )
}
