import {HoverHelp} from "@lightningkite/mui-lightning-components"
import {Button, Card, CardContent, Container} from "@mui/material"
import {User} from "api/sdk"
import {AuthContext} from "App"
import ErrorAlert from "components/ErrorAlert"
import Loading from "components/Loading"
import PageHeader from "components/PageHeader"
import React, {FC, useContext, useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {UserForm} from "./UserForm"

export const UserDetail: FC = () => {
  const {userId} = useParams()
  const {session, currentUser, refreshCurrentUser} = useContext(AuthContext)

  const [user, setUser] = useState<User | null>()

  const refreshUser = async () => {
    // If the current user is editing their own profile, refresh the current user
    if (user?._id === currentUser._id) {
      refreshCurrentUser()
    }

    try {
      const newUser = await session.user.detail(userId as string)
      setUser(newUser)
    } catch {
      setUser(null)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [userId])

  if (user === undefined) {
    return <Loading />
  }

  if (user === null) {
    return <ErrorAlert>Error loading user</ErrorAlert>
  }

  return (
    <Container maxWidth="sm">
      <PageHeader
        title={user.name}
        breadcrumbs={[
          ["All Users", "/users"],
          [user.name, ""]
        ]}
      >
        <HoverHelp description="Delete this user">
          <Button color="error">Delete</Button>
        </HoverHelp>
      </PageHeader>

      <Card>
        <CardContent sx={{mt: 2}}>
          <UserForm user={user} refreshUser={refreshUser} />
        </CardContent>
      </Card>
    </Container>
  )
}
