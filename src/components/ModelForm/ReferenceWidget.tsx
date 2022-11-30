import {HasId} from "@lightningkite/lightning-server-simplified"
import {RestAutocompleteInput} from "@lightningkite/mui-lightning-components"
import {WidgetProps} from "@rjsf/utils"
import {AuthContext} from "App"
import React, {ReactElement, useContext, useEffect, useState} from "react"
import ErrorAlert from "../ErrorAlert"

export function ReferenceWidget<T extends HasId = HasId>(
  props: WidgetProps
): ReactElement {
  const {uiSchema} = props
  const {session, lkSchema} = useContext(AuthContext)

  const endpointName = ""
  const modelSchema = lkSchema.models[endpointName]
  const endpoint = session.getRestEndpoint<T>(modelSchema.url)

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

  if (error) {
    return <ErrorAlert>Failed to get item</ErrorAlert>
  }

  if (item === undefined) {
    return <p>Loading...</p>
  }

  return (
    <RestAutocompleteInput
      label={props.label}
      value={item}
      onChange={setItem}
      restEndpoint={endpoint}
      getOptionLabel={(item) =>
        modelSchema.titleFields.map((field) => item[field as keyof T]).join(" ")
      }
      searchProperties={modelSchema.titleFields as Array<keyof T>}
    />
  )
}
