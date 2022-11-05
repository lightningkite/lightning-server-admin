import {ThemeProvider} from "@mui/material"
import {LocalizationProvider} from "@mui/x-date-pickers"
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs"
import {Api, ModelSchema, RequesterSession, User} from "api/sdk"
import {useSessionManager} from "api/useSessionManager"
import ErrorAlert from "components/ErrorAlert"
import Loading from "components/Loading"
import MainLayout from "layouts/MainLayout"
import UnauthLayout from "layouts/UnauthLayout"
import React, {createContext, FC, useEffect, useState} from "react"
import {BrowserRouter} from "react-router-dom"
import {AuthRoutes, UnauthRoutes} from "routers"
import {theme} from "./theme"

// AuthContext is available when the user is authenticated
export const AuthContext = createContext({
  session: {} as RequesterSession,
  logout: (): void => {
    throw new Error("Used logout outside of AuthContext")
  },
  currentUser: {} as User,
  refreshCurrentUser: (): Promise<void> => {
    throw new Error("Used refreshCurrentUser outside of AuthContext")
  },
  modelSchemas: {} as ModelSchema[]
})

// UnauthContext is available when the user is not authenticated (login screen)
export const UnauthContext = createContext({
  api: {} as Api,
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
  const [modelSchemas, setModelSchemas] = useState<ModelSchema[] | null>()

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

    session?.adminEditor.getModelSchema().then(setModelSchemas)
  }, [isLoggedIn])

  if (isLoggedIn && (currentUser === undefined || modelSchemas === undefined)) {
    return <Loading />
  }

  if (currentUser === null) {
    return <ErrorAlert>Error loading current user</ErrorAlert>
  }

  if (modelSchemas === null) {
    return <ErrorAlert>Error loading model schemas</ErrorAlert>
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          {session ? (
            <AuthContext.Provider
              value={{
                session,
                logout,
                currentUser: currentUser as User,
                refreshCurrentUser,
                modelSchemas: modelSchemas as ModelSchema[]
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
