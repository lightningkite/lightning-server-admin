import {faker} from "@faker-js/faker"
import {Product} from "api/sdk"

export function generateProducts(total: number): Product[] {
  return Array.from({length: total}, () => ({
    _id: faker.datatype.uuid(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.datatype.number()
  }))
}
