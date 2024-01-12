import {HasId} from "@lightningkite/lightning-server-simplified"
import {Add, Upload} from "@mui/icons-material"
import {Button, Dialog, DialogContent, DialogTitle, Stack} from "@mui/material"
import React, {ReactElement, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {useCurrentSchema} from "utils/hooks/useCurrentSchema"
import {AutoLoadingButton} from "./AutoLoadingButton"
import ErrorAlert from "./ErrorAlert"
import {ModelForm} from "./ModelForm"
import {UploadCsv} from "./UploadCsv"

export interface NewItemProps {
  onCreate: () => void
}

export function NewItem<T extends HasId>(props: NewItemProps): ReactElement {
  const {onCreate} = props
  const {endpointName} = useParams()
  const {endpoint, modelSchema} = useCurrentSchema<T>()

  const [showDialog, setShowDialog] = useState(false)
  const [initialValues, setInitialValues] = useState<Partial<T> | null>(null)
  const [view, setView] = useState<"upload-csv" | "new">("new")

  if (!endpointName) {
    return (
      <ErrorAlert>No endpoint name found in the current URL path</ErrorAlert>
    )
  }

  const handleClose = () => {
    setShowDialog(false)
  }

  const handleOpen = () => {
    endpoint.default().then((x) => {
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

  useEffect(() => {
    setView("new")
  }, [showDialog])

  return (
    <>
      <Button onClick={handleOpen} startIcon={<Add />}>
        Add
      </Button>

      <Dialog open={showDialog} onClose={handleClose}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {view === "upload-csv" ? (
            <DialogTitle>
              Bulk Upload {modelSchema.collectionName ?? modelSchema.title}
            </DialogTitle>
          ) : (
            <>
              <DialogTitle>
                Create New {modelSchema.collectionName ?? modelSchema.title}
              </DialogTitle>
              <Button
                variant="contained"
                onClick={() => setView("upload-csv")}
                sx={{mr: 2}}
                startIcon={<Upload />}
              >
                Bulk Upload (CSV)
              </Button>
            </>
          )}
        </Stack>

        <DialogContent>
          {view === "upload-csv" && (
            <UploadCsv endpointName={endpointName} handleClose={handleClose} />
          )}
          {view === "new" && (
            <ModelForm
              endpointName={endpointName}
              initialValues={initialValues ?? {}}
              onSubmit={handleSubmit}
              type="create"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
