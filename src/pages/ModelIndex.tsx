import {HasId} from "@lightningkite/lightning-server-simplified"
import {RestDataTable} from "@lightningkite/mui-lightning-components"
import {Container} from "@mui/material"
import ErrorAlert from "components/ErrorAlert"
import {NewItem} from "components/NewItem"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {camelCaseToTitle} from "utils/helpers/miscHelpers"
import {useCurrentSchema} from "utils/hooks/useCurrentSchema"

export function ModelIndex<T extends HasId = HasId>(): ReactElement {
  const navigate = useNavigate()
  const {endpoint, modelSchema} = useCurrentSchema<T>()
  const {endpointName} = useParams()

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  if (!endpointName) {
    return (
      <ErrorAlert>No endpoint name found in the current URL path</ErrorAlert>
    )
  }

  return (
    <Container maxWidth="md">
      <PageHeader title={`${modelSchema.title} List`}>
        <NewItem onCreate={() => setRefreshTrigger((prev) => prev + 1)} />
      </PageHeader>

      <RestDataTable<T>
        additionalQueryConditions={[{Always: true}]}
        restEndpoint={endpoint}
        onRowClick={(model) => navigate(`/models/${endpointName}/${model._id}`)}
        searchFields={modelSchema.searchFields}
        columns={modelSchema.tableColumns.map((key) => ({
          field: key.toString(),
          headerName: camelCaseToTitle(key.toString()),
          flex: 1
        }))}
        dependencies={[refreshTrigger]}
        multiselectActions={[
          {
            label: "Delete",
            action: (ids) => {
              const result = confirm(
                `Are you sure you want to delete ${ids.length} items?`
              )
              result &&
                endpoint
                  .bulkDelete({_id: {Inside: ids}})
                  .then(() => setRefreshTrigger((prev) => prev + 1))
                  .catch(() => alert("Failed to delete items"))
            }
          }
        ]}
      />
    </Container>
  )
}
