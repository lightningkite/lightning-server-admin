import {Form} from "@rjsf/mui"
import {RegistryWidgetsType} from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import {CustomFileWidget} from "components/CustomFileWidget"
import React, {ReactElement} from "react"
import {LKSchema} from "utils/models"

export interface ModelFormProps<T> {
  schema: LKSchema
  initialValues?: Partial<T>
  onSubmit: (data: T) => void
}

export function ModelForm<T>(props: ModelFormProps<T>): ReactElement {
  const {schema, onSubmit, initialValues} = props

  const customWidgets: RegistryWidgetsType = {
    FileWidget: CustomFileWidget
  }

  return (
    <Form
      schema={schema}
      formData={initialValues}
      validator={validator}
      onSubmit={(e) => onSubmit(e.formData)}
      widgets={customWidgets}
    />
  )
}
