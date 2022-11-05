// Replace this file with the automatically generated lightning server SDK

import {
  AggregateQuery,
  apiCall,
  Condition,
  EntryChange,
  GroupAggregateQuery,
  GroupCountQuery,
  MassModification,
  Modification,
  Path,
  Query
} from "@lightningkite/lightning-server-simplified"
import {LKSchema} from "utils/models"

export interface User {
  _id: string
  name: string
  email: string
  phone: string
  birthday: string
  profilePic: string
  createdAt: string
  modifiedAt: string
}

export interface Product {
  _id: string
  title: string
  description: string
  price: number
}

export interface SSOAuthSubmission {
  value: string
  clientKey: string
}

export interface Api {
  readonly auth: {
    emailLoginLink(input: string): Promise<void>
    loginSSO(input: string): Promise<string>
    submitSSO(input: SSOAuthSubmission): Promise<string>
    getSelf(requesterToken: string): Promise<User>
  }

  readonly adminEditor: {
    getSchemas(requesterToken: string): Promise<LKSchema[]>
  }

  readonly user: {
    query(
      input: Query<User>,
      requesterToken: string,
      files?: Record<Path<Query<User>>, File>
    ): Promise<Array<User>>
    detail(id: string, requesterToken: string): Promise<User>
    insertBulk(
      input: Array<User>,
      requesterToken: string,
      files?: Record<Path<Array<User>>, File>
    ): Promise<Array<User>>
    insert(
      input: User,
      requesterToken: string,
      files?: Record<Path<User>, File>
    ): Promise<User>
    upsert(
      id: string,
      input: User,
      requesterToken: string,
      files?: Record<Path<User>, File>
    ): Promise<User>
    bulkReplace(
      input: Array<User>,
      requesterToken: string,
      files?: Record<Path<Array<User>>, File>
    ): Promise<Array<User>>
    replace(
      id: string,
      input: User,
      requesterToken: string,
      files?: Record<Path<User>, File>
    ): Promise<User>
    bulkModify(
      input: MassModification<User>,
      requesterToken: string,
      files?: Record<Path<MassModification<User>>, File>
    ): Promise<number>
    modifyWithDiff(
      id: string,
      input: Modification<User>,
      requesterToken: string,
      files?: Record<Path<Modification<User>>, File>
    ): Promise<EntryChange<User>>
    modify(
      id: string,
      input: Modification<User>,
      requesterToken: string,
      files?: Record<Path<Modification<User>>, File>
    ): Promise<User>
    bulkDelete(
      input: Condition<User>,
      requesterToken: string,
      files?: Record<Path<Condition<User>>, File>
    ): Promise<number>
    delete(id: string, requesterToken: string): Promise<void>
    count(
      input: Condition<User>,
      requesterToken: string,
      files?: Record<Path<Condition<User>>, File>
    ): Promise<number>
    groupCount(
      input: GroupCountQuery<User>,
      requesterToken: string,
      files?: Record<Path<GroupCountQuery<User>>, File>
    ): Promise<Record<string, number>>
    aggregate(
      input: AggregateQuery<User>,
      requesterToken: string,
      files?: Record<Path<AggregateQuery<User>>, File>
    ): Promise<number | null | undefined>
    groupAggregate(
      input: GroupAggregateQuery<User>,
      requesterToken: string,
      files?: Record<Path<GroupAggregateQuery<User>>, File>
    ): Promise<Record<string, number | null | undefined>>
  }

