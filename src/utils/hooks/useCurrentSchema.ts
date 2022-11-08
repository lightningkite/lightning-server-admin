import {HasId} from "@lightningkite/lightning-server-simplified"
import {AuthContext} from "App"
import {useContext} from "react"
import {useParams} from "react-router-dom"

export const useCurrentSchema = <T extends HasId>() => {
  const {endpointName} = useParams()
  const {session, schemaSets: schemas} = useContext(AuthContext)

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

  const endpoint = session.getRestEndpoint<T>(endpointName)

  const schemaSet = schemas.find(
    (it) => it.jsonSchema.endpointName === endpointName
  )

  if (!schemaSet) {
    throw new Error(`No schema found for endpoint ${endpointName}`)
  }

  return {endpoint, schemaSet}
}
