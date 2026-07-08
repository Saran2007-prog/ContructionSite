# BuildTrack: MEAN Stack Project Management with Strict RBAC

This implementation plan details the setup and code generation for BuildTrack, a Construction Project Management and Site Monitoring platform featuring Role-Based Access Control (RBAC) across both backend and frontend layers.

## Proposed System Architecture

We will structure the project into two main directories: `backend` (Node.js/Express/Mongoose) and `frontend` (Angular with Angular Material and Bootstrap).

```
BuildTrack/
├── backend/
│   ├── src/
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   └── Placeholders.js
│   │   ├── middleware/
│   │   │   └── auth.js
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── dashboardRoutes.js
│   │   └── server.js
│   ├── package.json
│   └── .env
└── frontend/ (Angular App)
    ├── src/
    │   ├── app/
    │   │   ├── core/
    │   │   │   ├── guards/
    │   │   │   │   └── auth.guard.ts
    │   │   │   ├── interceptors/
    │   │   │   │   └── jwt.interceptor.ts
    │   │   │   └── services/
    │   │   │       └── auth.service.ts
    │   │   ├── pages/
    │   │   │   ├── login/
    │   │   │   └── dashboards/
    │   │   │       ├── admin-dashboard/
    │   │   │       ├── pm-dashboard/
    │   │   │       ├── engineer-dashboard/
    │   │   │       ├── contractor-dashboard/
    │   │   │       ├── client-dashboard/
    │   │   │       └── worker-dashboard/
    │   │   ├── app.module.ts
    │   │   └── app-routing.module.ts
    │   └── styles.scss
    └── package.json
```

---

## Proposed Changes

### 1. Backend (Mongoose, Express.js, Node.js)

#### [NEW] [User.js](file:///c:/Users/subhi/saran/ConstructionSite/backend/src/models/User.js)
Define the `User` schema containing email, password_hash, profile, and `role` with the required enum values: `'Administrator', 'Project_Manager', 'Site_Engineer', 'Contractor', 'Worker', 'Client'`.

#### [NEW] [Placeholders.js](file:///c:/Users/subhi/saran/ConstructionSite/backend/src/models/Placeholders.js)
Define placeholder Mongoose schemas for relationships:
- `Project`, `Milestone`, `Resource`, `Inventory`, `Worker` (referencing User), `Attendance`, `Procurement`, `Notification`, `Report`.

#### [NEW] [auth.js](file:///c:/Users/subhi/saran/ConstructionSite/backend/src/middleware/auth.js)
Define Express middleware:
- `authenticateToken`: Verifies the JWT token from the Authorization header.
- `authorizeRole(allowedRoles)`: Checks user's role against the array of allowed roles.

#### [NEW] [authController.js](file:///c:/Users/subhi/saran/ConstructionSite/backend/src/controllers/authController.js)
Define authentication controller functions:
- `inviteUser` (Admin only): Create a new user with their assigned role.
- `login`: Authenicate credentials (using bcrypt) and return a signed JWT containing user `_id` and `role`.

#### [NEW] [authRoutes.js](file:///c:/Users/subhi/saran/ConstructionSite/backend/src/routes/authRoutes.js)
Register `/login` and `/invite` (protected by `authenticateToken` and `authorizeRole(['Administrator'])`).

#### [NEW] [dashboardRoutes.js](file:///c:/Users/subhi/saran/ConstructionSite/backend/src/routes/dashboardRoutes.js)
Provide mock protected API routes (e.g. `/api/admin/data`, `/api/pm/data`, etc.) to verify client-side interceptors and route protection.

#### [NEW] [server.js](file:///c:/Users/subhi/saran/ConstructionSite/backend/src/server.js)
Primary server configuration connecting to MongoDB and launching the Express application.

---

### 2. Frontend (Angular with Bootstrap & Material)

#### [NEW] [auth.service.ts](file:///c:/Users/subhi/saran/ConstructionSite/frontend/src/app/core/services/auth.service.ts)
Handles storing/retrieving JWTs, decoding JWT claims using `jwt-decode`, and querying active session details.

#### [NEW] [jwt.interceptor.ts](file:///c:/Users/subhi/saran/ConstructionSite/frontend/src/app/core/interceptors/jwt.interceptor.ts)
Intercepts all HttpClient requests to append the JWT to the authorization header.

#### [NEW] [auth.guard.ts](file:///c:/Users/subhi/saran/ConstructionSite/frontend/src/app/core/guards/auth.guard.ts)
Angular route guard (`CanActivate`) checking JWT validity and role verification via route `data.roles` array.

#### [NEW] [app-routing.module.ts](file:///c:/Users/subhi/saran/ConstructionSite/frontend/src/app/app-routing.module.ts)
Configure routing mapping user dashboards under protection:
- `/admin-dashboard` -> `Administrator`
- `/pm-dashboard` -> `Administrator`, `Project_Manager`
- `/engineer-dashboard` -> `Administrator`, `Site_Engineer`
- `/contractor-dashboard` -> `Administrator`, `Contractor`
- `/client-dashboard` -> `Administrator`, `Client`
- `/worker-dashboard` -> `Administrator`, `Worker`

#### [NEW] Dashboards Skeletons
Build the component logic, templates, and styling for the 6 dashboards to display mock features, design responsive layouts via Bootstrap, and test backend API access.

---

## Verification Plan

### Automated Verification
We will run:
1. Backend linting and server launch.
2. Angular compiler build verification to check for compilation correctness.

### Manual Verification
- Attempt to navigate to different dashboard routes with different login credentials to confirm role checks redirect as expected.
- Check headers of backend API requests from components to confirm JWT inclusion.
- Attempt unauthorized route access via direct URL and confirm automatic redirect to `/login`.
