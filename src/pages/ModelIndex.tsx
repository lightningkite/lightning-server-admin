import {HasId} from "@lightningkite/lightning-server-simplified"
import {RestDataTable} from "@lightningkite/mui-lightning-components"
import {Container} from "@mui/material"
import ErrorAlert from "components/ErrorAlert"
import {NewItem} from "components/NewItem"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {lowerCamelCaseToTitleCase} from "utils/helpers/miscHelpers"
import {useCurrentSchema} from "utils/hooks/useCurrentSchema"

export function ModelIndex<T extends HasId = HasId>(): ReactElement {
  const navigate = useNavigate()
  const {
    endpoint,
    schemaSet: {jsonSchema}
  } = useCurrentSchema<T>()
  const {endpointName} = useParams()

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  if (!jsonSchema || !endpointName) {
    return <ErrorAlert>Model schema not found - {endpointName}</ErrorAlert>
  }

  return (
    <Container maxWidth="md">
      <PageHeader title={`${jsonSchema.title} List`}>
        <NewItem onCreate={() => setRefreshTrigger((prev) => prev + 1)} />
      </PageHeader>

      <RestDataTable<T>
        restEndpoint={endpoint}
        onRowClick={(model) => navigate(`/models/${endpointName}/${model._id}`)}
        searchFields={jsonSchema.searchFields as (keyof T)[]}
        columns={jsonSchema.tableColumns.map((key) => ({
          field: key,
          headerName: lowerCamelCaseToTitleCase(key),
          flex: 1
        }))}
        dependencies={[refreshTrigger]}
      />
    </Container>
  )
}
