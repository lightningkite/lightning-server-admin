import {Button, ThemeProvider} from "@mui/material"
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {
  GenericAPI,
  GenericRequesterSession,
  SchemaSet,
  User
} from "api/genericSdk"
import {useSessionManager} from "api/useSessionManager"
import ErrorAlert from "components/ErrorAlert"
import Loading from "components/Loading"
import MainLayout from "layouts/MainLayout"
import UnauthLayout from "layouts/UnauthLayout"
import React, {createContext, FC, useEffect, useState} from "react"
import {BrowserRouter} from "react-router-dom"
import {AuthRoutes, UnauthRoutes} from "routers"
import {LocalStorageKey} from "utils/constants"
import {theme} from "./theme"

// AuthContext is available when the user is authenticated
export const AuthContext = createContext({
  session: {} as GenericRequesterSession,
  logout: (): void => {
    throw new Error("Used logout outside of AuthContext")
  },
  currentUser: {} as User,
  refreshCurrentUser: (): Promise<void> => {
    throw new Error("Used refreshCurrentUser outside of AuthContext")
  },
  schemaSets: [] as SchemaSet[]
})

// UnauthContext is available when the user is not authenticated (login screen)
export const UnauthContext = createContext({
  api: null as GenericAPI | null,
  authenticate: (userToken: string): void => {
    throw new Error("Used authenticate outside of UnauthenticatedContext")
  },
  changeBackendURL: (backendURL: string): void => {
    throw new Error("Used changeBackendURL outside of UnauthenticatedContext")
  }
})

const App: FC = () => {
  const {api, changeBackendURL, session, authenticate, logout} =
    useSessionManager()

  const [currentUser, setCurrentUser] = useState<User | null>()
  const [schemas, setSchemas] = useState<SchemaSet[] | null>()

  const isLoggedIn = !!session

  const refreshCurrentUser = async (): Promise<void> => {
    if (!session) {
      setCurrentUser(undefined)
    }
    await session?.auth
      .getSelf()
      .then(setCurrentUser)
      .catch(() => setCurrentUser(null))
  }

  useEffect(() => {
    refreshCurrentUser()

    if (!session) {
      return
    }

    // Add current backend URL to local storage options if it's not already there
    const backendUrlOptions: string[] =
      JSON.parse(
        localStorage.getItem(LocalStorageKey.BACKEND_URL_OPTIONS) ?? "[]"
      ) || []

    const backendURL = localStorage.getItem(LocalStorageKey.BACKEND_URL) ?? ""

    if (!backendUrlOptions.includes(backendURL)) {
      backendUrlOptions.push(backendURL)
      localStorage.setItem(
        LocalStorageKey.BACKEND_URL_OPTIONS,
        JSON.stringify(backendUrlOptions)
      )
    }

    session.adminEditor
      .getModelSchema()
      .then(setSchemas)
      .catch(() => setSchemas(null))
  }, [isLoggedIn])

  if (isLoggedIn && (currentUser === undefined || schemas === undefined)) {
    return <Loading />
  }

  if (currentUser === null) {
    return (
      <ErrorAlert
        action={
          <Button color="inherit" size="small" onClick={logout}>
            Log Out
          </Button>
        }
      >
        Error loading current user
      </ErrorAlert>
    )
  }

  if (schemas === null) {
    return (
      <ErrorAlert
        action={
          <Button color="inherit" size="small" onClick={logout}>
            Log Out
          </Button>
        }
      >
        Error loading model schemas
      </ErrorAlert>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {session && api ? (
            <AuthContext.Provider
              value={{
                session,
                logout,
                currentUser: currentUser as User,
                refreshCurrentUser,
                schemaSets: schemas as SchemaSet[]
              }}
            >
              <MainLayout>
                <AuthRoutes />
              </MainLayout>
            </AuthContext.Provider>
          ) : (
            <UnauthContext.Provider
              value={{api, changeBackendURL, authenticate}}
            >
              <UnauthLayout>
                <UnauthRoutes />
              </UnauthLayout>
            </UnauthContext.Provider>
          )}
        </ThemeProvider>
      </BrowserRouter>
    </LocalizationProvider>
  )
}

export default App
