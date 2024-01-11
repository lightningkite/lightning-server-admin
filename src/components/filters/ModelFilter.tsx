import {Condition, HasId} from "@lightningkite/lightning-server-simplified"
import {FilterList} from "@mui/icons-material"
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs
} from "@mui/material"
import {AuthContext} from "App"
import {ReactElement, useContext, useState} from "react"
import {LocalStorageKey} from "utils/constants"
import ErrorAlert from "../ErrorAlert"
import {AdvancedFilter} from "./AdvancedFilter"
import {SimpleFilter} from "./SimpleFilter"

export interface AdvancedFilterProps<T extends HasId> {
  endpointName: string
  filter: Condition<T>
  setFilter: (c: Condition<T>) => void
}

export function ModelFilter<T extends HasId>(
  props: AdvancedFilterProps<T>
): ReactElement {
  const {filter, setFilter, endpointName} = props

  const {lkSchema} = useContext(AuthContext)

  const [filterTypeOpen, setFilterTypeOpen] = useState<
    "advanced" | "simple" | null
  >(null)

  if (!endpointName) {
    return (
      <ErrorAlert>No endpoint name found in the current URL path</ErrorAlert>
    )
  }

  const handleClose = () => {
    setFilterTypeOpen(null)
  }

  const handleOpen = () => {
    const inLocalStorage = localStorage.getItem(LocalStorageKey.FILTER_OPTION)
    setFilterTypeOpen(inLocalStorage === "advanced" ? "advanced" : "simple")
  }

  const handleSubmit = (data: Condition<T>) => {
    handleClose()
    setFilter(data)
  }

  return (
    <>
      <Button onClick={handleOpen} startIcon={<FilterList />}>
        Filter
      </Button>

      <Dialog
        open={!!filterTypeOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
      >
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <DialogTitle>Filter</DialogTitle>
          <Tabs
            sx={{mr: 2}}
            value={filterTypeOpen}
            onChange={(_, value) => {
              localStorage.setItem(LocalStorageKey.FILTER_OPTION, value)
              setFilterTypeOpen(value)
            }}
          >
            <Tab value="simple" label="Simple" />
            <Tab value="advanced" label="Advanced" />
          </Tabs>
        </Stack>

        <DialogContent>
          {filterTypeOpen === "simple" && (
            <SimpleFilter
              filter={filter}
              handleSubmit={handleSubmit}
              modelSchema={lkSchema.models[endpointName]}
            />
          )}
          {filterTypeOpen === "advanced" && (
            <AdvancedFilter
              filter={filter}
              handleSubmit={handleSubmit}
              modelSchema={lkSchema.models[endpointName]}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
