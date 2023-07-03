/* eslint-disable */
import utils, {
    deepEquals,
    FieldProps,
    FormContextType,
    getUiOptions, getWidget,
    guessType,
    RJSFSchema,
    StrictRJSFSchema
} from "@rjsf/utils";
import React, {Component, useState} from "react";
import unset from "lodash/unset";
import {JSONSchema7, JSONSchema7Definition} from "json-schema";

export function MyOneOfField<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
    >(props: FieldProps<T, S, F>) {
    const {
        name,
        baseType,
        disabled = false,
        readonly = false,
        hideError = false,
        errorSchema = {},
        formData,
        formContext,
        idPrefix,
        idSeparator,
        idSchema,
        schema,
        onBlur,
        onChange,
        onFocus,
        options,
        registry,
        uiSchema,
    } = props;

    const { widgets, fields } = registry;
    const fieldId = `${idSchema.$id}${
        schema.oneOf ? "__oneof_select" : "__anyof_select"
    }`;

    const { widget = "select", ...uiOptions } = getUiOptions<T, S, F>(uiSchema);
    const Widget = getWidget<T, S, F>({ type: "number" }, widget, widgets);
    const [selectedOption, setSelectedOption] = useState(()=>{
        if(formData === undefined || typeof formData !== 'object') return 0
        const existingKey = Object.keys(formData as object)[0]
        const subIndex = schema.oneOf?.findIndex((subschema) => {
            const otherKey = Object.keys((subschema as JSONSchema7).properties ?? {"Never": true})[0]
            return otherKey === existingKey
        }) ?? 0
        return subIndex
    })
    function resetSelectedOption(value: number) {
        setSelectedOption(value)
        onChange({} as T)
    }
    const option = options[selectedOption] || null;
    const enumOptions = options.map((option: RJSFSchema, index: number) => ({
        label: option.title || `Option ${index + 1}`,
        value: index,
    }));
    const { SchemaField: _SchemaField } = fields;
    return (
        <div className="panel panel-default panel-body">
            <div className="form-group">
                <Widget
                    id={fieldId}
                    name={name}
                    schema={{ type: "number", default: 0 } as S}
                    onChange={resetSelectedOption}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    value={selectedOption}
                    options={{ enumOptions }}
                    registry={registry}
                    formContext={formContext}
                    {...uiOptions}
                    label=""
                />
            </div>
            {option !== null && (
                <_SchemaField
                    name={name}
                    schema={option.type
                        ? option
                        : Object.assign({}, option, { type: baseType })}
                    uiSchema={uiSchema}
                    errorSchema={errorSchema}
                    idSchema={idSchema}
                    idPrefix={idPrefix}
                    idSeparator={idSeparator}
                    formData={formData}
                    formContext={formContext}
                    onChange={onChange}
                    onBlur={onBlur}
                    onFocus={onFocus}
                    registry={registry}
                    disabled={disabled}
                    readonly={readonly}
                    hideError={hideError}
                />
            )}
        </div>
    );
}

