# 🚀 QUICK START GUIDE - AI Event Manager Backend

## Start the Backend Server

```bash
cd "c:\Users\laksh\OneDrive\Desktop\AI-Event-Manager\AI-Event-Manager"
npm start
```

Server will start on **http://localhost:5000**

---

## Quick Test Commands

### 1. Check Health
```powershell
curl http://localhost:5000/api/health
```

### 2. Login
```powershell
$loginData = @{
  email = "aris.thorne@college.edu"
  password = "AdminPass#2026"
} | ConvertTo-Json

$response = Invoke-WebRequest -Uri "http://localhost:5000/api/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body $loginData `
  -UseBasicParsing

$response.Content | ConvertFrom-Json
```

### 3. Get Users (with JWT token)
```powershell
$token = "YOUR_JWT_TOKEN_HERE"
$headers = @{"Authorization"="Bearer $token"}

Invoke-WebRequest -Uri "http://localhost:5000/api/users" `
  -Method GET `
  -Headers $headers `
  -UseBasicParsing | % { $_.Content | ConvertFrom-Json }
```

---

## Key Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Events
- `GET /api/events` - List events
- `POST /api/events` - Create event
- `GET /api/events/:id` - Get event
- `PUT /api/events/:id` - Update event
- `POST /api/events/:id/review` - Review event

### Users
- `GET /api/users` - List all users
- `GET /api/users/staff/list` - List staff
- `GET /api/users/students/list` - List students

### Resources
- `GET /api/resources` - List resources
- `GET /api/resources/venues` - List venues

### AI (RAG)
- `POST /api/rag/search` - Search
- `GET /api/rag/knowledge-base` - KB status

---

## Test Users

### Admin
- **Email:** aris.thorne@college.edu
- **Password:** AdminPass#2026

### Staff
- **Email:** rajesh.raman@college.edu
- **Password:** StaffPass#001

---

## Environment Variables (.env)

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_change_this_in_production
CORS_ORIGIN=http://localhost:3000
ENABLE_RAG=true
ENABLE_WEBSOCKET=true
LOG_LEVEL=info
```

---

## Database

All data stored in `UI/` folder:
- `users.json` - User accounts
- `events.json` - Events
- `venues.json` - Venues
- `resources.json` - Resources
- `staff.json` - Staff info
- `students.json` - Student info
- `rules.json` - Validation rules

---

## Key Files

| File | Purpose |
|------|---------|
| `index.js` | Server entry point |
| `config/` | Configuration management |
| `middleware/auth.js` | JWT & RBAC |
| `routes/` | API endpoints |
| `AGENTIC AI/` | Agent implementations |
| `utils/` | Logging & data access |

---

## Troubleshooting

### Port 5000 Already in Use
```powershell
netstat -ano | findstr :5000
taskkill /PID [PID] /F
```

### Module Not Found
```bash
npm install
```

### Clear Data
```powershell
node -e "const sm = require('./AGENTIC AI/memory/state'); sm.clearAllState();"
```

---

## Frontend Integration

Set frontend API URL to: `http://localhost:5000/api`

Example:
```javascript
const API_URL = 'http://localhost:5000/api';

async function login(email, password) {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}
```

---

## Monitoring

View logs in:
- `logs/app.log` - Application logs
- `logs/error.log` - Error logs
- Console output - Real-time logs

---

## Documentation Files

📖 Read for more details:
- `API_DOCUMENTATION.md` - Complete API reference
- `README_BACKEND.md` - Setup guide
- `SETUP_INTEGRATION_GUIDE.md` - Frontend integration
- `BACKEND_VERIFICATION_REPORT.md` - Test results

---

## Performance Tips

- ✅ Caching enabled (JSON data cached)
- ✅ Pagination ready
- ✅ Query filtering supported
- ✅ WebSocket for real-time updates

---

**Backend is Production Ready!** 🎉
