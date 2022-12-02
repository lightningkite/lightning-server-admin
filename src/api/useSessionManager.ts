import {useState} from "react"
import {LocalStorageKey} from "utils/constants"
import {injectedInformation} from "../injectedInfo"
import {GenericAPI, GenericLiveApi, GenericRequesterSession} from "./genericSdk"
import {MockApi} from "./mockApi"

export const backendURLOptions: string[] =
  JSON.parse(
    localStorage.getItem(LocalStorageKey.BACKEND_URL_OPTIONS) ?? "[]"
  ) ?? []

export const useSessionManager = (): {
  api: GenericAPI | null
  changeBackendURL: (backendURL: string) => void
  session: GenericRequesterSession | null
  authenticate: (userToken: string) => void
  logout: () => void
} => {
  const [api, setApi] = useState<GenericAPI | null>(() => {
    const localStorageBackendURL = localStorage.getItem(
      LocalStorageKey.BACKEND_URL
    )

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const initialBackendURL = injectedInformation?.url ?? localStorageBackendURL

    if (initialBackendURL && localStorageBackendURL !== initialBackendURL) {
      localStorage.setItem(LocalStorageKey.BACKEND_URL, initialBackendURL)
    }

    if (initialBackendURL === null) {
      return null
    }

    if (initialBackendURL === "mock") return new MockApi()

    return new GenericLiveApi(initialBackendURL)
  })

  // Null if not logged in, a session if logged in
  const [session, setSession] = useState<GenericRequesterSession | null>(() => {
    const injectedToken = injectedInformation?.jwt
    if (injectedToken) {
      localStorage.setItem(LocalStorageKey.USER_TOKEN, injectedToken)
    }
    const token = localStorage.getItem(LocalStorageKey.USER_TOKEN)

    if (token && api) {
      return new GenericRequesterSession(api, token)
    }

    return null
  })

  const authenticate = (userToken: string) => {
    if (!api) {
      throw new Error("No API")
    }

    setSession(new GenericRequesterSession(api, userToken))
    localStorage.setItem(LocalStorageKey.USER_TOKEN, userToken)
  }

  const logout = (): void => {
    localStorage.removeItem(LocalStorageKey.USER_TOKEN)
    window.location.href = "/"
  }

  const changeBackendURL = (backendURL: string) => {
    localStorage.setItem(LocalStorageKey.BACKEND_URL, backendURL)
    if (backendURL === "mock") {
      setApi(new MockApi())
    } else {
      setApi(new GenericLiveApi(backendURL))
    }
  }

  return {
    api,
    changeBackendURL,
    session,
    authenticate,
    logout
  }
}
