export const formatSwaggerQuerystringSchema = (swaggerQuerySchema) => {
  return Object.entries(swaggerQuerySchema.properties).map(([key, value]) => ({
    name: key,
    in: "query",
    required: swaggerQuerySchema.required?.includes(key) || false,
    schema: value,
    description: value.description || "",
  }));
};
