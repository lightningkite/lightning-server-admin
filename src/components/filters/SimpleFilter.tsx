import {Condition, HasId} from "@lightningkite/lightning-server-simplified"
import {Button, Stack, Typography} from "@mui/material"
import {Form} from "@rjsf/mui"
import {RJSFSchema} from "@rjsf/utils"
import {AuthContext} from "App"
import {LKModelSchema} from "api/genericSdk"
import {MyOneOfField} from "components/ModelForm/MyOneOfField"
import {Key, ReactElement, useState} from "react"
import {customTemplates, dummyValidator} from "utils/helpers/dummyValidator"

export function SimpleFilter<T extends HasId>({
  filter,
  modelSchema,
  handleSubmit
}: {
  filter: Condition<T>
  modelSchema: LKModelSchema<T>
  handleSubmit: (data: Condition<T>) => void
}): ReactElement {
  const [formData, setFormData] = useState<any>(
    (() => {
      if (!("And" in filter)) return undefined
      if (!Array.isArray(filter.And)) return undefined
      if ("Always" in filter.And) return undefined
      const keyValues = filter.And.map((cond) => {
        const entry = Object.entries(cond).at(0)
        const key = entry?.at(0)
        if (!("Equal" in entry?.at(1))) return undefined

        const value = entry?.at(1).Equal
        return {[key]: value}
      })
      return keyValues
    })()
  )

  const displayableProperties = Object.entries(modelSchema.properties).reduce(
    (acc, [key, value]) => {
      if (["string", "integer"].includes(value.type as string)) {
        acc[key] = value
      }
      return acc
    },
    {} as Record<string, RJSFSchema>
  )

  return (
    <Form
      schema={{properties: displayableProperties}}
      formData={formData}
      fields={{
        OneOfField: MyOneOfField
      }}
      validator={dummyValidator}
      onSubmit={(e) => {
        setFormData(e.formData)
        const conditions: (Condition<T> | undefined)[] = Object.entries(
          e.formData
        ).map(([key, value]) => {
          const keySchema = Object.entries(modelSchema.properties).find(
            ([k]) => k === key
          )?.[1]
          if (keySchema) return {[key]: {Equal: value}} as Condition<T>
          return undefined
        })
        handleSubmit({And: conditions.filter(Boolean) as Condition<T>[]})
      }}
      templates={customTemplates}
      uiSchema={{
        "ui:submitButtonOptions": {
          props: {},
          submitText: "Filter"
        }
      }}
    />
  )
}
