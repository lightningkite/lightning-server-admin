import {LoadingButton, LoadingButtonProps} from "@mui/lab"
import React, {FC, useState} from "react"

export interface AutoLoadingButtonProps
  extends Omit<LoadingButtonProps, "onClick" | "loading"> {
  onClick: () => Promise<void>
}

/**
 * Used in place of @mui/lab's LoadingButton to automatically set the loading
 * state when the onClick handler is called. The onClick handler must return a
 * Promise. The loading state will be set to false when the Promise resolves.
 */
export const AutoLoadingButton: FC<AutoLoadingButtonProps> = (props) => {
  const {onClick, ...rest} = props

  const [isLoading, setIsLoading] = useState(false)

  const handleClick = async () => {
    setIsLoading(true)
    await onClick()
    setIsLoading(false)
  }

  return (
    <LoadingButton
      {...rest}
      onClick={() => {
        handleClick()
      }}
      loading={isLoading}
    />
  )
}
