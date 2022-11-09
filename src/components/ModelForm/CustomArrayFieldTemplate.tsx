import {HasId} from "@lightningkite/lightning-server-simplified"
import {Add, Delete} from "@mui/icons-material"
import {Box, Button, IconButton, Stack, Typography} from "@mui/material"
import {ArrayFieldTemplateProps} from "@rjsf/utils"
import React, {ReactElement} from "react"

export function CustomArrayFieldTemplate<T extends HasId = HasId>(
  props: ArrayFieldTemplateProps
): ReactElement {
  const {items, onAddClick, canAdd, title} = props

  console.log(props)

  return (
    <Box mb={2}>
      <Typography variant="h6" mb={2}>
        {title}
      </Typography>

      <Box sx={{borderLeft: "2px solid #AAA", pl: 2, py: 1}}>
        <Stack spacing={3}>
          {items.map((item) => (
            <Stack
              direction="row"
              alignItems="center"
              key={item.key}
              spacing={2}
            >
              {item.children}
              {item.hasRemove && (
                <IconButton onClick={item.onDropIndexClick(item.index)}>
                  <Delete />
                </IconButton>
              )}
            </Stack>
          ))}
        </Stack>

        {canAdd && (
          <Button onClick={onAddClick} startIcon={<Add />} sx={{mt: 2}}>
            Add Item
          </Button>
        )}
      </Box>
    </Box>
  )
}
