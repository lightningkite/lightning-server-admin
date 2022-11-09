import {HasId} from "@lightningkite/lightning-server-simplified"
import {RestAutocompleteInput} from "@lightningkite/mui-lightning-components"
import {Typography} from "@mui/material"
import {WidgetProps} from "@rjsf/utils"
import {AuthContext} from "App"
import React, {ReactElement, useContext, useEffect, useState} from "react"
import ErrorAlert from "./ErrorAlert"

export function ReferenceWidget<T extends HasId = HasId>(
  props: WidgetProps
): ReactElement {
  const {uiSchema} = props
  const {session, schemaSets: schemas} = useContext(AuthContext)

  const endpointName = (uiSchema?.["ui:options"]?.reference as string) ?? ""
  const schemaSet = schemas.find(
    (s) => s.jsonSchema.endpointName === endpointName
  )
  const endpoint = session.getRestEndpoint<T>(endpointName)

  const [item, setItem] = useState<T | null>()
  const [error, setError] = useState(false)

  useEffect(() => {
    if (props.value === undefined || props.value === null) {
      setItem(null)
      return
    }

    setItem(undefined)
    setError(false)

    endpoint
      .detail(props.value)
      .then((r) => setItem(r ?? null))
      .catch(() => setError(true))
  }, [props.value])

  useEffect(() => {
    item && props.onChange(item._id)
  }, [item])

  return (
    <div>
      <Typography mb={1}>{props.label}</Typography>
      {(() => {
        if (error) {
          return <ErrorAlert>Failed to get item</ErrorAlert>
        }

        if (item === undefined) {
          return <p>Loading...</p>
        }

        if (schemaSet === undefined) {
          return <ErrorAlert>Unable to find item schema</ErrorAlert>
        }

        return (
          <RestAutocompleteInput
            value={item}
            onChange={setItem}
            restEndpoint={endpoint}
            getOptionLabel={(item) =>
              schemaSet.jsonSchema.titleFields
                .map((field) => item[field as keyof T])
                .join(" ")
            }
            searchProperties={
              schemaSet.jsonSchema.titleFields as Array<keyof T>
            }
          />
        )
      })()}
    </div>
  )
}
