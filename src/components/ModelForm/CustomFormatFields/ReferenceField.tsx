import {HasId} from "@lightningkite/lightning-server-simplified"
import {RestAutocompleteInput} from "@lightningkite/mui-lightning-components"
import {Link as LinkIcon} from "@mui/icons-material"
import {Alert, Box, IconButton, Stack} from "@mui/material"
import {FieldTemplateProps} from "@rjsf/utils"
import {LKModelSchema} from "api/genericSdk"
import {AuthContext} from "App"
import ErrorAlert from "components/ErrorAlert"
import React, {ReactElement, useContext, useEffect, useState} from "react"
import {Link} from "react-router-dom"

export function ReferenceField<T extends HasId>(
  props: FieldTemplateProps
): ReactElement {
  const {session, lkSchema} = useContext(AuthContext)

  const [endpointName, modelSchema] = Object.entries(
    lkSchema.models as Record<string, LKModelSchema<T>>
  ).find(([_key, value]) => value.$ref?.includes(props.schema.references)) ?? [
    undefined,
    undefined
  ]

  const endpoint = modelSchema
    ? session.getRestEndpoint<T>(modelSchema.url)
    : undefined

  const [item, setItem] = useState<T | null>()
  const [error, setError] = useState(false)

  const value = props.formData

  useEffect(() => {
    if (!endpoint) {
      return
    }

    if (value === undefined || value === null) {
      setItem(null)
      return
    }

    setItem(undefined)
    setError(false)

    endpoint
      .detail(value)
      .then((r) => setItem(r ?? null))
      .catch(() => setError(true))
  }, [value])

  useEffect(() => {
    item && props.onChange(item._id)
  }, [item])

  if (error) {
    return <ErrorAlert>Failed to get item</ErrorAlert>
  }

  if (!modelSchema || !endpointName || !endpoint) {
    return (
      <Alert severity="error">
        Model schema not found - {props.schema.references}
      </Alert>
    )
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{width: "100%"}}>
        <RestAutocompleteInput
          loading={item === undefined}
          label={props.label}
          value={item ?? null}
          onChange={setItem}
          restEndpoint={endpoint}
          getOptionLabel={(item) =>
            modelSchema.titleFields.map((field) => item[field]).join(" ")
          }
          searchProperties={modelSchema.titleFields}
        />
      </Box>
      <IconButton
        component={Link}
        to={`/models/${endpointName}/${item?._id ?? ""}`}
        disabled={item === null}
      >
        <LinkIcon />
      </IconButton>
    </Stack>
  )
}