  readonly product: {
    query(
      input: Query<Product>,
      requesterToken: string,
      files?: Record<Path<Query<Product>>, File>
    ): Promise<Array<Product>>
    detail(id: string, requesterToken: string): Promise<Product>
    insertBulk(
      input: Array<Product>,
      requesterToken: string,
      files?: Record<Path<Array<Product>>, File>
    ): Promise<Array<Product>>
    insert(
      input: Product,
      requesterToken: string,
      files?: Record<Path<Product>, File>
    ): Promise<Product>
    upsert(
      id: string,
      input: Product,
      requesterToken: string,
      files?: Record<Path<Product>, File>
    ): Promise<Product>
    bulkReplace(
      input: Array<Product>,
      requesterToken: string,
      files?: Record<Path<Array<Product>>, File>
    ): Promise<Array<Product>>
    replace(
      id: string,
      input: Product,
      requesterToken: string,
      files?: Record<Path<Product>, File>
    ): Promise<Product>
    bulkModify(
      input: MassModification<Product>,
      requesterToken: string,
      files?: Record<Path<MassModification<Product>>, File>
    ): Promise<number>
    modifyWithDiff(
      id: string,
      input: Modification<Product>,
      requesterToken: string,
      files?: Record<Path<Modification<Product>>, File>
    ): Promise<EntryChange<Product>>
    modify(
      id: string,
      input: Modification<Product>,
      requesterToken: string,
      files?: Record<Path<Modification<Product>>, File>
    ): Promise<Product>
    bulkDelete(
      input: Condition<Product>,
      requesterToken: string,
      files?: Record<Path<Condition<Product>>, File>
    ): Promise<number>
    delete(id: string, requesterToken: string): Promise<void>
    count(
      input: Condition<Product>,
      requesterToken: string,
      files?: Record<Path<Condition<Product>>, File>
    ): Promise<number>
    groupCount(
      input: GroupCountQuery<Product>,
      requesterToken: string,
      files?: Record<Path<GroupCountQuery<Product>>, File>
    ): Promise<Record<string, number>>
    aggregate(
      input: AggregateQuery<Product>,
      requesterToken: string,
      files?: Record<Path<AggregateQuery<Product>>, File>
    ): Promise<number | null | undefined>
    groupAggregate(
      input: GroupAggregateQuery<Product>,
      requesterToken: string,
      files?: Record<Path<GroupAggregateQuery<Product>>, File>
    ): Promise<Record<string, number | null | undefined>>
  }
}

export class RequesterSession {
  constructor(public api: Api, public requesterToken: string) {}

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

  readonly user = {
    api: this.api,
    requesterToken: this.requesterToken,
    query(
      input: Query<User>,
      files?: Record<Path<Query<User>>, File>
    ): Promise<Array<User>> {
      return this.api.user.query(input, this.requesterToken, files)
    },
    detail(id: string): Promise<User> {
      return this.api.user.detail(id, this.requesterToken)
    },
    insertBulk(
      input: Array<User>,
      files?: Record<Path<Array<User>>, File>
    ): Promise<Array<User>> {
      return this.api.user.insertBulk(input, this.requesterToken, files)
    },
    insert(input: User, files?: Record<Path<User>, File>): Promise<User> {
      return this.api.user.insert(input, this.requesterToken, files)
    },
    upsert(
      id: string,
      input: User,
      files?: Record<Path<User>, File>
    ): Promise<User> {
      return this.api.user.upsert(id, input, this.requesterToken, files)
    },
    bulkReplace(
      input: Array<User>,
      files?: Record<Path<Array<User>>, File>
    ): Promise<Array<User>> {
      return this.api.user.bulkReplace(input, this.requesterToken, files)
    },
    replace(
      id: string,
      input: User,
      files?: Record<Path<User>, File>
    ): Promise<User> {
      return this.api.user.replace(id, input, this.requesterToken, files)
    },
    bulkModify(
      input: MassModification<User>,
      files?: Record<Path<MassModification<User>>, File>
    ): Promise<number> {
      return this.api.user.bulkModify(input, this.requesterToken, files)
    },
    modifyWithDiff(
      id: string,
      input: Modification<User>,
      files?: Record<Path<Modification<User>>, File>
    ): Promise<EntryChange<User>> {
      return this.api.user.modifyWithDiff(id, input, this.requesterToken, files)
    },
    modify(
      id: string,
      input: Modification<User>,
      files?: Record<Path<Modification<User>>, File>
    ): Promise<User> {
      return this.api.user.modify(id, input, this.requesterToken, files)
    },
    bulkDelete(
      input: Condition<User>,
      files?: Record<Path<Condition<User>>, File>
    ): Promise<number> {
      return this.api.user.bulkDelete(input, this.requesterToken, files)
    },
    delete(id: string): Promise<void> {
      return this.api.user.delete(id, this.requesterToken)
    },
    count(
      input: Condition<User>,
      files?: Record<Path<Condition<User>>, File>
    ): Promise<number> {
      return this.api.user.count(input, this.requesterToken, files)
    },
    groupCount(
      input: GroupCountQuery<User>,
      files?: Record<Path<GroupCountQuery<User>>, File>
    ): Promise<Record<string, number>> {
      return this.api.user.groupCount(input, this.requesterToken, files)
    },
    aggregate(
      input: AggregateQuery<User>,
      files?: Record<Path<AggregateQuery<User>>, File>
    ): Promise<number | null | undefined> {
      return this.api.user.aggregate(input, this.requesterToken, files)
    },
    groupAggregate(
      input: GroupAggregateQuery<User>,
      files?: Record<Path<GroupAggregateQuery<User>>, File>
    ): Promise<Record<string, number | null | undefined>> {
      return this.api.user.groupAggregate(input, this.requesterToken, files)
    }
  }

