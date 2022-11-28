import {SchemaSet} from "api/genericSdk"

export function generateSchemas(): SchemaSet[] {
  return [
    {
      jsonSchema: {
        $id: "https://example.com/user.schema.json",
        $schema: "http://json-schema.org/schema#",
        title: "User",
        type: "object",
        searchFields: ["email"],
        tableColumns: ["email", "canSeeDataAfter", "isSuperAdmin"],
        endpointName: "user",
        titleFields: ["email"],
        required: ["_id", "email", "isSuperAdmin", "canSeeDataAfter", "sites"],
        uploadEarlyEndpoint: "https://upload.example.com",
        properties: {
          _id: {
            type: "string"
          },
          email: {
            type: "string"
          },
          isSuperAdmin: {
            type: "boolean"
          },
          canSeeDataAfter: {
            type: "string",
            format: "date"
          },
          sites: {
            type: "array",
            items: {
              type: "string"
            }
          }
        }
      },
      uiSchema: {
        sites: {
          items: {
            "ui:widget": "ReferenceWidget",
            "ui:options": {
              reference: "site",
              optionText: "_id"
            }
          }
        }
      }
    },
    {
      jsonSchema: {
        $id: "https://example.com/product.schema.json",
        $schema: "http://json-schema.org/schema#",
        title: "Site",
        type: "object",
        searchFields: ["_id", "name"],
        tableColumns: ["_id", "name", "willScrape"],
        endpointName: "site",
        titleFields: ["_id"],
        required: [
          "_id",
          "title",
          "description",
          "price",
          "createdAt",
          "modifiedAt"
        ],
        properties: {
          _id: {
            type: "string"
          },
          name: {
            type: "string"
          },
          willScrape: {
            type: "boolean"
          },
          scrapeFrequency: {
            type: "string"
          },
          isOnline: {
            type: "boolean"
          },
          doNotScrapeUntil: {
            type: "string",
            format: "date-time"
          },
          claimedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },
      uiSchema: null
    },
    {
      jsonSchema: {
        $id: "https://example.com/tag.schema.json",
        $schema: "http://json-schema.org/schema#",
        title: "Notification",
        type: "object",
        searchFields: ["title"],
        tableColumns: ["title", "timestamp"],
        endpointName: "notifications",
        titleFields: ["title"],
        required: [
          "_id",
          "timestamp",
          "urgent",
          "adminOnly",
          "title",
          "content"
        ],
        properties: {
          _id: {
            type: "string"
          },
          title: {
            type: "string"
          },
          content: {
            type: "string"
          },
          timestamp: {
            type: "string",
            format: "date-time"
          },
          urgent: {
            type: "boolean"
          },
          adminOnly: {
            type: "boolean"
          },
          relatedToSite: {
            type: "string"
          }
        }
      },
      uiSchema: {
        relatedToSite: {
          "ui:widget": "ReferenceWidget",
          "ui:options": {
            reference: "site",
            optionText: "_id"
          }
        }
      }
    }
  ]
}
