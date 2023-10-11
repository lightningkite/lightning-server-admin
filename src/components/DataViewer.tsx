import {TabContext, TabList, TabPanel} from "@mui/lab"
import {Tab, TextField} from "@mui/material"
import {Box} from "@mui/system"
import {Form} from "@rjsf/mui"
import {RJSFSchema} from "@rjsf/utils"
import React, {ReactElement, useContext, useState} from "react"
import {AuthContext} from "../App"
import {customTemplates, dummyValidator} from "../utils/helpers/dummyValidator"
import {MyOneOfField} from "./ModelForm/MyOneOfField"

export function DataViewer(props: {
  type: RJSFSchema
  value: any
}): ReactElement {
  const {lkSchema} = useContext(AuthContext)
  const [tabValue, setTabValue] = useState("form")
  return (
    <TabContext value={tabValue}>
      <Box sx={{borderBottom: 1, borderColor: "divider"}}>
        <TabList
          onChange={(_e, value) => setTabValue(value)}
          aria-label="lab API tabs example"
        >
          <Tab label="Form" value="form" />
          <Tab label="JSON" value="json" />
        </TabList>
      </Box>
      <TabPanel value="form">
        <Form
          schema={{
            ...props.type,
            definitions: lkSchema.definitions
          }}
          readonly={true}
          formData={props.value}
          fields={
            {
              // OneOfField: MyOneOfField
            }
          }
          validator={dummyValidator}
          templates={customTemplates}
          uiSchema={{
            "ui:submitButtonOptions": {
              props: {},
              submitText: "Filter"
            }
          }}
        />
      </TabPanel>
      <TabPanel value="json">
        <TextField
          fullWidth
          multiline
          minRows={50}
          value={JSON.stringify(props.value, null, 2)}
        />
      </TabPanel>
    </TabContext>
  )
}
