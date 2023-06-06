import {Condition, HasId} from "@lightningkite/lightning-server-simplified"
import {FilterList} from "@mui/icons-material"
import {Button, Dialog, DialogContent, DialogTitle} from "@mui/material"
import React, {ReactElement, useContext, useState} from "react"
import ErrorAlert from "./ErrorAlert"
import {MyOneOfField} from "./ModelForm/MyOneOfField";
import {Form} from "@rjsf/mui";
import {RJSFSchema} from "@rjsf/utils";
import {dummyValidator, customTemplates} from "../utils/helpers/dummyValidator";
import {AuthContext} from "../App";

export interface AdvancedFilterProps<T> {
  endpointName: string,
  filter: Condition<T>,
  setFilter: (c: Condition<T>) => void
}

export function AdvancedFilter<T extends HasId>(props: AdvancedFilterProps<T>): ReactElement {
  const {filter, setFilter, endpointName} = props
  const {lkSchema} = useContext(AuthContext)

  const [showDialog, setShowDialog] = useState(false)

  if (!endpointName) {
    return (
      <ErrorAlert>No endpoint name found in the current URL path</ErrorAlert>
    )
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  const handleOpen = () => setShowDialog(true)

  const handleSubmit = (data: Condition<T>) => {
    handleClose()
    setFilter(data)
  }

  const modelRef = lkSchema.models[endpointName].$ref
  const rawModelName = modelRef?.substring(14)
  const conditionRef = rawModelName && lkSchema.definitions && `com.lightningkite.lightningdb.Condition_${rawModelName}`
  if(!conditionRef) return <> </>

  return (
    <>
      <Button onClick={handleOpen} startIcon={<FilterList />}>
        Filter
      </Button>

      <Dialog open={showDialog} onClose={handleClose}
              fullWidth
              maxWidth="sm">
        <DialogTitle>Filter</DialogTitle>

        <DialogContent>
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
              onSubmit={e => handleSubmit(e.formData)}
              templates={customTemplates}
              uiSchema={{
                "ui:submitButtonOptions": {
                  props: {
                  },
                  submitText: "Filter"
                }
              }}
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
