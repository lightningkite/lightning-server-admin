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

  console.log("uiSchema?.ui:options", uiSchema?.["ui:options"])

  const endpointName = (uiSchema?.["ui:options"]?.reference as string) ?? ""
  const schemaSet = schemas.find(
    (s) => s.jsonSchema.endpointName === endpointName
  )
  const endpoint = session.getRestEndpoint<T>(endpointName)

  const [item, setItem] = useState<T | null>()

  useEffect(() => {
    setItem(undefined)

    endpoint
      .detail(props.value)
      .then(setItem)
      .catch(() => setItem(null))
  }, [props.value])

  useEffect(() => {
    item && props.onChange(item._id)
  }, [item])

  return (
    <div>
      <Typography mb={1}>{props.label}</Typography>
      {(() => {
        if (props.value && item === undefined) {
          return <p>Loading...</p>
        }

        if (props.value && item === null) {
          return <ErrorAlert>Failed to get item</ErrorAlert>
        }

        if (schemaSet === undefined) {
          return <ErrorAlert>Unable to find item schema</ErrorAlert>
        }

        return (
          <RestAutocompleteInput
            value={item ?? null}
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
