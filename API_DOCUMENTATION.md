# AI Event Manager Backend - API Documentation

## Overview
Comprehensive REST API for the AI Event Manager system with multiple agentic AI services working together to manage events, resources, users, and approvals.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Endpoints

### 1. Authentication Endpoints

#### Login
**POST** `/auth/login`

Request:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "email": "user@example.com",
    "role": "admin",
    "name": "User Name"
  }
}
```

#### Register
**POST** `/auth/register`

Request:
```json
{
  "name": "New User",
  "email": "newuser@example.com",
  "password": "password123",
  "role": "organizer"
}
```

#### Verify Token
**GET** `/auth/verify`

Requires: Authentication header

#### Get Profile
**GET** `/auth/profile`

Requires: Authentication header

#### Update Profile
**PUT** `/auth/profile`

Requires: Authentication header

Request:
```json
{
  "name": "Updated Name",
  "email": "updated@example.com"
}
```

#### Logout
**POST** `/auth/logout`

Requires: Authentication header

---

### 2. Events Endpoints

#### List Events
**GET** `/events`

Query Parameters:
- `status` (optional): pending, approved, rejected
- `organizerId` (optional): Filter by organizer
- `date` (optional): Filter by date

Requires: Authentication

#### Create Event
**POST** `/events`

Requires: Authentication, Role: admin or organizer

Request:
```json
{
  "name": "Event Name",
  "date": "2024-12-25",
  "startDate": "2024-12-25T10:00:00Z",
  "endDate": "2024-12-25T14:00:00Z",
  "description": "Event description",
  "location": "Venue Name",
  "expectedAttendees": 100,
  "budget": 5000,
  "category": "conference"
}
```

#### Get Event
**GET** `/events/:id`

Requires: Authentication

#### Update Event
**PUT** `/events/:id`

Requires: Authentication, Role: admin or organizer

#### Delete Event
**DELETE** `/events/:id`

Requires: Authentication, Role: admin or organizer

#### Submit Event for Review
**POST** `/events/:id/review`

Requires: Authentication, Role: admin or reviewer

#### Reject Event
**POST** `/events/:id/reject`

Requires: Authentication, Role: admin or reviewer

Request:
```json
{
  "reason": "Event does not meet requirements"
}
```

#### Get Event Reviews
**GET** `/events/:id/reviews`

Requires: Authentication

#### Get Pending Reviews
**GET** `/events/pending/reviews`

Requires: Authentication, Role: admin or reviewer

#### Allocate Resource
**POST** `/events/:id/allocate-resource`

Requires: Authentication, Role: admin or organizer

Request:
```json
{
  "resourceId": "resource_id",
  "quantity": 5
}
```

---

### 3. Users Endpoints

#### List All Users
**GET** `/users`

Requires: Authentication, Role: admin

Query Parameters:
- `role` (optional): Filter by role
- `status` (optional): Filter by status

#### Get User
**GET** `/users/:id`

Requires: Authentication (can only view own profile unless admin)

#### Update User
**PUT** `/users/:id`

Requires: Authentication (can only update own profile unless admin)

#### List Staff
**GET** `/users/staff/list`

Requires: Authentication

Query Parameters:
- `department` (optional): Filter by department

#### List Students
**GET** `/users/students/list`

Requires: Authentication

Query Parameters:
- `year` (optional): Filter by year

---

### 4. Resources Endpoints

#### List Resources
**GET** `/resources`

Requires: Authentication

Query Parameters:
- `type` (optional): Resource type
- `available` (optional): true/false

#### List Venues
**GET** `/resources/venues`

Requires: Authentication

Query Parameters:
- `capacity` (optional): Minimum capacity
- `availability` (optional): Status

#### Get Venue Details
**GET** `/resources/venues/:id`

Requires: Authentication

#### Check Availability
**GET** `/resources/check-availability`

Requires: Authentication

Query Parameters:
- `resourceId` (required): Resource ID
- `startDate` (required): ISO date string
- `endDate` (required): ISO date string

Response:
```json
{
  "success": true,
  "resourceId": "resource_id",
  "isAvailable": true,
  "conflicts": []
}
```

---

### 5. RAG (Retrieval-Augmented Generation) Endpoints

#### Search
**POST** `/rag/search`

Requires: Authentication

Request:
```json
{
  "query": "conference venues with high capacity"
}
```

Response:
```json
{
  "success": true,
  "results": [
    {
      "category": "venues",
      "matches": ["Venue: Grand Hall - Capacity: 500"]
    }
  ],
  "totalMatches": 1
}
```

#### Generate Response
**POST** `/rag/query`

Requires: Authentication

Request:
```json
{
  "query": "How do I plan a successful conference?",
  "category": "events"
}
```

#### Get Event Suggestions
**GET** `/rag/suggestions/:eventId`

Requires: Authentication

#### Get Knowledge Base Status
**GET** `/rag/knowledge-base`

Requires: Authentication

#### Re-initialize Knowledge Base
**POST** `/rag/initialize`

Requires: Authentication

---

### 6. System Endpoints

#### Health Check
**GET** `/health`

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00Z",
  "agents": {
    "mainAgent": { "id": "...", "status": "active" },
    "subAgents": [...]
  }
}
```

