# Asian Restaurant Server

This is the backend server for the Asian Restaurant Management System. It provides RESTful APIs to manage users, foods, and orders, secured with Firebase authentication.

---

## Features

- User management: create and fetch users  
- Food management: create, read, update foods, track purchase counts  
- Order management: create, read, and delete orders  
- Secure API endpoints with Firebase token verification  
- Role-based access with email verification middleware  
- Retrieve top purchased food items  
- CORS configured for frontend origins  

---

## Tech Stack

- Node.js & Express.js  
- MongoDB & MongoDB Atlas  
- Firebase Admin SDK  
- dotenv  
- cors  
- cookie-parser  

---

## API Endpoints

| Method | Endpoint        | Protected            | Description                                |
| ------ | --------------- | -------------------- | ------------------------------------------ |
| POST   | `/users`        | No                   | Create a new user                          |
| GET    | `/users`        | No                   | Get all users                              |
| POST   | `/foods`        | Yes (Firebase Token) | Add a new food item                        |
| GET    | `/foods`        | No                   | Get all food items                         |
| GET    | `/foods/:id`    | No                   | Get a single food item by ID               |
| GET    | `/food/:email`  | Yes + Email Verify   | Get foods added by a specific user email   |
| PATCH  | `/foods/:id`    | No                   | Update purchase count and quantity of food |
| PUT    | `/foods/:id`    | No                   | Update or upsert a food item               |
| GET    | `/top-purchase` | No                   | Get top 8 purchased food items             |
| POST   | `/orders`       | Yes (Firebase Token) | Place a new order                          |
| GET    | `/orders`       | Yes (Firebase Token) | Get all orders                             |
| GET    | `/order/:email` | Yes + Email Verify   | Get orders for a specific user email       |
| DELETE | `/orders/:id`   | No                   | Delete an order by ID                      |

## Middleware

verifyFirebaseToken: Verifies Firebase JWT token from Authorization header
emailVerify: Checks if email param matches decoded token email

## Setup & Run

git clone https://github.com/Sifat2245/Asian-Server.git
cd your-repo
npm install
#### add your .env file
npm start



