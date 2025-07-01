# 📊 Sales Inventory Management System

A complete solution for tracking inventory, sales, customers, and employees with invoicing support.

## ✨ Key Features

### 📦 Product Management

- Add/edit products with **SKU, name, price, cost, stock levels**
- **Barcode/QR scanning** support
- **Category-based organization** (e.g., Electronics, Clothing)
- **Low stock alerts** and reorder suggestions

### 👥 Customer Management

- Store **customer details** (name, email, phone, address)
- Track **purchase history & loyalty points**
- **Customer segmentation** (VIP, bulk buyers, etc.)

### 👨‍💼 Employee & User Management

- **Role-based access** (Admin, Sales, Inventory Manager)
- **Employee profiles** with contact details and permissions
- **Login & authentication** for secure access

### 🧾 Invoice & Sales Tracking

- Generate **itemized invoices** with taxes & discounts
- **Print/email receipts**
- **Sales reports** (daily, weekly, monthly)

### 📂 Category Management

- Organize products into **hierarchical categories**
- Filter products by category in reports

## 🗃️ Database Structure (Main Tables)

| Table            | Key Fields |
|------------------|------------|
| **Product**      | `id`, `name`, `sku`, `category_id`, `price`, `stock`, `barcode` |
| **Category**     | `id`, `name`, `parent_category_id` |
| **Customer**     | `id`, `name`, `email`, `phone`, `address`, `loyalty_points` |
| **User**        | `id`, `username`, `role`, `email`, `hashed_password` |
| **Invoice**      | `id`, `customer_id`, `employee_id`, `date`, `total`, `payment_status` |
| **Invoice_product**  | `id`, `invoice_id`, `product_id`, `quantity`, `unit_price` |

## 🛠️ Setup & Installation

### Prerequisites

- **Backend**: Next.js
- **Database**: PostgreSQL
- **Frontend**: Next.js
