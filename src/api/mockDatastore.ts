import {LKSchema} from "utils/models"
import {Product, User} from "./mockApi"
import {generateSchemas} from "./mocks/modelSchemas"
import {generateProducts} from "./mocks/products"
import {generateUsers} from "./mocks/users"

export interface MockDatastore {
  users: User[]
  products: Product[]
  schemas: LKSchema[]
}

export const generateMockDatastore = (): MockDatastore => {
  const users = generateUsers(25)
  const schemas = generateSchemas()
  const products = generateProducts(100)

  return {users, schemas, products}
}
