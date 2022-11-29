import {
  AggregateQuery,
  apiCall,
  Condition,
  EntryChange,
  GroupAggregateQuery,
  GroupCountQuery,
  HasId,
  MassModification,
  Modification,
  Query,
  SessionRestEndpoint
} from "@lightningkite/lightning-server-simplified"
import {RJSFSchema} from "@rjsf/utils"

export interface LKSchema {
  uploadEarlyEndpoint?: string
  definitions: RJSFSchema["$defs"]
  endpoints: EndpointSchema[]
  models: Record<string, LKModelSchema<any>>
}

export interface LKModelSchema<T> extends RJSFSchema {
  title: string
  permissions: null
  searchFields: Array<keyof T>
  tableColumns: Array<keyof T>
  titleFields: Array<keyof T>
  properties: Record<string, RJSFSchema>
}

export interface EndpointSchema {
  group: string
  method: HTTPVerb
  path: string
  routes: Record<string, RJSFSchema>
  input: RJSFSchema
  output: RJSFSchema
}

export interface PermissionsSchema {
  create: null
  read: null
  readMask: null
  update: null
  updateRestrictions: null
  delete: null
  maxQueryTimeMs: null
}

export enum HTTPVerb {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH"
}

export interface User extends HasId {
  email: string
  [key: string]: any
}

export interface EmailPinLogin {
  email: string
  pin: string
}

export interface ServerHealth {
  serverId: string
  version: string
  memory: Memory
  features: Record<string, HealthStatus>
  loadAverageCpu: number
}

export interface Memory {
  maxMem: number
  totalMemory: number
  freeMemory: number
  systemAllocated: number
  memUsagePercent: number
}

export enum Level {
  OK = "OK",
  WARNING = "WARNING",
  URGENT = "URGENT",
  ERROR = "ERROR"
}

export interface HealthStatus {
  level: Level
  checkedAt: string
  additionalMessage: string | null | undefined
}

export interface GenericAPI {
  readonly auth: {
    refreshToken(userToken: string): Promise<string>
    getSelf(userToken: string): Promise<User>
    emailLoginLink(input: string): Promise<void>
    emailPINLogin(input: EmailPinLogin): Promise<string>
  }

  getSchema(userToken: string): Promise<LKSchema>

  getServerHealth(userToken: string): Promise<ServerHealth>

  getRestEndpoint<T extends HasId>(
    endpointName: string,
    userToken: string
  ): SessionRestEndpoint<T>
}

export class GenericRequesterSession {
  constructor(public api: GenericAPI, public userToken: string) {}

  readonly auth = {
    refreshToken: (): Promise<string> => {
      return this.api.auth.refreshToken(this.userToken)
    },
    getSelf: (): Promise<User> => {
      return this.api.auth.getSelf(this.userToken)
    },
    emailLoginLink: (input: string): Promise<void> => {
      return this.api.auth.emailLoginLink(input)
    },
    emailPINLogin: (input: EmailPinLogin): Promise<string> => {
      return this.api.auth.emailPINLogin(input)
    }
  }

  getSchema(): Promise<LKSchema> {
    return this.api.getSchema(this.userToken)
  }

  getServerHealth(): Promise<ServerHealth> {
    return this.api.getServerHealth(this.userToken)
  }

  getRestEndpoint<T extends HasId>(
    endpointName: string
  ): SessionRestEndpoint<T> {
    const api = this.api
    const userToken = this.userToken

    return api.getRestEndpoint<T>(endpointName, userToken)
  }
}

export class GenericLiveApi implements GenericAPI {
  public constructor(
    public httpUrl: string,
    public socketUrl: string = httpUrl,
    public extraHeaders: Record<string, string> = {}
  ) {}