#### Status
**GET** `/status`

Response:
```json
{
  "status": "running",
  "version": "1.0.0",
  "nodeEnv": "development",
  "agents": {...},
  "features": {
    "websocket": true,
    "rag": true,
    "notifications": true
  }
}
```

#### System Info
**GET** `/system/info`

Response includes agent capabilities and system statistics

#### Get All Data
**GET** `/data/all`

Requires: Authentication

Returns all system data (users, events, staff, students, venues, resources, rules, responses)

---

### 7. Agent Routing Endpoint

#### Route Request
**POST** `/agents/route`

Requires: Authentication

Request:
```json
{
  "type": "event:create",
  "payload": {
    "name": "Event Name",
    "date": "2024-12-25"
  }
}
```

Supported types:
- `event:create` - Create new event
- `event:list` - List events
- `event:get` - Get event
- `event:update` - Update event
- `event:delete` - Delete event
- `event:review` - Review event
- `user:authenticate` - Authenticate user
- `user:get` - Get user
- `user:list` - List users
- `resource:allocate` - Allocate resource
- `resource:list` - List resources

---

## WebSocket Events (if enabled)

### Connection
```javascript
io.on('connect', () => {
  console.log('Connected');
});
```

### Listen for Event Updates
```javascript
socket.on('event:updated', (data) => {
  console.log('Event updated:', data);
});
```

### Emit Event Update
```javascript
socket.emit('event:update', {
  id: 'event_id',
  changes: { status: 'approved' }
});
```

### Listen for Agent Responses
```javascript
socket.on('agent:response', (data) => {
  console.log('Agent response:', data);
});
```

### Emit Agent Request
```javascript
socket.emit('agent:request', {
  type: 'event:list',
  payload: {}
});
```

---

## Error Handling

All errors follow a consistent format:

```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional array of specific errors
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error
- `503` - Service Unavailable

---

## Roles & Permissions

- **admin**: Full system access
- **organizer**: Can create and manage own events
- **reviewer**: Can review and approve events
- **staff**: Can view and respond to events
- **student**: Can view events and register

---

## Configuration

Configuration is managed through `.env` file. Key variables:

- `PORT`: Server port (default: 5000)
- `NODE_ENV`: Environment (development/production)
- `JWT_SECRET`: Secret key for JWT tokens
- `CORS_ORIGIN`: Allowed CORS origin
- `LLM_API_KEY`: API key for LLM provider
- `LLM_MODEL`: LLM model to use
- `ENABLE_RAG`: Enable RAG service
- `ENABLE_WEBSOCKET`: Enable WebSocket support

---

## Development

### Start Server
```bash
npm start
```

### Start with Auto-Reload
```bash
npm run dev
```

### Environment Setup
```bash
cp .env.example .env
# Edit .env with your configuration
npm install
npm start
```

---

## Support

For issues or questions, please contact the development team.
