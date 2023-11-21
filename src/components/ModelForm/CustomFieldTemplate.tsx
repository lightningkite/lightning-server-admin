import {Templates} from "@rjsf/mui"
import {FieldTemplateProps} from "@rjsf/utils"
import React, {ReactElement} from "react"
import FileField from "./CustomFormatFields/FileField"
import {ReferenceField} from "./CustomFormatFields/ReferenceField"
import {ReferenceReadOnlyField} from "./CustomFormatFields/ReferenceReadOnlyField";

export function CustomFieldTemplate(props: FieldTemplateProps): ReactElement {
  // console.log({
  //   label: props.label,
  //   format: props.schema.format,
  //   references: props.schema.references,
  //   props
  // })

  if (props.schema.format === "file") {
    return <FileField {...props} />
  }

  if (props.schema.references) {
    if(props.readonly)
      return <ReferenceReadOnlyField {...props} />
    else
      return <ReferenceField {...props} />
  }

  const F = Templates.FieldTemplate ?? (()=><div/>)
  return <F {...props} />
}
