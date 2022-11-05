import {ModelSchema} from "api/sdk"

export function generateModelSchemas(): ModelSchema[] {
  return [
    {
      modelName: "Product",
      slug: "product",
      schema: JSON.stringify({
        $id: "https://example.com/product.schema.json",
        $schema: "https://json-schema.org/draft/2020-12/schema",
        title: "Product",
        type: "object",
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
      })
    }
  ]
}
