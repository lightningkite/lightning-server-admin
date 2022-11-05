import {LKSchema} from "utils/models"

export function generateSchemas(): LKSchema[] {
  return [
    {
      $id: "https://example.com/product.schema.json",
      $schema: "http://json-schema.org/schema#",
      title: "User",
      type: "object",
      searchFields: ["name", "email"],
      tableColumns: ["name", "email", "phone"],
      endpointName: "user",
      titleFields: ["name"],
      properties: {
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
          type: "string"
        },
        profilePic: {
          type: "string",
          format: "data-url",
          title: "Profile Picture"
        }
      }
    },
    {
      $id: "https://example.com/product.schema.json",
      $schema: "http://json-schema.org/schema#",
      title: "Product",
      type: "object",
      searchFields: ["title", "description"],
      tableColumns: ["title", "description", "price"],
      endpointName: "product",
      titleFields: ["title"],
      properties: {
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
        }
      }
    }
  ]
}