  readonly product = {
    api: this.api,
    requesterToken: this.requesterToken,
    query(
      input: Query<Product>,
      files?: Record<Path<Query<Product>>, File>
    ): Promise<Array<Product>> {
      return this.api.product.query(input, this.requesterToken, files)
    },
    detail(id: string): Promise<Product> {
      return this.api.product.detail(id, this.requesterToken)
    },
    insertBulk(
      input: Array<Product>,
      files?: Record<Path<Array<Product>>, File>
    ): Promise<Array<Product>> {
      return this.api.product.insertBulk(input, this.requesterToken, files)
    },
    insert(
      input: Product,
      files?: Record<Path<Product>, File>
    ): Promise<Product> {
      return this.api.product.insert(input, this.requesterToken, files)
    },
    upsert(
      id: string,
      input: Product,
      files?: Record<Path<Product>, File>
    ): Promise<Product> {
      return this.api.product.upsert(id, input, this.requesterToken, files)
    },
    bulkReplace(
      input: Array<Product>,
      files?: Record<Path<Array<Product>>, File>
    ): Promise<Array<Product>> {
      return this.api.product.bulkReplace(input, this.requesterToken, files)
    },
    replace(
      id: string,
      input: Product,
      files?: Record<Path<Product>, File>
    ): Promise<Product> {
      return this.api.product.replace(id, input, this.requesterToken, files)
    },
    bulkModify(
      input: MassModification<Product>,
      files?: Record<Path<MassModification<Product>>, File>
    ): Promise<number> {
      return this.api.product.bulkModify(input, this.requesterToken, files)
    },
    modifyWithDiff(
      id: string,
      input: Modification<Product>,
      files?: Record<Path<Modification<Product>>, File>
    ): Promise<EntryChange<Product>> {
      return this.api.product.modifyWithDiff(
        id,
        input,
        this.requesterToken,
        files
      )
    },
    modify(
      id: string,
      input: Modification<Product>,
      files?: Record<Path<Modification<Product>>, File>
    ): Promise<Product> {
      return this.api.product.modify(id, input, this.requesterToken, files)
    },
    bulkDelete(
      input: Condition<Product>,
      files?: Record<Path<Condition<Product>>, File>
    ): Promise<number> {
      return this.api.product.bulkDelete(input, this.requesterToken, files)
    },
    delete(id: string): Promise<void> {
      return this.api.product.delete(id, this.requesterToken)
    },
    count(
      input: Condition<Product>,
      files?: Record<Path<Condition<Product>>, File>
    ): Promise<number> {
      return this.api.product.count(input, this.requesterToken, files)
    },
    groupCount(
      input: GroupCountQuery<Product>,
      files?: Record<Path<GroupCountQuery<Product>>, File>
    ): Promise<Record<string, number>> {
      return this.api.product.groupCount(input, this.requesterToken, files)
    },
    aggregate(
      input: AggregateQuery<Product>,
      files?: Record<Path<AggregateQuery<Product>>, File>
    ): Promise<number | null | undefined> {
      return this.api.product.aggregate(input, this.requesterToken, files)
    },
    groupAggregate(
      input: GroupAggregateQuery<Product>,
      files?: Record<Path<GroupAggregateQuery<Product>>, File>
    ): Promise<Record<string, number | null | undefined>> {
      return this.api.product.groupAggregate(input, this.requesterToken, files)
    }
  }
}

