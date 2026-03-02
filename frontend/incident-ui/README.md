# Incident Management System - User Guide

## Quick Start

### 1. Start the Application
```bash
# Backend (Terminal 1)
cd backend/incident-log-api
php artisan serve

# Frontend (Terminal 2)
cd frontend/incident-ui
npm run dev
```

### 2. Access
Open browser: http://localhost:5173

---

## Default Login

```
Email: admin@gmail.com
Password: rahim123
```

---

## User Roles

###  Admin (Super User)
- Create and manage users
- Assign incidents to operators
- View all incidents
- Full system access

###  Operator
- View incidents assigned to them
- Update incident status
- Add comments
- Work on assigned incidents

###  Reporter
- Create new incidents
- View their own incidents
- Track incident progress

---

##  Admin Guide

### Step 1: Login
1. Go to http://localhost:5173
2. Click "Get Started"
3. Enter email: `admin@gmail.com`
4. Enter password: `rahim123`
5. Click "Login"

### Step 2: Create Users

#### Create Reporter:
1. Click "Users" in sidebar
2. Click "Create User" button
3. Fill form:
   - Name: `John Reporter`
   - Email: `reporter@example.com`
   - Password: `password123`
   - Role: Select "Reporter"
4. Click "Create User"
5. Done! Reporter can now login

#### Create Operator:
1. Click "Users" in sidebar
2. Click "Create User" button
3. Fill form:
   - Name: `Jane`
   - Email: `operator@gmail.com`
   - Password: `password123`
   - Role: Select "Operator"
4. Click "Create User"
5. Done! Operator can now login

### Step 3: Assign Incidents to Operators

1. Click "Assign Incidents" in sidebar
2. You will see two tabs:
   - **Unassigned**: Incidents that need assignment
   - **Assigned**: Incidents already assigned to operators

#### Assign New Incident:
1. Stay on "Unassigned" tab (default)
2. Click on an incident (it will highlight in blue)
3. Click on an operator (it will highlight in green)
4. Click "Assign Incident" button
5. Done! Incident moves to "Assigned" tab

#### View Assigned Incidents:
1. Click "Assigned" tab
2. See all incidents assigned to operators
3. Includes all statuses (open, investigating, resolved, closed)
4. Cannot re-assign (button shows "Already Assigned")
5. Use this to track operator workload

### Step 4: View Incidents

1. Click "Incidents" in sidebar
2. You will see two tabs:
   - **Active Incidents**: Open, investigating, resolved
   - **History**: Closed incidents

#### View Active Incidents:
1. Stay on "Active Incidents" tab (default)
2. See all current incidents
3. Click any incident to view details
4. Can edit, comment, or change status

#### View History:
1. Click "History" tab
2. See all closed incidents
3. Reference for reporting
4. Can view details but incidents are complete

### Step 5: Monitor Dashboard

1. Click "Dashboard" in sidebar
2. See stats:
   - Total incidents
   - Open incidents
   - Investigating incidents
   - Resolved incidents
3. View recent incidents table

---

##  Operator Guide

### Step 1: Login
1. Go to http://localhost:5173
2. Click "Get Started"
3. Enter your email (given by admin)
4. Enter your password (given by admin)
5. Click "Login"

### Step 2: View Assigned Incidents

1. Click "Assigned Incidents" in sidebar
2. See list of incidents assigned to you
3. Use filters to search:
   - Search by title
   - Filter by status
   - Filter by severity

### Step 3: Work on an Incident

1. Click on an incident from the list
2. Read the description
3. Read existing comments
4. Click "Edit" button

### Step 4: Change Status

1. Click "Edit" button
2. Select new status from dropdown:
   - If status is "open" → select "investigating"
   - If status is "investigating" → select "resolved"
   - If status is "resolved" → select "closed"
3. Note: You can only select the next status (cannot skip steps)
4. Add comment (optional but recommended):
   - Example: "Started investigating the issue"
   - Example: "Fixed the bug and deployed"
5. Click "Update Status"
6. Done! Status changed and comment added

Note: When incident is closed, it moves to History

### Step 5: Add Comments

1. View incident details
2. Scroll to comments section
3. Type your comment in the text box
4. Click "Add Comment"
5. Done! Comment added

### Step 6: Check Dashboard

1. Click "Dashboard" in sidebar
2. See your assigned incidents stats:
   - Total assigned to you
   - Open
   - Investigating
   - Resolved
3. View your recent incidents

---

## Reporter Guide

### Step 1: Login
1. Go to http://localhost:5173
2. Click "Get Started"
3. Enter your email (given by admin)
4. Enter your password (given by admin)
5. Click "Login"

### Step 2: Create New Incident

