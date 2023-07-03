import {Form} from "@rjsf/mui"
import {AuthContext} from "App"
import React, {ReactElement, useContext, useEffect, useState} from "react"
import {MyOneOfField} from "./MyOneOfField";
import {customTemplates, dummyValidator} from "../../utils/helpers/dummyValidator";
import {extractUiSchema} from "../../utils/helpers/extractUi";

export interface ModelFormProps<T> {
  endpointName: string
  initialValues?: Partial<T>
  onSubmit: (data: T) => void
  type: "create" | "save"
}

export function ModelForm<T>(props: ModelFormProps<T>): ReactElement {
  const {endpointName, onSubmit, initialValues, type} = props
  const {lkSchema} = useContext(AuthContext)

  const [currentValues, setCurrentValues] = useState<Partial<T>>(
    initialValues ?? {}
  )

  const [needsUnmount, setNeedsUnmount] = useState(true)

  useEffect(() => {
    setCurrentValues(initialValues ?? {})
    setNeedsUnmount(true)
  }, [initialValues])

  if (needsUnmount) {
    setNeedsUnmount(false)
  }

  return (
    <Form
      schema={lkSchema.models[endpointName]}
      formData={{
        ...currentValues
      }}
      fields={{
        // OneOfField: MyOneOfField
      }}
      validator={dummyValidator}
      onSubmit={(e) => {
        console.log("On Submit");
        onSubmit(e.formData)
      }}
      templates={customTemplates}
      uiSchema={{
        ...extractUiSchema(lkSchema.models[endpointName]),
        "ui:submitButtonOptions": {
          props: {
          },
          submitText: type === "create" ? "Create" : "Save"
        }
      }}
    />
  )
}
