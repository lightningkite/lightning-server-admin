import {LKSchema} from "utils/models"

export function generateSchemas(): LKSchema[] {
  return [
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
