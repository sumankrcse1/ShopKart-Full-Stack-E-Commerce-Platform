# 🛒 ShopKart - Full-Stack E-Commerce Platform

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5.10-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.3-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue.svg)](https://www.postgresql.org/)
[![JWT](https://img.shields.io/badge/JWT-Authentication-orange.svg)](https://jwt.io/)
[![OAuth2](https://img.shields.io/badge/OAuth2-Google-red.svg)](https://oauth.net/2/)

## 📋 Table of Contents
- [Project Overview](#project-overview)
- [Key Features](#key-features)
- [System Architecture](#system-architecture)
- [Technology Stack](#technology-stack)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Security Implementation](#security-implementation)
- [Installation Guide](#installation-guide)
- [Future Enhancements](#future-enhancements)

---
<img width="1470" height="956" alt="shopkart-homepage" src="https://github.com/user-attachments/assets/48953907-3862-419e-beb9-a14cea6a514e" />


<img width="1470" height="923" alt="Screenshot 2026-01-28 at 8 24 42 PM" src="https://github.com/user-attachments/assets/0e4878ba-ae48-4662-885a-dae78df707d8" />

## 🎯 Project Overview

**ShopKart** is a production-ready, full-stack e-commerce platform designed to deliver a seamless shopping experience with enterprise-level security and scalability. The application implements modern software engineering practices including JWT-based authentication, OAuth2 social login, rate limiting, and comprehensive role-based access control.

### Problem Statement

Traditional e-commerce platforms often struggle with:
- **Security vulnerabilities** in authentication and authorization
- **Poor user experience** during checkout and payment processing
- **Lack of scalability** under high traffic loads
- **Limited payment gateway integration**
- **Inefficient admin management** systems

### Solution

ShopKart addresses these challenges through:
- Multi-layered security with JWT and OAuth2
- Advanced rate limiting to prevent abuse
- Seamless Razorpay payment integration
- Comprehensive admin dashboard
- Scalable microservices-ready architecture

---

## ✨ Key Features

### 🔐 Authentication & Authorization

#### Multi-Provider Authentication
- **Traditional Email/Password**: Secure credential-based authentication with bcrypt password hashing
- **OAuth2 Social Login**: One-click Google authentication
- **Email Verification**: OTP-based email verification system with expiry management
- **Password Recovery**: Secure token-based password reset flow

#### Security Features
- JWT-based stateless authentication
- Role-based access control (USER, ADMIN)
- Protected routes with custom authorization filters
- HTTP-only cookies for OAuth2 state management
- CORS configuration for cross-origin security

### 🛍️ E-Commerce Functionality

#### Product Management
- Advanced product catalog with category hierarchy
- Multi-attribute filtering (color, size, price range, discount)
- Dynamic inventory management
- Product rating and review system
- Image hosting and management

#### Shopping Cart
- Persistent cart across sessions
- Real-time price calculations
- Quantity management
- Size and color selection
- Cart synchronization across devices

#### Order Processing
- Multi-step checkout workflow
- Address management system
- Order history and tracking
- Order status updates (PENDING, PLACED, CONFIRMED, SHIPPED, DELIVERED, CANCELLED)
- Invoice generation

### 💳 Payment Integration

#### Razorpay Payment Gateway
- Secure payment link generation
- Multiple payment methods support
- Real-time payment status updates
- Payment verification and callback handling
- Automatic order confirmation on successful payment

### 👨‍💼 Admin Panel

#### Dashboard Analytics
- Revenue tracking and statistics
- Order management metrics
- User growth analytics
- Product performance insights

#### Inventory Management
- Product CRUD operations
- Bulk product uploads
- Category management
- Stock tracking and alerts

#### Order Management
- Order status updates
- Bulk order processing
- Customer information access
- Order cancellation and refunds

#### User Management
- User role management
- User account suspension
- Activity monitoring
- Permission management

### 🛡️ Advanced Security

#### Rate Limiting (Token Bucket Algorithm)
- **Authentication Endpoints**: 5 requests/minute per IP
- **OTP Endpoints**: 
  - Send OTP: 3 requests/hour per email
  - Verify OTP: 10 attempts/10 minutes per email
- **Password Reset**: 3 requests/hour per email
- **API Endpoints**: 100 requests/minute per IP
- **Admin Endpoints**: 200 requests/minute per user

#### Request Validation
- Input sanitization
- SQL injection prevention
- XSS protection
- CSRF token validation

---

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ React SPA    │  │ Admin Panel  │  │ Mobile Apps  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS/REST API
┌───────────────────────────▼─────────────────────────────────┐
│                    API GATEWAY / NGINX                       │
│                  (Load Balancer + CORS)                      │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   SPRING BOOT BACKEND                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SECURITY LAYER                           │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐           │  │
│  │  │ Rate     │→ │  JWT     │→ │  Admin   │           │  │
│  │  │ Limiter  │  │Validator │  │  Filter  │           │  │
│  │  └──────────┘  └──────────┘  └──────────┘           │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              CONTROLLER LAYER                         │  │
│  │  Auth│Product│Cart│Order│Payment│Admin│Review        │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              SERVICE LAYER                            │  │
│  │  Business Logic│DTO Mapping│Validation               │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │              REPOSITORY LAYER                         │  │
│  │  Spring Data JPA│Custom Queries│Transactions          │  │
│  └───────────────────────────────────────────────────────┘  │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   PERSISTENCE LAYER                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │ PostgreSQL   │  │ Redis Cache  │  │ File Storage │      │
│  │   Database   │  │ (Rate Limit) │  │   (Images)   │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                   EXTERNAL SERVICES                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │  Razorpay    │  │ Google OAuth │  │ Email SMTP   │      │
│  │   Payment    │  │    (Auth)    │  │  (SendGrid)  │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Request Flow

```
User Request
    │
    ▼
┌─────────────────┐
│ Rate Limiter    │ → Check request quota
└────────┬────────┘
         │ ✓
         ▼
┌─────────────────┐
│ CORS Filter     │ → Validate origin
└────────┬────────┘
         │ ✓
         ▼
┌─────────────────┐
│ JWT Validator   │ → Extract & verify token
└────────┬────────┘
         │ ✓
         ▼
┌─────────────────┐
│ Admin Filter    │ → Check role (if admin endpoint)
└────────┬────────┘
         │ ✓
         ▼
┌─────────────────┐
│ Controller      │ → Route to appropriate handler
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Service Layer   │ → Business logic execution
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Repository      │ → Database operations
└────────┬────────┘
         │
         ▼
     Response
```

---

## 🛠️ Technology Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **Java** | 21 | Primary programming language |
| **Spring Boot** | 3.5.10 | Application framework |
| **Spring Security** | 3.5.10 | Authentication & authorization |
| **Spring Data JPA** | 3.5.10 | ORM and database interaction |
| **PostgreSQL** | Latest | Primary database |
| **JWT (JJWT)** | 0.12.6 | Token-based authentication |
| **Bucket4j** | 8.10.1 | Rate limiting implementation |
| **Razorpay SDK** | 1.4.3 | Payment gateway integration |
| **Spring Mail** | 3.5.10 | Email service |
| **OAuth2 Client** | 3.5.10 | Social authentication |
| **Maven** | Latest | Build automation |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| **React** | 19.2.3 | UI library |
| **React Router** | 7.11.0 | Client-side routing |
| **Redux** | 9.2.0 | State management |
| **Redux Thunk** | 3.1.0 | Async actions |
| **Material-UI** | 7.3.6 | Component library |
| **Axios** | 1.13.2 | HTTP client |
| **Tailwind CSS** | 3.4.17 | Utility-first CSS |
| **ApexCharts** | 5.3.6 | Data visualization |
| **Lucide React** | 0.562.0 | Icon library |

### DevOps & Tools
- **Docker** - Containerization
- **Git** - Version control
- **Postman** - API testing
- **Maven** - Dependency management
- **npm** - Package management

---

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│    User     │         │   Product   │         │   Category  │
├─────────────┤         ├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │         │ id (PK)     │
│ firstName   │         │ title       │         │ name        │
│ lastName    │         │ description │         │ level       │
│ email       │────┐    │ price       │────┐    │ parent_id   │
│ password    │    │    │ discount... │    │    └─────────────┘
│ role        │    │    │ quantity    │    │           │
│ mobile      │    │    │ brand       │    │           │
│ createdAt   │    │    │ color       │    │           │
└─────────────┘    │    │ category_id │────┘-----------|
      │            │    │ imageUrl    │                
      │            │    └─────────────┘                
      │            │           │                       
      │            │           │                       
      ▼            │           ▼                       
┌─────────────┐   │    ┌─────────────┐                 
│   Address   │   │    │    Size     │                 
├─────────────┤   │    ├─────────────┤                 
│ id (PK)     │   │    │ name        │                 
│ user_id (FK)│◄──┘    │ quantity    │                 
│ firstName   │        └─────────────┘                 
│ streetAddr  │                │                       
│ city        │                │                       
│ state       │                ▼                       
│ zipCode     │         ┌─────────────┐                
│ mobile      │         │   Rating    │                
└─────────────┘         ├─────────────┤                
      │                 │ id (PK)     │                
      │                 │ user_id(FK) │                
      │                 │ product_id  │                
      │                 │ rating      │                
      │                 │ createdAt   │                
      │                 └─────────────┘                
      │                        │                       
      │                        │                       
      ▼                        ▼                       
┌─────────────┐         ┌─────────────┐               
│    Cart     │         │   Review    │               
├─────────────┤         ├─────────────┤               
│ id (PK)     │         │ id (PK)     │               
│ user_id(FK) │         │ user_id(FK) │               
│ totalPrice  │         │ product_id  │               
│ discount... │         │ review      │               
└─────────────┘         │ createdAt   │               
      │                 └─────────────┘               
      │                                               
      ▼                                               
┌─────────────┐                                       
│  CartItem   │                                       
├─────────────┤                                       
│ id (PK)     │                                       
│ cart_id(FK) │                                       
│ product_id  │                                       
│ size        │                                       
│ quantity    │                                       
│ price       │                                       
└─────────────┘                                       
      │                                               
      │                                               
      ▼                                               
┌─────────────┐         ┌─────────────┐               
│    Order    │         │  OrderItem  │               
├─────────────┤         ├─────────────┤               
│ id (PK)     │◄────────┤ id (PK)     │               
│ orderId     │         │ order_id(FK)│               
│ user_id(FK) │         │ product_id  │               
│ orderDate   │         │ size        │               
│ totalPrice  │         │ quantity    │               
│ status      │         │ price       │               
│ address_id  │         └─────────────┘               
└─────────────┘                                       
      │                                               
      │                                               
      ▼                                               
┌─────────────┐                                       
│ PaymentDtls │                                       
├─────────────┤                                       
│ paymentId   │                                       
│ status      │                                       
│ rzp_link_id │                                       
│ rzp_status  │                                       
└─────────────┘                                       
                                                      
┌─────────────┐                                       
│  EmailOTP   │                                       
├─────────────┤                                       
│ id (PK)     │                                       
│ email       │                                       
│ otp         │                                      
│ expiryTime  │                                       
│ verified    │                                       
│ attemptCnt  │                                       
└─────────────┘                                       
                                                      
┌─────────────┐                                       
│ PassResetTkn│                                       
├─────────────┤                                       
│ id (PK)     │                                       
│ token       │                                       
│ user_id(FK) │                                       
│ expiryDate  │                                       
│ used        │                                       
└─────────────┘                                       
                                                      
┌─────────────┐                                       
│OAuth2UsrInfo│                                       
├─────────────┤                                       
│ id (PK)     │                                       
│ email       │                                       
│ providerId  │                                       
│ provider    │                                       
│ imageUrl    │                                       
│ user_id(FK) │                                       
└─────────────┘                                       
```

### Key Relationships

- **User → Address**: One-to-Many (One user can have multiple addresses)
- **User → Cart**: One-to-One (Each user has one active cart)
- **Cart → CartItem**: One-to-Many (Cart contains multiple items)
- **User → Order**: One-to-Many (User can place multiple orders)
- **Order → OrderItem**: One-to-Many (Order contains multiple items)
- **Product → Category**: Many-to-One (Products belong to categories)
- **Category → Category**: Self-referencing (Hierarchical categories)
- **Product → Rating/Review**: One-to-Many (Products have ratings and reviews)
- **User → OAuth2UserInfo**: One-to-One (OAuth user mapping)

---

## 📚 API Documentation

### Base URL
```
Development: http://localhost:8080
Production: https://api.shopkart.com
```

### Authentication Header
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication APIs

### 1. User Registration

**Endpoint:** `POST /auth/signup`

**Description:** Register a new user account with email verification

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "mobile": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Registration successful",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "mobile": "+1234567890",
    "createdAt": "2026-01-28T10:30:00"
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input data
- `409 Conflict` - Email already registered
- `429 Too Many Requests` - Rate limit exceeded (5 req/min)

---

### 2. User Login

**Endpoint:** `POST /auth/signin`

**Description:** Authenticate user and receive JWT token

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "jwt": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "message": "Login successful",
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "USER"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid credentials
- `404 Not Found` - User not found
- `429 Too Many Requests` - Rate limit exceeded (5 req/min)

---

### 3. Google OAuth2 Login

**Endpoint:** `GET /oauth2/authorize/google`

**Description:** Initiate Google OAuth2 authentication flow

**Query Parameters:** None

**Response:** Redirects to Google authentication page

**Success Redirect:** `/oauth2/redirect?token=<JWT_TOKEN>`

**Failure Redirect:** `/oauth2/redirect?error=<ERROR_MESSAGE>`

---

### 4. Get User Profile

**Endpoint:** `GET /api/users/profile`

**Description:** Retrieve authenticated user's profile

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "role": "USER",
  "mobile": "+1234567890",
  "addresses": [
    {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe",
      "streetAddress": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001",
      "mobile": "+1234567890"
    }
  ],
  "createdAt": "2026-01-28T10:30:00"
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid or missing token
- `403 Forbidden` - Token expired

---

### 5. Forgot Password

**Endpoint:** `POST /auth/forgot-password`

**Description:** Request password reset email with secure token

**Request Body:**
```json
{
  "email": "john.doe@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset link sent to your email"
}
```

**Error Responses:**
- `404 Not Found` - Email not registered
- `429 Too Many Requests` - Rate limit exceeded (3 req/hour)

---

### 6. Reset Password

**Endpoint:** `POST /auth/reset-password`

**Description:** Reset password using token from email

**Request Body:**
```json
{
  "token": "abc123def456...",
  "newPassword": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password reset successful"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid or expired token
- `400 Bad Request` - Weak password

---

### 7. Validate Reset Token

**Endpoint:** `GET /auth/validate-reset-token`

**Description:** Check if password reset token is valid

**Query Parameters:**
- `token` - Password reset token

**Request:**
```
GET /auth/validate-reset-token?token=abc123def456...
```

**Response (200 OK):**
```json
{
  "valid": true
}
```

**Error Response:**
```json
{
  "valid": false,
  "message": "Token expired or invalid"
}
```

---

## 🛍️ Product APIs

### 8. Get All Products (with Filters)

**Endpoint:** `GET /api/products`

**Description:** Retrieve paginated product list with advanced filtering

**Query Parameters:**
- `category` - Filter by category (optional)
- `color` - Filter by colors (comma-separated, optional)
- `size` - Filter by sizes (comma-separated, optional)
- `minPrice` - Minimum price (default: 0)
- `maxPrice` - Maximum price (default: 10000)
- `minDiscount` - Minimum discount percentage (default: 0)
- `sort` - Sort order: `price_low`, `price_high`, `newest` (default: `price_low`)
- `pageNumber` - Page number (default: 0)
- `pageSize` - Items per page (default: 10)
- `stock` - Stock availability filter (optional)

**Request Example:**
```
GET /api/products?category=Electronics&minPrice=100&maxPrice=500&sort=price_low&pageNumber=0&pageSize=20
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Premium Wireless Headphones",
      "description": "High-quality wireless headphones with noise cancellation",
      "price": 299,
      "discountPrice": 249,
      "discountPercent": 17,
      "quantity": 50,
      "brand": "TechBrand",
      "color": "Black",
      "sizes": [
        { "name": "Standard", "quantity": 50 }
      ],
      "imageUrl": "https://example.com/images/headphones.jpg",
      "category": {
        "id": 5,
        "name": "Electronics",
        "level": 1
      },
      "numRatings": 4.5,
      "createdAt": "2026-01-20T14:30:00"
    }
  ],
  "totalElements": 150,
  "totalPages": 15,
  "size": 10,
  "number": 0,
  "first": true,
  "last": false,
  "numberOfElements": 10
}
```

---

### 9. Get Product by ID

**Endpoint:** `GET /api/products/id/{productId}`

**Description:** Retrieve detailed product information

**Path Parameters:**
- `productId` - Product ID

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Premium Wireless Headphones",
  "description": "High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality",
  "price": 299,
  "discountPrice": 249,
  "discountPercent": 17,
  "quantity": 50,
  "brand": "TechBrand",
  "color": "Black",
  "sizes": [
    { "name": "Standard", "quantity": 50 }
  ],
  "imageUrl": "https://example.com/images/headphones.jpg",
  "category": {
    "id": 5,
    "name": "Electronics",
    "level": 1
  },
  "ratings": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "firstName": "Alice",
        "lastName": "Smith"
      },
      "rating": 5.0,
      "createdAt": "2026-01-25T09:15:00"
    }
  ],
  "reviews": [
    {
      "id": 1,
      "user": {
        "id": 2,
        "firstName": "Alice",
        "lastName": "Smith"
      },
      "review": "Excellent sound quality! Worth every penny.",
      "createdAt": "2026-01-25T09:20:00"
    }
  ],
  "numRatings": 4.5,
  "createdAt": "2026-01-20T14:30:00"
}
```

**Error Responses:**
- `404 Not Found` - Product not found

---

## 🛒 Cart APIs

### 10. Get User Cart

**Endpoint:** `GET /api/cart/`

**Description:** Retrieve current user's shopping cart

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "email": "john.doe@example.com"
  },
  "cartItems": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "title": "Premium Wireless Headphones",
        "imageUrl": "https://example.com/images/headphones.jpg",
        "brand": "TechBrand"
      },
      "size": "Standard",
      "quantity": 2,
      "price": 299,
      "discountedPrice": 249,
      "userId": 1
    }
  ],
  "totalPrice": 598,
  "totalDiscountedPrice": 498,
  "discount": 100,
  "totalItem": 2
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Cart not found

---

### 11. Add Item to Cart

**Endpoint:** `PUT /api/cart/add`

**Description:** Add a product to the shopping cart

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": 1,
  "size": "Standard",
  "quantity": 2
}
```

**Response (200 OK):**
```json
{
  "message": "Item added to cart successfully",
  "cartItem": {
    "id": 1,
    "product": {
      "id": 1,
      "title": "Premium Wireless Headphones"
    },
    "size": "Standard",
    "quantity": 2,
    "price": 299,
    "discountedPrice": 249
  }
}
```

**Error Responses:**
- `400 Bad Request` - Invalid product or size
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Product not found

---

### 12. Update Cart Item

**Endpoint:** `PUT /api/cart_items/{cartItemId}`

**Description:** Update quantity of item in cart

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Path Parameters:**
- `cartItemId` - Cart item ID

**Request Body:**
```json
{
  "quantity": 3
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "quantity": 3,
  "price": 299,
  "discountedPrice": 249
}
```

**Error Responses:**
- `400 Bad Request` - Invalid quantity
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Cart item not found

---

### 13. Remove Cart Item

**Endpoint:** `DELETE /api/cart_items/{cartItemId}`

**Description:** Remove an item from cart

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `cartItemId` - Cart item ID

**Response (200 OK):**
```json
{
  "message": "Item removed from cart successfully",
  "cartItemId": 1
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Cart item not found

---

## 📦 Order APIs

### 14. Create Order

**Endpoint:** `POST /api/orders/`

**Description:** Create a new order from cart items

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "streetAddress": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zipCode": "10001",
  "mobile": "+1234567890"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "orderId": "ORD20260128001",
  "user": {
    "id": 1,
    "email": "john.doe@example.com"
  },
  "orderItems": [
    {
      "id": 1,
      "product": {
        "id": 1,
        "title": "Premium Wireless Headphones"
      },
      "size": "Standard",
      "quantity": 2,
      "price": 299,
      "discountedPrice": 249
    }
  ],
  "orderDate": "2026-01-28T15:30:00",
  "deliveryDate": "2026-02-04T15:30:00",
  "shippingAddress": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "streetAddress": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001",
    "mobile": "+1234567890"
  },
  "paymentDetails": {
    "status": "PENDING"
  },
  "totalPrice": 598,
  "totalDiscountedPrice": 498,
  "discount": 100,
  "orderStatus": "PENDING",
  "totalItem": 2,
  "createdAt": "2026-01-28T15:30:00"
}
```

**Error Responses:**
- `400 Bad Request` - Empty cart or invalid address
- `401 Unauthorized` - Invalid token

---

### 15. Get Order by ID

**Endpoint:** `GET /api/orders/{orderId}`

**Description:** Retrieve order details

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `orderId` - Order ID

**Response (200 OK):**
```json
{
  "id": 1,
  "orderId": "ORD20260128001",
  "orderStatus": "PLACED",
  "totalPrice": 598,
  "totalDiscountedPrice": 498,
  "orderItems": [...],
  "shippingAddress": {...},
  "paymentDetails": {
    "status": "COMPLETED",
    "paymentId": "pay_123abc",
    "razorpayPaymentLinkId": "plink_xyz789"
  }
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `403 Forbidden` - Not authorized to view this order
- `404 Not Found` - Order not found

---

### 16. Get Order History

**Endpoint:** `GET /api/orders/user`

**Description:** Retrieve user's order history

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "orderId": "ORD20260128001",
    "orderDate": "2026-01-28T15:30:00",
    "orderStatus": "DELIVERED",
    "totalPrice": 598,
    "totalItem": 2
  },
  {
    "id": 2,
    "orderId": "ORD20260125002",
    "orderDate": "2026-01-25T10:15:00",
    "orderStatus": "SHIPPED",
    "totalPrice": 149,
    "totalItem": 1
  }
]
```

**Error Responses:**
- `401 Unauthorized` - Invalid token

---

## 💳 Payment APIs

### 17. Create Payment Link

**Endpoint:** `POST /api/payments/{orderId}`

**Description:** Generate Razorpay payment link for order

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Path Parameters:**
- `orderId` - Order ID

**Response (200 OK):**
```json
{
  "payment_link_id": "plink_xyz789abc",
  "payment_link_url": "https://rzp.io/i/xyz789abc",
  "order_id": 1,
  "amount": 49800,
  "currency": "INR",
  "status": "created"
}
```

**Note:** User will be automatically redirected to `payment_link_url`

**Error Responses:**
- `400 Bad Request` - Order already paid
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Order not found

---

### 18. Update Payment Status

**Endpoint:** `GET /api/payments`

**Description:** Razorpay callback endpoint to update payment status

**Query Parameters:**
- `razorpay_payment_id` - Razorpay payment ID
- `razorpay_payment_link_id` - Payment link ID
- `razorpay_payment_link_reference_id` - Order ID
- `razorpay_payment_link_status` - Payment status

**Request Example:**
```
GET /api/payments?razorpay_payment_id=pay_123&razorpay_payment_link_id=plink_xyz&razorpay_payment_link_reference_id=1&razorpay_payment_link_status=paid
```

**Response (200 OK):**
```json
{
  "message": "Payment updated successfully",
  "order": {
    "id": 1,
    "orderId": "ORD20260128001",
    "orderStatus": "PLACED",
    "paymentDetails": {
      "status": "COMPLETED",
      "paymentId": "pay_123",
      "razorpayPaymentLinkId": "plink_xyz",
      "razorpayPaymentLinkStatus": "paid"
    }
  }
}
```

---

## ⭐ Rating & Review APIs

### 19. Create Product Rating

**Endpoint:** `POST /api/ratings/create`

**Description:** Submit a rating for a product

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": 1,
  "rating": 4.5
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe"
  },
  "product": {
    "id": 1,
    "title": "Premium Wireless Headphones"
  },
  "rating": 4.5,
  "createdAt": "2026-01-28T16:00:00"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid rating value (must be 0-5)
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Product not found

---

### 20. Get Product Ratings

**Endpoint:** `GET /api/ratings/product/{productId}`

**Description:** Retrieve all ratings for a product

**Path Parameters:**
- `productId` - Product ID

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe"
    },
    "rating": 4.5,
    "createdAt": "2026-01-28T16:00:00"
  },
  {
    "id": 2,
    "user": {
      "id": 2,
      "firstName": "Alice",
      "lastName": "Smith"
    },
    "rating": 5.0,
    "createdAt": "2026-01-27T14:30:00"
  }
]
```

---

### 21. Create Product Review

**Endpoint:** `POST /api/reviews/create`

**Description:** Submit a written review for a product

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "productId": 1,
  "review": "Excellent product! The sound quality is amazing and battery life exceeds expectations."
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe"
  },
  "product": {
    "id": 1,
    "title": "Premium Wireless Headphones"
  },
  "review": "Excellent product! The sound quality is amazing and battery life exceeds expectations.",
  "createdAt": "2026-01-28T16:05:00"
}
```

**Error Responses:**
- `400 Bad Request` - Empty review text
- `401 Unauthorized` - Invalid token
- `404 Not Found` - Product not found

---

### 22. Get Product Reviews

**Endpoint:** `GET /api/reviews/product/{productId}`

**Description:** Retrieve all reviews for a product

**Path Parameters:**
- `productId` - Product ID

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "user": {
      "id": 1,
      "firstName": "John",
      "lastName": "Doe"
    },
    "review": "Excellent product! The sound quality is amazing.",
    "createdAt": "2026-01-28T16:05:00"
  },
  {
    "id": 2,
    "user": {
      "id": 2,
      "firstName": "Alice",
      "lastName": "Smith"
    },
    "review": "Great value for money. Highly recommended!",
    "createdAt": "2026-01-27T15:00:00"
  }
]
```

---

## 👨‍💼 Admin APIs

**Note:** All admin endpoints require `ADMIN` role and proper authentication.

### 23. Get Admin Dashboard Statistics

**Endpoint:** `GET /api/admin/stats`

**Description:** Retrieve dashboard analytics and key metrics

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response (200 OK):**
```json
{
  "totalRevenue": 125000.50,
  "totalOrders": 1250,
  "totalUsers": 5432,
  "totalProducts": 350,
  "pendingOrders": 45,
  "monthlyRevenue": 25000.00,
  "monthlyOrders": 230,
  "revenueGrowth": 15.5,
  "orderGrowth": 12.3
}
```

**Error Responses:**
- `401 Unauthorized` - Invalid token
- `403 Forbidden` - Not an admin user

---

### 24. Get All Products (Admin - Paginated)

**Endpoint:** `GET /api/admin/products/paginated`

**Description:** Retrieve paginated product list for admin management

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Query Parameters:**
- `page` - Page number (default: 0)
- `size` - Items per page (default: 10)

**Request:**
```
GET /api/admin/products/paginated?page=0&size=20
```

**Response (200 OK):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Premium Wireless Headphones",
      "price": 299,
      "discountPrice": 249,
      "quantity": 50,
      "brand": "TechBrand",
      "category": {
        "name": "Electronics"
      },
      "createdAt": "2026-01-20T14:30:00"
    }
  ],
  "totalElements": 350,
  "totalPages": 18,
  "size": 20,
  "number": 0
}
```

---

### 25. Create Product (Admin)

**Endpoint:** `POST /api/admin/products`

**Description:** Create a new product

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Ultra Slim Laptop",
  "description": "Lightweight laptop with high performance",
  "price": 1299,
  "discountPrice": 1199,
  "discountPercent": 8,
  "quantity": 25,
  "brand": "TechPro",
  "color": "Silver",
  "sizes": [
    { "name": "13-inch", "quantity": 15 },
    { "name": "15-inch", "quantity": 10 }
  ],
  "imageUrl": "https://example.com/images/laptop.jpg",
  "topLevelCategory": "Electronics",
  "secondLevelCategory": "Computers",
  "thirdLevelCategory": "Laptops"
}
```

**Response (201 Created):**
```json
{
  "id": 351,
  "title": "Ultra Slim Laptop",
  "price": 1299,
  "discountPrice": 1199,
  "quantity": 25,
  "createdAt": "2026-01-28T17:00:00"
}
```

**Error Responses:**
- `400 Bad Request` - Invalid product data
- `403 Forbidden` - Not an admin user

---

### 26. Update Product (Admin)

**Endpoint:** `PUT /api/admin/products/{productId}`

**Description:** Update existing product details

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**Path Parameters:**
- `productId` - Product ID

**Request Body:**
```json
{
  "price": 1199,
  "discountPrice": 1099,
  "quantity": 30
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Premium Wireless Headphones",
  "price": 1199,
  "discountPrice": 1099,
  "quantity": 30,
  "updatedAt": "2026-01-28T17:15:00"
}
```

---

### 27. Delete Product (Admin)

**Endpoint:** `DELETE /api/admin/products/{productId}/delete`

**Description:** Delete a product from the system

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Path Parameters:**
- `productId` - Product ID

**Response (200 OK):**
```json
{
  "message": "Product deleted successfully",
  "productId": 1
}
```

**Error Responses:**
- `403 Forbidden` - Not an admin user
- `404 Not Found` - Product not found

---

### 28. Get All Orders (Admin)

**Endpoint:** `GET /api/admin/orders`

**Description:** Retrieve all orders for admin management

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "orderId": "ORD20260128001",
    "user": {
      "id": 1,
      "email": "john.doe@example.com"
    },
    "orderDate": "2026-01-28T15:30:00",
    "orderStatus": "PLACED",
    "totalPrice": 598,
    "totalItem": 2
  }
]
```

---

### 29. Update Order Status (Admin)

**Endpoint:** `PUT /api/admin/orders/{orderId}/status`

**Description:** Update order status

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
Content-Type: application/json
```

**Path Parameters:**
- `orderId` - Order ID

**Request Body:**
```json
{
  "status": "SHIPPED"
}
```

**Valid Status Values:**
- `PENDING`
- `PLACED`
- `CONFIRMED`
- `SHIPPED`
- `DELIVERED`
- `CANCELLED`

**Response (200 OK):**
```json
{
  "id": 1,
  "orderId": "ORD20260128001",
  "orderStatus": "SHIPPED",
  "updatedAt": "2026-01-28T18:00:00"
}
```

---

### 30. Delete Order (Admin)

**Endpoint:** `DELETE /api/admin/orders/{orderId}`

**Description:** Delete an order from the system

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Path Parameters:**
- `orderId` - Order ID

**Response (200 OK):**
```json
{
  "message": "Order deleted successfully",
  "orderId": 1
}
```

---

### 31. Get All Users (Admin)

**Endpoint:** `GET /api/admin/users`

**Description:** Retrieve all registered users

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@example.com",
    "role": "USER",
    "mobile": "+1234567890",
    "createdAt": "2026-01-28T10:30:00"
  },
  {
    "id": 2,
    "firstName": "Alice",
    "lastName": "Smith",
    "email": "alice.smith@example.com",
    "role": "USER",
    "mobile": "+1234567891",
    "createdAt": "2026-01-27T09:15:00"
  }
]
```

---

### 32. Delete User (Admin)

**Endpoint:** `DELETE /api/admin/users/{userId}`

**Description:** Delete a user account

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Path Parameters:**
- `userId` - User ID

**Response (200 OK):**
```json
{
  "message": "User deleted successfully",
  "userId": 1
}
```

---

### 33. Get Sales Report (Admin)

**Endpoint:** `GET /api/admin/reports/sales`

**Description:** Generate sales report for specified date range

**Headers:**
```
Authorization: Bearer <ADMIN_JWT_TOKEN>
```

**Query Parameters:**
- `startDate` - Start date (format: YYYY-MM-DD)
- `endDate` - End date (format: YYYY-MM-DD)

**Request:**
```
GET /api/admin/reports/sales?startDate=2026-01-01&endDate=2026-01-31
```

**Response (200 OK):**
```json
{
  "startDate": "2026-01-01",
  "endDate": "2026-01-31",
  "totalRevenue": 125000.50,
  "totalOrders": 450,
  "averageOrderValue": 277.78,
  "topProducts": [
    {
      "productId": 1,
      "title": "Premium Wireless Headphones",
      "totalSold": 120,
      "revenue": 29880.00
    }
  ],
  "dailyStats": [
    {
      "date": "2026-01-28",
      "orders": 15,
      "revenue": 4200.00
    }
  ]
}
```

---

## 🔒 Security Implementation

### JWT Authentication Flow

```
1. User Login
   ↓
2. Server validates credentials
   ↓
3. Generate JWT with email claim
   ↓
4. Return JWT to client
   ↓
5. Client stores JWT (localStorage)
   ↓
6. Client sends JWT in Authorization header
   ↓
7. Server validates JWT signature
   ↓
8. Extract user email from token
   ↓
9. Grant access to protected resources
```

### Security Features

#### 1. Password Security
- **Hashing:** BCrypt with salt (strength: 10)
- **Minimum Length:** 6 characters
- **Password Reset:** Token-based with 24-hour expiry
- **No Plain Text Storage:** Passwords never stored in plain text

#### 2. JWT Token Management
- **Algorithm:** HMAC-SHA256
- **Expiration:** 24 hours
- **Claims:** Email, issue time, expiration
- **Secret Key:** Environment-based configuration
- **Stateless:** No server-side session storage

#### 3. Rate Limiting Implementation

**Token Bucket Algorithm using Bucket4j:**

```java
// Authentication endpoints: 5 requests/minute
Bandwidth limit = Bandwidth.classic(5, 
    Refill.intervally(5, Duration.ofMinutes(1)));

// OTP send: 3 requests/hour per email
Bandwidth limit = Bandwidth.classic(3, 
    Refill.intervally(3, Duration.ofHours(1)));

// API endpoints: 100 requests/minute
Bandwidth limit = Bandwidth.classic(100, 
    Refill.intervally(100, Duration.ofMinutes(1)));
```

**Rate Limit Headers:**
```
X-Rate-Limit-Remaining: 95
X-Rate-Limit-Retry-After-Seconds: 45
```

**Rate Limit Response:**
```json
{
  "error": "Too many requests",
  "message": "Rate limit exceeded. Please try again in 45 seconds.",
  "retryAfter": 45
}
```

#### 4. Authorization Levels

**Public Endpoints:**
- Product listing
- Product details
- Authentication endpoints

**User Endpoints (Requires JWT):**
- Cart management
- Order placement
- Profile management
- Reviews and ratings

**Admin Endpoints (Requires ADMIN role):**
- Product management
- Order management
- User management
- Dashboard analytics

#### 5. Input Validation
- **Jakarta Validation:** Bean validation annotations
- **SQL Injection Prevention:** Parameterized queries via JPA
- **XSS Protection:** Output encoding
- **Email Validation:** Regex pattern matching
- **Phone Validation:** International format support

#### 6. CORS Configuration
```java
config.setAllowedOrigins(List.of(
    "http://localhost:3000",
    "https://shopkart.com"
));
config.setAllowedMethods(List.of(
    "GET", "POST", "PUT", "DELETE", "OPTIONS"
));
config.setAllowedHeaders(List.of("*"));
config.setAllowCredentials(true);
```

#### 7. OAuth2 Security
- **State Parameter:** CSRF protection
- **HTTP-only Cookies:** Authorization request storage
- **Token Validation:** Google ID token verification
- **User Mapping:** Automatic local account creation/linking

---

## 🚀 Installation Guide

### Prerequisites
```bash
- Java 21 or higher
- Node.js 18+ and npm
- PostgreSQL 14+
- Maven 3.8+
- Git
```

### Backend Setup

#### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/shopkart.git
cd shopkart/backend
```

#### 2. Database Configuration

**Create PostgreSQL Database:**
```sql
CREATE DATABASE shopkart_db;
CREATE USER shopkart_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shopkart_db TO shopkart_user;
```

**Configure `application.properties`:**
```properties
# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/shopkart_db
spring.datasource.username=shopkart_user
spring.datasource.password=your_password
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

# JWT Configuration
jwt.secret=your_secret_key_here_minimum_32_characters_long

# Email Configuration (for OTP and password reset)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=your_email@gmail.com
spring.mail.password=your_app_password
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true

# Razorpay Configuration
razorpay.key.id=your_razorpay_key_id
razorpay.key.secret=your_razorpay_key_secret

# OAuth2 Configuration
spring.security.oauth2.client.registration.google.client-id=your_google_client_id
spring.security.oauth2.client.registration.google.client-secret=your_google_client_secret
spring.security.oauth2.client.registration.google.scope=email,profile

# Frontend URL (for OAuth redirect)
app.oauth2.redirect-uri=http://localhost:3000/oauth2/redirect
```

#### 3. Build and Run Backend
```bash
# Build the project
mvn clean install

# Run the application
mvn spring-boot:run

# Or run the JAR file
java -jar target/ecommerce-backend.jar
```

**Backend will start on:** `http://localhost:8080`

---

### Frontend Setup

#### 1. Navigate to Frontend Directory
```bash
cd ../frontend
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables

**Create `.env` file:**
```env
REACT_APP_API_BASE_URL=http://localhost:8080
REACT_APP_RAZORPAY_KEY_ID=your_razorpay_key_id
```

#### 4. Run Frontend
```bash
# Development mode
npm start

# Production build
npm run build
```

**Frontend will start on:** `http://localhost:3000`

---

### Environment-Specific Configuration

#### Development
```properties
spring.profiles.active=dev
server.port=8080
logging.level.com.suman.ecommerce=DEBUG
```

#### Production
```properties
spring.profiles.active=prod
server.port=8080
spring.jpa.hibernate.ddl-auto=validate
logging.level.com.suman.ecommerce=INFO
```

---

### Docker Setup (Optional)

**Backend Dockerfile:**
```dockerfile
FROM openjdk:21-jdk-slim
WORKDIR /app
COPY target/ecommerce-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: shopkart_db
      POSTGRES_USER: shopkart_user
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - postgres
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/shopkart_db

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

**Run with Docker:**
```bash
docker-compose up -d
```

---

## 🔄 API Testing with Postman

### Import Collection

**Environment Variables:**
```json
{
  "baseUrl": "http://localhost:8080",
  "authToken": "",
  "adminToken": ""
}
```

### Sample Test Scenarios

#### 1. User Registration and Login Flow
```javascript
// Register
POST {{baseUrl}}/auth/signup
Body: { "email": "test@example.com", ... }

// Login
POST {{baseUrl}}/auth/signin
Body: { "email": "test@example.com", "password": "..." }

// Save token to environment
pm.environment.set("authToken", pm.response.json().jwt);
```

#### 2. Product Search and Cart Flow
```javascript
// Search products
GET {{baseUrl}}/api/products?category=Electronics

// Add to cart
PUT {{baseUrl}}/api/cart/add
Headers: Authorization: Bearer {{authToken}}
Body: { "productId": 1, "quantity": 2 }

// View cart
GET {{baseUrl}}/api/cart/
Headers: Authorization: Bearer {{authToken}}
```

#### 3. Checkout and Payment Flow
```javascript
// Create order
POST {{baseUrl}}/api/orders/
Headers: Authorization: Bearer {{authToken}}
Body: { "address": {...} }

// Create payment
POST {{baseUrl}}/api/payments/{{orderId}}
Headers: Authorization: Bearer {{authToken}}
```

---

## 📊 Performance Optimization

### Database Optimization
- **Indexing:** Created indexes on frequently queried columns
  - `users.email`
  - `products.category_id`
  - `orders.user_id`
  - `orders.order_date`

- **Query Optimization:**
  - Lazy loading for relationships
  - Pagination for large datasets
  - Custom JPQL queries for complex operations

- **Connection Pooling:** HikariCP configuration
```properties
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
```

### Caching Strategy
- **Redis Cache:** Rate limit bucket storage
- **In-Memory Cache:** Category hierarchy
- **HTTP Caching:** Product images with CDN

### API Response Time Targets
- **Product Listing:** < 200ms
- **Cart Operations:** < 150ms
- **Order Creation:** < 300ms
- **Search Queries:** < 250ms

---

## 🧪 Testing Strategy

### Unit Tests
```java
@Test
public void testUserRegistration() {
    // Test user registration logic
}

@Test
public void testJwtGeneration() {
    // Test JWT token generation
}
```

### Integration Tests
```java
@SpringBootTest
@AutoConfigureMockMvc
public class OrderIntegrationTest {
    @Test
    public void testOrderCreationFlow() {
        // Test complete order flow
    }
}
```

### API Tests (Postman/Newman)
- Automated API testing suite
- Pre-request scripts for authentication
- Test assertions for response validation

---

## 🌟 Future Enhancements

### Planned Features

#### 1. Advanced Search
- **Elasticsearch Integration:** Full-text search
- **Auto-suggestions:** Search recommendations
- **Voice Search:** Voice-based product search
- **Visual Search:** Image-based product discovery

#### 2. Recommendation Engine
- **Collaborative Filtering:** User-based recommendations
- **Content-Based Filtering:** Product similarity
- **Hybrid Approach:** Combined recommendation strategy
- **Machine Learning:** Personalized suggestions

#### 3. Real-time Features
- **WebSocket Integration:** Live order tracking
- **Push Notifications:** Order status updates
- **Chat Support:** Real-time customer service
- **Live Inventory:** Real-time stock updates

#### 4. Payment Gateway Expansion
- **Stripe Integration:** International payments
- **PayPal Support:** Alternative payment method
- **Wallet Integration:** Digital wallet support
- **Cryptocurrency:** Crypto payment options

#### 5. Mobile Application
- **React Native:** Cross-platform mobile app
- **Push Notifications:** Mobile alerts
- **Offline Mode:** Offline browsing capability
- **Biometric Auth:** Fingerprint/Face ID login

#### 6. Advanced Analytics
- **Business Intelligence:** Advanced reporting
- **Predictive Analytics:** Sales forecasting
- **Customer Insights:** Behavior analysis
- **A/B Testing:** Feature optimization

#### 7. Multi-vendor Support
- **Vendor Dashboard:** Seller management
- **Commission System:** Automated calculations
- **Vendor Analytics:** Performance metrics
- **Multi-store Support:** Multiple storefronts

#### 8. Internationalization
- **Multi-language:** i18n support
- **Multi-currency:** Currency conversion
- **Regional Tax:** Location-based taxation
- **Shipping Zones:** International shipping

#### 9. Security Enhancements
- **Two-Factor Authentication:** Enhanced security
- **Biometric Login:** Face/Fingerprint auth
- **Advanced Fraud Detection:** AI-based monitoring
- **Security Audits:** Regular penetration testing

#### 10. Performance Improvements
- **GraphQL API:** Flexible data fetching
- **Server-Side Rendering:** SEO optimization
- **CDN Integration:** Global content delivery
- **Microservices:** Service decomposition

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Suman Kumar**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Email: your.email@example.com

---

## 🙏 Acknowledgments

- Spring Boot team for the excellent framework
- React team for the powerful UI library
- Razorpay for payment gateway services
- PostgreSQL community for the robust database
- All open-source contributors

---

## 📞 Support

For support and queries:
- **Email:** support@shopkart.com
- **Documentation:** [docs.shopkart.com](https://docs.shopkart.com)
- **Issue Tracker:** [GitHub Issues](https://github.com/yourusername/shopkart/issues)

---

**⭐ If you find this project useful, please consider giving it a star on GitHub!**

---

*Last Updated: January 28, 2026*
