import {RJSFSchema} from "@rjsf/utils"
import {generateSchemas} from "./mocks/modelSchemas"
import {generateProducts} from "./mocks/products"
import {generateUsers} from "./mocks/users"
import {Product, User} from "./sdk"

export interface MockDatastore {
  users: User[]
  products: Product[]
  schemas: RJSFSchema[]
}

export const generateMockDatastore = (): MockDatastore => {
  const users = generateUsers(25)
  const schemas = generateSchemas()
  const products = generateProducts(100)

  return {users, schemas, products}
}
