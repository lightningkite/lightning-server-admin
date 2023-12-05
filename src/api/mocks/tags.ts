import {faker} from "@faker-js/faker"
import { Tag } from "api/mockApi"

export function generateTags(total: number): Tag[] {
  return Array.from({length: total}, () => ({
    _id: faker.datatype.uuid(),
    name: faker.commerce.productAdjective(),
    description: faker.commerce.productDescription(),
    createdAt: faker.date.past().toISOString(),
    modifiedAt: faker.date.past().toISOString()
  }))
}
