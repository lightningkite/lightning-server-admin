import {Condition, HasId} from "@lightningkite/lightning-server-simplified"
import {RestDataTable} from "@lightningkite/mui-lightning-components"
import {Download, OpenInNew} from "@mui/icons-material"
import {Button, Container} from "@mui/material"
import {AutoLoadingButton} from "components/AutoLoadingButton"
import ErrorAlert from "components/ErrorAlert"
import {NewItem} from "components/NewItem"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {LocalStorageKey} from "utils/constants"
import {camelCaseToTitle} from "utils/helpers/miscHelpers"
import {useCurrentSchema} from "utils/hooks/useCurrentSchema"
import {AdvancedFilter} from "../components/AdvancedFilter"

export function ModelIndex<T extends HasId = HasId>(): ReactElement {
  const navigate = useNavigate()
  const {endpoint, modelSchema} = useCurrentSchema<T>()
  const {endpointName} = useParams()

  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [filter, setFilter] = useState<Condition<T>>({Always: true})

  if (!endpointName) {
    return (
      <ErrorAlert>No endpoint name found in the current URL path</ErrorAlert>
    )
  }

  async function handleDownloadCSV(): Promise<void> {
    const backendURL = localStorage.getItem(LocalStorageKey.BACKEND_URL)
    const token = localStorage.getItem(LocalStorageKey.USER_TOKEN)

    if (!backendURL || !endpointName || !token) {
      return
    }

    await fetch(`${backendURL}${endpointName}/rest/query`, {
      headers: {
        Accept: "text/csv",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({condition: filter}),
      method: "POST"
    })
      .then((response) => {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]))
          const link = document.createElement("a")

          link.href = url
          link.setAttribute("download", `${endpointName}.csv`)
          document.body.appendChild(link)
          link.click()
        })
      })
      .catch((error) => {
        console.log(error)
        alert("Failed to download CSV")
      })
  }

  return (
    <Container maxWidth="md">
      <PageHeader title={`${modelSchema.title} List`}>
        <Button
          color="info"
          component="a"
          target="_blank"
          href={modelSchema.url}
          startIcon={<OpenInNew />}
        >
          Open Direct
        </Button>
        <AutoLoadingButton onClick={handleDownloadCSV} startIcon={<Download />}>
          CSV
        </AutoLoadingButton>
        <NewItem onCreate={() => setRefreshTrigger((prev) => prev + 1)} />
        <AdvancedFilter
          filter={filter}
          setFilter={setFilter}
          endpointName={endpointName}
        />
      </PageHeader>

      {!("Always" in filter) && <p>Additional filter enabled</p>}

      <RestDataTable<T>
        additionalQueryConditions={[filter]}
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
