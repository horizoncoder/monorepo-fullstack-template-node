export const adminOpenApiSpec = {
  openapi: '3.0.0',
  info: {
    title: 'Admin API',
    version: '1.0.0',
    description: 'Admin panel API for managing users, administrators, roles and permissions. Authentication via admin_session cookie.',
  },
  servers: [{ url: 'https://api.develop/api/admin' }],
  components: {
    securitySchemes: {
      cookieAuth: {
        type: 'apiKey',
        in: 'cookie',
        name: 'admin_session',
      },
    },
    schemas: {
      Permission: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          key: { type: 'string', example: 'users.read' },
          name: { type: 'string', example: 'View Users' },
          description: { type: 'string' },
          group: { type: 'string', example: 'Users' },
        },
      },
      Role: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          name: { type: 'string', example: 'Editor' },
          description: { type: 'string' },
          permissions: { type: 'array', items: { type: 'string' } },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Admin: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          roles: { type: 'array', items: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' } } } },
          permissions: { type: 'array', items: { type: 'string' }, description: 'Resolved from roles' },
          isSuperuser: { type: 'boolean' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
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
      CreateUser: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          password: { type: 'string', minLength: 6 },
        },
      },
      CreateAdmin: {
        type: 'object',
        required: ['email', 'name', 'password'],
        properties: {
          email: { type: 'string', format: 'email' },
          name: { type: 'string' },
          password: { type: 'string', minLength: 6 },
          roleIds: { type: 'array', items: { type: 'string', format: 'uuid' } },
          isSuperuser: { type: 'boolean' },
        },
      },
      CreateRole: {
        type: 'object',
        required: ['name'],
        properties: {
          name: { type: 'string' },
          description: { type: 'string' },
          permissions: { type: 'array', items: { type: 'string' } },
        },
      },
      Stats: {
        type: 'object',
        properties: {
          usersCount: { type: 'number' },
          adminsCount: { type: 'number' },
          rolesCount: { type: 'number' },
        },
      },
    },
  },
  paths: {
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Admin login',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } },
        responses: { 200: { description: 'Login successful, sets admin_session cookie' }, 401: { description: 'Invalid credentials' } },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Admin logout',
        responses: { 200: { description: 'Logged out' } },
      },
    },
    '/auth/me': {
      get: {
        tags: ['Auth'],
        summary: 'Get current admin with roles and resolved permissions',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'Current admin info' }, 401: { description: 'Unauthorized' } },
      },
    },
    '/permissions': {
      get: {
        tags: ['Permissions'],
        summary: 'List all available permissions',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'List of all permissions grouped by category' } },
      },
    },
    '/roles': {
      get: {
        tags: ['Roles'],
        summary: 'List all roles with their permissions',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'List of roles' } },
      },
      post: {
        tags: ['Roles'],
        summary: 'Create a role',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateRole' } } } },
        responses: { 201: { description: 'Role created' }, 409: { description: 'Name already exists' } },
      },
    },
    '/roles/{id}': {
      get: {
        tags: ['Roles'],
        summary: 'Get role by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Role details with permissions' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Roles'],
        summary: 'Update role (name, description, permissions)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Role updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Roles'],
        summary: 'Delete role',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Role deleted' }, 404: { description: 'Not found' } },
      },
    },
    '/users': {
      get: {
        tags: ['Users'],
        summary: 'List all users',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'List of users' } },
      },
      post: {
        tags: ['Users'],
        summary: 'Create a user',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateUser' } } } },
        responses: { 201: { description: 'User created' }, 409: { description: 'Email already exists' } },
      },
    },
    '/users/{id}': {
      get: {
        tags: ['Users'],
        summary: 'Get user by ID',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'User details' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Users'],
        summary: 'Update user',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'User updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Users'],
        summary: 'Delete user',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'User deleted' }, 404: { description: 'Not found' } },
      },
    },
    '/admins': {
      get: {
        tags: ['Admins'],
        summary: 'List all admins with roles',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'List of admins' } },
      },
      post: {
        tags: ['Admins'],
        summary: 'Create an admin with role assignments',
        security: [{ cookieAuth: [] }],
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateAdmin' } } } },
        responses: { 201: { description: 'Admin created' }, 409: { description: 'Email already exists' } },
      },
    },
    '/admins/{id}': {
      get: {
        tags: ['Admins'],
        summary: 'Get admin by ID with roles and permissions',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Admin details' }, 404: { description: 'Not found' } },
      },
      patch: {
        tags: ['Admins'],
        summary: 'Update admin (profile, roles, superuser)',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Admin updated' }, 404: { description: 'Not found' } },
      },
      delete: {
        tags: ['Admins'],
        summary: 'Delete admin',
        security: [{ cookieAuth: [] }],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
        responses: { 200: { description: 'Admin deleted' }, 404: { description: 'Not found' } },
      },
    },
    '/stats': {
      get: {
        tags: ['Stats'],
        summary: 'Get dashboard statistics',
        security: [{ cookieAuth: [] }],
        responses: { 200: { description: 'Dashboard stats' } },
      },
    },
  },
}
