import {Add, ArrowDownward, ArrowUpward, Delete} from "@mui/icons-material"
import {Box, Button, IconButton, Stack, Typography} from "@mui/material"
import {ArrayFieldTemplateProps} from "@rjsf/utils"
import React, {ReactElement} from "react"

export function CustomArrayFieldTemplate(
  props: ArrayFieldTemplateProps
): ReactElement {
  const {items, onAddClick, canAdd, title} = props

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
              spacing={1}
            >
              {item.children}

              <IconButton
                disabled={!item.hasMoveUp}
                onClick={item.onReorderClick(item.index, item.index - 1)}
              >
                <ArrowUpward />
              </IconButton>

              <IconButton
                disabled={!item.hasMoveDown}
                onClick={item.onReorderClick(item.index, item.index + 1)}
              >
                <ArrowDownward />
              </IconButton>

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
