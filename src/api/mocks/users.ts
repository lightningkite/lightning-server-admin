import {faker} from "@faker-js/faker"
import {User} from "api/sdk"

export function generateUsers(total: number): User[] {
  return Array.from({length: total}, () => ({
    _id: faker.datatype.uuid(),
    name: faker.name.fullName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    birthday: faker.date.past().toISOString(),
    profilePic: faker.image.avatar(),
    createdAt: faker.date.past().toISOString(),
    modifiedAt: faker.date.past().toISOString()
  }))
}
