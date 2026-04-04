# 🏦 FinanceVault – Professional Role-Based Financial Dashboard

**FinanceVault** is a high-performance MERN stack application designed for organizational financial management. It provides a secure, multi-tenant environment where financial data is protected by strict **Role-Based Access Control (RBAC)**, ensuring that sensitive data is only accessible to authorized personnel.

## 🔗 Live Links

* **Live Demo:** https://finance-vault-client.onrender.com
* **Backend API:** https://finance-vault-server.onrender.com

---
## 🚀 Key Features

### 🔐 Advanced Role-Based Access Control (RBAC)

* **Granular Permissions:** Custom middleware validates every request based on three distinct tiers: **Admin**, **Analyst**, and **Viewer**.
* **Real-Time Security:** User accounts can be set to `Inactive` by Admins, instantly revoking system access across all sessions.
* **Backend Enforcement:** Permissions are enforced at the API route level, not just hidden in the UI.

### 📊 High-Performance Data Aggregation

* **Database-Level Processing:** Utilizes complex **MongoDB Aggregation Pipelines** to calculate total income, expenses, net balance, and monthly trends.
* **Strategic Oversight:** Aggregated data is processed in a single pass on the server, significantly reducing frontend overhead and supporting large datasets.
* **Categorical Breakdown:** Automated grouping of financial records by category for instant visual insights.

### 🏢 Multi-Tenant Infrastructure

* **Organization Isolation:** Uses a `company` scoping logic to ensure that data from different organizations is strictly isolated.
* **Bootstrapping:** Automated scripts ensure a default Admin account and organization are created on the first server boot to streamline onboarding.
---
## ⚙️ Installation & Setup

### 1. Prerequisites

* Node.js (v18+)
* MongoDB Atlas Account

### 2. Install

```bash
cd FinanceVault

# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```
---
### 3. Environment Configuration
Create a .env file in the server directory:
```bash

MONGO_URI=
JWT_SECRET=
EXCHANGE_RATE_API_KEY=
CLIENT_URL=http://localhost:3000
PORT=5000
DEFAULT_ADMIN_COMPANY_NAME=
DEFAULT_ADMIN_NAME=
DEFAULT_ADMIN_EMAIL=
DEFAULT_ADMIN_PASSWORD=
```

Start the server:

```bash
npm start
```

Start the client:

```bash
npm start
```

---
---
## 📖 API Documentation

All protected routes require a valid JWT token to be passed in the `x-auth-token` header. The server utilizes an MVC architecture to ensure a clean separation of concerns between routes and controllers.

---

### 1. Authentication & Identity

**Base Route:** `/api/auth`

| Method | Endpoint | Access | Description |
| :----- | :------- | :----- | :---------- |
| POST | `/signup` | Public | Registers a user, links them to a default company, and sets the initial role to Viewer. |
| POST | `/login` | Public | Validates credentials and returns a JWT. Blocks access if the account status is Inactive. |
| GET | `/me` | Authenticated | Returns the logged-in user's profile, including their company and role. |

---

### 2. Financial Transactions & Analytics

**Base Route:** `/api/transactions`

| Method | Endpoint | Access Role | Description |
| :----- | :------- | :---------- | :---------- |
| GET | `/summary` | Admin, Analyst, Viewer | Aggregation Pipeline: Returns totalIncome, totalExpenses, and netBalance. |
| GET | `/` | Admin, Analyst | Returns transactions with server-side pagination and regex category filtering. |
| POST | `/` | Admin, Analyst | Creates a new record scoped to the user's companyID. |
| PUT | `/:id` | Admin, Analyst | Updates a record after validating it belongs to the user's company. |
| DELETE | `/:id` | Admin | Permanently removes a transaction record from the database. |

---

### 3. User & Admin Management

**Base Route:** `/api/users`

| Method | Endpoint | Access Role | Description |
| :----- | :------- | :---------- | :---------- |
| GET | `/` | Admin | Lists all users within the Admin's specific organization. |
| PATCH | `/:id/status` | Admin | Toggles a user's status between Active and Inactive for real-time security. |
---

## 📁 Project Structure

```
FinanceVault/
├── client/                 # React SPA
│   ├── src/
│   │   ├── api/            # Axios instance & interceptors
│   │   ├── components/     # Reusable UI
│   │   ├── pages/          # Auth & Role-based Dashboards
│   │   └── context/        # Global Auth State
│   └── package.json
└── server/                 # Node.js API
    ├── bootstrap/          # Admin auto-creation logic
    ├── controllers/        # Transaction & Analytics logic
    ├── middleware/         # Auth & Role-Check logic
    ├── models/             # Mongoose Schemas (User, Transaction)
    ├── routes/             # Scoped API endpoints
    └── server.js           # Entry point
```


---

## 🛠️ Technical Stack

| Layer          | Technologies                                        |
| :------------- | :-------------------------------------------------- |
| **Frontend**   | React.js (v19), Tailwind CSS, Context API, Axios    |
| **Backend**    | Node.js, Express.js (v5), Custom RBAC Middleware    |
| **Database**   | MongoDB Atlas                                       |
| **Auth**       | JWT (JSON Web Tokens), Bcrypt.js (Password Hashing) |
| **Deployment** | Render (Static Site & Web Service)                  |

---

## 🔑 Access Matrix

| Feature                       | Viewer | Analyst | Admin |
| :---------------------------- | :----: | :-----: | :---: |
| View High-Level KPIs          |   ✅   |   ✅    |   ✅   |
| View Category Totals          |   ✅   |   ✅    |   ✅   |
| View Raw Transaction Tables   |   ❌   |   ✅    |   ✅   |
| Filter & Search Records       |   ❌   |   ✅    |   ✅   |
| Create/Edit Financial Records |   ❌   |   ❌    |   ✅   |
| Manage Team Members & Roles   |   ❌   |   ❌    |   ✅   |

---



## 🏗️ Technical Decisions

### Why MongoDB Aggregation?

Rather than fetching raw data and calculating totals in React, I implemented server-side aggregation. This offloads heavy computation to the database, ensuring the UI remains snappy even as the transaction count grows into the thousands.

### Why the Middleware Pattern?

I developed a modular checkRole middleware that allows for readable route declarations. Permissions are enforced at the API level, ensuring that even if the UI is bypassed, the data remains inaccessible to unauthorized users.

---


