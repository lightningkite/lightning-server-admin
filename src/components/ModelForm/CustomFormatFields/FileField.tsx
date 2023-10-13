import {Button, Stack, Typography} from "@mui/material"
import {FieldTemplateProps} from "@rjsf/utils"
import {Context} from "App"
import React, {FC, useContext, useEffect, useState} from "react"
import {uploadFile} from "utils/helpers/uploads"

const FileField: FC<FieldTemplateProps> = (props) => {
  const {lkSchema} = useContext(Context)

  const [showSelector, setShowSelector] = useState(!props.formData)
  const [isUploading, setIsUploading] = useState(false)
  const [type, setType] = useState<string | null>(null)

  const url = props.formData as string | undefined
  useEffect(() => {
    if (type !== null) setType(null)
    if (url) {
      fetch(url, {
        headers: {
          Range: "0-0"
        }
      }).then((x) => {
        setType(x.headers.get("Content-Type") ?? null)
      })
    }
  }, [url])

  const handleUpload = async (file: File) => {
    if (!file) {
      return
    }

    setIsUploading(true)

    try {
      if (!lkSchema.uploadEarlyEndpoint) {
        throw new Error("No upload early endpoint present in schema")
      }

      const fileURL = await uploadFile(file, lkSchema.uploadEarlyEndpoint)

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
            <Stack spacing={1} direction="row" sx={{maxHeight: "100px"}}>
              {props.formData && (
                <Button onClick={() => setShowSelector(false)} sx={{mr: 2}}>
                  Cancel
                </Button>
              )}
              <Button component="label">
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={(e) => {
                    const file = e.target.files?.item(0) ?? null
                    file && handleUpload(file)
                  }}
                />
              </Button>
            </Stack>
          )
        }

        console.log(url)
        return (
          <Stack spacing={1} direction="row" sx={{maxHeight: "100px"}}>
            <Button onClick={() => setShowSelector(true)}>Change</Button>
            <a href={url}>
              {type == null ? (
                <p style={{width: "100%", height: "100%"}}>{url}</p>
              ) : type.startsWith("image/") ? (
                <img
                  alt={url}
                  src={url}
                  style={{objectFit: "contain", width: "100%", height: "100%"}}
                />
              ) : type.startsWith("video/") ? (
                <video
                  src={url}
                  style={{objectFit: "contain", width: "100%", height: "100%"}}
                />
              ) : (
                <p>{url}</p>
              )}
            </a>
          </Stack>
        )
      })()}
    </div>
  )
}

export default FileField
