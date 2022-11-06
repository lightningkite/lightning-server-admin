import {HasId} from "@lightningkite/lightning-server-simplified"
import {Button, Dialog, DialogContent, DialogTitle} from "@mui/material"
import React, {ReactElement, useState} from "react"
import {useCurrentSchema} from "utils/hooks/useCurrentSchema"
import {ModelForm} from "./ModelForm"

export interface NewItemProps {
  onCreate: () => void
}

export function NewItem<T extends HasId>(props: NewItemProps): ReactElement {
  const {onCreate} = props
  const {endpoint, schema} = useCurrentSchema<T>()

  const [showDialog, setShowDialog] = useState(false)

  const handleClose = () => {
    setShowDialog(false)
  }

  const handleOpen = () => setShowDialog(true)

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
      <Button onClick={handleOpen}>Add {schema.title}</Button>

      <Dialog open={showDialog} onClose={handleClose}>
        <DialogTitle>Create New {schema.title}</DialogTitle>

        <DialogContent>
          <ModelForm schema={schema} onSubmit={handleSubmit} type="create" />
        </DialogContent>
      </Dialog>
    </>
  )
}
