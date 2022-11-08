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
import {LKSchema} from "utils/models"

export interface User extends HasId {
  [key: string]: any
}

export interface SSOAuthSubmission {
  value: string
  clientKey: string
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
    emailLoginLink(input: string): Promise<void>
    loginSSO(input: string): Promise<string>
    submitSSO(input: SSOAuthSubmission): Promise<string>
    getSelf(requesterToken: string): Promise<User>
  }

  readonly adminEditor: {
    getSchemas(requesterToken: string): Promise<LKSchema[]>
  }

  getServerHealth(requesterToken: string): Promise<ServerHealth>

  getRestEndpoint<T extends HasId>(
    endpointName: string,
    requesterToken: string
  ): SessionRestEndpoint<T>
}

export class GenericRequesterSession {
  constructor(public api: GenericAPI, public requesterToken: string) {}

  readonly auth = {
    api: this.api,
    requesterToken: this.requesterToken,

    getSelf(): Promise<User> {
      return this.api.auth.getSelf(this.requesterToken)
    },
    emailLoginLink(input: string): Promise<void> {
      return this.api.auth.emailLoginLink(input)
    },
    loginSSO(input: string): Promise<string> {
      return this.api.auth.loginSSO(input)
    },
    submitSSO(input: SSOAuthSubmission): Promise<string> {
      return this.api.auth.submitSSO(input)
    }
  }

  readonly adminEditor = {
    api: this.api,
    requesterToken: this.requesterToken,

    getModelSchema(): Promise<LKSchema[]> {
      return this.api.adminEditor.getSchemas(this.requesterToken)
    }
  }

  getServerHealth(): Promise<ServerHealth> {
    return this.api.getServerHealth(this.requesterToken)
  }

  getRestEndpoint<T extends HasId>(
    endpointName: string
  ): SessionRestEndpoint<T> {
    const api = this.api
    const requesterToken = this.requesterToken

    return api.getRestEndpoint<T>(endpointName, requesterToken)
  }
}

export class GenericLiveApi implements GenericAPI {
  public constructor(
    public httpUrl: string,
    public socketUrl: string = httpUrl,
    public extraHeaders: Record<string, string> = {}
  ) {}

  readonly auth = {
    httpUrl: this.httpUrl,
    socketUrl: this.socketUrl,
    extraHeaders: this.extraHeaders,
    emailLoginLink(input: string): Promise<void> {
      return apiCall(`${this.httpUrl}/auth/login-email-link`, input, {
        method: "POST"
      }).then((x) => undefined)
    },
    loginSSO(input: string): Promise<string> {
      return apiCall(`${this.httpUrl}/auth/login-sso`, input, {
        method: "POST"
      }).then((x) => x.json())
    },
    submitSSO(input: SSOAuthSubmission): Promise<string> {
      return apiCall(`${this.httpUrl}/auth/submit-sso`, input, {
        method: "POST"
      }).then((x) => x.json())
    },
    getSelf(requesterToken: string): Promise<User> {
      return apiCall(`${this.httpUrl}/auth/self/user`, undefined, {
        method: "GET",
        headers: {
          ...this.extraHeaders,
          Authorization: `Bearer ${requesterToken}`
        }
      }).then((x) => x.json())
    }
  }

  readonly adminEditor = {
    httpUrl: this.httpUrl,
    socketUrl: this.socketUrl,
    extraHeaders: this.extraHeaders,
    getSchemas(requesterToken: string): Promise<LKSchema[]> {
      return apiCall(`${this.httpUrl}/admin-editor/models-schema`, undefined, {
        method: "GET",
        headers: {
          ...this.extraHeaders,
          Authorization: `Bearer ${requesterToken}`
        }
      }).then((x) => x.json())
    }
  }

  getServerHealth(requesterToken: string): Promise<ServerHealth> {
    return apiCall(`${this.httpUrl}/help/health`, undefined, {
      method: "GET",
      headers: requesterToken
        ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
        : this.extraHeaders
    }).then((x) => x.json())
  }

  getRestEndpoint<T extends HasId>(
    endpointName: string,
    requesterToken: string
  ): SessionRestEndpoint<T> {
    const httpUrl = this.httpUrl
    const extraHeaders = this.extraHeaders

    return {
      query<T>(input: Query<T>): Promise<Array<T>> {
        return apiCall(`${httpUrl}/${endpointName}/rest/query`, input, {
          method: "POST",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      detail(id: string): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, undefined, {
          method: "GET",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      insertBulk(input: Array<T>): Promise<Array<T>> {
        return apiCall(`${httpUrl}/${endpointName}/rest/bulk`, input, {
          method: "POST",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      insert(input: User): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest`, input, {
          method: "POST",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      upsert(id: string, input: User): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, input, {
          method: "POST",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      bulkReplace(input: Array<T>): Promise<Array<T>> {
        return apiCall(`${httpUrl}/${endpointName}/rest`, input, {
          method: "PUT",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      replace(id: string, input: User): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, input, {
          method: "PUT",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      bulkModify(input: MassModification<T>): Promise<number> {
        return apiCall(`${httpUrl}/${endpointName}/rest/bulk`, input, {
          method: "PATCH",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      modifyWithDiff(
        id: string,
        input: Modification<T>
      ): Promise<EntryChange<T>> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}/delta`, input, {
          method: "PATCH",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      modify(id: string, input: Modification<T>): Promise<T> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, input, {
          method: "PATCH",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      bulkDelete(input: Condition<T>): Promise<number> {
        return apiCall(`${httpUrl}/${endpointName}/rest/bulk-delete`, input, {
          method: "POST",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      delete(id: string): Promise<void> {
        return apiCall(`${httpUrl}/${endpointName}/rest/${id}`, undefined, {
          method: "DELETE",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => undefined)
      },
      count<T>(input: Condition<T>): Promise<number> {
        return apiCall(`${httpUrl}/${endpointName}/rest/count`, input, {
          method: "POST",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      groupCount(input: GroupCountQuery<T>): Promise<Record<string, number>> {
        return apiCall(`${httpUrl}/${endpointName}/rest/group-count`, input, {
          method: "POST",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : extraHeaders
        }).then((x) => x.json())
      },
      aggregate(input: AggregateQuery<T>): Promise<number | null | undefined> {
        return apiCall(`${httpUrl}/${endpointName}/rest/aggregate`, input, {
          method: "POST",
          headers: requesterToken
            ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
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
            headers: requesterToken
              ? {...extraHeaders, Authorization: `Bearer ${requesterToken}`}
              : extraHeaders
          }
        ).then((x) => x.json())
      }
    }
  }
}
