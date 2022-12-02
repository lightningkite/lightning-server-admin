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
  const {endpoint, modelSchema} = useCurrentSchema<T>()

  const [item, setItem] = React.useState<T | null>()

  useEffect(() => {
    if (endpointName && modelId) {
      endpoint
        .detail(modelId)
        .then(setItem)
        .catch(() => setItem(null))
    }
  }, [endpointName, modelId])

  if (!endpointName) {
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
    const result = confirm(`Are you sure you want to delete this item?`)
    result &&
      endpoint
        .delete(modelId)
        .then(() => navigate(`/models/${endpointName}`))
        .catch(() => alert("Failed to delete"))
  }

  const itemTitle = modelSchema.titleFields
    .map((field) => item[field])
    .join(" ")

  return (
    <Container maxWidth="md">
      <PageHeader
        breadcrumbs={[
          [modelSchema.title, `/models/${endpointName}`],
          [itemTitle, ""]
        ]}
        title={itemTitle}
      >
        <Button
          color="info"
          component="a"
          target="_blank"
          href={modelSchema.url + "/" + modelId}
        >
          Open Direct
        </Button>
        <Button color="error" onClick={handleDelete}>
          Delete
        </Button>
      </PageHeader>

      <Card>
        <CardContent>
          <ModelForm
            endpointName={endpointName}
            initialValues={item}
            onSubmit={onSubmit}
            type="save"
          />
        </CardContent>
      </Card>
    </Container>
  )
}
