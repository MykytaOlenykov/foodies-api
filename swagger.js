import { formatSwaggerQuerystringSchema } from "./helpers/formatSwaggerQuerystringSchema.js";
import {
  getAllAreasQueryStringSwagger,
  getAllAreasResponseSwagger,
} from "./schemas/areasSchemas.js";
import {
  registerSwagger,
  registerResponseSwagger,
  loginSwagger,
  loginResponseSwagger,
  currentResponseSwagger,
} from "./schemas/authSchemas.js";
import {
  getAllCategoriesQueryStringSwagger,
  getAllCategoriesResponseSwagger,
} from "./schemas/categoriesSchemas.js";
import { errorResponseSwagger } from "./schemas/commonSchemas.js";
import {
  getAllIngredientsQueryStringSwagger,
  getAllIngredientsResponseSwagger,
} from "./schemas/ingredientsSchemas.js";
import {} from "./schemas/recipesSchemas.js";
import {} from "./schemas/testimonialSchema.js";
import {} from "./schemas/usersSchemas.js";

const errorResponseOptions = {
  content: {
    "application/json": {
      schema: errorResponseSwagger,
    },
  },
};

export const swaggerOptions = {
  openapi: "3.0.0",
  info: {
    title: "Foodies API",
    version: "1.0.0",
  },
  paths: {
    "/api/areas": {
      get: {
        tags: ["Areas"],
        parameters: formatSwaggerQuerystringSchema(
          getAllAreasQueryStringSwagger
        ),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getAllAreasResponseSwagger,
              },
            },
          },
        },
      },
    },
    "/api/auth/register": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: registerSwagger,
            },
          },
        },
        responses: {
          200: {
            content: {
              "application/json": {
                schema: registerResponseSwagger,
              },
            },
          },
          409: errorResponseOptions,
        },
      },
    },
    "/api/auth/login": {
      post: {
        tags: ["Auth"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: loginSwagger,
            },
          },
        },
        responses: {
          200: {
            content: {
              "application/json": {
                schema: loginResponseSwagger,
              },
            },
          },
          401: errorResponseOptions,
        },
      },
    },
    "/api/auth/current": {
      get: {
        tags: ["Auth"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: currentResponseSwagger,
              },
            },
          },
          401: errorResponseOptions,
        },
      },
    },
    "/api/auth/logout": {
      post: {
        tags: ["Auth"],
        security: [{ BearerAuth: [] }],
        responses: {
          204: {},
          401: errorResponseOptions,
        },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        parameters: formatSwaggerQuerystringSchema(
          getAllCategoriesQueryStringSwagger
        ),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getAllCategoriesResponseSwagger,
              },
            },
          },
        },
      },
    },
    "/api/ingredients": {
      get: {
        tags: ["Ingredients"],
        parameters: formatSwaggerQuerystringSchema(
          getAllIngredientsQueryStringSwagger
        ),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getAllIngredientsResponseSwagger,
              },
            },
          },
        },
      },
    },
  },
};
