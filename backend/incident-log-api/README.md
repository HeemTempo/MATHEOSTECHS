# Incident Log System API

A simple API for managing incidents in your team. Team members can report incidents, operators can handle them, and admins can manage everything.

## What Does This Do?

This system helps teams track and manage incidents:
- **Reporters** create incidents when something goes wrong
- **Operators** investigate and fix the incidents
- **Admins** manage users and assign work

## Setup Instructions

### Step 1: Install Dependencies
```bash
composer install
```

### Step 2: Configure Database

Open the `.env` file and set your database:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=incident_db
DB_USERNAME=root
DB_PASSWORD="your_password"
```

### Step 3: Create Database Tables
```bash
php artisan migrate:fresh --seed
```

This creates:
- All database tables
- One admin user (email: admin@example.com, password: password)

### Step 4: Start the Server
```bash
php artisan serve
```

Your API is now running at: `http://localhost:8000`

## How to Test It Works

### Test 1: Login as Admin
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}'
```

You'll get a response with a `token`. Copy this token.

### Test 2: Create a User
Replace `YOUR_TOKEN` with the token from Test 1:

```bash
curl -X POST http://localhost:8000/api/users \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Reporter",
    "email": "john@company.com",
    "password": "password123",
    "role": "reporter"
  }'
```

### Test 3: Create an Incident
Login as the reporter you just created, then create an incident:

```bash
curl -X POST http://localhost:8000/api/incidents \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Server is down",
    "description": "Production server not responding",
    "severity": "critical"
  }'
```

### Test 4: View All Incidents
```bash
curl http://localhost:8000/api/incidents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## User Roles

| **Admin** | Create users, assign incidents, full access |
| **Operator** | View all incidents, update status, add comments |
| **Reporter** | Create incidents, view their own incidents |

## Common API Endpoints

### Authentication
- `POST /api/login` - Login and get token
- `POST /api/logout` - Logout

### Users (Admin Only)
- `GET /api/users` - View all users
- `POST /api/users` - Create new user
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Incidents
- `GET /api/incidents` - View incidents
- `POST /api/incidents` - Create incident
- `GET /api/incidents/{id}` - View single incident
- `PUT /api/incidents/{id}/status` - Update status
- `PUT /api/incidents/{id}/assign` - Assign to operator (admin only)

### Comments
- `POST /api/incidents/{id}/comments` - Add comment

## Filtering & Pagination

You can filter incidents:
```bash
# Get only open incidents
GET /api/incidents?status=open

# Get critical incidents
GET /api/incidents?severity=critical

# Search incidents
GET /api/incidents?search=server

# Get page 2 with 20 items
GET /api/incidents?page=2&per_page=20
```

You can filter users:
```bash
# Get only reporters
GET /api/users?role=reporter

# Get only operators
GET /api/users?role=operator
```

## Incident Status Flow

Incidents must follow this order:
```
open → investigating → resolved → closed
```

You cannot skip steps!

## Default Admin Account

After running migrations:
- **Email:** admin@example.com
- **Password:** rahim123

