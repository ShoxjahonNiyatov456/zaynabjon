# ElektroMenu - Electronic Menu System

A modern electronic menu system with a Node.js/Express backend and Next.js frontend.

## Project Structure

\`\`\`
├── backend/                 # Backend API (Node.js/Express)
│   ├── config/             # Database and service configurations
│   ├── controllers/        # Route controllers
│   ├── middlewares/        # Custom middlewares
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # External service integrations
│   ├── utils/             # Utility functions
│   └── server.js          # Main server file
│
├── app/                    # Frontend (Next.js App Router)
├── components/             # React components
├── lib/                    # Frontend utilities and API client
└── public/                 # Static assets
\`\`\`

## Features

### Backend
- **Authentication**: JWT-based user authentication
- **Categories**: CRUD operations for menu categories
- **Products**: Product management with image upload
- **Orders**: Order processing and management
- **Settings**: Restaurant settings and configuration
- **File Upload**: Cloudinary integration for image storage

### Frontend
- **Modern UI**: Dark theme with sophisticated design
- **Responsive**: Mobile-first responsive design
- **Category Filtering**: Left sidebar with category navigation
- **Product Grid**: Beautiful product display with images
- **Shopping Cart**: Add to cart functionality
- **Banner Slider**: Promotional banner carousel
- **Search**: Product search functionality

## Getting Started

### Backend Setup

1. Navigate to the backend directory:
   \`\`\`bash
   cd backend
   \`\`\`

2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Create environment file:
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Configure your environment variables in `.env`

5. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

The backend API will be available at `http://localhost:8800`

### Frontend Setup

1. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

2. Set up environment variables:
   \`\`\`bash
   # Create .env.local file
   NEXT_PUBLIC_API_URL=http://localhost:8800
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

The frontend will be available at `http://localhost:3000`

## API Endpoints

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get category by ID
- `POST /categories` - Create new category (Admin only)
- `PUT /categories/:id` - Update category (Admin only)
- `DELETE /categories/:id` - Delete category (Admin only)

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get product by ID
- `POST /products` - Create new product (Admin only)
- `PUT /products/:id` - Update product (Admin only)
- `DELETE /products/:id` - Delete product (Admin only)

### Orders
- `GET /orders` - Get all orders (Admin only)
- `GET /orders/:id` - Get order by ID (Admin only)
- `POST /orders` - Create new order
- `PUT /orders/:id` - Update order status (Admin only)
- `DELETE /orders/:id` - Delete order (Admin only)

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login

### Settings
- `GET /settings` - Get restaurant settings
- `POST /settings` - Create settings (Admin only)
- `PUT /settings` - Update settings (Admin only)

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- Cloudinary for image storage
- Multer for file uploads
- bcryptjs for password hashing

### Frontend
- Next.js 15 (App Router)
- React 18
- TypeScript
- Tailwind CSS v4
- shadcn/ui components
- Lucide React icons

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
