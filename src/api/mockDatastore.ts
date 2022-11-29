import {LKSchema} from "./genericSdk"
import {Product, Tag, User} from "./mockApi"
import {generateProducts} from "./mocks/products"
import {generateLKSchema} from "./mocks/schemas"
import {generateTags} from "./mocks/tags"
import {generateUsers} from "./mocks/users"

export interface MockDatastore {
  users: User[]
  products: Product[]
  tags: Tag[]
  schema: LKSchema
}

export const generateMockDatastore = (): MockDatastore => {
  const users = generateUsers(25)
  const schema = generateLKSchema()
  const tags = generateTags(3)
  const products = generateProducts(100, tags)

  return {users, schema, products, tags}
}