export class LiveApi implements Api {
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

  readonly user = {
    httpUrl: this.httpUrl,
    socketUrl: this.socketUrl,
    extraHeaders: this.extraHeaders,
    query(
      input: Query<User>,
      requesterToken: string,
      files?: Record<Path<Query<User>>, File>
    ): Promise<Array<User>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/query`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    detail(id: string, requesterToken: string): Promise<User> {
      return apiCall(`${this.httpUrl}/activity-tags/rest/${id}`, undefined, {
        method: "GET",
        headers: requesterToken
          ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
          : this.extraHeaders
      }).then((x) => x.json())
    },
    insertBulk(
      input: Array<User>,
      requesterToken: string,
      files?: Record<Path<Array<User>>, File>
    ): Promise<Array<User>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/bulk`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    insert(
      input: User,
      requesterToken: string,
      files?: Record<Path<User>, File>
    ): Promise<User> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    upsert(
      id: string,
      input: User,
      requesterToken: string,
      files?: Record<Path<User>, File>
    ): Promise<User> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/${id}`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    bulkReplace(
      input: Array<User>,
      requesterToken: string,
      files?: Record<Path<Array<User>>, File>
    ): Promise<Array<User>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest`,
        input,
        {
          method: "PUT",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    replace(
      id: string,
      input: User,
      requesterToken: string,
      files?: Record<Path<User>, File>
    ): Promise<User> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/${id}`,
        input,
        {
          method: "PUT",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    bulkModify(
      input: MassModification<User>,
      requesterToken: string,
      files?: Record<Path<MassModification<User>>, File>
    ): Promise<number> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/bulk`,
        input,
        {
          method: "PATCH",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    modifyWithDiff(
      id: string,
      input: Modification<User>,
      requesterToken: string,
      files?: Record<Path<Modification<User>>, File>
    ): Promise<EntryChange<User>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/${id}/delta`,
        input,
        {
          method: "PATCH",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    modify(
      id: string,
      input: Modification<User>,
      requesterToken: string,
      files?: Record<Path<Modification<User>>, File>
    ): Promise<User> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/${id}`,
        input,
        {
          method: "PATCH",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    bulkDelete(
      input: Condition<User>,
      requesterToken: string,
      files?: Record<Path<Condition<User>>, File>
    ): Promise<number> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/bulk-delete`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    delete(id: string, requesterToken: string): Promise<void> {
      return apiCall(`${this.httpUrl}/activity-tags/rest/${id}`, undefined, {
        method: "DELETE",
        headers: requesterToken
          ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
          : this.extraHeaders
      }).then((x) => undefined)
    },
    count(
      input: Condition<User>,
      requesterToken: string,
      files?: Record<Path<Condition<User>>, File>
    ): Promise<number> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/count`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    groupCount(
      input: GroupCountQuery<User>,
      requesterToken: string,
      files?: Record<Path<GroupCountQuery<User>>, File>
    ): Promise<Record<string, number>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/group-count`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    aggregate(
      input: AggregateQuery<User>,
      requesterToken: string,
      files?: Record<Path<AggregateQuery<User>>, File>
    ): Promise<number | null | undefined> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/aggregate`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    groupAggregate(
      input: GroupAggregateQuery<User>,
      requesterToken: string,
      files?: Record<Path<GroupAggregateQuery<User>>, File>
    ): Promise<Record<string, number | null | undefined>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/group-aggregate`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    }
  }

  readonly product = {
    httpUrl: this.httpUrl,
    socketUrl: this.socketUrl,
    extraHeaders: this.extraHeaders,
    query(
      input: Query<Product>,
      requesterToken: string,
      files?: Record<Path<Query<Product>>, File>
    ): Promise<Array<Product>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/query`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    detail(id: string, requesterToken: string): Promise<Product> {
      return apiCall(`${this.httpUrl}/activity-tags/rest/${id}`, undefined, {
        method: "GET",
        headers: requesterToken
          ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
          : this.extraHeaders
      }).then((x) => x.json())
    },
    insertBulk(
      input: Array<Product>,
      requesterToken: string,
      files?: Record<Path<Array<Product>>, File>
    ): Promise<Array<Product>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/bulk`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    insert(
      input: Product,
      requesterToken: string,
      files?: Record<Path<Product>, File>
    ): Promise<Product> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    upsert(
      id: string,
      input: Product,
      requesterToken: string,
      files?: Record<Path<Product>, File>
    ): Promise<Product> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/${id}`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    bulkReplace(
      input: Array<Product>,
      requesterToken: string,
      files?: Record<Path<Array<Product>>, File>
    ): Promise<Array<Product>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest`,
        input,
        {
          method: "PUT",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    replace(
      id: string,
      input: Product,
      requesterToken: string,
      files?: Record<Path<Product>, File>
    ): Promise<Product> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/${id}`,
        input,
        {
          method: "PUT",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    bulkModify(
      input: MassModification<Product>,
      requesterToken: string,
      files?: Record<Path<MassModification<Product>>, File>
    ): Promise<number> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/bulk`,
        input,
        {
          method: "PATCH",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    modifyWithDiff(
      id: string,
      input: Modification<Product>,
      requesterToken: string,
      files?: Record<Path<Modification<Product>>, File>
    ): Promise<EntryChange<Product>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/${id}/delta`,
        input,
        {
          method: "PATCH",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    modify(
      id: string,
      input: Modification<Product>,
      requesterToken: string,
      files?: Record<Path<Modification<Product>>, File>
    ): Promise<Product> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/${id}`,
        input,
        {
          method: "PATCH",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    bulkDelete(
      input: Condition<Product>,
      requesterToken: string,
      files?: Record<Path<Condition<Product>>, File>
    ): Promise<number> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/bulk-delete`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    delete(id: string, requesterToken: string): Promise<void> {
      return apiCall(`${this.httpUrl}/activity-tags/rest/${id}`, undefined, {
        method: "DELETE",
        headers: requesterToken
          ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
          : this.extraHeaders
      }).then((x) => undefined)
    },
    count(
      input: Condition<Product>,
      requesterToken: string,
      files?: Record<Path<Condition<Product>>, File>
    ): Promise<number> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/count`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    groupCount(
      input: GroupCountQuery<Product>,
      requesterToken: string,
      files?: Record<Path<GroupCountQuery<Product>>, File>
    ): Promise<Record<string, number>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/group-count`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    aggregate(
      input: AggregateQuery<Product>,
      requesterToken: string,
      files?: Record<Path<AggregateQuery<Product>>, File>
    ): Promise<number | null | undefined> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/aggregate`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    },
    groupAggregate(
      input: GroupAggregateQuery<Product>,
      requesterToken: string,
      files?: Record<Path<GroupAggregateQuery<Product>>, File>
    ): Promise<Record<string, number | null | undefined>> {
      return apiCall(
        `${this.httpUrl}/activity-tags/rest/group-aggregate`,
        input,
        {
          method: "POST",
          headers: requesterToken
            ? {...this.extraHeaders, Authorization: `Bearer ${requesterToken}`}
            : this.extraHeaders
        },
        files
      ).then((x) => x.json())
    }
  }
}
