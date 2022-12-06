import {
    CustomValidator,
    ErrorSchema,
    ErrorTransformer,
    RJSFValidationError,
    ValidationData,
    ValidatorType
} from "@rjsf/utils";
import {FormProps} from "@rjsf/core";
import {CustomArrayFieldTemplate} from "../../components/ModelForm/CustomArrayFieldTemplate";
import {CustomFieldTemplate} from "../../components/ModelForm/CustomFieldTemplate";

export const dummyValidator: ValidatorType<any, any> = {    /** This function processes the `formData` with an optional user contributed `customValidate` function, which receives
     * the form data and a `errorHandler` function that will be used to add custom validation errors for each field. Also
     * supports a `transformErrors` function that will take the raw AJV validation errors, prior to custom validation and
     * transform them in what ever way it chooses.
     *
     * @param formData - The form data to validate
     * @param schema - The schema against which to validate the form data
     * @param [customValidate] - An optional function that is used to perform custom validation
     * @param [transformErrors] - An optional function that is used to transform errors after AJV validation
     */
    validateFormData<T>(formData: any | undefined, schema: T, customValidate?: CustomValidator<any>, transformErrors?: ErrorTransformer): ValidationData<T> {
        return {
            errors: [],
            errorSchema: {}
        }
    },
    /** Converts an `errorSchema` into a list of `RJSFValidationErrors`
     *
     * @param errorSchema - The `ErrorSchema` instance to convert
     * @param [fieldPath=[]] - The current field path, defaults to [] if not specified
     */
    toErrorList(errorSchema?: ErrorSchema<any>, fieldPath?: string[]): RJSFValidationError[] {
        return []
    },
    /** Validates data against a schema, returning true if the data is valid, or
     * false otherwise. If the schema is invalid, then this function will return
     * false.
     *
     * @param schema - The schema against which to validate the form data   * @param schema
     * @param formData - The form data to validate
     * @param rootSchema - The root schema used to provide $ref resolutions
     */
    isValid(schema: any, formData: any, rootSchema: any): boolean {
        return true
    },
    /** Runs the pure validation of the `schema` and `formData` without any of the RJSF functionality. Provided for use
     * by the playground. Returns the `errors` from the validation
     *
     * @param schema - The schema against which to validate the form data   * @param schema
     * @param formData - The form data to validate
     */
    rawValidation<Result = any>(schema: any, formData?: any): {
        errors?: Result[];
        validationError?: Error;
    } { return {} }
}

export const customTemplates: FormProps["templates"] = {
    ArrayFieldTemplate: CustomArrayFieldTemplate,
    FieldTemplate: CustomFieldTemplate
}