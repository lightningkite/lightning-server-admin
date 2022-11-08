import {SchemaSet} from "./genericSdk"
import {Product, Tag, User} from "./mockApi"
import {generateProducts} from "./mocks/products"
import {generateSchemas} from "./mocks/schemas"
import {generateTags} from "./mocks/tags"
import {generateUsers} from "./mocks/users"

export interface MockDatastore {
  users: User[]
  products: Product[]
  tags: Tag[]
  schemas: SchemaSet[]
}

export const generateMockDatastore = (): MockDatastore => {
  const users = generateUsers(25)
  const schemas = generateSchemas()
  const tags = generateTags(3)
  const products = generateProducts(100, tags)

  return {users, schemas, products, tags}
}
