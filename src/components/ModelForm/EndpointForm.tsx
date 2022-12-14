import {FormProps} from "@rjsf/core"
import {Form} from "@rjsf/mui"
import {RJSFSchema} from "@rjsf/utils"
import React, {ReactElement, useEffect, useState} from "react"
import {CustomArrayFieldTemplate} from "./CustomArrayFieldTemplate"
import {CustomFieldTemplate} from "./CustomFieldTemplate"
import {MyOneOfField} from "./MyOneOfField";
import {dummyValidator} from "../../utils/helpers/dummyValidator";

export interface EndpointFormProps<T> {
  onSubmit: (data: T) => Promise<void>
  schema: RJSFSchema
  submitLabel: string
}

export function EndpointForm<T>(props: EndpointFormProps<T>): ReactElement {
  const {onSubmit, schema, submitLabel} = props

  const customTemplates: FormProps["templates"] = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate
  }

  const [currentValues, setCurrentValues] = useState<Partial<T>>({})

  const [needsUnmount, setNeedsUnmount] = useState(true)

  useEffect(() => {
    setCurrentValues({})
    setNeedsUnmount(true)
  }, [schema])

  if (needsUnmount) {
    setNeedsUnmount(false)
  }

  return (
    <Form
      schema={schema}
      formData={currentValues}
      fields={{
        OneOfField: MyOneOfField
      }}
      validator={dummyValidator}
      onSubmit={(e) => {
        onSubmit(e.formData)
      }}
      onChange={(e) => setCurrentValues(e.formData)}
      templates={customTemplates}
      uiSchema={{
        "ui:submitButtonOptions": {
          submitText: submitLabel
        }
      }}
    />
  )
}
