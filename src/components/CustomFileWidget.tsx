import {Button, Stack} from "@mui/material"
import {WidgetProps} from "@rjsf/utils"
import React, {FC, useEffect} from "react"

export const CustomFileWidget: FC<WidgetProps> = (props) => {
  const [file, setFile] = React.useState<File | null>(null)
  const [showSelector, setShowSelector] = React.useState(!props.value)
  const [isUploading, setIsUploading] = React.useState(false)

  const handleUpload = async () => {
    if (!file) {
      return
    }

    setIsUploading(true)

    // TODO: Upload file to server
    await console.log("TODO upload file:", file.name)

    setTimeout(() => {
      setShowSelector(false)
      setIsUploading(false)
    }, 1000)
  }

  useEffect(() => {
    handleUpload()
  }, [file])

  return (
    <div>
      <p>{props.label}</p>
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
                onChange={(e) => setFile(e.target.files?.item(0) ?? null)}
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
