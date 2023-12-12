import {HasId} from "@lightningkite/lightning-server-simplified"
import {RestAutocompleteInput} from "@lightningkite/mui-lightning-components"
import {Link as LinkIcon} from "@mui/icons-material"
import {Alert, Box, IconButton, Stack, Typography} from "@mui/material"
import {FieldTemplateProps} from "@rjsf/utils"
import {enqueueDetail} from "api/enqueue"
import {LKModelSchema} from "api/genericSdk"
import {AuthContext} from "App"
import ErrorAlert from "components/ErrorAlert"
import React, {ReactElement, useContext, useEffect, useState} from "react"
import {Link} from "react-router-dom"

export function ReferenceReadOnlyField<T extends HasId>(
  props: FieldTemplateProps
): ReactElement {
  const {session, lkSchema} = useContext(AuthContext)

  const [endpointName, modelSchema] = Object.entries(
    lkSchema.models as Record<string, LKModelSchema<T>>
  ).find(
    ([_key, value]) =>
      value?.$ref === `#/definitions/${props.schema.references as string}`
  ) ?? [undefined, undefined]

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

    enqueueDetail(endpointName ?? "x", endpoint, value)
      .then((r) => setItem(r ?? null))
      .catch(() => setError(true))
  }, [value])

  useEffect(() => {
    item && props.onChange(item._id)
  }, [item])

  if (!modelSchema || !endpointName || !endpoint) {
    return (
      <Alert severity="error">
        Model schema not found - {props.schema.references}
      </Alert>
    )
  }

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <Box sx={{width: "100%", minWidth: 200}}>
        <Typography>
          {item ? modelSchema.titleFields.map((k) => item[k]).join(" ") : "N/A"}
        </Typography>
      </Box>
      <IconButton
        component={Link}
        to={`/models/${endpointName}/${item?._id ?? ""}`}
        disabled={item === null}
      >
        <LinkIcon />
      </IconButton>
      {error && <ErrorAlert>Load Error</ErrorAlert>}
    </Stack>
  )
}