  readonly auth = {
    refreshToken: (userToken: string): Promise<string> => {
      return apiCall(`${this.httpUrl}/auth/refresh-token`, undefined, {
        method: "GET",
        headers: userToken
          ? {...this.extraHeaders, Authorization: `Bearer ${userToken}`}
          : this.extraHeaders
      }).then((x) => x.json())
    },
    getSelf: (userToken: string): Promise<User> => {
      return apiCall(`${this.httpUrl}/auth/self`, undefined, {
        method: "GET",
        headers: userToken
          ? {...this.extraHeaders, Authorization: `Bearer ${userToken}`}
          : this.extraHeaders
      }).then((x) => x.json())
    },
    emailLoginLink: (input: string): Promise<void> => {
      return apiCall(`${this.httpUrl}/auth/login-email`, input, {
        method: "POST"
      }).then((_x) => undefined)
    },
    emailPINLogin: (input: EmailPinLogin): Promise<string> => {
      return apiCall(`${this.httpUrl}/auth/login-email-pin`, input, {
        method: "POST"
      }).then((x) => x.json())
    }
  }

  getSchema(userToken: string): Promise<LKSchema> {
    return apiCall(`${this.httpUrl}/admin-editor/models-schema`, undefined, {
      method: "GET",
      headers: {
        ...this.extraHeaders,
        Authorization: `Bearer ${userToken}`
      }
    }).then((x) => x.json())
  }

  getServerHealth(userToken: string): Promise<ServerHealth> {
    return apiCall(`${this.httpUrl}/meta/health`, undefined, {
      method: "GET",
      headers: userToken
        ? {...this.extraHeaders, Authorization: `Bearer ${userToken}`}
        : this.extraHeaders
    }).then((x) => x.json())
  }

  getRestEndpoint<T extends HasId>(
    endpointName: string,
    userToken: string
  ): SessionRestEndpoint<T> {
    const httpUrl = this.httpUrl
    const extraHeaders = this.extraHeaders

    return {
      query<T>(input: Query<T>): Promise<Array<T>> {
        return apiCall(`${httpUrl}/${endpointName}/rest/query`, input, {
          method: "POST",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      detail(id: string): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, undefined, {
          method: "GET",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      insertBulk(input: Array<T>): Promise<Array<T>> {
        return apiCall(`${httpUrl}/${endpointName}/rest/bulk`, input, {
          method: "POST",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      insert(input: T): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest`, input, {
          method: "POST",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      upsert(id: string, input: T): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, input, {
          method: "POST",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      bulkReplace(input: Array<T>): Promise<Array<T>> {
        return apiCall(`${httpUrl}/${endpointName}/rest`, input, {
          method: "PUT",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      replace(id: string, input: T): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, input, {
          method: "PUT",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      bulkModify(input: MassModification<T>): Promise<number> {
        return apiCall(`${httpUrl}/${endpointName}/rest/bulk`, input, {
          method: "PATCH",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      modifyWithDiff(
        id: string,
        input: Modification<T>
      ): Promise<EntryChange<T>> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}/delta`, input, {
          method: "PATCH",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      modify(id: string, input: Modification<T>): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, input, {
          method: "PATCH",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      bulkDelete(input: Condition<T>): Promise<number> {
        return apiCall(`${httpUrl}/${endpointName}/rest/bulk-delete`, input, {
          method: "POST",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      delete(id: string): Promise<void> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, undefined, {
          method: "DELETE",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => undefined)
      },
      count<T>(input: Condition<T>): Promise<number> {
        return apiCall(`${httpUrl}/${endpointName}/rest/count`, input, {
          method: "POST",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      groupCount(input: GroupCountQuery<T>): Promise<Record<string, number>> {
        return apiCall(`${httpUrl}/${endpointName}/rest/group-count`, input, {
          method: "POST",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      aggregate(input: AggregateQuery<T>): Promise<number | null | undefined> {
        return apiCall(`${httpUrl}/${endpointName}/rest/aggregate`, input, {
          method: "POST",
          headers: userToken
            ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      groupAggregate(
        input: GroupAggregateQuery<T>
      ): Promise<Record<string, number | null | undefined>> {
        return apiCall(
          `${httpUrl}/${endpointName}/rest/group-aggregate`,
          input,
          {
            method: "POST",
            headers: userToken
              ? {...extraHeaders, Authorization: `Bearer ${userToken}`}
              : extraHeaders
          }
        ).then((x) => x.json())
      }
    }
  }
}
