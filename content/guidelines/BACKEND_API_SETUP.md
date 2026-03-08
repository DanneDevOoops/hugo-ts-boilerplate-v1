---
title: 'Backend API Setup'
description: 'Best practices and example implementations for building a backend API to work with your Hugo frontend.'
draft: false
---

- [GraphQL Best Practices](https://graphql.org/learn/best-practices/)
- [REST API Best Practices](https://restfulapi.net/)
- [HTTP Caching Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching)
- [Fastify Docs](https://www.fastify.io/)
- [Express.js Docs](https://expressjs.com/)

## Resources

- **Docker** (custom infrastructure)
- **AWS Lambda** (serverless)
- **Heroku** (traditional PaaS)
- **Railway** (simple PaaS)
- **Vercel** (serverless, best for Node.js)
  Consider deploying to:

## Deployment

````
});
  next();
  res.header('X-XSS-Protection', '1; mode=block');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-Content-Type-Options', 'nosniff');
app.use((req, res, next) => {
// Additional CORS headers

app.use(helmet());

import helmet from 'helmet';
```typescript

## Security Headers

````

});
next();
});
timestamp: new Date(),
path: req.path,
method: req.method,
logger.info({
app.use((req, res, next) => {
// Log API requests

});
],
new winston.transports.File({ filename: 'combined.log' }),
new winston.transports.File({ filename: 'error.log', level: 'error' }),
transports: [
format: winston.format.json(),
level: process.env.LOG_LEVEL || 'info',
const logger = winston.createLogger({

import winston from 'winston';
// Structured logging

```typescript

## Monitoring & Logging

6. **Use connection pooling** for databases
5. **Monitor query performance**
4. **Set appropriate cache headers**
3. **Implement response compression** (gzip)
2. **Use pagination** for list endpoints
1. **Add database indexes** on frequently queried fields

## Performance Optimization

```

});
});
expect(response.body.data.id).toBeDefined();
expect(response.status).toBe(201);

    });
      email: 'test@example.com',
      name: 'Test User',
    const response = await request(app).post('/api/users').send({

it('POST /api/users should create a new user', async () => {

});
expect(response.headers['cache-control']).toContain('public');
expect(response.body.data).toBeInstanceOf(Array);
expect(response.status).toBe(200);

    const response = await request(app).get('/api/users');

it('GET /api/users should return users list', async () => {
describe('Users API', () => {

import app from '../server';
import request from 'supertest';
// src/**tests**/users.test.ts

```typescript

## Testing the Backend

```

NODE_ENV=development
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:1313
DATABASE_URL=postgresql://user:password@localhost:5432/hugo_db
PORT=3000

# .env

```bash

## Environment Configuration

```

});
// ...
// Only authenticated users can create
app.post('/api/users', authMiddleware, (req, res) => {
// Protect routes

}
}
return res.status(401).json({ error: 'Invalid token' });
} catch (error) {
next();
(req as any).user = decoded;
const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
try {

}
return res.status(401).json({ error: 'No token provided' });
if (!token) {

const token = req.headers.authorization?.split(' ')[1];
export function authMiddleware(req: Request, res: Response, next: Function) {

import jwt from 'jsonwebtoken';
// src/middleware/auth.ts

```typescript

## Authentication

```

app.use('/api/', apiLimiter);
// Apply to routes

});
legacyHeaders: false,
standardHeaders: true,
message: 'Too many requests, please try again later.',
max: 100, // Limit each IP to 100 requests per windowMs
windowMs: 15 _ 60 _ 1000, // 15 minutes
export const apiLimiter = rateLimit({

import rateLimit from 'express-rate-limit';
// src/middleware/rateLimit.ts

```typescript

## Rate Limiting

```

const server = new ApolloServer({ typeDefs, resolvers });

};
},
},
return { id: '1', name, email, createdAt: new Date().toISOString() };
// Insert into database
createUser: async (_, { name, email }: { name: string; email: string }) => {
Mutation: {
},
},
return null;
// Query database
user: async (_, { id }: { id: string }) => {
},
return [];
// Query database
users: async () => {
Query: {
const resolvers = {

`;
}
deleteUser(id: String!): Boolean!
updateUser(id: String!, name: String, email: String): User
createUser(name: String!, email: String!): User!
type Mutation {

}
user(id: String!): User
users: [User!]!
type Query {

}
createdAt: String!
email: String!
name: String!
id: String!
type User {
const typeDefs = gql`

import { ApolloServer, gql } from 'apollo-server-express';
// src/schema.ts

```typescript

```

npm install apollo-server graphql

```bash

If you prefer GraphQL over REST:

## GraphQL Alternative

```

});
console.log(`Server listening on ${address}`);
if (err) throw err;
app.listen({ port: 3000 }, (err, address) => {

});
},
};
timestamp: new Date().toISOString(),
status: 200,
data: users,
return {

    const users: User[] = [];
    // Query database

    reply.header('Cache-Control', 'public, max-age=300');

handler: async (request, reply) => {
},
},
},
},
},
items: { $ref: '#/definitions/User' },
type: 'array',
data: {
properties: {
type: 'object',
200: {
response: {
schema: {
app.get('/api/users', {
// Routes

}
createdAt: string;
email: string;
name: string;
id: string;
interface User {
// Types

});
origin: process.env.FRONTEND_URL || 'http://localhost:1313',
await app.register(cors, {

const app = fastify({ logger: true });

import cors from '@fastify/cors';
import fastify from 'fastify';
// src/server.ts

```typescript

```

npm install fastify @fastify/cors

```bash

## Fastify Backend Example (Lightweight Alternative)

```

}
await pool.query('DELETE FROM users WHERE id = $1', [id]);
export async function deleteUser(id: string) {

}
return result.rows[0];
const result = await pool.query(query, [...values, id]);

const query = `UPDATE users SET ${setClause} WHERE id = $${keys.length + 1} RETURNING *`;
const setClause = keys.map((key, i) => `${key} = $${i + 1}`).join(', ');

const values = Object.values(updates);
const keys = Object.keys(updates);
export async function updateUser(id: string, updates: Record<string, unknown>) {

}
return result.rows[0];
);
[name, email]
'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING \*',
const result = await pool.query(
export async function createUser(name: string, email: string) {

}
return result.rows[0];
);
[id]
'SELECT \* FROM users WHERE id = $1',
const result = await pool.query(
export async function getUser(id: string) {

import { pool } from '../db/client';
// src/services/user.service.ts

});
connectionString: process.env.DATABASE_URL,
export const pool = new Pool({

import { Pool } from 'pg';
// src/db/client.ts

```typescript

### Database Integration Example (PostgreSQL)

```

});
console.log(`Server running at http://localhost:${PORT}`);
app.listen(PORT, () => {

});
});
timestamp: new Date().toISOString(),
status: 404,
},
message: 'Resource not found',
code: 'NOT_FOUND',
error: {
res.status(404).json({
app.use((req: Request, res: Response) => {
// Error handling

});
res.status(204).send();
const { id } = req.params;
app.delete('/api/users/:id', (req: Request, res: Response) => {

});
});
timestamp: new Date().toISOString(),
status: 200,
data: updatedUser,
res.json({

};
createdAt: '2024-01-01T00:00:00Z',
email: updates.email || 'john@example.com',
name: updates.name || 'John',
id,
const updatedUser = {

const updates = req.body;
const { id } = req.params;
app.patch('/api/users/:id', (req: Request, res: Response) => {

});
});
timestamp: new Date().toISOString(),
status: 201,
data: newUser,
res.status(201).json({

}
idempotencyCache.set(idempotencyKey as string, newUser);
if (idempotencyKey) {
const idempotencyKey = req.headers['idempotency-key'];
// Cache idempotent response

};
createdAt: new Date().toISOString(),
email,
name,
id: Math.random().toString(36).substr(2, 9),
const newUser = {

}
});
timestamp: new Date().toISOString(),
status: 400,
},
message: 'Name and email are required',
code: 'VALIDATION_ERROR',
error: {
return res.status(400).json({
if (!name || !email) {
// Validation

const { name, email } = req.body;
app.post('/api/users', idempotencyMiddleware, (req: Request, res: Response) => {

});
});
timestamp: new Date().toISOString(),
status: 200,
data: user,
res.json({

};
createdAt: '2024-01-01T00:00:00Z',
email: 'john@example.com',
name: 'John',
id,
const user = {

const { id } = req.params;
app.get('/api/users/:id', cacheMiddleware(300), (req: Request, res: Response) => {

});
});
timestamp: new Date().toISOString(),
status: 200,
data: users,
res.json({

];
{ id: '2', name: 'Jane', email: 'jane@example.com' },
{ id: '1', name: 'John', email: 'john@example.com' },
const users = [
// Simulate database query
app.get('/api/users', cacheMiddleware(300), (req: Request, res: Response) => {
// Users endpoints

});
res.json({ status: 'ok', timestamp: new Date().toISOString() });
app.get('/api/health', (req: Request, res: Response) => {
// API Routes

};
next();

}
return res.json(idempotencyCache.get(idempotencyKey as string));
if (idempotencyCache.has(idempotencyKey as string)) {

}
return next();
if (!idempotencyKey) {

const idempotencyKey = req.headers['idempotency-key'];
) => {
next: Function
res: Response,
req: Request,
const idempotencyMiddleware = (

const idempotencyCache = new Map<string, Response>();
// Idempotency middleware

};
next();
}
res.set('Cache-Control', 'no-cache');
} else {
res.set('Cache-Control', `public, max-age=${maxAge}`);
if (req.method === 'GET') {
) => {
next: Function
res: Response,
req: Request,
const cacheMiddleware = (maxAge: number) => (
// Cache headers middleware

app.use(express.json());
}));
credentials: true,
origin: process.env.FRONTEND_URL || 'http://localhost:1313',
app.use(cors({
// Middleware

const PORT = process.env.PORT || 3000;
const app: Express = express();

dotenv.config();

import dotenv from 'dotenv';
import cors from 'cors';
import express, { Express, Request, Response } from 'express';
// src/server.ts

```typescript

### Server Implementation

```

npm install --save-dev typescript @types/express @types/node
npm install express cors dotenv

```bash

### Basic Setup

## Express.js Backend Example

```

}
"timestamp": "2024-03-10T10:30:00Z"
"status": 400,
},
]
{ "field": "email", "message": "Invalid email format" }
"details": [
"message": "Invalid input",
"code": "VALIDATION_ERROR",
"error": {
{
// Error response

}
"timestamp": "2024-03-10T10:30:00Z"
"status": 200,
"data": { /_ actual data _/ },
{
// Success response

```typescript

### 4. Consistent Response Format

```

}
"email": "john@example.com"
"name": "John",
{

Idempotency-Key: 123e4567-e89b-12d3-a456-426614174000
POST /api/users HTTP/1.1

```http

Implement idempotency keys:
### 3. Request Deduplication Support

```

Last-Modified: Wed, 21 Oct 2023 07:28:00 GMT
ETag: "33a64df..." # For conditional requests
Cache-Control: no-cache # For POST/PUT/DELETE
Cache-Control: public, max-age=300 # 5 minutes (for GET requests)

```

Help frontend cache effectively:
### 2. Proper Cache Headers

- Easy to scale horizontally
- No reliance on session state (except auth tokens)
- Each request should be independent
### 1. Stateless API Design

## Key Principles

```

└─────────────────────────────────┘
│ - Rate Limiting │
│ - Authentication │
│ - Database Layer │
│ - Express.js, Fastify, etc. │
│ Backend API │
┌─────────────────────────────────┐
↓
│ HTTP/REST or GraphQL
└─────────────────┬───────────────┘
│ - API Client │
│ - App Store │
│ - Cache Manager │
│ Hugo Frontend (TypeScript) │
┌─────────────────────────────────┐

```

## Recommended Architecture

This guide provides best practices and example implementations for building a backend API to work with your Hugo frontend's state management system.

## Overview

```
