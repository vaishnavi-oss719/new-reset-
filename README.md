📌 Authentication Backend API

A secure backend API for user authentication with password reset functionality using Node.js, Express, MongoDB, and Brevo email service.

🚀 Live API
(https://new-reset.onrender.com)
🛠️ Tech Stack

Node.js

Express.js

MongoDB (Mongoose)

bcrypt (Password hashing)

crypto (Secure reset tokens)

dotenv (Environment variables)

Axios

Brevo SMTP API (Email service)

Render (Deployment)

📂 Project Structure
server/
│-config/
    \__db.js
├── models/
│   └── User.js
│
├── routes/
│   └── authRoutes.js
│
├── controllers/
│   └── authController.js
│
├── index.js
├── package.json
└── .env
⚙️ Environment Variables

Create a .env file:

PORT=4000
MONGO_URI="mongodb+srv://suba72176_db_user:2jnDhcfcjwf8FBFY@cluster0.0pi0sip.mongodb.net/PasswordReset"
JWT_SECRET=supersecretkey
EMAIL_USER=rv172542@gmail.com
EMAIL_PASS=tqwk skcw wseo gpvy
CLIENT_URL=https://password-ten-azure.vercel.app

⚠️ In Render deployment, add these inside Environment → Environment Variables



🔐 API Endpoints
1️⃣ Register User

POST

/api/auth/register
Body:
{
  "name": "Vaishnavi",
  "email": "vaish@gmail.com",
  "password": "123456"
}
Response:
{
  "message": "User registered successfully"
}
2️⃣ Login User

POST

/api/auth/login
Body:
{
  "email": "vaish@gmail.com",
  "password": "123456"
}
3️⃣ Forgot Password

Generates secure reset token and sends email.

POST

/api/auth/forgot
Body:
{
  "email": "vaish@gmail.com"
}
4️⃣ Reset Password

Updates password using secure token.

POST

/api/auth/reset/:token

Example:

/api/auth/reset/725d2a6d0b6af741a978ab580a2e9b25ae93d7bf5db4a73992da654edc6e50fc
Body:
{
  "password": "newpassword123"
}
🔄 Password Reset Flow

User enters email in Forgot Password

Backend generates secure random token

Token stored in database with expiry time

Email sent with reset link

User clicks link

Backend verifies token

Password updated securely

🔒 Security Features

Password hashing using bcrypt

Secure random token generation using crypto

Token expiry validation

Environment variable protection

MongoDB data validation

🧪 Testing with Postman

Register new user

Login

Forgot password

Copy token from email

Call Reset API with token

🌍 Deployment (Render)

Push backend to GitHub

Create Web Service in Render

Add environment variables

Deploy

👩‍💻 Author

Vaishnavi R
