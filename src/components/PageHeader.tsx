import {Box, Breadcrumbs, Link, Stack, Typography} from "@mui/material"
import React, {FC, PropsWithChildren} from "react"
import {Link as RouterLink} from "react-router-dom"

export type BreadCrumb = [label: string, path: string]

export interface PageHeaderProps {
  title: string
  breadcrumbs?: BreadCrumb[]
}

const PageHeader: FC<PropsWithChildren<PageHeaderProps>> = (props) => {
  const {title, breadcrumbs, children} = props

  return (
    <Box mt={3} mb={3}>
      {breadcrumbs && (
        <Breadcrumbs sx={{mb: 2}} separator="›">
          {breadcrumbs.map(([label, path], index) =>
            index !== breadcrumbs.length - 1 ? (
              <Link
                component={RouterLink}
                key={path}
                underline="hover"
                color="inherit"
                to={path}
              >
                {label}
              </Link>
            ) : (
              <Typography color="text.primary" key={path}>
                {label}
              </Typography>
            )
          )}
        </Breadcrumbs>
      )}

      <Stack direction="row" alignItems="center" justifyContent="start">
        <Typography variant="h1" sx={{mr: "auto"}}>
          {title}
        </Typography>
        {children}
      </Stack>
    </Box>
  )
}

export default PageHeader
