import {
  HasId,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {Button, Dialog, DialogContent, DialogTitle} from "@mui/material"
import {RequesterSession} from "api/sdk"
import {AuthContext} from "App"
import React, {ReactElement, useContext, useState} from "react"
import {LKSchema} from "utils/models"
import {ModelForm} from "./ModelForm"

export interface NewItemProps {
  modelName: string
  schema: LKSchema
  endpointName: string
  onCreate: () => void
}

export function NewItem<T extends HasId>(props: NewItemProps): ReactElement {
  const {modelName, schema, endpointName, onCreate} = props
  const {session} = useContext(AuthContext)

  const [showDialog, setShowDialog] = useState(false)

  const handleClose = () => {
    setShowDialog(false)
  }

  const handleOpen = () => setShowDialog(true)

  const endpoint = session[
    endpointName as keyof RequesterSession
  ] as unknown as SessionRestEndpoint<T>

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
      <Button onClick={handleOpen}>Add {modelName}</Button>

      <Dialog open={showDialog} onClose={handleClose}>
        <DialogTitle>Create New {modelName}</DialogTitle>

        <DialogContent>
          <ModelForm schema={schema} onSubmit={handleSubmit} />
        </DialogContent>
      </Dialog>
    </>
  )
}
