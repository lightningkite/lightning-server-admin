import {
  AttachFile,
  Clear,
  Download,
  Upload,
  UploadFile
} from "@mui/icons-material"
import {
  Alert,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography
} from "@mui/material"
import {AuthContext} from "App"
import {FC, useContext, useRef, useState} from "react"
import {LocalStorageKey} from "utils/constants"
import {AutoLoadingButton} from "./AutoLoadingButton"

export const UploadCsv: FC<{endpointName: string; handleClose: () => void}> = ({
  endpointName,
  handleClose
}) => {
  const {lkSchema} = useContext(AuthContext)
  const [file, setFile] = useState<File>()
  const inputRef = useRef<HTMLInputElement>(null)

  const token = localStorage.getItem(LocalStorageKey.USER_TOKEN)
  const backendURL = localStorage.getItem(LocalStorageKey.BACKEND_URL)

  const handleUpload = () => {
    return fetch(`${lkSchema.models[endpointName].url}/bulk`, {
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
        "Content-Type": "text/csv"
      },
      body: file,
      method: "POST"
    }).then(handleClose)
  }

  function downloadSampleCSV(): Promise<void> {
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

  if (!endpointName || !backendURL || !token) {
    return <Alert>Error loading endpointName, backendURL, or token</Alert>
  }

  return (
    <>
      {file ? (
        <>
          <Stack alignItems="center" direction="row" gap={1}>
            <List>
              <ListItem disablePadding>
                <ListItemIcon>
                  <AttachFile />
                </ListItemIcon>
                <ListItemText primary={file.name} />
              </ListItem>
            </List>
            <IconButton onClick={() => setFile(undefined)}>
              <Clear />
            </IconButton>
          </Stack>
          <AutoLoadingButton
            variant="contained"
            sx={{width: "100%", mt: 2}}
            startIcon={<Upload />}
            onClick={handleUpload}
          >
            Upload
          </AutoLoadingButton>
        </>
      ) : (
        <Stack gap={2}>
          <Typography>
            Download a sample CSV to see how to format the csv
          </Typography>
          <Button
            sx={{alignSelf: "center"}}
            startIcon={<Download />}
            onClick={downloadSampleCSV}
          >
            Sample
          </Button>
          <Typography>
            Select the CSV file to upload it to the server
          </Typography>
          <Button
            sx={{alignSelf: "center"}}
            startIcon={<UploadFile />}
            onClick={() => inputRef.current?.click()}
          >
            Select File
          </Button>
        </Stack>
      )}

      <input
        accept={".csv"}
        ref={inputRef}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          if (e.target.files) {
            const uploadedFile = e.target.files[0]
            console.log(uploadedFile)
            setFile(uploadedFile)
          }
        }}
        hidden
        multiple={false}
        type="file"
        id="hcp-upload"
      />
    </>
  )
}
