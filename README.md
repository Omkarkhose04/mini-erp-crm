# Mini ERP CRM

A full-stack ERP and CRM application for managing customers, products, inventory, stock movements, and sales challans.

## 🚀 Features

### Authentication
- Admin login
- JWT-based authentication
- Protected routes
- Role-based authorization

### Customer Management
- Create customers
- View customer list
- Search customers
- Customer status management
- Customer type management
- Follow-up dates and notes

### Product Management
- Create products
- View products
- SKU management
- Product categories
- Unit price management
- Minimum stock levels
- Warehouse locations

### Inventory Management
- Stock IN movements
- Stock OUT movements
- Automatic stock updates
- Insufficient-stock validation
- Stock movement history
- Low-stock identification

### Sales Challans
- Create draft challans
- Add customer and products
- Calculate item totals
- Confirm challans
- Cancel draft challans
- Automatic stock deduction when confirmed
- Challan status tracking

## 🛠️ Tech Stack

### Frontend
- React
- Vite
- React Router
- Axios
- CSS

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT

## 📁 Project Structure

```text
mini-erp-crm/
│
├── backend/
│   ├── prisma/
│   └── src/
│       ├── controllers/
│       ├── middleware/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       └── ...
│
├── frontend/
│   └── src/
│       ├── pages/
│       ├── App.jsx
│       ├── api.js
│       └── ...
│
├── .gitignore
└── README.md