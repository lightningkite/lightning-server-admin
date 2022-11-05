import {RJSFSchema} from "@rjsf/utils"

export interface LKSchema extends RJSFSchema {
  title: string
  searchFields: string[]
  tableColumns: string[]
  endpointName: string
  titleFields: string[]
}
