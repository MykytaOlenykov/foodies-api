import { formatSwaggerQueryStringSchema } from "./helpers/formatSwaggerQueryStringSchema.js";
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
import {
  paginationSwagger,
  errorResponseSwagger,
} from "./schemas/commonSchemas.js";
import {
  getAllIngredientsQueryStringSwagger,
  getAllIngredientsResponseSwagger,
} from "./schemas/ingredientsSchemas.js";
import {
  getRecipesQueryStringSwagger,
  getRecipesResponseSwagger,
  createRecipeBodySwagger,
  createRecipeResponseSwagger,
  getRecipeByIdResponseSwagger,
  getPopularRecipesResponseSwagger,
  getFavoriteRecipesResponseSwagger,
  addFavoriteRecipeResponseSwagger,
} from "./schemas/recipesSchemas.js";
import { getAllTestimonialsResponseSwagger } from "./schemas/testimonialSchema.js";
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
        parameters: formatSwaggerQueryStringSchema(
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
          400: errorResponseOptions,
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
          400: errorResponseOptions,
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
          204: {
            content: {},
          },
          401: errorResponseOptions,
        },
      },
    },
    "/api/categories": {
      get: {
        tags: ["Categories"],
        parameters: formatSwaggerQueryStringSchema(
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
        parameters: formatSwaggerQueryStringSchema(
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
    "/api/recipes": {
      get: {
        tags: ["Recipes"],
        parameters: formatSwaggerQueryStringSchema(
          getRecipesQueryStringSwagger
        ),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getRecipesResponseSwagger,
              },
            },
          },
        },
      },
      post: {
        tags: ["Recipes"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                ...createRecipeBodySwagger,
                properties: {
                  ...createRecipeBodySwagger.properties,
                  thumb: {
                    type: "string",
                    format: "binary",
                    description: "The file to upload",
                  },
                },
                required: [...createRecipeBodySwagger.required, "thumb"],
              },
            },
          },
        },
        responses: {
          200: {
            content: {
              "application/json": {
                schema: createRecipeResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
        },
      },
    },
    "/api/recipes/:recipeId": {
      get: {
        tags: ["Recipes"],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getRecipeByIdResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          404: errorResponseOptions,
        },
      },
      delete: {
        tags: ["Recipes"],
        security: [{ BearerAuth: [] }],
        responses: {
          204: {
            content: {},
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
          404: errorResponseOptions,
        },
      },
    },
    "/api/recipes/popular": {
      get: {
        tags: ["Recipes"],
        parameters: formatSwaggerQueryStringSchema(paginationSwagger),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getPopularRecipesResponseSwagger,
              },
            },
          },
        },
      },
    },
    "/api/recipes/favorites": {
      get: {
        tags: ["Recipes"],
        security: [{ BearerAuth: [] }],
        parameters: formatSwaggerQueryStringSchema(paginationSwagger),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getFavoriteRecipesResponseSwagger,
              },
            },
          },
          401: errorResponseOptions,
        },
      },
    },
    "/api/recipes/favorites/:recipeId": {
      post: {
        tags: ["Recipes"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: addFavoriteRecipeResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
          404: errorResponseOptions,
        },
      },
      delete: {
        tags: ["Recipes"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: addFavoriteRecipeResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
          404: errorResponseOptions,
        },
      },
    },
    "/api/testimonials": {
      get: {
        tags: ["Testimonials"],
        parameters: formatSwaggerQueryStringSchema(paginationSwagger),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getAllTestimonialsResponseSwagger,
              },
            },
          },
        },
      },
    },
  },
};
