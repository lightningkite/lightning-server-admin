import {HasId} from "@lightningkite/lightning-server-simplified"
import {RestAutocompleteInput} from "@lightningkite/mui-lightning-components"
import {getDefaultRegistry} from "@rjsf/core"
import {FieldTemplateProps} from "@rjsf/utils"
import {LKModelSchema} from "api/genericSdk"
import {AuthContext} from "App"
import ErrorAlert from "components/ErrorAlert"
import React, {ReactElement, useContext, useEffect, useState} from "react"

export function ReferenceField<T extends HasId>(
  props: FieldTemplateProps
): ReactElement {
  const {session, lkSchema} = useContext(AuthContext)

  const [endpointName, modelSchema] = Object.entries(lkSchema.models).find(
    ([key, value]) => value.$ref?.includes(props.schema.references)
  ) as [string, LKModelSchema<T>]

  const endpoint = session.getRestEndpoint<T>(modelSchema.url)

  const [item, setItem] = useState<T | null>()
  const [error, setError] = useState(false)

  const value = props.formData

  useEffect(() => {
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
        modelSchema.titleFields.map((field) => item[field]).join(" ")
      }
      searchProperties={modelSchema.titleFields}
    />
  )
}
