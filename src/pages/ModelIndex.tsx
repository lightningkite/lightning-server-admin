import {
  HasId,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {RestDataTable} from "@lightningkite/mui-lightning-components"
import {Container} from "@mui/material"
import {RequesterSession} from "api/sdk"
import {AuthContext} from "App"
import ErrorAlert from "components/ErrorAlert"
import {NewItem} from "components/NewItem"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useContext, useState} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {lowerCamelCaseToTitleCase} from "utils/helpers/miscHelpers"

export function ModelIndex<T extends HasId = HasId>(): ReactElement {
  const navigate = useNavigate()
  const {endpointName} = useParams()
  const {session, schemas} = useContext(AuthContext)

  const [refreshTrigger, setRefreshTrigger] = useState(0)

  const schema = schemas.find((it) => it.endpointName === endpointName)

  if (!schema || !endpointName) {
    return <ErrorAlert>Model schema not found - {endpointName}</ErrorAlert>
  }

  return (
    <Container maxWidth="md">
      <PageHeader title={`${schema.title} List`}>
        <NewItem
          modelName={schema.title}
          schema={schema}
          endpointName={endpointName}
          onCreate={() => setRefreshTrigger((prev) => prev + 1)}
        />
      </PageHeader>

      <RestDataTable<T>
        restEndpoint={
          session[
            endpointName as keyof RequesterSession
          ] as unknown as SessionRestEndpoint<T>
        }
        onRowClick={(model) => navigate(`/models/${endpointName}/${model._id}`)}
        searchFields={schema.searchFields as (keyof T)[]}
        columns={schema.tableColumns.map((key) => ({
          field: key,
          headerName: lowerCamelCaseToTitleCase(key),
          flex: 1
        }))}
        dependencies={[refreshTrigger]}
      />
    </Container>
  )
}
