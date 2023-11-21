import {TabContext, TabList, TabPanel} from "@mui/lab"
import {Stack, Tab, TextField, Typography} from "@mui/material"
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
  const [tabValue, setTabValue] = useState("raw")
  return (
    <TabContext value={tabValue}>
      <Box sx={{borderBottom: 1, borderColor: "divider"}}>
        <TabList
          onChange={(_e, value) => setTabValue(value)}
          aria-label="lab API tabs example"
        >
          <Tab label="Raw" value="raw"/>
          <Tab label="Form" value="form"/>
          <Tab label="JSON" value="json"/>
        </TabList>
      </Box>
      <TabPanel value="raw">
        {tabValue === "raw" && <div style={{overflow: "scroll"}}><ViewJsonNode item={props.value} horizontal={false}/></div>}
      </TabPanel>
      <TabPanel value="form">

        {tabValue === "form" && <Form
            schema={{
              ...props.type,
              definitions: lkSchema.definitions
            }}
            readonly={true}
            formData={props.value}
            fields={{
              // OneOfField: MyOneOfField
            }}
            validator={dummyValidator}
            templates={customTemplates}
            uiSchema={{
              "ui:submitButtonOptions": {
                props: {},
                submitText: "Filter"
              }
            }}
        />}
      </TabPanel>
      <TabPanel value="json">

        {tabValue === "json" && <TextField
            fullWidth
            multiline
            minRows={50}
            value={JSON.stringify(props.value, null, 2)}
        />}
      </TabPanel>
    </TabContext>
  )
}

export function ViewJsonNode(props: {
  item: any,
  horizontal: boolean
}): ReactElement {
  switch(typeof props.item) {
    // case "boolean":
    //   return props.item ?
    case "undefined":
      return <Typography>N/A</Typography>
    case "object":
      if(props.item === null) return <Typography>N/A</Typography>
      else if (Array.isArray(props.item)) {
        return <Stack sx={{padding: 1}} direction={props.horizontal ? "row" : "column"}>
          {
            props.item.map((x, index) => <ViewJsonNode key={index} item={x} horizontal={!props.horizontal}/>)
          }
        </Stack>
      } else {
        return <Stack sx={{padding: 1}} direction={props.horizontal ? "row" : "column"}>
          {
            Object.keys(props.item).map(key => <Stack sx={{padding: 1}} key={key} direction={!props.horizontal ? "row" : "column"}>
              <Typography variant={"subtitle2"}>{key}</Typography>
              <ViewJsonNode item={props.item[key]} horizontal={props.horizontal}/>
            </Stack>)
          }
        </Stack>
      }
    case "function":
      return <Typography>Function?</Typography>
    default:
      return <Typography>{props.item.toString()}</Typography>
  }
}