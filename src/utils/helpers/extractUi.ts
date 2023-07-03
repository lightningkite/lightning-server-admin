import {JSONSchema7} from "json-schema";
import {UiSchema} from "@rjsf/utils";

export function extractUiSchema(stuff: JSONSchema7): UiSchema {
  const out: Record<string, any> = {}
  extractUiSchemaInternal(stuff, out)
  return out as UiSchema
}
function extractUiSchemaInternal(stuff: JSONSchema7, dumpTo: Record<string, any>) {
  Object.entries(stuff).filter(k => k[0].startsWith("ui:")).forEach(x => {
    dumpTo[x[0]] = x[1]
  })
  if(stuff.properties) {
    for(const prop in stuff.properties) {
      const out: Record<string, any> = {}
      extractUiSchemaInternal(stuff.properties[prop] as JSONSchema7, out)
      dumpTo[prop] = out
    }
  }
  if(stuff.items) {
    const out: Record<string, any> = {}
    extractUiSchemaInternal(stuff.items as JSONSchema7, out)
    dumpTo.items = out
  }
}