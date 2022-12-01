import {apiCall} from "@lightningkite/lightning-server-simplified"
import {LocalStorageKey} from "utils/constants"

/**
 *
 * @param file JS File object to upload
 * @param uploadEarlyEndpoint url to the upload early endpoint
 * @returns a url that can be stored in the database
 */
export async function uploadFile(
  file: File,
  uploadEarlyEndpoint: string
): Promise<string> {
  const requesterToken = localStorage.getItem(LocalStorageKey.USER_TOKEN)

  if (!requesterToken) {
    throw new Error("Not logged in, no requester token found")
  }

  const {uploadUrl, futureCallToken} = await apiCall(
    uploadEarlyEndpoint,
    undefined,
    {
      method: "GET",
      headers: {Authorization: `Bearer ${requesterToken}`}
    }
  )
    .then((x) => x.json())
    .catch(() => {
      throw new Error("Error getting upload URL")
    })

  await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers: {
      "Content-type": file.type,
      "x-ms-blob-type": "BlockBlob"
    }
  })
    .then((res) => {
      if (!res.ok) {
        throw new Error("Not OK response when uploading file")
      }
    })
    .catch(() => {
      throw new Error("Error uploading file to storage")
    })

  return futureCallToken
}
