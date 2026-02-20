export const swaggerSpec = {
  openapi: '3.0.1',
  info: {
    title: 'Money Guard API',
    version: '1.0.0',
    description: 'Auth + Transactions endpoints for Money Guard',
  },
  servers: [{ url: 'http://localhost:4000' }],
  paths: {
    '/api/health': {
      get: {
        summary: 'Health check',
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/auth/login': {
      post: {
        summary: 'User login',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: {
            type: 'object',
            properties: { email: { type: 'string' }, password: { type: 'string' } },
            required: ['email','password']
          } } }
        },
        responses: { '200': { description: 'Logged in' } }
      }
    },
    '/api/auth/register': {
      post: {
        summary: 'User registration',
        requestBody: {
          required: true,
          content: { 'application/json': { schema: {
            type: 'object',
            properties: { name:{type:'string'}, email:{type:'string'}, password:{type:'string'} },
            required: ['email','password']
          } } }
        },
        responses: { '201': { description: 'Created' } }
      }
    },
    '/api/transactions': {
      get: { summary: 'List transactions', responses: { '200': { description: 'OK' } } },
      post: {
        summary: 'Create transaction',
        requestBody: { required: true, content: { 'application/json': { schema: {
          type: 'object',
          properties: { type:{type:'string',enum:['INCOME','EXPENSE']}, amount:{type:'number'}, category:{type:'string'}, date:{type:'string'}, comment:{type:'string'} },
          required: ['type','amount']
        } } } },
        responses: { '201': { description: 'Created' } }
      }
    }
  }
};
