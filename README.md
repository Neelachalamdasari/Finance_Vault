# FinanceVault – Role-Based Financial Dashboard

FinanceVault is a high-performance MERN stack application. The platform provides a secure, multi-tenant solution for managing organizational financial records with distinct access control for Admins, Analysts, and Viewers.

## 🚀 Key Features

- **Role-Based Access Control (RBAC):** Granular permissions ensuring users only access data relevant to their role (Viewer, Analyst, or Admin).
- **Advanced Data Aggregation:** Utilizes **MongoDB Aggregation Pipelines** to process financial summaries, monthly trends, and category breakdowns directly on the database level for maximum scalability.
- **Multi-Tenant Architecture:** Secure data scoping using `companyID` to ensure complete isolation between different organizations.
- **Automated Bootstrapping:** Automatically creates a default Admin user and company organization upon the first server start for immediate testing.
- **Real-Time Security:** Custom middleware monitors user status (Active/Inactive) to block access instantly if an account is deactivated by an Admin.

---

## 🛠️ Technical Stack

- **Frontend:** React.js, Tailwind CSS, Context API, Axios.
- **Backend:** Node.js, Express.js.
- **Database:** MongoDB (Mongoose ODM).
- **Authentication:** JWT (JSON Web Tokens) & Bcrypt.js password hashing.

---

## 🔑 Access Levels

| Role | Permissions |
| :--- | :--- |
| **Admin** | Full management: Create/Update users, Manage Roles, Manage Financial Records, View Dashboard. |
| **Analyst** | Read-only access to all financial records, advanced filters, and full dashboard insights. |
| **Viewer** | Restricted access: Can view high-level Dashboard KPIs only; cannot view raw transaction rows. |

---

## ⚙️ Installation & Setup

### 1. Clone the Repository
```bash
git clone [your-repository-link]
cd FinanceVault

# Install Backend Dependencies
```bash
cd server
npm install

# Install Frontend Dependencies
```bash
cd ../client
npm install

# Start Backend (from /server)
```bash
npm start

# Start Frontend (from /client in a new terminal)

```bash
npm start