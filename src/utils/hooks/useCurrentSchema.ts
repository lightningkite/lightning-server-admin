import {HasId} from "@lightningkite/lightning-server-simplified"
import {LKModelSchema} from "api/genericSdk"
import {AuthContext} from "App"
import {useContext} from "react"
import {useParams} from "react-router-dom"

export const useCurrentSchema = <T extends HasId>() => {
  const {endpointName} = useParams()
  const {session, lkSchema} = useContext(AuthContext)

  if (!session || !lkSchema) {
    throw new Error(
      "The useCurrentSchema hook must be used inside of an AuthContext"
    )
  }

  if (!endpointName) {
    throw new Error(
      "The useCurrentSchema hook must be used inside of a route with an endpointName parameter"
    )
  }

  const modelSchema: LKModelSchema<T> = lkSchema.models[endpointName]
  const endpoint = session.getRestEndpoint<T>(modelSchema.url)

  if (!modelSchema) {
    throw new Error(`No schema found for endpoint ${endpointName}`)
  }

  return {endpoint, modelSchema}
}
