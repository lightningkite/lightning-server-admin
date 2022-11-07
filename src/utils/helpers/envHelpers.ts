export enum DeploymentType {
  LOCAL = "local",
  STAGING = "staging",
  PRODUCTION = "production"
}

// Load environment variables
export const envDeploymentType = process.env.REACT_APP_DEPLOYMENT_TYPE

const consoleFormat = "color:red; font-size: 20px"

// Verify environment variables
if (!envDeploymentType)
  console.log("%cREACT_APP_DEPLOYMENT_TYPE is not set", consoleFormat)
if (
  !(Object.values(DeploymentType) as string[]).includes(envDeploymentType ?? "")
)
  console.log(
    `%cREACT_APP_DEPLOYMENT_TYPE is not one of ${Object.values(
      DeploymentType
    ).join(", ")}`,
    consoleFormat
  )
