import {EndpointSchema} from "../../api/genericSdk";

export const camelCaseToTitle = (str: string) => {
  return str
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
}

export const filterEntries = <T extends Record<keyof T, T[keyof T]>>(
  obj: T,
  predicate: (params: {key: keyof T; value: T[keyof T]}) => boolean
): Partial<T> => {
  return Object.fromEntries(
    Object.entries(obj).filter(([key, value]) =>
      predicate({key: key as keyof T, value: value as T[keyof T]})
    )
  ) as Partial<T>
}

export function stringOfEndpointSchema(e: EndpointSchema): string {
  return e.method + " " + e.path
}

export function keyOfEndpointSchema(e: EndpointSchema): string {
  return e.method + "-" + e.path.replaceAll('{', '').replaceAll('}', '').replaceAll('...', 'anything').replaceAll('/', '-')
}
