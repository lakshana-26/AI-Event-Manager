# AI Event Manager - Backend Implementation

Complete Node.js/Express backend implementation with agentic AI services for intelligent event management.

## 📁 Project Structure

```
AI-Event-Manager/
├── AGENTIC AI/
│   ├── main_agent/           # Main orchestrator agent
│   ├── people_agent/         # User & staff management
│   ├── resource_agent/       # Events, venues, resources
│   ├── review_agent/         # Event validation & approval
│   ├── rag/                  # Retrieval-Augmented Generation
│   ├── tools/                # Utility functions
│   └── memory/state/         # Persistent state management
├── FRONTEND/                 # Frontend application (separate)
├── UI/                       # Data files (JSON)
├── routes/                   # API route handlers
│   ├── auth.js              # Authentication endpoints
│   ├── events.js            # Event management endpoints
│   ├── users.js             # User management endpoints
│   ├── resources.js         # Resource management endpoints
│   └── rag.js               # RAG service endpoints
├── config/                   # Configuration management
├── middleware/               # Express middleware
├── utils/                    # Utility functions
│   ├── logger.js            # Logging service
│   └── dataLoader.js        # JSON data loader
├── index.js                  # Main server entry point
├── package.json              # Dependencies
├── .env                      # Environment variables
└── API_DOCUMENTATION.md      # API reference
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm or yarn

### Installation

1. **Navigate to project directory:**
```bash
cd c:\Users\laksh\OneDrive\Desktop\AI-Event-Manager\AI-Event-Manager
```

2. **Install dependencies:**
```bash
npm install
```

3. **Configure environment:**
```bash
# .env file is already created with default values
# Update LLM API key if using RAG features
```

4. **Start the server:**
```bash
npm start
# Server runs on http://localhost:5000
```

5. **Development mode with auto-reload:**
```bash
npm run dev
```

---

## 🔧 Configuration

Edit `.env` file to configure:

```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000

# JWT Authentication
JWT_SECRET=your_jwt_secret_key_change_this_in_production
JWT_EXPIRY=7d

# LLM Configuration (for RAG)
LLM_API_KEY=your_llm_api_key_here
LLM_MODEL=gpt-3.5-turbo
LLM_PROVIDER=openai

# Features
ENABLE_RAG=true
ENABLE_WEBSOCKET=true
ENABLE_NOTIFICATIONS=true
```

---

## 📋 API Endpoints Overview

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event details
- `PUT /api/events/:id` - Update event
- `DELETE /api/events/:id` - Delete event
- `POST /api/events/:id/review` - Review event
- `POST /api/events/:id/reject` - Reject event

### Users
- `GET /api/users` - List users (admin)
- `GET /api/users/:id` - Get user
- `PUT /api/users/:id` - Update user
- `GET /api/users/staff/list` - List staff
- `GET /api/users/students/list` - List students

### Resources
- `GET /api/resources` - List resources
- `GET /api/resources/venues` - List venues
- `GET /api/resources/check-availability` - Check availability

### RAG (AI Features)
- `POST /api/rag/search` - Search across data
- `POST /api/rag/query` - AI query with RAG
- `GET /api/rag/suggestions/:eventId` - Get AI suggestions

### System
- `GET /api/health` - Health check
- `GET /api/status` - System status
- `GET /api/system/info` - Detailed system info
- `GET /api/data/all` - Get all system data

**Full API documentation:** See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

---

## 🤖 Agent Architecture

### Main Agent
- **Purpose**: Central orchestrator that routes requests to appropriate agents
- **Capabilities**: Request routing, workflow management, system memory
- **Location**: `AGENTIC AI/main_agent/`

### People Agent
- **Purpose**: Manages users, staff, students, and authentication
- **Capabilities**: 
  - User authentication and profile management
  - Staff listing and filtering
  - Student listing and filtering
- **Location**: `AGENTIC AI/people_agent/`

### Resource Agent
- **Purpose**: Manages events, venues, and resources
- **Capabilities**:
  - Event creation, retrieval, update, deletion
  - Resource allocation and management
  - Venue listing and filtering
  - Resource availability checking
- **Location**: `AGENTIC AI/resource_agent/`

### Review Agent
- **Purpose**: Validates events against rules and manages approvals
- **Capabilities**:
  - Event validation against rules
  - Event approval/rejection workflow
  - Review history tracking
  - Rule enforcement
- **Location**: `AGENTIC AI/review_agent/`

### RAG Service
- **Purpose**: Retrieval-Augmented Generation for AI-powered features
- **Capabilities**:
  - Knowledge base management
  - Context-aware search
  - LLM integration for suggestions
  - Event improvement recommendations
- **Location**: `AGENTIC AI/rag/`

---

## 💾 Data Files

All data is stored as JSON in the `UI/` directory:

- `users.json` - User accounts and profiles
- `events.json` - Event information
- `staff.json` - Staff member details
- `students.json` - Student information
- `responses.json` - Event responses and registrations
- `venues.json` - Venue information
- `resources.json` - Available resources
- `rules.json` - Event validation rules

---

## 📝 Usage Examples

### 1. Login and Get Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "password123"
  }'
```

