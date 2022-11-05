import {generateModelSchemas} from "./mocks/modelSchemas"
import {generateProducts} from "./mocks/products"
import {generateUsers} from "./mocks/users"
import {ModelSchema, Product, User} from "./sdk"

export interface MockDatastore {
  users: User[]
  products: Product[]
  modelSchemas: ModelSchema[]
}

export const generateMockDatastore = (): MockDatastore => {
  const users = generateUsers(25)
  const modelSchemas = generateModelSchemas()
  const products = generateProducts(100)

  return {users, modelSchemas, products}
}
