import {makeObjectModification} from "@lightningkite/lightning-server-simplified"
import {
  makeFormikDateTimePickerProps,
  makeFormikTextFieldProps
} from "@lightningkite/mui-lightning-components"
import {LoadingButton} from "@mui/lab"
import {Alert, Stack, TextField} from "@mui/material"
import {DatePicker} from "@mui/x-date-pickers"
import {User} from "api/sdk"
import {AuthContext} from "App"
import dayjs from "dayjs"
import {useFormik} from "formik"
import React, {FC, useContext, useEffect, useState} from "react"
import * as yup from "yup"

// Form validation schema. See: https://www.npmjs.com/package/yup#object
const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required"),
  phone: yup.string().required("Phone is required"),
  birthday: yup.string().required("Birthday is required")
})

export interface UserFormProps {
  user: User
  refreshUser: () => Promise<void>
}

export const UserForm: FC<UserFormProps> = (props) => {
  const {user, refreshUser} = props

  const {session} = useContext(AuthContext)

  const [error, setError] = useState("")

  // Formik is a library for managing form state. See: https://formik.org/docs/overview
  const formik = useFormik({
    initialValues: {
      name: user.name,
      email: user.email,
      phone: user.phone,
      birthday: new Date(user.birthday)
    },
    validationSchema,
    // When the form is submitted, this function is called if the form values are valid
    onSubmit: async (values) => {
      setError("")

      // Convert date fields from Date back to ISO string
      const formattedValues = {
        ...values,
        birthday: values.birthday.toISOString().split("T")[0]
      }

      // Automatically builds the Lightning Server modification given the old object and the new values
      const modification = makeObjectModification(user, formattedValues)

      // Handle the case where nothing changed (this shouldn't happen, but we gotta make TypeScript happy)
      if (!modification) {
        return
      }

      try {
        await session.user.modify(user._id, modification)
        await refreshUser()
      } catch {
        setError("Error updating user")
      }
    }
  })

  // Reset the form when the user changes or refreshes
  useEffect(() => {
    // Dates are stored as ISO strings in the database, so we need to convert them to Date objects
    formik.resetForm({values: {...user, birthday: new Date(user.birthday)}})
  }, [user])

  return (
    <Stack gap={3}>
      <TextField label="Name" {...makeFormikTextFieldProps(formik, "name")} />
      <TextField label="Email" {...makeFormikTextFieldProps(formik, "email")} />
      <TextField label="Phone" {...makeFormikTextFieldProps(formik, "phone")} />
      <DatePicker
        label="Birthday"
        {...makeFormikDateTimePickerProps(formik, "birthday")}
        minDate={dayjs().subtract(120, "year")}
        maxDate={dayjs()}
      />

      {error && <Alert severity="error">{error}</Alert>}

      <LoadingButton
        onClick={() => {
          formik.submitForm()
        }}
        variant="contained"
        color="primary"
        loading={formik.isSubmitting}
        style={{alignSelf: "end"}}
        disabled={!formik.dirty}
      >
        {formik.dirty ? "Save Changes" : "Saved"}
      </LoadingButton>
    </Stack>
  )
}
