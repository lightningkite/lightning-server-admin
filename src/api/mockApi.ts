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
  GenericAPI,
  Level,
  SchemaSet,
  ServerHealth,
  SSOAuthSubmission
} from "./genericSdk"
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
    endpointName: string,
    requesterToken: string
  ): SessionRestEndpoint<T> {
    return {
      query: <T extends HasId>(input: Query<T>): Promise<Array<T>> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "query",
          input,
          requesterToken
        )
      },
      detail: <T extends HasId>(id: string): Promise<T> => {
        return this.adaptEndpoint<T>(endpointName, "detail", id, requesterToken)
      },
      insertBulk: <T extends HasId>(input: Array<T>): Promise<Array<T>> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "insertBulk",
          input,
          requesterToken
        )
      },
      insert: <T extends HasId>(input: T): Promise<T> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "insert",
          input,
          requesterToken
        )
      },
      upsert: <T extends HasId>(id: string, input: T): Promise<T> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "upsert",
          id,
          input,
          requesterToken
        )
      },
      bulkReplace: <T extends HasId>(input: Array<T>): Promise<Array<T>> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "bulkReplace",
          input,
          requesterToken
        )
      },
      replace: <T extends HasId>(id: string, input: T): Promise<T> => {
        return this.adaptEndpoint<T>(
          endpointName,
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
          endpointName,
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
          endpointName,
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
          endpointName,
          "modify",
          id,
          input,
          requesterToken
        )
      },
      bulkDelete: <T extends HasId>(input: Condition<T>): Promise<number> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "bulkDelete",
          input,
          requesterToken
        )
      },
      delete: <T extends HasId>(id: string): Promise<void> => {
        return this.adaptEndpoint<T>(endpointName, "delete", id, requesterToken)
      },
      count: <T extends HasId>(input: Condition<T>): Promise<number> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "count",
          input,
          requesterToken
        )
      },
      groupCount: <T extends HasId>(
        input: GroupCountQuery<T>
      ): Promise<Record<string, number>> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "groupCount",
          input,
          requesterToken
        )
      },
      aggregate: <T extends HasId>(
        input: AggregateQuery<T>
      ): Promise<number> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "aggregate",
          input,
          requesterToken
        )
      },
      groupAggregate: <T extends HasId>(
        input: GroupAggregateQuery<T>
      ): Promise<Record<string, number>> => {
        return this.adaptEndpoint<T>(
          endpointName,
          "groupAggregate",
          input,
          requesterToken
        )
      }
    }
  }

  readonly adminEditor = {
    getSchemas: async (requesterToken: string): Promise<SchemaSet[]> => {
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
