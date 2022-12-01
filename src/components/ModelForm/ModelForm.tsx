import {areValuesSame} from "@lightningkite/lightning-server-simplified"
import {FormProps} from "@rjsf/core"
import {Form} from "@rjsf/mui"
import validator from "@rjsf/validator-ajv8"
import {AuthContext} from "App"
import React, {ReactElement, useContext, useEffect, useState} from "react"
import {CustomArrayFieldTemplate} from "./CustomArrayFieldTemplate"
import {CustomFieldTemplate} from "./CustomFieldTemplate"

export interface ModelFormProps<T> {
  endpointName: string
  initialValues?: Partial<T>
  onSubmit: (data: T) => void
  type: "create" | "save"
}

export function ModelForm<T>(props: ModelFormProps<T>): ReactElement {
  const {endpointName, onSubmit, initialValues, type} = props
  const {lkSchema} = useContext(AuthContext)

  const customTemplates: FormProps["templates"] = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate
  }

  const [currentValues, setCurrentValues] = useState<Partial<T>>(
    initialValues ?? {}
  )

  const [needsUnmount, setNeedsUnmount] = useState(true)

  useEffect(()=> {
    setCurrentValues(initialValues??{})
    setNeedsUnmount(true)
  }, [initialValues])

  if(needsUnmount) {
      setNeedsUnmount(false)
    // window.setTimeout(()=> {
    // }, 1000)
    return (<p>REEEEEEE</p>)
  }

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
