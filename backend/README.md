# Elektron Menu Backend

Express.js backend API for the electronic menu system.

## Features

- 🔐 JWT Authentication
- 📁 Category management
- 🍽️ Product management
- 🛒 Order processing
- 📷 Image upload with Cloudinary
- 🗄️ MongoDB database integration

## Environment Variables

Create a `.env` file in the backend directory:

\`\`\`
MONGO_URI=mongodb+srv://menu:qJHoeCETSkoNmHdB@cluster0.ygw3vn3.mongodb.net/
PORT=8800
CLOUDINARY_CLOUD_NAME=ds7uywpld
CLOUDINARY_API_KEY=964275313136228
CLOUDINARY_API_SECRET=kV6xEVW4GAVgh4IuilS4HagGZwQ
JWT_SECRET=menu123456
\`\`\`

## Getting Started

1. Install dependencies:
\`\`\`bash
cd backend
npm install
\`\`\`

2. Set up environment variables (see above)

3. Start the server:
\`\`\`bash
npm start
# or for development
npm run dev
\`\`\`

The server will run on http://localhost:8800

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (auth required)
- `PUT /api/categories/:id` - Update category (auth required)
- `DELETE /api/categories/:id` - Delete category (auth required)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/category/:categoryId` - Get products by category
- `POST /api/products` - Create product (auth required)
- `PUT /api/products/:id` - Update product (auth required)
- `DELETE /api/products/:id` - Delete product (auth required)

### Orders
- `GET /api/orders` - Get all orders (auth required)
- `POST /api/orders` - Create new order
- `PUT /api/orders/:id` - Update order status (auth required)

### Upload
- `POST /api/upload` - Upload image to Cloudinary
