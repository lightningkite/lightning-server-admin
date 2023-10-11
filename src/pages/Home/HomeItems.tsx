import {Card, CardContent, Stack, TextField, Typography} from "@mui/material"
import React, {FC} from "react"

export const HomeItems: FC = () => {
  return (
    <>
      <Card sx={{mb: 2}}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" color="primary.main">
            Token
          </Typography>

          <TextField label="Token" fullWidth />
        </CardContent>
      </Card>

      <Stack direction="row" gap={2} flexWrap={"wrap"}>
        <Card sx={{flexGrow: 1, minWidth: 200}}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" color="primary.main">
              Base Server
            </Typography>
            <TextField label="Server" fullWidth />
          </CardContent>
        </Card>
      </Stack>
    </>
  )
}
