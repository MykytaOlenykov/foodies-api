import { formatSwaggerQuerySchema } from "./helpers/formatSwaggerQuerySchema.js";
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
import {
  followToUserResponseSwagger,
  gatFollowersResponseSwagger,
  gatFollowingResponseSwagger,
  getUserByIdResponseSwagger,
  updateAvatarResponseSwagger,
} from "./schemas/usersSchemas.js";

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
        parameters: formatSwaggerQuerySchema(getAllAreasQueryStringSwagger),
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
          201: {
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
        parameters: formatSwaggerQuerySchema(
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
        parameters: formatSwaggerQuerySchema(
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
        parameters: formatSwaggerQuerySchema(getRecipesQueryStringSwagger),
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
          201: {
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
        parameters: formatSwaggerQuerySchema(paginationSwagger),
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
        parameters: formatSwaggerQuerySchema(paginationSwagger),
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
        parameters: formatSwaggerQuerySchema(paginationSwagger),
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
    "/api/users/avatars": {
      patch: {
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "multipart/form-data": {
              schema: {
                type: "object",
                properties: {
                  avatar: {
                    type: "string",
                    format: "binary",
                    description: "The file to upload",
                  },
                },
                required: ["avatar"],
              },
            },
          },
        },
        responses: {
          200: {
            content: {
              "application/json": {
                schema: updateAvatarResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
          404: errorResponseOptions,
        },
      },
    },
    "/api/users/:userId": {
      get: {
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: getUserByIdResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
          404: errorResponseOptions,
        },
      },
    },
    "/api/users/:userId/followers": {
      get: {
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        parameters: formatSwaggerQuerySchema(paginationSwagger),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: gatFollowersResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
        },
      },
    },
    "/api/users/following": {
      get: {
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        parameters: formatSwaggerQuerySchema(paginationSwagger),
        responses: {
          200: {
            content: {
              "application/json": {
                schema: gatFollowingResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
        },
      },
    },
    "/api/users/following/:userId": {
      post: {
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: followToUserResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
          404: errorResponseOptions,
        },
      },
      delete: {
        tags: ["Users"],
        security: [{ BearerAuth: [] }],
        responses: {
          200: {
            content: {
              "application/json": {
                schema: followToUserResponseSwagger,
              },
            },
          },
          400: errorResponseOptions,
          401: errorResponseOptions,
          404: errorResponseOptions,
        },
      },
    },
  },
};
