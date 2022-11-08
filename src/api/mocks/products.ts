import {faker} from "@faker-js/faker"
import {Product, Tag} from "api/mockApi"

export function generateProducts(total: number, tags: Tag[]): Product[] {
  return Array.from({length: total}, () => ({
    _id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.datatype.number(),
    tags: faker.helpers
      .arrayElements(tags, faker.datatype.number(3))
      .map((t) => t._id),
    createdAt: faker.date.past().toISOString(),
    modifiedAt: faker.date.past().toISOString()
  }))
}
