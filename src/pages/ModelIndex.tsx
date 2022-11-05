import {
  HasId,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {RestDataTable} from "@lightningkite/mui-lightning-components"
import {Button, Container} from "@mui/material"
import {RequesterSession} from "api/sdk"
import {AuthContext} from "App"
import ErrorAlert from "components/ErrorAlert"
import PageHeader from "components/PageHeader"
import React, {ReactElement, useContext} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {lowerCamelCaseToTitleCase} from "utils/helpers/miscHelpers"

export function ModelIndex<T extends HasId = HasId>(): ReactElement {
  const navigate = useNavigate()
  const {endpointName} = useParams()
  const {session, schemas} = useContext(AuthContext)

  const schema = schemas.find((it) => it.endpointName === endpointName)

  if (!schema || !endpointName) {
    return <ErrorAlert>Model schema not found - {endpointName}</ErrorAlert>
  }

  const modelName = schema.title ?? ""

  return (
    <Container maxWidth="md">
      <PageHeader title={`${modelName} List`}>
        <Button>Add {modelName}</Button>
      </PageHeader>

      <RestDataTable<T>
        restEndpoint={
          session[
            endpointName as keyof RequesterSession
          ] as unknown as SessionRestEndpoint<T>
        }
        onRowClick={(model) => navigate(`/models/${endpointName}/${model._id}`)}
        searchFields={schema.searchFields as (keyof T)[]}
        columns={(schema.tableColumns as string[]).map((key) => ({
          field: key,
          headerName: lowerCamelCaseToTitleCase(key),
          flex: 1
        }))}
      />
    </Container>
  )
}
