import {useState} from "react"
import {LocalStorageKey} from "utils/constants"
import {MockApi} from "./mockApi"
import {Api, LiveApi, RequesterSession} from "./sdk"

export const backendURLOptions: string[] =
  JSON.parse(
    localStorage.getItem(LocalStorageKey.BACKEND_URL_OPTIONS) ?? "[]"
  ) ?? []

export const useSessionManager = (): {
  api: Api | null
  changeBackendURL: (backendURL: string) => void
  session: RequesterSession | null
  authenticate: (userToken: string) => void
  logout: () => void
} => {
  const [api, setApi] = useState<Api | null>(() => {
    const localStorageBackendURL = localStorage.getItem(
      LocalStorageKey.BACKEND_URL
    )

    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
    const initialBackendURL = localStorageBackendURL

    if (initialBackendURL && localStorageBackendURL !== initialBackendURL) {
      localStorage.setItem(LocalStorageKey.BACKEND_URL, initialBackendURL)
    }

    if (initialBackendURL === null) {
      return null
    }

    if (initialBackendURL === "mock") return new MockApi()

    return new LiveApi(initialBackendURL)
  })

  // Null if not logged in, a session if logged in
  const [session, setSession] = useState<RequesterSession | null>(() => {
    const token = localStorage.getItem(LocalStorageKey.USER_TOKEN)

    if (token && api) {
      return new RequesterSession(api, token)
    }

    return null
  })

  const authenticate = (userToken: string) => {
    if (!api) {
      throw new Error("No API")
    }

    setSession(new RequesterSession(api, userToken))
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
      setApi(new LiveApi(backendURL))
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
