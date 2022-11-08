import {SchemaSet} from "api/genericSdk"

export function generateSchemas(): SchemaSet[] {
  return [
    {
      jsonSchema: {
        $id: "https://example.com/user.schema.json",
        $schema: "http://json-schema.org/schema#",
        title: "User",
        type: "object",
        searchFields: ["name", "email", "phone"],
        tableColumns: ["name", "email", "phone"],
        endpointName: "user",
        titleFields: ["name"],
        required: ["_id", "name", "email", "createdAt", "modifiedAt"],
        uploadEarlyEndpoint: "https://upload.example.com",
        properties: {
          _id: {
            type: "string"
          },
          name: {
            type: "string"
          },
          email: {
            type: "string"
          },
          phone: {
            type: "string"
          },
          birthday: {
            type: "string",
            format: "date"
          },
          profilePic: {
            type: "string",
            format: "data-url",
            title: "Profile Picture"
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          modifiedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },
      uiSchema: null
    },
    {
      jsonSchema: {
        $id: "https://example.com/product.schema.json",
        $schema: "http://json-schema.org/schema#",
        title: "Product",
        type: "object",
        searchFields: ["title", "description"],
        tableColumns: ["title", "description", "price"],
        endpointName: "product",
        titleFields: ["title"],
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
          title: {
            type: "string",
            description: "The product's title."
          },
          description: {
            type: "string",
            description: "The product's description."
          },
          price: {
            description: "The price of the product, in dollars.",
            type: "integer",
            minimum: 0
          },
          tags: {
            type: "array",
            items: {
              type: "string"
            }
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          modifiedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },
      uiSchema: {
        tags: {
          items: {
            "ui:widget": "ReferenceWidget",
            "ui:options": {
              reference: "tag",
              optionText: "name"
            }
          }
        }
      }
    },
    {
      jsonSchema: {
        $id: "https://example.com/tag.schema.json",
        $schema: "http://json-schema.org/schema#",
        title: "Tag",
        type: "object",
        searchFields: ["name"],
        tableColumns: ["name"],
        endpointName: "tag",
        titleFields: ["name"],
        required: ["_id", "name", "createdAt", "modifiedAt"],
        properties: {
          _id: {
            type: "string"
          },
          name: {
            type: "string"
          },
          description: {
            type: "string"
          },
          createdAt: {
            type: "string",
            format: "date-time"
          },
          modifiedAt: {
            type: "string",
            format: "date-time"
          }
        }
      },
      uiSchema: null
    }
  ]
}
