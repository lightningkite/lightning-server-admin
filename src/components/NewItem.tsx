import {HasId} from "@lightningkite/lightning-server-simplified"
import {Add} from "@mui/icons-material"
import {Button, Dialog, DialogContent, DialogTitle} from "@mui/material"
import React, {ReactElement, useState} from "react"
import {useParams} from "react-router-dom"
import {useCurrentSchema} from "utils/hooks/useCurrentSchema"
import ErrorAlert from "./ErrorAlert"
import {ModelForm} from "./ModelForm"

export interface NewItemProps {
  onCreate: () => void
}

export function NewItem<T extends HasId>(props: NewItemProps): ReactElement {
  const {onCreate} = props
  const {endpointName} = useParams()
  const {endpoint, modelSchema} = useCurrentSchema<T>()

  const [showDialog, setShowDialog] = useState(false)
  const [initialValues, setInitialValues] = useState<Partial<T> | null>(null)

  if (!endpointName) {
    return (
      <ErrorAlert>No endpoint name found in the current URL path</ErrorAlert>
    )
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  const handleOpen = () => {
    endpoint.default().then(x => {
      setInitialValues(x)
      setShowDialog(true)
    })
  }

  const handleSubmit = (data: T) => {
    endpoint
      .insert(data)
      .then(() => {
        handleClose()
        onCreate()
      })
      .catch(() => alert("Failed to save"))
  }

  return (
    <>
      <Button onClick={handleOpen} startIcon={<Add />}>
        Add
      </Button>

      <Dialog open={showDialog} onClose={handleClose}>
        <DialogTitle>Create New {modelSchema.collectionName ?? modelSchema.title}</DialogTitle>

        <DialogContent>
          <ModelForm
            endpointName={endpointName}
            initialValues={initialValues ?? {}}
            onSubmit={handleSubmit}
            type="create"
          />
        </DialogContent>
      </Dialog>
    </>
  )
}
