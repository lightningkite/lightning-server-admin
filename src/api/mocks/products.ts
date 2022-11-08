import {faker} from "@faker-js/faker"
import {Product} from "api/mockApi"

export function generateProducts(total: number): Product[] {
  return Array.from({length: total}, () => ({
    _id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.datatype.number(),
    createdAt: faker.date.past().toISOString(),
    modifiedAt: faker.date.past().toISOString()
  }))
}