1. Click "Create Incident" in sidebar
2. Fill the form:
   - Title: Short description (e.g., "Login not working")
   - Description: Detailed explanation
   - Severity: Select one:
     - Low: Minor issue
     - Medium: Normal issue
     - High: Important issue
     - Critical: Urgent issue
3. Click "Create Incident"
4. Done! Admin will assign it to an operator

### Step 3: View Your Incidents

1. Click "Incidents" in sidebar
2. See list of incidents you reported
3. Click any incident to view details
4. See status and comments from operators

### Step 4: Track Progress

1. View incident details
2. Check current status:
   - Open: Waiting for assignment
   - Investigating: Operator is working on it
   - Resolved: Issue is fixed
   - Closed: Incident is complete
3. Read comments to see updates

### Step 5: Check Dashboard

1. Click "Dashboard" in sidebar
2. See your incidents stats:
   - Total incidents you reported
   - Open
   - Investigating
   - Resolved
3. View your recent incidents

---

## Status Meanings

### Open (Mpya)
- Incident just reported
- Waiting for admin to assign to operator

### Investigating (Inachunguzwa)
- Operator is working on it
- Looking for solution

### Resolved (Imetatuliwa)
- Issue is fixed
- Waiting for confirmation

### Closed (Imefungwa)
- Incident is complete
- No more action needed

---

## Status Workflow

```
Open → Investigating → Resolved → Closed
```

**Rules:**
- Cannot skip steps
- Cannot go backwards
- Must follow the order

---

## Common Tasks

### Admin: How to Assign Incidents

#### Method 1: Assign New Incident
1. Go to "Assign Incidents"
2. Stay on "Unassigned" tab
3. Select incident (blue highlight)
4. Select operator (green highlight)
5. Click "Assign Incident"

#### Method 2: Check Assigned Incidents
1. Go to "Assign Incidents"
2. Click "Assigned" tab
3. See all assigned incidents (including closed)
4. Track operator workload

### Admin: How to View History
1. Go to "Incidents"
2. Click "History" tab
3. See all closed incidents
4. Use for reporting and reference

### How to Search Incidents
1. Go to incidents page
2. Use search box at the top
3. Type title or description
4. Results filter automatically

### How to Filter by Status
1. Go to incidents page
2. Click "Status" dropdown
3. Select status (open, investigating, resolved, closed)
4. Results filter automatically

### How to Filter by Severity
1. Go to incidents page
2. Click "Severity" dropdown
3. Select severity (low, medium, high, critical)
4. Results filter automatically

---

## Tips

### For Admins:
- Create users first before they can use the system
- Use "Unassigned" tab to assign new incidents quickly
- Use "Assigned" tab to track operator workload
- Check "History" tab for closed incidents and reporting
- Monitor dashboard regularly
- Closed incidents automatically move to History

### For Operators:
- Check "Assigned Incidents" daily
- Add comments when changing status
- Follow the workflow (open → investigating → resolved → closed)
- Update status as you progress
- When you close an incident, it goes to History

### For Reporters:
- Write clear incident descriptions
- Choose correct severity level
- Check dashboard for updates
- Read operator comments for progress
- Closed incidents move to History automatically

---

## Troubleshooting

### Cannot Login?
- Check email and password
- Make sure user was created by admin
- Try refreshing the page

### Cannot See Incidents?
- Reporter: You only see your own incidents
- Operator: You only see assigned incidents
- Admin: You see all incidents

### Cannot Edit Incident?
- Reporter: Cannot edit incidents
- Operator: Can only edit assigned incidents
- Admin: Can edit all incidents

### Cannot Change Status?
- Must follow workflow order
- Cannot skip steps
- Cannot go backwards



## Summary

### Admin:
1. Login
2. Create users
3. Assign incidents (use Unassigned tab)
4. View assigned work (use Assigned tab)
5. Check history (use History tab)
6. Monitor system

### Operator:
1. Login
2. View assigned incidents
3. Change status
4. Add comments

### Reporter:
1. Login
2. Create incidents
3. View your incidents
4. Track progress

---



---

## Admin Tabs Explained

### Assign Incidents Page

#### Unassigned Tab (Default)
- Shows incidents without operators
- Excludes closed incidents
- Use this to assign new work
- Can assign to operators

#### Assigned Tab
- Shows ALL incidents with operators
- Includes all statuses (even closed)
- Cannot re-assign
- Use to track workload and history

### Incidents Page

#### Active Incidents Tab (Default)
- Shows open, investigating, resolved
- Excludes closed incidents
- Current work view
- Can edit and manage

#### History Tab
- Shows only closed incidents
- Archive of completed work
- Reference for reporting
- Read-only view

---

