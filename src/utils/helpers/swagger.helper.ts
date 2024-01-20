import { OpenAPIObject } from '@nestjs/swagger';
const pathMethods = ['get', 'post', 'put', 'patch', 'delete'] as const;

const generalResponses = {
  404: { description: 'Not found' },
  500: { description: 'Server error' },
};

const authResponses = {
  401: { description: 'Not authenticated' },
  403: { description: 'Access denied' },
};

const deleteResponses = {
  204: { description: 'No content' },
};

const postAndPutResponses = {
  400: { description: 'Bad request' },
};

export class SwaggerHelper {
  static setDefaultResponses(document: OpenAPIObject): void {
    for (const path of Object.keys(document.paths)) {
      for (const method of pathMethods) {
        const route = document.paths[path]?.[method];

        if (route) {
          Object.assign(route.responses, generalResponses);

          if (route.security) {
            Object.assign(route.responses, authResponses);
          }

          if (method === 'put' || method === 'post') {
            Object.assign(route.responses, postAndPutResponses);
          }

          if (method === 'delete') {
            Object.assign(route.responses, deleteResponses);
            delete route.responses[200];
          }
        }
      }
    }
  }
}
