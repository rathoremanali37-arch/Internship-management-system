# InternHub — Internship Management System (MERN)

A single-page Internship Management System built with MongoDB, Express.js, React.js and Node.js. The original dashboard and internship discovery UI have been retained and extended with authentication, role-based access, routed pages and company listing management.

## Main features

### Student
- Register and log in using email and password.
- Browse, search and filter internship listings.
- Open a routed internship details page.
- Submit a validated application and prevent duplicate applications.
- Track application status and withdraw an application.
- View dashboard statistics scoped to the logged-in student.

### Company
- Company accounts are provisioned by an administrator/trusted operator.
- Create, read, update and delete owned internship listings.
- View applications received for the company's own listings.
- Change application status to Applied, Shortlisted or Rejected.

### Admin
- Admin accounts are provisioned by a trusted operator.
- View all internship listings and applications.
- Manage listings and update application statuses.

## Technology stack

- Frontend: React 18, Vite, React Router, Axios, CSS.
- Backend: Node.js, Express 4, JWT, bcryptjs.
- Database: MongoDB and Mongoose.
- Security: hashed passwords, 24-hour JWTs, protected routes, role checks, company ownership checks, server-side validation, centralized error handling.

## Project structure

```text
internship-mern/
  client/
    src/
      auth/                 Auth context and protected route
      components/           Dashboard, cards, forms, tracker, management UI
      pages/                Login/register and internship details
      App.jsx
      api.js                Axios instance and JWT header interceptor
      main.jsx              BrowserRouter route definitions
  server/
    data/                   Sample internship records
    middleware/             JWT authentication and role authorization
    models/                 User, Internship and Application schemas
    routes/                 Auth, internship, application and stats APIs
    scripts/                Trusted company/admin account provisioning
    server.js               Express app, middleware and DB startup
  docs-api.md               API reference and ER diagram
```

## Setup

Requirements: Node.js 18+, npm, and MongoDB local or MongoDB Atlas.

### 1. Backend

Open a terminal in the project root:

```bash
cd server
npm install
```

Create `server/.env` by copying `.env.example`, then set your own MongoDB URI and a long random JWT secret (at least 32 characters):

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/internship_db
CLIENT_URL=http://localhost:5173
JWT_SECRET=replace_with_a_long_random_secret_of_at_least_32_chars
```

Start the API:

```bash
npm start
```

Expected messages include `MongoDB connected` and `Server running on http://localhost:5000`.

### 2. Frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open `http://localhost:5173`.

## First use and demo sequence

1. Register a student account at `/register`.
2. Log in and browse the sample internships.
3. Apply to an internship using a valid 10-digit phone number.
4. Open My applications to see the persisted application.
5. To demonstrate company features, provision a company account from the `server` folder:

   ```bash
   node scripts/createUser.js "Example Company" company@example.com "UseAUniquePassword" company
   ```

6. Log in as that company. Use Manage listings to create/edit/delete its own listings. Applications received for its listings appear under Applications received; the company can update their status.

Company/admin accounts are deliberately not available through public self-registration. This prevents a student account from granting itself company privileges.

## Important note about existing database records

The earlier demo version stored applications without a user account. Those legacy application records cannot automatically be assigned to a newly registered student, so create fresh applications after logging in. Existing sample internships remain visible; company accounts can manage only listings created under their own account. Admin accounts can manage all listings.

## API documentation and database design

See [`docs-api.md`](./docs-api.md) for the endpoint table, authentication header, example payloads, HTTP status codes and Mermaid ER diagram.

## Assignment coverage

- CO3: reusable React components, controlled forms, state/props, React Router, `useNavigate`, `useParams`, client-side validation.
- CO4: Express REST API, routers, logging/validation/error middleware, Mongoose schemas and references, populate, async CRUD, HTTP status codes.
- CO5: React/Express integration using Axios, CORS, dotenv, JWT registration/login, protected APIs, role-based UI, loading/error feedback, indexes and scoped database queries.

## Security reminders

- Never commit `.env`, database credentials, JWT secrets or real passwords.
- Passwords are hashed with bcryptjs before storage.
- JWTs are sent using the `Authorization: Bearer` header and expire after 24 hours.
- Company access is limited to the company's own internship listings and their applications.
