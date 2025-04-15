# 🚀 DevBond - Social Networking Platform

DevBond is a full-stack social networking platform built with the **MERN** stack, **Tailwind CSS**, and **DaisyUI**, featuring:

- 💬 **Real-time communication** using WebSockets  
- 💸 **Seamless payment integration** with Razorpay  
- ☁️ **Cloud deployment** on AWS EC2 for scalability  
- 🔐 **Robust authentication and validation**  
- 📡 **Dynamic user feed, connection requests, and profile management**

---

## 🧩 Tech Stack

- **Frontend:** React, Tailwind CSS, DaisyUI  
- **Backend:** Node.js, Express.js, MongoDB (Mongoose)  
- **Authentication:** JWT, bcrypt, cookie-parser  
- **Real-time:** Socket.IO  
- **Payments:** Razorpay  
- **Deployment:** AWS EC2  

---

## 📁 API Endpoints

### **Auth Routes**
| Method | Endpoint         | Description              |
|--------|------------------|--------------------------|
| POST   | `/signup`        | Register a new user      |
| POST   | `/login`         | Login existing user      |
| POST   | `/logout`        | Logout current user      |

### **Profile Routes**
| Method | Endpoint            | Description               |
|--------|---------------------|---------------------------|
| GET    | `/profile/view`     | View profile              |
| PATCH  | `/profile/edit`     | Edit profile              |
| PATCH  | `/profile/password` | Forgot password handler   |

### **Connection Request Routes**
| Method | Endpoint                                      | Description                          |
|--------|-----------------------------------------------|--------------------------------------|
| POST   | `/request/send/:status/:userId`               | Send request (interested/ignored)   |
| POST   | `/request/review/:status/:requestId`          | Accept or reject a connection       |

### **User Routes**
| Method | Endpoint                  | Description                              |
|--------|---------------------------|------------------------------------------|
| GET    | `/user/connections`       | Get all accepted connections             |
| GET    | `/user/requests/received` | Get all received requests                |
| GET    | `/user/feed`              | View feed of other users                 |

> 🔹 Status types: `interested`, `ignored`, `accepted`, `rejected`

---

## ⚙️ Setup & Installation

```bash
# 1. Clone the repository
git clone https://github.com/pavansingh888/DevBond.git
cd devbond

# 2. Initialize Git
git init

# 3. Install dependencies
npm install express mongoose bcrypt cookie-parser jsonwebtoken validator razorpay dotenv socket.io cron-scheduler cors

# 4. Install dev dependencies
npm install --save-dev nodemon

# 5. Set environment variables in a `.env` file

```

### Sample `.env` file

```
PORT=
JWT_SECRET=
DB_CONNECTION_STRING=
AWS_ACCESS_KEY=
AWS_SECRET_KEY=
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=
```

### Run the server

```bash
npm run dev   # uses nodemon
```

---

## 📬 API Testing

- Use **Postman** to test all routes
- Create workspace, save collections, and add auth headers if required

---

## 🧠 Development Journey Highlights

### 🗃️ MongoDB Integration

- Connected MongoDB Atlas using `mongoose`
- Created `UserSchema` and `RequestSchema`
- Used validations: `required`, `unique`, `minLength`, `validate`, `timestamps`
- Applied `$or`, `$and`, `$nin`, `$ne` queries
- Pagination using `.skip()` and `.limit()`

### 🔒 Auth and Security

- Encrypted passwords using `bcrypt`
- Generated and verified JWTs with `jsonwebtoken`
- Used cookies for maintaining user sessions
- Created `getJWT()` and `comparePassword()` schema methods

### 💌 Connection System

- Sent, reviewed (accept/reject), and viewed connection requests
- Designed schema and API validation
- Implemented logic to ensure data consistency and prevent duplicates

### 💸 Razorpay Integration

- Integrated payment system using Razorpay SDK
- Setup webhook for payment status
- Managed environment secrets securely

---

## 📦 Deployment

- Deployed on **AWS EC2**
- Used PM2 for background process management
- Setup nginx reverse proxy and SSL if needed

---

## 🧪 Tips & Lessons

- Always validate incoming data - **NEVER TRUST `req.body`**
- Structure routers in folders and group them logically
- Understand middleware flow and express internals
- Index DB fields that are frequently queried
- Use schema `.pre()` for pre-save logic
- Always consider **corner cases** before finalizing API logic

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
