import {faker} from "@faker-js/faker"
import {
  Condition,
  HasId,
  mockRestEndpointFunctions,
  Query,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {LocalStorageKey} from "utils/constants"
import {LKSchema} from "utils/models"
import {GenericAPI, Level, ServerHealth, SSOAuthSubmission} from "./genericSdk"
import {generateMockDatastore} from "./mockDatastore"

export interface User {
  _id: string
  name: string
  email: string
  phone?: string
  birthday?: string
  profilePic?: string
  createdAt: string
  modifiedAt: string
}

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  createdAt: string
  modifiedAt: string
}

let myUser: User | null = null

export class MockApi implements GenericAPI {
  mockProductEndpointFunctions: ReturnType<
    typeof mockRestEndpointFunctions<Product>
  >

  mockUserEndpointFunctions: ReturnType<typeof mockRestEndpointFunctions<User>>

  public constructor(
    public httpUrl: string = "mock",
    public socketUrl: string = httpUrl,
    public mockDatastore = generateMockDatastore()
  ) {
    if (localStorage.getItem(LocalStorageKey.USER_TOKEN)) {
      myUser = faker.helpers.arrayElement(this.mockDatastore.users)
    }

    this.mockProductEndpointFunctions = mockRestEndpointFunctions<Product>(
      this.mockDatastore.products,
      "product"
    )

    this.mockUserEndpointFunctions = mockRestEndpointFunctions<User>(
      this.mockDatastore.users,
      "user"
    )
  }

  // readonly user = mockRestEndpointFunctions<User>(
  //   this.mockDatastore.users,
  //   "user"
  // )

  // readonly product = mockRestEndpointFunctions<Product>(
  //   this.mockDatastore.products,
  //   "product"
  // )

  getRestEndpoint<T extends HasId>(
    endpointName: string,
    requesterToken: string
  ): SessionRestEndpoint<T> {
    throw new Error("Method not implemented.")
  }

  readonly adaptEndpoint = <T extends HasId>(
    endpointName: string,
    restFunctionName: keyof ReturnType<typeof mockRestEndpointFunctions<T>>,
    ...args: any[]
  ): Promise<any> => {
    switch (endpointName) {
      case "user":
        return this.mockUserEndpointFunctions[restFunctionName](
          args[0],
          args[1],
          args[2]
        )
      case "product":
        return this.mockProductEndpointFunctions[restFunctionName](
          args[0],
          args[1],
          args[2]
        )
      default:
        throw new Error("Unknown endpoint: " + endpointName)
    }
  }

  readonly serverModel = {
    query: <T extends HasId>(
      endpointName: string,
      input: Query<T>,
      requesterToken: string
    ): Promise<Array<T>> => {
      return this.adaptEndpoint<T>(endpointName, "query", input, requesterToken)
    },
    count: <T extends HasId>(
      endpointName: string,
      input: Condition<T>,
      requesterToken: string
    ): Promise<number> => {
      return this.adaptEndpoint<T>(endpointName, "count", input, requesterToken)
    }
  }

  readonly adminEditor = {
    getSchemas: async (requesterToken: string): Promise<LKSchema[]> => {
      return this.mockDatastore.schemas
    }
  }

  readonly auth = {
    emailLoginLink: async (email: string): Promise<void> => {
      localStorage.setItem(LocalStorageKey.USER_TOKEN, "mock-user-token")
      myUser = faker.helpers.arrayElement(this.mockDatastore.users)
      alert(
        "You are using the mock API and will not receive an email. Refresh the page to log in."
      )
    },
    loginSSO: async (input: string): Promise<string> => {
      localStorage.setItem(LocalStorageKey.USER_TOKEN, "mock-user-token")
      myUser = faker.helpers.arrayElement(this.mockDatastore.users)
      alert(
        "You are using the mock API and will not receive an email or text. Enter any code to log in."
      )
      return "mock-sso-uuid"
    },
    submitSSO: async (input: SSOAuthSubmission): Promise<string> => {
      return "mock-user-token"
    },
    getSelf: (requesterToken: string): Promise<User> => {
      if (!myUser) return Promise.reject()
      return Promise.resolve(myUser)
    }
  }

  async getServerHealth(requesterToken: string): Promise<ServerHealth> {
    return {
      serverId: "mock-server-id",
      version: "0.0.0",
      loadAverageCpu: 80,
      memory: {
        maxMem: 321,
        totalMemory: 512,
        freeMemory: 128,
        systemAllocated: 256,
        memUsagePercent: 50
      },
      features: {
        authentication: {
          level: Level.OK,
          checkedAt: faker.date.recent().toISOString(),
          additionalMessage: null
        },
        fluxCapacitor: {
          level: Level.WARNING,
          checkedAt: faker.date.recent().toISOString(),
          additionalMessage: "Flux capacitor is not calibrated"
        },
        database: {
          level: Level.OK,
          checkedAt: faker.date.recent().toISOString(),
          additionalMessage: null
        },
        unnecessaryMicroservice: {
          level: Level.ERROR,
          checkedAt: faker.date.recent().toISOString(),
          additionalMessage: "Offline"
        }
      }
    }
  }
}
