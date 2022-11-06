import {
  HasId,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {RequesterSession} from "api/sdk"
import {AuthContext} from "App"
import {useContext} from "react"
import {useParams} from "react-router-dom"

export const useCurrentSchema = <T extends HasId>() => {
  const {endpointName} = useParams()
  const {session, schemas} = useContext(AuthContext)

  if (!session || !schemas) {
    throw new Error(
      "The useCurrentSchema hook must be used inside of an AuthContext"
    )
  }

  if (!endpointName) {
    throw new Error(
      "The useCurrentSchema hook must be used inside of a route with an endpointName parameter"
    )
  }

  const endpoint = session[
    endpointName as keyof RequesterSession
  ] as unknown as SessionRestEndpoint<T>

  const schema = schemas.find((it) => it.endpointName === endpointName)

  if (!schema) {
    throw new Error(`No schema found for endpoint ${endpointName}`)
  }

  return {endpoint, schema}
}
