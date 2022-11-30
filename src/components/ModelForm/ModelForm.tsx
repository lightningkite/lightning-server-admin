import {areValuesSame} from "@lightningkite/lightning-server-simplified"
import {FormProps} from "@rjsf/core"
import {Form} from "@rjsf/mui"
import validator from "@rjsf/validator-ajv8"
import {AuthContext} from "App"
import {CustomFileWidget} from "components/ModelForm/CustomFileWidget"
import {ReferenceWidget} from "components/ModelForm/ReferenceWidget"
import React, {ReactElement, useContext, useState} from "react"
import {v4 as uuidv4} from "uuid"
import {CustomArrayFieldTemplate} from "./CustomArrayFieldTemplate"

export interface ModelFormProps<T> {
  endpointName: string
  initialValues?: Partial<T>
  onSubmit: (data: T) => void
  type: "create" | "save"
}

export function ModelForm<T>(props: ModelFormProps<T>): ReactElement {
  const {endpointName, onSubmit, initialValues, type} = props
  const {lkSchema} = useContext(AuthContext)

  const customWidgets: FormProps["widgets"] = {
    FileWidget: CustomFileWidget,
    ReferenceWidget
  }

  const customTemplates: FormProps["templates"] = {
    ArrayFieldTemplate: CustomArrayFieldTemplate
  }

  const [currentValues, setCurrentValues] = useState<Partial<T>>(
    initialValues ?? {}
  )

  return (
    <Form
      schema={lkSchema.models[endpointName]}
      formData={{
        // _id: uuidv4(),
        // createdAt: new Date().toISOString(),
        // modifiedAt: new Date().toISOString(),
        ...currentValues
      }}
      validator={validator}
      onSubmit={(e) => onSubmit(e.formData)}
      onChange={(e) => setCurrentValues(e.formData)}
      // widgets={customWidgets}
      templates={customTemplates}
      uiSchema={{
        // _id: {"ui:disabled": true},
        // createdAt: {"ui:disabled": true},
        // modifiedAt: {"ui:disabled": true},
        "ui:submitButtonOptions": {
          props: {
            disabled:
              initialValues && areValuesSame(initialValues, currentValues)
          },
          submitText: type === "create" ? "Create" : "Save"
        }
        // ...schemaSet.uiSchema
      }}
    />
  )
}