// interface AnyOfFieldState {
//     /** The currently selected option */
//     selectedOption: number;
// }
//
// /** The `AnyOfField` component is used to render a field in the schema that is an `anyOf`, `allOf` or `oneOf`. It tracks
//  * the currently selected option and cleans up any irrelevant data in `formData`.
//  *
//  * @param props - The `FieldProps` for this template
//  */
// export class MyOneOfField<
//     T = any,
//     S extends StrictRJSFSchema = RJSFSchema,
//     F extends FormContextType = any
//     > extends Component<FieldProps<T, S, F>, AnyOfFieldState> {
//     /** Constructs an `AnyOfField` with the given `props` to initialize the initially selected option in state
//      *
//      * @param props - The `FieldProps` for this template
//      */
//     constructor(props: FieldProps<T, S, F>) {
//         super(props);
//
//         const { formData, options } = this.props;
//
//         this.state = {
//             // selectedOption: 0
//             selectedOption: this.getMatchingOption(0, formData as T, options),
//         };
//     }
//
//     /** React lifecycle methos that is called when the props and/or state for this component is updated. It recomputes the
//      * currently selected option based on the overall `formData`
//      *
//      * @param prevProps - The previous `FieldProps` for this template
//      * @param prevState - The previous `AnyOfFieldState` for this template
//      */
//     componentDidUpdate(
//         prevProps: Readonly<FieldProps<T, S, F>>,
//         prevState: Readonly<AnyOfFieldState>
//     ) {
//         const { formData, options, idSchema } = this.props;
//         const { selectedOption } = this.state;
//         if (
//             !deepEquals(formData, prevProps.formData) &&
//             idSchema.$id === prevProps.idSchema.$id
//         ) {
//             const matchingOption = this.getMatchingOption(
//                 selectedOption,
//                 formData as T,
//                 options
//             );
//
//             if (!prevState || matchingOption === selectedOption) {
//                 return;
//             }
//
//             this.setState({
//                 selectedOption: matchingOption,
//             });
//         }
//     }
//
//     /** Determines the best matching option for the given `formData` and `options`.
//      *
//      * @param formData - The new formData
//      * @param options - The list of options to choose from
//      * @return - The index of the `option` that best matches the `formData`
//      */
//     getMatchingOption(selectedOption: number, formData: T, options: S[]) {
//         console.log("selectedOption", selectedOption, "data", formData, "options", options)
//         const { schemaUtils } = this.props.registry;
//
//         const option = schemaUtils.getFirstMatchingOption(formData, options);
//         if (option !== 0) {
//             return option;
//         }
//
//
//
//         // let filteredOptions = options
//         //     .filter(x => (formData === undefined || formData === null) ? x.type === "null" : typeof formData === x.type )
//         //
//         //
//         // if(typeof formData === "object" && formData) {
//         //     filteredOptions = filteredOptions
//         //         .filter(x =>
//         //             Object.keys(x.properties ?? {}).every(y => y in formData)
//         //         )
//         // }
//         //
//         // if (filteredOptions.length == 1) {
//         //     const index = options.indexOf(filteredOptions[0])
//         //     console.log("Overriding option to ", index)
//         //     return index
//         // }
//
//         // If the form data matches none of the options, use the currently selected
//         // option, assuming it's available; otherwise use the first option
//         return selectedOption || 0;
//     }
//
//     /** Callback handler to remember what the currently selected option is. In addition to that the `formData` is updated
//      * to remove properties that are not part of the newly selected option schema, and then the updated data is passed to
//      * the `onChange` handler.
//      *
//      * @param option -
//      */
//     onOptionChange = (option: any) => {
//         console.log("onOptionChange ", option)
//         const selectedOption = parseInt(option, 10);
//         const { formData, onChange, options, registry } = this.props;
//         const { schemaUtils } = registry;
//         const newOption = schemaUtils.retrieveSchema(
//             options[selectedOption],
//             formData
//         );
//
//         // If the new option is of type object and the current data is an object,
//         // discard properties added using the old option.
//         let newFormData: any | undefined = undefined;
//         if (
//             guessType(formData) === "object" &&
//             (newOption.type === "object" || newOption.properties)
//         ) {
//             newFormData = Object.assign({}, formData);
//
//             const optionsToDiscard = options.slice();
//             optionsToDiscard.splice(selectedOption, 1);
//
//             // Discard any data added using other options
//             for (const option of optionsToDiscard) {
//                 if (option.properties) {
//                     for (const key in option.properties) {
//                         if (typeof newFormData === "object" && newFormData && key in newFormData) {
//                             unset(newFormData, key);
//                         }
//                     }
//                 }
//             }
//         }
//
//         if(newFormData === undefined) {
//             switch (newOption.type) {
//                 case "object":
//                     newFormData = {}
//                     break
//                 case "string":
//                     newFormData = ""
//                     break
//                 case "integer":
//                 case "number":
//                     newFormData = 0
//                     break
//                 case "boolean":
//                     newFormData = false
//                     break
//                 case "null":
//                     newFormData = null
//                     break
//                 case "array":
//                     newFormData = []
//                     break
//             }
//         }
//
//         // Call getDefaultFormState to make sure defaults are populated on change.
//         onChange(
//             schemaUtils.getDefaultFormState(
//                 options[selectedOption],
//                 newFormData
//             ) as T,
//             undefined,
//             this.getFieldId()
//         );
//
//         this.setState({
//             selectedOption: parseInt(option, 10),
//         });
//     };
//
//     getFieldId() {
//         const { idSchema, schema } = this.props;
//         return `${idSchema.$id}${
//             schema.oneOf ? "__oneof_select" : "__anyof_select"
//         }`;
//     }
//
//     /** Renders the `AnyOfField` selector along with a `SchemaField` for the value of the `formData`
//      */
//     render() {
//         const {
//             name,
//             baseType,
//             disabled = false,
//             readonly = false,
//             hideError = false,
//             errorSchema = {},
//             formData,
//             formContext,
//             idPrefix,
//             idSeparator,
//             idSchema,
//             onBlur,
//             onChange,
//             onFocus,
//             options,
//             registry,
//             uiSchema,
//         } = this.props;
//         const start = Date.now()
//
//         const { widgets, fields } = registry;
//         const { SchemaField: _SchemaField } = fields;
//         const { selectedOption } = this.state;
//         const { widget = "select", ...uiOptions } = getUiOptions<T, S, F>(uiSchema);
//         const Widget = getWidget<T, S, F>({ type: "number" }, widget, widgets);
//
//         const option = options[selectedOption] || null;
//         let optionSchema;
//
//         if (option) {
//             // If the subschema doesn't declare a type, infer the type from the
//             // parent schema
//             optionSchema = option.type
//                 ? option
//                 : Object.assign({}, option, { type: baseType });
//         }
//
//         const enumOptions = options.map((option: RJSFSchema, index: number) => ({
//             label: option.title || `Option ${index + 1}`,
//             value: index,
//         }));
//
//         const w = (<Widget
//             id={this.getFieldId()}
//             name={name + "_type"}
//             schema={{ type: "number", default: 0 } as S}
//             onChange={this.onOptionChange}
//             onBlur={onBlur}
//             onFocus={onFocus}
//             value={selectedOption}
//             options={{ enumOptions }}
//             registry={registry}
//             formContext={formContext}
//             {...uiOptions}
//             label=""
//         />)
//
//         const s = (<_SchemaField
//             name={name}
//             schema={optionSchema}
//             uiSchema={uiSchema}
//             errorSchema={errorSchema}
//             idSchema={idSchema}
//             idPrefix={idPrefix}
//             idSeparator={idSeparator}
//             formData={formData}
//             formContext={formContext}
//             onChange={onChange}
//             onBlur={onBlur}
//             onFocus={onFocus}
//             registry={registry}
//             disabled={disabled}
//             readonly={readonly}
//             hideError={hideError}
//         />)
//
//         const end = Date.now()
//
//         return (
//             <div className="panel panel-default panel-body">
//                 <div className="form-group">
//                     {w}
//                 </div>
//                 {option !== null && s}
//             </div>
//         );
//     }
// }
