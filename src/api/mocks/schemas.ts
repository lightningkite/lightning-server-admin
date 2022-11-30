// @ts-nocheck

import {LKSchema} from "api/genericSdk"

export function generateLKSchema(): LKSchema {
  return {
    uploadEarlyEndpoint: "https://jivie.lightningkite.com/upload",
    definitions: {
      "com.lightningkite.lightningserver.demo.User": {
        title: "User",
        type: ["object"],
        properties: {
          _id: {title: " Id", type: ["string"]},
          email: {title: "Email", type: ["string"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningserver.auth.EmailPinLogin": {
        title: "Email Pin Login",
        type: ["object"],
        properties: {
          email: {title: "Email", type: ["string"]},
          pin: {title: "Pin", type: ["string"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningserver.files.UploadInformation": {
        title: "Upload Information",
        type: ["object"],
        properties: {
          uploadUrl: {title: "Upload Url", type: ["string"]},
          futureCallToken: {title: "Future Call Token", type: ["string"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>":
        {type: ["object"]},
      "com.lightningkite.lightningdb.Query": {
        title: "Query",
        type: ["object"],
        properties: {
          condition: {
            $ref: "#/definitions/com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>",
            title: "Condition"
          },
          orderBy: {
            title: "Order By",
            type: ["array"],
            items: {type: ["string"]}
          },
          skip: {title: "Skip", type: ["number"]},
          limit: {title: "Limit", type: ["number"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "java.time.Instant": {type: ["string"], format: "datetime-local"},
      ServerFile: {
        type: ["string"],
        options: {
          upload: {upload_handler: "mainUploadHandler", auto_upload: true}
        },
        format: "url",
        links: [{href: "{{self}}", rel: "View File"}]
      },
      "com.lightningkite.lightningserver.demo.Status": {
        type: ["string"],
        enum: ["DRAFT", "PUBLISHED"],
        enumLabels: ["Draft", "Published"]
      },
      "com.lightningkite.lightningserver.demo.TestModel": {
        title: "Test Model",
        type: ["object"],
        properties: {
          _id: {title: " Id", type: ["string"]},
          timestamp: {
            $ref: "#/definitions/java.time.Instant",
            title: "Timestamp"
          },
          name: {title: "Name", type: ["string"]},
          number: {title: "Number", type: ["number"]},
          content: {title: "Content", type: ["string"]},
          file: {
            title: "File",
            anyOf: [{$ref: "#/definitions/ServerFile"}, {type: ["null"]}]
          },
          status: {
            $ref: "#/definitions/com.lightningkite.lightningserver.demo.Status",
            title: "Status"
          }
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningdb.Modification<com.lightningkite.lightningserver.demo.TestModel>":
        {type: ["object"]},
      "com.lightningkite.lightningdb.MassModification": {
        title: "Mass Modification",
        type: ["object"],
        properties: {
          condition: {
            $ref: "#/definitions/com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>",
            title: "Condition"
          },
          modification: {
            $ref: "#/definitions/com.lightningkite.lightningdb.Modification<com.lightningkite.lightningserver.demo.TestModel>",
            title: "Modification"
          }
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningdb.EntryChange": {
        title: "Entry Change",
        type: ["object"],
        properties: {
          old: {
            title: "Old",
            anyOf: [
              {
                $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
              },
              {type: ["null"]}
            ]
          },
          new: {
            title: "New",
            anyOf: [
              {
                $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
              },
              {type: ["null"]}
            ]
          }
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningdb.GroupCountQuery": {
        title: "Group Count Query",
        type: ["object"],
        properties: {
          condition: {
            $ref: "#/definitions/com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>",
            title: "Condition"
          },
          groupBy: {title: "Group By", type: ["string"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningdb.Aggregate": {
        type: ["string"],
        enum: [
          "Sum",
          "Average",
          "StandardDeviationSample",
          "StandardDeviationPopulation"
        ],
        enumLabels: [
          "Sum",
          "Average",
          "Standard Deviation Sample",
          "Standard Deviation Population"
        ]
      },
      "com.lightningkite.lightningdb.AggregateQuery": {
        title: "Aggregate Query",
        type: ["object"],
        properties: {
          aggregate: {
            $ref: "#/definitions/com.lightningkite.lightningdb.Aggregate",
            title: "Aggregate"
          },
          condition: {
            $ref: "#/definitions/com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>",
            title: "Condition"
          },
          property: {title: "Property", type: ["string"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningdb.GroupAggregateQuery": {
        title: "Group Aggregate Query",
        type: ["object"],
        properties: {
          aggregate: {
            $ref: "#/definitions/com.lightningkite.lightningdb.Aggregate",
            title: "Aggregate"
          },
          condition: {
            $ref: "#/definitions/com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>",
            title: "Condition"
          },
          groupBy: {title: "Group By", type: ["string"]},
          property: {title: "Property", type: ["string"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningserver.serverhealth.ServerHealth.Memory": {
        title: "Memory",
        type: ["object"],
        properties: {
          max: {title: "Max", type: ["number"]},
          total: {title: "Total", type: ["number"]},
          free: {title: "Free", type: ["number"]},
          systemAllocated: {title: "System Allocated", type: ["number"]},
          usage: {title: "Usage", type: ["number"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningserver.serverhealth.HealthStatus.Level": {
        type: ["string"],
        enum: ["OK", "WARNING", "URGENT", "ERROR"],
        enumLabels: ["OK", "WARNING", "URGENT", "ERROR"]
      },
      "com.lightningkite.lightningserver.serverhealth.HealthStatus": {
        title: "Health Status",
        type: ["object"],
        properties: {
          level: {
            $ref: "#/definitions/com.lightningkite.lightningserver.serverhealth.HealthStatus.Level",
            title: "Level"
          },
          checkedAt: {
            $ref: "#/definitions/java.time.Instant",
            title: "Checked At"
          },
          additionalMessage: {
            title: "Additional Message",
            anyOf: [{type: ["string"]}, {type: ["null"]}]
          }
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningserver.serverhealth.ServerHealth": {
        title: "Server Health",
        type: ["object"],
        properties: {
          serverId: {title: "Server Id", type: ["string"]},
          version: {title: "Version", type: ["string"]},
          memory: {
            $ref: "#/definitions/com.lightningkite.lightningserver.serverhealth.ServerHealth.Memory",
            title: "Memory"
          },
          features: {
            title: "Features",
            type: ["object"],
            additionalProperties: {
              $ref: "#/definitions/com.lightningkite.lightningserver.serverhealth.HealthStatus"
            }
          },
          loadAverageCpu: {title: "Load Average Cpu", type: ["number"]}
        },
        additionalProperties: {type: ["null"]}
      },
      "com.lightningkite.lightningserver.metrics.MetricSpanStats": {
        title: "Metric Span Stats",
        type: ["object"],
        properties: {
          _id: {title: " Id", type: ["string"]},
          endpoint: {title: "Endpoint", type: ["string"]},
          type: {title: "Type", type: ["string"]},
          timeStamp: {
            $ref: "#/definitions/java.time.Instant",
            title: "Time Stamp"
          },
          timeSpan: {title: "Time Span", type: ["string"]},
          min: {title: "Min", type: ["number"]},
          max: {title: "Max", type: ["number"]},
          sum: {title: "Sum", type: ["number"]},
          count: {title: "Count", type: ["number"]}
        },
        additionalProperties: {type: ["null"]}
      }
    },
    endpoints: [
      {
        group: "Auth",
        method: "GET",
        path: "/auth/refresh-token",
        routes: {},
        input: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        },
        output: {type: ["string"]}
      },
      {
        group: "Auth",
        method: "GET",
        path: "/auth/self",
        routes: {},
        input: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.User"
        }
      },
      {
        group: "Auth",
        method: "POST",
        path: "/auth/login-email",
        routes: {},
        input: {type: ["string"]},
        output: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        }
      },
      {
        group: "Auth",
        method: "POST",
        path: "/auth/login-email-pin",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningserver.auth.EmailPinLogin"
        },
        output: {type: ["string"]}
      },
      {
        method: "GET",
        path: "/upload",
        routes: {},
        input: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningserver.files.UploadInformation"
        }
      },
      {
        group: "TestModel",
        method: "GET",
        path: "/test-model/rest",
        routes: {},
        input: {$ref: "#/definitions/com.lightningkite.lightningdb.Query"},
        output: {
          type: ["array"],
          items: {
            $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
          }
        }
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest/query",
        routes: {},
        input: {$ref: "#/definitions/com.lightningkite.lightningdb.Query"},
        output: {
          type: ["array"],
          items: {
            $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
          }
        }
      },
      {
        group: "TestModel",
        method: "GET",
        path: "/test-model/rest/{id}",
        routes: {id: {type: ["string"]}},
        input: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
        }
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest/bulk",
        routes: {},
        input: {
          type: ["array"],
          items: {
            $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
          }
        },
        output: {
          type: ["array"],
          items: {
            $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
          }
        }
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
        }
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest/{id}",
        routes: {id: {type: ["string"]}},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
        }
      },
      {
        group: "TestModel",
        method: "PUT",
        path: "/test-model/rest",
        routes: {},
        input: {
          type: ["array"],
          items: {
            $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
          }
        },
        output: {
          type: ["array"],
          items: {
            $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
          }
        }
      },
      {
        group: "TestModel",
        method: "PUT",
        path: "/test-model/rest/{id}",
        routes: {id: {type: ["string"]}},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
        }
      },
      {
        group: "TestModel",
        method: "PATCH",
        path: "/test-model/rest/bulk",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.MassModification"
        },
        output: {type: ["number"]}
      },
      {
        group: "TestModel",
        method: "PATCH",
        path: "/test-model/rest/{id}/delta",
        routes: {id: {type: ["string"]}},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.Modification<com.lightningkite.lightningserver.demo.TestModel>"
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningdb.EntryChange"
        }
      },
      {
        group: "TestModel",
        method: "PATCH",
        path: "/test-model/rest/{id}",
        routes: {id: {type: ["string"]}},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.Modification<com.lightningkite.lightningserver.demo.TestModel>"
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel"
        }
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest/bulk-delete",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>"
        },
        output: {type: ["number"]}
      },
      {
        group: "TestModel",
        method: "DELETE",
        path: "/test-model/rest/{id}",
        routes: {id: {type: ["string"]}},
        input: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        },
        output: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        }
      },
      {
        group: "TestModel",
        method: "GET",
        path: "/test-model/rest/count",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>"
        },
        output: {type: ["number"]}
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest/count",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.Condition<com.lightningkite.lightningserver.demo.TestModel>"
        },
        output: {type: ["number"]}
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest/group-count",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.GroupCountQuery"
        },
        output: {type: ["object"], additionalProperties: {type: ["number"]}}
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest/aggregate",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.AggregateQuery"
        },
        output: {anyOf: [{type: ["number"]}, {type: ["null"]}]}
      },
      {
        group: "TestModel",
        method: "POST",
        path: "/test-model/rest/group-aggregate",
        routes: {},
        input: {
          $ref: "#/definitions/com.lightningkite.lightningdb.GroupAggregateQuery"
        },
        output: {
          type: ["object"],
          additionalProperties: {anyOf: [{type: ["number"]}, {type: ["null"]}]}
        }
      },
      {
        method: "GET",
        path: "/test-primitive",
        routes: {},
        input: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        },
        output: {type: ["string"]}
      },
      {
        method: "GET",
        path: "/meta/health",
        routes: {},
        input: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        },
        output: {
          $ref: "#/definitions/com.lightningkite.lightningserver.serverhealth.ServerHealth"
        }
      },
      {
        method: "GET",
        path: "/metrics",
        routes: {},
        input: {$ref: "#/definitions/com.lightningkite.lightningdb.Query"},
        output: {
          type: ["array"],
          items: {
            $ref: "#/definitions/com.lightningkite.lightningserver.metrics.MetricSpanStats"
          }
        }
      },
      {
        method: "GET",
        path: "/metrics/clear",
        routes: {},
        input: {
          type: ["object"],
          properties: {},
          additionalProperties: {type: ["null"]}
        },
        output: {type: ["string"]}
      }
    ],
    models: {
      "test-model": {
        $ref: "#/definitions/com.lightningkite.lightningserver.demo.TestModel",
        url: "https://jivie.lightningkite.com/test-model/rest",
        searchFields: ["name", "content"],
        tableColumns: ["name", "number", "status"],
        titleFields: ["name"]
      }
    }
  }
  // return {
  //   uploadEarlyEndpoint: "http://www.example.com/upload",
  //   definitions: {
  //     foo: {
  //       type: "object"
  //     }
  //   },
  //   endpoints: [],
  //   models: {
  //     user: {
  //       $id: "https://example.com/user.schema.json",
  //       $schema: "http://json-schema.org/schema#",
  //       title: "User",
  //       type: "object",
  //       permissions: null,
  //       searchFields: ["name", "email", "phone"],
  //       tableColumns: ["name", "email", "phone"],
  //       endpointName: "user",
  //       titleFields: ["name"],
  //       required: ["_id", "name", "email", "createdAt", "modifiedAt"],
  //       uploadEarlyEndpoint: "https://upload.example.com",
  //       properties: {
  //         _id: {
  //           type: "string"
  //         },
  //         name: {
  //           type: "string"
  //         },
  //         email: {
  //           type: "string"
  //         },
  //         phone: {
  //           type: "string"
  //         },
  //         birthday: {
  //           type: "string",
  //           format: "date"
  //         },
  //         profilePic: {
  //           type: "string",
  //           format: "data-url",
  //           title: "Profile Picture"
  //         },
  //         createdAt: {
  //           type: "string",
  //           format: "date-time"
  //         },
  //         modifiedAt: {
  //           type: "string",
  //           format: "date-time"
  //         }
  //       }
  //     }
  //   }
  // }
}

// return [
//   {
//     jsonSchema: {
//       $id: "https://example.com/user.schema.json",
//       $schema: "http://json-schema.org/schema#",
//       title: "User",
//       type: "object",
//       searchFields: ["email"],
//       tableColumns: ["email", "canSeeDataAfter", "isSuperAdmin"],
//       endpointName: "user",
//       titleFields: ["email"],
//       required: ["_id", "email", "isSuperAdmin", "canSeeDataAfter", "sites"],
//       uploadEarlyEndpoint: "https://upload.example.com",
//       properties: {
//         _id: {
//           type: "string"
//         },
//         email: {
//           type: "string"
//         },
//         isSuperAdmin: {
//           type: "boolean"
//         },
//         canSeeDataAfter: {
//           type: "string",
//           format: "date"
//         },
//         sites: {
//           type: "array",
//           items: {
//             type: "string"
//           }
//         }
//       }
//     },
//     uiSchema: {
//       sites: {
//         items: {
//           "ui:widget": "ReferenceWidget",
//           "ui:options": {
//             reference: "site",
//             optionText: "_id"
//           }
//         }
//       }
//     }
//   },
//   {
//     jsonSchema: {
//       $id: "https://example.com/product.schema.json",
//       $schema: "http://json-schema.org/schema#",
//       title: "Site",
//       type: "object",
//       searchFields: ["_id", "name"],
//       tableColumns: ["_id", "name", "willScrape"],
//       endpointName: "site",
//       titleFields: ["_id"],
//       required: [
//         "_id",
//         "title",
//         "description",
//         "price",
//         "createdAt",
//         "modifiedAt"
//       ],
//       properties: {
//         _id: {
//           type: "string"
//         },
//         name: {
//           type: "string"
//         },
//         willScrape: {
//           type: "boolean"
//         },
//         scrapeFrequency: {
//           type: "string"
//         },
//         isOnline: {
//           type: "boolean"
//         },
//         doNotScrapeUntil: {
//           type: "string",
//           format: "date-time"
//         },
//         claimedAt: {
//           type: "string",
//           format: "date-time"
//         }
//       }
//     },
//     uiSchema: null
//   },
//   {
//     jsonSchema: {
//       $id: "https://example.com/tag.schema.json",
//       $schema: "http://json-schema.org/schema#",
//       title: "Notification",
//       type: "object",
//       searchFields: ["title"],
//       tableColumns: ["title", "timestamp"],
//       endpointName: "notifications",
//       titleFields: ["title"],
//       required: [
//         "_id",
//         "timestamp",
//         "urgent",
//         "adminOnly",
//         "title",
//         "content"
//       ],
//       properties: {
//         _id: {
//           type: "string"
//         },
//         title: {
//           type: "string"
//         },
//         content: {
//           type: "string"
//         },
//         timestamp: {
//           type: "string",
//           format: "date-time"
//         },
//         urgent: {
//           type: "boolean"
//         },
//         adminOnly: {
//           type: "boolean"
//         },
//         relatedToSite: {
//           type: "string"
//         }
//       }
//     },
//     uiSchema: {
//       relatedToSite: {
//         "ui:widget": "ReferenceWidget",
//         "ui:options": {
//           reference: "site",
//           optionText: "_id"
//         }
//       }
//     }
//   }
// ]
