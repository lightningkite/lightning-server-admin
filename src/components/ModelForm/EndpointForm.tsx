import {FormProps} from "@rjsf/core"
import {Form} from "@rjsf/mui"
import {RJSFSchema} from "@rjsf/utils"
import React, {ReactElement, useEffect, useState} from "react"
import {CustomArrayFieldTemplate} from "./CustomArrayFieldTemplate"
import {CustomFieldTemplate} from "./CustomFieldTemplate"
import {MyOneOfField} from "./MyOneOfField";
import {dummyValidator} from "../../utils/helpers/dummyValidator";
import {Box} from "@mui/system";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import {Button, Tab, TextField} from "@mui/material";

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

  function resetValue(): any {
    let start: any
    switch (schema.type) {
      case "object":
        start = {}
        break
      case "string":
        start = ""
        break
      case "integer":
      case "number":
        start = 0
        break
      case "boolean":
        start = false
        break
      case "null":
        start = null
        break
      case "array":
        start = []
        break
    }
    return start
  }

  const [currentValues, setCurrentValues] = useState<any>(resetValue)
  const [currentValuesJson, setCurrentValuesJson] = useState<string>(() => "")
  const [currentValuesJsonValid, setCurrentValuesJsonValid] = useState<boolean>(() => false)
  console.log(currentValues)

  const [needsUnmount, setNeedsUnmount] = useState(true)

  useEffect(() => {
    setCurrentValues(resetValue())
    setNeedsUnmount(true)
  }, [schema])

  if (needsUnmount) {
    setNeedsUnmount(false)
  }

  const [tabValue, setTabValue] = useState("form")

  return (<TabContext value={tabValue}>
    <Box sx={{borderBottom: 1, borderColor: "divider"}}>
      <TabList
        onChange={(_e, value) => setTabValue(value)}
        aria-label="lab API tabs example"
      >
        <Tab label="Form" value="form"/>
        <Tab label="JSON" value="json"/>
      </TabList>
    </Box>
    <TabPanel value="form">
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
        onChange={(e) => {
          setCurrentValues(e.formData)
          setCurrentValuesJson(JSON.stringify(e.formData, null, 2))
          setCurrentValuesJsonValid(true)
        }}
        templates={customTemplates}
        uiSchema={{
          "ui:submitButtonOptions": {
            submitText: submitLabel
          }
        }}
      />
    </TabPanel>
    <TabPanel value="json">
      <TextField
        sx={{width: "100%"}}
        multiline={true}
        value={currentValuesJson}
        onChange={e => {
          setCurrentValuesJson(e.target.value)
          try {
            setCurrentValues(JSON.parse(e.target.value))
            setCurrentValuesJsonValid(true)
          } catch(e) {
            setCurrentValuesJsonValid(false)
          }
        }}
      />
      <Button variant="contained" disabled={!currentValuesJsonValid} onClick={(e) => {
        onSubmit(currentValues)
      }}>Submit</Button>
    </TabPanel>
  </TabContext>)
}
