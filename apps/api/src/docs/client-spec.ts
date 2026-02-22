export const clientOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Client API',
    version: '1.0.0',
    description: 'Client-facing API for user authentication and profile management. Authentication via user_session cookie.',
  },
  servers: [{ url: 'https://api.develop/api/client' }],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'user_session',
      },
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      LoginInput: {
        type: 'object',
        required: ['email', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
      UpdateProfile: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          password: { type: 'string', minLength: 6 },
        },
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'User login',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
        responses: { 200: { description: 'Login successful, sets user_session cookie' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'User logout',
        responses: { 200: { description: 'Logged out' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current user',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'Current user info' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/profile': {
      get: {
        tags: ['Profile'],
        summary: 'Get user profile',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'User profile' } },
      },
      patch: {
        tags: ['Profile'],
        summary: 'Update user profile',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateProfile' } } } },
        responses: { 200: { description: 'Profile updated' } },
      },
    },
  },
}
