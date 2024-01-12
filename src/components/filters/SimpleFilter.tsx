import {Condition, HasId} from "@lightningkite/lightning-server-simplified"
import {Button, Stack, Typography} from "@mui/material"
import {Form} from "@rjsf/mui"
import {RJSFSchema} from "@rjsf/utils"
import {AuthContext} from "App"
import {LKModelSchema} from "api/genericSdk"
import {MyOneOfField} from "components/ModelForm/MyOneOfField"
import {Key, ReactElement, useEffect, useState} from "react"
import {customTemplates, dummyValidator} from "utils/helpers/dummyValidator"
import {extractUiSchema} from "utils/helpers/extractUi"

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
      return filter.And.reduce<any>((acc, curr) => {
        const entry = Object.entries(curr).at(0)
        const key = entry?.at(0) as string
        if (!("Equal" in entry?.at(1))) return acc
        const value = entry?.at(1).Equal
        if (!value) return acc
        acc[key] = value
        return acc
      }, {})
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

  useEffect(() => {
    console.log(formData)
  }, formData)

  return (
    <Form
      // schema={modelSchema}
      schema={{properties: displayableProperties}}
      formData={{...formData}}
      fields={{
        OneOfField: MyOneOfField
      }}
      validator={dummyValidator}
      onSubmit={(e) => {
        setFormData(e.formData)
        const conditions: (Condition<T> | undefined)[] = Object.entries(
          e.formData
        ).map(([key, value]) => ({[key]: {Equal: value}} as Condition<T>))
        handleSubmit({And: conditions.filter(Boolean) as Condition<T>[]})
      }}
      templates={customTemplates}
      uiSchema={{
        // ...extractUiSchema(modelSchema),
        "ui:submitButtonOptions": {
          props: {},
          submitText: "Filter"
        }
      }}
    />
  )
}