### 2. Create Event (using token)
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tech Conference 2024",
    "date": "2024-12-25",
    "startDate": "2024-12-25T09:00:00Z",
    "endDate": "2024-12-25T17:00:00Z",
    "description": "Annual tech conference",
    "location": "Main Hall",
    "expectedAttendees": 200,
    "budget": 10000
  }'
```

### 3. Review Event
```bash
curl -X POST http://localhost:5000/api/events/{eventId}/review \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### 4. Search with RAG
```bash
curl -X POST http://localhost:5000/api/rag/search \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "query": "large conference venues"
  }'
```

---

## 🔐 Authentication & Authorization

### Roles
- **admin**: Full system access
- **organizer**: Can create and manage events
- **reviewer**: Can review and approve events
- **staff**: Can view and respond to events
- **student**: Can view and register for events

### JWT Token
Token is valid for 7 days (configurable). Include in requests:
```
Authorization: Bearer <your_token_here>
```

---

## 📊 WebSocket Real-Time Features

Events are broadcast in real-time to connected clients:

```javascript
// Client-side example
const socket = io('http://localhost:5000');

socket.on('event:changed', (data) => {
  console.log('Event updated:', data);
});

// Emit event update
socket.emit('event:update', {
  id: 'event_123',
  changes: { status: 'approved' }
});
```

---

## 🧠 RAG & AI Features

### Knowledge Base
The RAG service automatically builds a knowledge base from:
- Events and their details
- User information
- Venue capabilities
- Available resources
- System rules

### Capabilities
1. **Smart Search** - Semantic search across all data
2. **AI Suggestions** - Get recommendations for events
3. **Context-Aware Queries** - Ask natural language questions
4. **Rule Validation** - Automatic event rule checking

Enable RAG in `.env`:
```env
ENABLE_RAG=true
LLM_API_KEY=your_openai_key_here
```

---

## 📝 Logging

Logs are stored in the `logs/` directory:
- `app.log` - General application logs
- `error.log` - Error-specific logs

Control logging level in `.env`:
```env
LOG_LEVEL=info  # debug, info, warn, error
```

---

## 🧪 Testing the Backend

### Health Check
```bash
curl http://localhost:5000/api/health
```

### System Status
```bash
curl http://localhost:5000/api/status
```

### Get All Data
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/data/all
```

---

## 🔄 Frontend Integration

The backend is ready to connect with the frontend. Update frontend API calls:

```javascript
// Frontend configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Example login request
async function login(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  const data = await response.json();
  localStorage.setItem('token', data.token);
  return data;
}

// For protected routes, include token
async function getEvents() {
  const token = localStorage.getItem('token');
  const response = await fetch(`${API_BASE_URL}/events`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  return response.json();
}
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change port in .env
PORT=5001
```

### Module Not Found
```bash
# Reinstall dependencies
rm -r node_modules
npm install
```

### Database/Data Errors
```bash
# Clear state
node -e "const sm = require('./AGENTIC\\ AI/memory/state'); sm.clearAllState();"
```

### CORS Issues
```bash
# Update CORS_ORIGIN in .env to match frontend URL
CORS_ORIGIN=http://localhost:3000
```

---

## 📚 Additional Resources

- [API Documentation](./API_DOCUMENTATION.md) - Complete endpoint reference
- [Express.js Docs](https://expressjs.com/)
- [JWT Guide](https://jwt.io/)
- [Socket.IO Docs](https://socket.io/docs/)

---

## 🤝 Next Steps

1. **Connect Frontend**: Update frontend to call backend API endpoints
2. **Setup Database**: Consider migrating from JSON to MongoDB/PostgreSQL
3. **Enable RAG**: Configure LLM API key for AI features
4. **Add Testing**: Implement unit and integration tests
5. **Production Deployment**: Set up environment for production

---

## 📞 Support

For issues or questions about the backend implementation, refer to API documentation or reach out to the development team.

**Backend Implementation Complete! ✅**

The server is ready to handle frontend requests. All agents are initialized and ready to process event management operations.
