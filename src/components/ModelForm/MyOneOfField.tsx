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
        const fullOptionInfo: JSONSchema7Definition | undefined = schema.oneOf ? schema.oneOf[value] : undefined

        if(typeof fullOptionInfo === "object") {
            switch (fullOptionInfo.type) {
                case 'string':
                    onChange("" as T)
                    break
                case 'number':
                    onChange(0 as T)
                    break
                case 'integer':
                    onChange(0 as T)
                    break
                case 'boolean':
                    onChange(false as T)
                    break
                case 'object':
                    onChange({} as T)
                    break
                case 'array':
                    onChange([] as T)
                    break
                case 'null':
                    onChange(null as T)
                    break
                default:
                    onChange(null as T)
            }
        } else {
            onChange({} as T)
        }
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
