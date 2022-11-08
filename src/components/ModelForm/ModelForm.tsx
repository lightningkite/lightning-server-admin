import {areValuesSame} from "@lightningkite/lightning-server-simplified"
import {Form} from "@rjsf/mui"
import {RegistryWidgetsType} from "@rjsf/utils"
import validator from "@rjsf/validator-ajv8"
import {SchemaSet} from "api/genericSdk"
import {CustomFileWidget} from "components/CustomFileWidget"
import {ReferenceWidget} from "components/ReferenceWidget"
import React, {ReactElement, useState} from "react"
import {v4 as uuidv4} from "uuid"

export interface ModelFormProps<T> {
  schemaSet: SchemaSet
  initialValues?: Partial<T>
  onSubmit: (data: T) => void
  type: "create" | "save"
}

export function ModelForm<T>(props: ModelFormProps<T>): ReactElement {
  const {schemaSet, onSubmit, initialValues, type} = props

  const customWidgets: RegistryWidgetsType = {
    FileWidget: CustomFileWidget,
    ReferenceWidget
  }

  const [currentValues, setCurrentValues] = useState<Partial<T>>(
    initialValues ?? {}
  )

  return (
    <Form
      schema={schemaSet.jsonSchema}
      formData={{
        _id: uuidv4(),
        createdAt: new Date().toISOString(),
        modifiedAt: new Date().toISOString(),
        ...currentValues
      }}
      validator={validator}
      onSubmit={(e) => onSubmit(e.formData)}
      onChange={(e) => setCurrentValues(e.formData)}
      widgets={customWidgets}
      uiSchema={{
        _id: {"ui:disabled": true},
        createdAt: {"ui:disabled": true},
        modifiedAt: {"ui:disabled": true},
        "ui:submitButtonOptions": {
          props: {
            disabled:
              initialValues && areValuesSame(initialValues, currentValues)
          },
          submitText: type === "create" ? "Create" : "Save"
        },
        ...schemaSet.uiSchema
      }}
    />
  )
}
