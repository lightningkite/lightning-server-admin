import {Button, Stack, Typography} from "@mui/material"
import {WidgetProps} from "@rjsf/utils"
import {AuthContext} from "App"
import React, {FC, useContext, useState} from "react"
import {uploadFile} from "utils/helpers/uploads"

export const CustomFileWidget: FC<WidgetProps> = (props) => {
  const {lkSchema} = useContext(AuthContext)

  const [showSelector, setShowSelector] = useState(!props.value)
  const [isUploading, setIsUploading] = useState(false)

  const handleUpload = async (file: File) => {
    if (!file) {
      return
    }

    setIsUploading(true)

    try {
      if (!lkSchema.uploadEarlyEndpoint) {
        throw new Error("No upload early endpoint present in schema")
      }

      const fileURL = await uploadFile(
        file,
        lkSchema.uploadEarlyEndpoint
      ).catch(() => {
        throw new Error("Failed to upload file")
      })
      props.onChange(fileURL)
    } catch (e) {
      alert((e as Error).message || "Error uploading file")
    }

    setShowSelector(false)
    setIsUploading(false)
  }

  return (
    <div>
      <Typography mb={1}>{props.label}</Typography>
      {(() => {
        if (isUploading) {
          return <p>Uploading...</p>
        }

        if (showSelector) {
          return (
            <>
              {props.value && (
                <Button onClick={() => setShowSelector(false)} sx={{mr: 2}}>
                  Cancel
                </Button>
              )}
              <input
                type="file"
                onChange={(e) => {
                  const file = e.target.files?.item(0) ?? null
                  file && handleUpload(file)
                }}
              />
            </>
          )
        }

        return (
          <Stack spacing={1} sx={{maxWidth: 200}}>
            <Button onClick={() => setShowSelector(true)}>Change</Button>
            <embed src={props.value} />
          </Stack>
        )
      })()}
    </div>
  )
}
