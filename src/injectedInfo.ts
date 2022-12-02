// Fetch the injected information
const injectedInfoText = document.getElementById(
  "injectedBackendInformation"
)?.innerText
export const injectedInformation:
  | {
      url: string
      basePage: string
      jwt?: string
    }
  | undefined = injectedInfoText ? JSON.parse(injectedInfoText) : undefined
