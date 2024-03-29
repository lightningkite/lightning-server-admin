import {faker} from "@faker-js/faker"
import {
  AggregateQuery,
  Condition,
  EntryChange,
  GroupAggregateQuery,
  GroupCountQuery,
  HasId,
  MassModification,
  mockRestEndpointFunctions,
  Modification,
  Query,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {LocalStorageKey} from "utils/constants"
import {
  EmailPinLogin,
  GenericAPI,
  Level,
  LKSchema,
  ServerHealth,
  User
} from "./genericSdk"
import {generateMockDatastore} from "./mockDatastore"

// export interface User {
//   _id: string
//   name: string
//   email: string
//   phone?: string
//   birthday?: string
//   profilePic?: string
//   createdAt: string
//   modifiedAt: string
// }

export interface Product {
  _id: string
  title: string
  description: string
  price: number
  tags: string[]
  createdAt: string
  modifiedAt: string
}

export interface Tag {
  _id: string
  name: string
  description: string
  createdAt: string
  modifiedAt: string
}

let myUser: User | null = null

export class MockApi implements GenericAPI {
  mockProductEndpointFunctions: ReturnType<
    typeof mockRestEndpointFunctions<Product>
  >

  mockUserEndpointFunctions: ReturnType<typeof mockRestEndpointFunctions<User>>

  mockTagEndpointFunctions: ReturnType<typeof mockRestEndpointFunctions<Tag>>

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

    this.mockTagEndpointFunctions = mockRestEndpointFunctions<Tag>(
      this.mockDatastore.tags,
      "tag"
    )
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
      case "tag":
        return this.mockTagEndpointFunctions[restFunctionName](
          args[0],
          args[1],
          args[2]
        )
      default:
        throw new Error("Unknown endpoint: " + endpointName)
    }
  }

  getRestEndpoint<T extends HasId>(
    endpointURL: string,
    requesterToken: string
  ): SessionRestEndpoint<T> {
    return {
      default: <T extends HasId>(): Promise<T> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "default",
          undefined,
          requesterToken
        )
      },
      query: <T extends HasId>(input: Query<T>): Promise<Array<T>> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "query",
          input,
          requesterToken
        )
      },
      queryPartial: <T extends HasId>(input: Query<T>): Promise<Array<T>> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "query",
          input,
          requesterToken
        )
      },
      detail: <T extends HasId>(id: string): Promise<T> => {
        return this.adaptEndpoint<T>(endpointURL, "detail", id, requesterToken)
      },
      insertBulk: <T extends HasId>(input: Array<T>): Promise<Array<T>> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "insertBulk",
          input,
          requesterToken
        )
      },
      insert: <T extends HasId>(input: T): Promise<T> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "insert",
          input,
          requesterToken
        )
      },
      upsert: <T extends HasId>(id: string, input: T): Promise<T> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "upsert",
          id,
          input,
          requesterToken
        )
      },
      bulkReplace: <T extends HasId>(input: Array<T>): Promise<Array<T>> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "bulkReplace",
          input,
          requesterToken
        )
      },
      replace: <T extends HasId>(id: string, input: T): Promise<T> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "replace",
          id,
          input,
          requesterToken
        )
      },
      bulkModify: <T extends HasId>(
        input: MassModification<T>
      ): Promise<number> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "bulkModify",
          input,
          requesterToken
        )
      },
      modifyWithDiff: <T extends HasId>(
        id: string,
        input: Modification<T>
      ): Promise<EntryChange<T>> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "modifyWithDiff",
          id,
          input,
          requesterToken
        )
      },
      modify: <T extends HasId>(
        id: string,
        input: Modification<T>
      ): Promise<T> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "modify",
          id,
          input,
          requesterToken
        )
      },
      bulkDelete: <T extends HasId>(input: Condition<T>): Promise<number> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "bulkDelete",
          input,
          requesterToken
        )
      },
      delete: <T extends HasId>(id: string): Promise<void> => {
        return this.adaptEndpoint<T>(endpointURL, "delete", id, requesterToken)
      },
      count: <T extends HasId>(input: Condition<T>): Promise<number> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "count",
          input,
          requesterToken
        )
      },
      groupCount: <T extends HasId>(
        input: GroupCountQuery<T>
      ): Promise<Record<string, number>> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "groupCount",
          input,
          requesterToken
        )
      },
      aggregate: <T extends HasId>(
        input: AggregateQuery<T>
      ): Promise<number> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "aggregate",
          input,
          requesterToken
        )
      },
      groupAggregate: <T extends HasId>(
        input: GroupAggregateQuery<T>
      ): Promise<Record<string, number>> => {
        return this.adaptEndpoint<T>(
          endpointURL,
          "groupAggregate",
          input,
          requesterToken
        )
      }
    }
  }

  getSchema = async (): Promise<LKSchema> => {
    return this.mockDatastore.schema
  }

  readonly auth = {
    refreshToken: async (): Promise<string> => {
      return "mock-refresh-token"
    },
    getSelf: (_userToken: string): Promise<User> => {
      if (!myUser) return Promise.reject()
      return Promise.resolve(myUser)
    },
    emailLoginLink: async (_email: string): Promise<void> => {
      localStorage.setItem(LocalStorageKey.USER_TOKEN, "mock-user-token")
      myUser = faker.helpers.arrayElement(this.mockDatastore.users)
      alert(
        "You are using the mock API and will not receive an email. Refresh the page to log in."
      )
    },
    emailPINLogin: async (_input: EmailPinLogin): Promise<string> => {
      localStorage.setItem(LocalStorageKey.USER_TOKEN, "mock-user-token")
      myUser = faker.helpers.arrayElement(this.mockDatastore.users)
      return "mock-sso-uuid"
    }
  }

  async getServerHealth(requesterToken: string): Promise<ServerHealth> {
    return {
      serverId: "mock-server-id",
      version: "0.0.0",
      loadAverageCpu: 80,
      memory: {
        max: 883884032,
        total: 59195392,
        free: 25636256,
        systemAllocated: 33559136,
        usage: 6.69
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
