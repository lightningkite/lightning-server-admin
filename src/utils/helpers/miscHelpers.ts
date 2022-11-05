export const lowerCamelCaseToTitleCase = (str: string) => {
  console.log("lowerCamelCaseToTitleCase", str)
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}
