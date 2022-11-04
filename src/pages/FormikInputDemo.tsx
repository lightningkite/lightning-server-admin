import {
  makeFormikAutocompleteProps,
  makeFormikCheckboxProps,
  makeFormikDateTimePickerProps,
  makeFormikTextFieldProps,
  RestAutocompleteInput
} from "@lightningkite/mui-lightning-components"
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  TextField,
  Typography
} from "@mui/material"
import {DatePicker, DateTimePicker, TimePicker} from "@mui/x-date-pickers"
import {User} from "api/sdk"
import {AuthContext} from "App"
import FormSection from "components/FormSection"
import PageHeader from "components/PageHeader"
import dayjs from "dayjs"
import {useFormik} from "formik"
import React, {FC, useContext} from "react"

export const FormikInputDemo: FC = () => {
  const {session} = useContext(AuthContext)

  const formik = useFormik({
    initialValues: {
      multipleUsers: [] as User[],
      gmailUser: null as User | null,
      text: "",
      number: 0,
      checkbox: false,
      date: new Date(),
      time: new Date(),
      dateTime: new Date()
    },
    // Validation schema is omitted from this demo. See src/pages/UserDetail/UserForm.tsx for an example.
    onSubmit: async (values) => {
      console.log(values)
    }
  })

  return (
    <Container maxWidth="sm">
      <PageHeader title="Demo - Inputs with Formik State" />

      <Card>
        <CardContent>
          <Typography variant="body1" sx={{mb: 3}}>
            This page demonstrates how to use Formik to manage the state of
            various MUI and custom inputs.
          </Typography>

          <FormSection
            disableTopPadding
            title="Rest Autocomplete Input"
            subtitle="The RestAutocompleteInput component fetches options asynchronously from the server as the user types. Only 10 items at a time are fetched from the server."
          >
            <RestAutocompleteInput
              {...makeFormikAutocompleteProps(formik, "multipleUsers")}
              multiple
              label="Select multiple users"
              restEndpoint={session.user}
              getOptionLabel={(user) => `${user.name}`}
              searchProperties={["name"]}
            />

            <RestAutocompleteInput
              {...makeFormikAutocompleteProps(formik, "gmailUser")}
              label="User with gmail email"
              restEndpoint={session.user}
              getOptionLabel={(user) => `${user.name} (${user.email})`}
              additionalQueryConditions={[
                {
                  email: {
                    StringContains: {value: "@gmail.com", ignoreCase: true}
                  }
                }
              ]}
              searchProperties={["name", "email"]}
            />
          </FormSection>

          <FormSection
            title="MUI Inputs"
            subtitle="Managing the basic MUI inputs with Formik"
          >
            <TextField
              label="Text Input"
              {...makeFormikTextFieldProps(formik, "text")}
            />

            <TextField
              label="Numeric Input"
              type="number"
              {...makeFormikTextFieldProps(formik, "number")}
            />

            <FormControlLabel
              control={
                <Checkbox {...makeFormikCheckboxProps(formik, "checkbox")} />
              }
              label="Checkbox input"
            />
          </FormSection>

          <FormSection
            title="Dates & Times"
            subtitle="Date and time input with MUI-X date pickers"
          >
            <DatePicker
              label="Pick a date"
              {...makeFormikDateTimePickerProps(formik, "date")}
              minDate={dayjs().subtract(5, "year")}
              maxDate={dayjs().add(1, "year")}
            />
            <TimePicker
              label="Pick a Time"
              {...makeFormikDateTimePickerProps(formik, "time")}
            />
            <DateTimePicker
              label="Pick a date and time"
              {...makeFormikDateTimePickerProps(formik, "dateTime")}
              minDateTime={dayjs().subtract(1, "month")}
              maxDateTime={dayjs().add(1, "month")}
            />
          </FormSection>

          <Button
            variant="contained"
            fullWidth
            sx={{mt: 5}}
            onClick={() => {
              formik.submitForm()
            }}
          >
            Log Values to Console
          </Button>
        </CardContent>
      </Card>
    </Container>
  )
}
