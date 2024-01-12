import {Clear, Download, Remove, Upload, UploadFile} from "@mui/icons-material"
import {Button, IconButton, Stack} from "@mui/material"
import {AuthContext} from "App"
import {FC, useContext, useRef, useState} from "react"
import {LocalStorageKey} from "utils/constants"
import {AutoLoadingButton} from "./AutoLoadingButton"

export const UploadCsv: FC<{endpointName: string}> = ({endpointName}) => {
  const {lkSchema, session} = useContext(AuthContext)
  const [file, setFile] = useState<File>()
  const inputRef = useRef<HTMLInputElement>(null)

  const token = localStorage.getItem(LocalStorageKey.USER_TOKEN)
  const backendURL = localStorage.getItem(LocalStorageKey.BACKEND_URL)

  const handleUploadChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const uploadedFile = e.target.files[0]
      setFile(uploadedFile)
      console.log(uploadedFile)
    }
  }

  const handleUpload = () => {
    if (!file) return
    fetch(`${lkSchema.models[endpointName].url}/bulk`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/csv"
      },
      body: file,
      method: "POST"
    })
  }

  function downloadSampleCSV(): Promise<void> {
    if (!backendURL || !endpointName || !token) {
      return Promise.reject()
    }

    return fetch(`${lkSchema.models[endpointName].url}/_default_`, {
      headers: {
        Accept: "text/csv",
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      method: "GET"
    })
      .then((response) => {
        response.blob().then((blob) => {
          const url = window.URL.createObjectURL(new Blob([blob]))
          const link = document.createElement("a")

          link.href = url
          link.setAttribute("download", `${endpointName}-sample.csv`)
          document.body.appendChild(link)
          link.click()
        })
      })
      .catch((error) => {
        console.log(error)
        alert("Failed to download CSV")
      })
  }

  return (
    <>
      {file ? (
        <>
          <Stack alignItems="center" direction="row">
            <div>File: {file.name}</div>
            <IconButton onClick={() => setFile(undefined)}>
              <Clear />
            </IconButton>
          </Stack>
          <Button startIcon={<Upload />} onClick={handleUpload}>
            Upload
          </Button>
        </>
      ) : (
        <>
          <Button startIcon={<Download />} onClick={downloadSampleCSV}>
            Sample
          </Button>
          <Button
            startIcon={<UploadFile />}
            onClick={() => inputRef.current?.click()}
          >
            Select File
          </Button>
        </>
      )}

      <input
        accept={".csv"}
        ref={inputRef}
        onChange={handleUploadChange}
        hidden
        multiple={false}
        type="file"
        id="hcp-upload"
      />
    </>
  )
}
