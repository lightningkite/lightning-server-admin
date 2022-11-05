import {
  HasId,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {RestDataTable} from "@lightningkite/mui-lightning-components"
import {Button, Container} from "@mui/material"
import {JSONSchema, RequesterSession} from "api/sdk"
import {AuthContext} from "App"
import ErrorAlert from "components/ErrorAlert"
import PageHeader from "components/PageHeader"
import React, {FC, useContext} from "react"
import {useNavigate, useParams} from "react-router-dom"
import {lowerCamelCaseToTitleCase} from "utils/helpers/miscHelpers"

export const ModelIndex: FC = () => {
  const navigate = useNavigate()
  const {modelSlug} = useParams()
  const {session, modelSchemas} = useContext(AuthContext)

  const modelSchema = modelSchemas.find((it) => it.slug === modelSlug)

  if (!modelSchema || !modelSlug) {
    return <ErrorAlert>Model schema not found - {modelSlug}</ErrorAlert>
  }

  const jsonSchema = JSON.parse(modelSchema.schema) as JSONSchema

  return (
    <Container maxWidth="md">
      <PageHeader title={`${modelSchema.modelName} List`}>
        <Button>Add {modelSchema.modelName}</Button>
      </PageHeader>

      <RestDataTable
        restEndpoint={
          session[
            modelSlug as keyof RequesterSession
          ] as SessionRestEndpoint<HasId>
        }
        onRowClick={(model) => navigate(`/${modelSlug}/${model._id}`)}
        searchFields={["title"] as unknown as (keyof HasId)[]}
        columns={Object.keys(jsonSchema.properties).map((key) => ({
          field: key,
          headerName: lowerCamelCaseToTitleCase(key),
          flex: 1
        }))}
      />
    </Container>
  )
}
