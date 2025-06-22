# Book Review API

A RESTful API for managing book reviews built with Node.js, Express, and MongoDB.

## Features

- User authentication with JWT
- Book management (CRUD operations)
- Review system with ratings
- Search functionality
- Pagination for books and reviews
- Filtering by author and genre

## Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory with the following variables:
   ```
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRES_IN=7d
   ```
4. Start the server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication

#### Signup
- **POST** `/api/auth/signup`
- Body:
  ```json
  {
    "username": "string",
    "email": "string",
    "password": "string"
  }
  ```

#### Login
- **POST** `/api/auth/login`
- Body:
  ```json
  {
    "email": "string",
    "password": "string"
  }
  ```

### Books

#### Create Book (Authenticated)
- **POST** `/api/books`
- Headers: `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "title": "string",
    "author": "string",
    "genre": "string",
    "description": "string"
  }
  ```

#### Get All Books
- **GET** `/api/books`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)
  - `author` (optional)
  - `genre` (optional)

#### Get Book by ID
- **GET** `/api/books/:id`
- Query Parameters:
  - `page` (default: 1)
  - `limit` (default: 10)

#### Search Books
- **GET** `/api/books/search?query=<search_term>`

### Reviews

#### Create Review (Authenticated)
- **POST** `/api/reviews/books/:bookId/reviews`
- Headers: `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "rating": "number",
    "comment": "string"
  }
  ```

#### Update Review (Authenticated)
- **PUT** `/api/reviews/:id`
- Headers: `Authorization: Bearer <token>`
- Body:
  ```json
  {
    "rating": "number",
    "comment": "string"
  }
  ```

#### Delete Review (Authenticated)
- **DELETE** `/api/reviews/:id`
- Headers: `Authorization: Bearer <token>`

#### Search  (Get)
- **Search** `/api/books/search?query=harry`

## Database Schema

### User
```javascript
{
  username: String,
  email: String,
  password: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Book
```javascript
{
  title: String,
  author: String,
  genre: String,
  description: String,
  averageRating: Number,
  totalReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Review
```javascript
{
  book: ObjectId,
  user: ObjectId,
  rating: Number,
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security

- Passwords are hashed using bcrypt
- JWT tokens are used for authentication
- Input validation and sanitization
- Rate limiting (to be implemented)
- CORS enabled. 
