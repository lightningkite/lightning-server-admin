import {Condition, HasId} from "@lightningkite/lightning-server-simplified"
import {Form} from "@rjsf/mui"
import {AuthContext} from "App"
import {LKModelSchema} from "api/genericSdk"
import {MyOneOfField} from "components/ModelForm/MyOneOfField"
import {useContext} from "react"
import {customTemplates, dummyValidator} from "utils/helpers/dummyValidator"

export function AdvancedFilter<T extends HasId>({
  filter,
  handleSubmit,
  modelSchema
}: {
  filter: Condition<T>
  handleSubmit: (data: Condition<T>) => void
  modelSchema: LKModelSchema<T>
}) {
  const {lkSchema} = useContext(AuthContext)

  const modelRef = modelSchema.$ref
  const rawModelName = modelRef?.substring(14)

  const conditionRef =
    modelSchema.conditionRef?.substring(14) ??
    (rawModelName && `com.lightningkite.lightningdb.Condition_${rawModelName}`)
  if (!conditionRef) return <> </>

  console.log({
    $ref: `#/definitions/${conditionRef}`,
    definitions: lkSchema.definitions
  })

  return (
    <Form
      schema={{
        $ref: `#/definitions/${conditionRef}`,
        definitions: lkSchema.definitions
      }}
      formData={filter}
      fields={{
        OneOfField: MyOneOfField
      }}
      validator={dummyValidator}
      onSubmit={(e) => handleSubmit(e.formData)}
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
