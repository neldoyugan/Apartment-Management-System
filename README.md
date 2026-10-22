# Apartment Management System

A full-stack web application for managing apartment listings, rental applications, inquiries, announcements, and an administrative dashboard.

## 📁 Project Structure

```
Apartment-Management-System/
├── backend/                  # FastAPI Python backend
│   ├── app/
│   │   ├── routers/          # API endpoints (apartments, applications, admin, etc.)
│   │   ├── auth.py           # JWT Authentication & bcrypt hashing
│   │   ├── database.py       # SQLAlchemy MySQL connection
│   │   ├── models.py         # Database ORM models
│   │   ├── schemas.py        # Pydantic request/response schemas
│   │   ├── seed.py           # Database seeder script
│   │   └── main.py           # FastAPI entry point
│   ├── requirements.txt      # Python dependencies
│   └── .env.example          # Sample environment variables
│
└── frontend/                 # Vite + React frontend
    ├── src/
    │   ├── api/              # Axios configuration
    │   ├── context/          # React contexts (AuthContext, etc.)
    │   ├── pages/            # Public & Admin pages
    │   └── App.jsx           # Main routing & app entry
    ├── package.json          # Frontend dependencies
    └── vite.config.js        # Vite config
```

---

## 🚀 Getting Started

### 1. Database Setup (MySQL)
1. Ensure MySQL (XAMPP / MariaDB / MySQL Server) is running on port `3306`.
2. Create the database:
   ```sql
   CREATE DATABASE apartment_db;
   ```
3. Copy `backend/.env.example` to `backend/.env` and update your database credentials if needed:
   ```env
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=apartment_db
   DB_USER=root
   DB_PASSWORD=
   SECRET_KEY=your_secret_key_here
   ```

### 2. Backend Setup
1. Open a terminal and navigate to the backend folder:
   ```powershell
   cd backend
   ```
2. Install dependencies:
   ```powershell
   pip install -r requirements.txt
   ```
3. Seed default data & administrator account:
   ```powershell
   python -m app.seed
   ```
4. Start the FastAPI server:
   ```powershell
   uvicorn app.main:app --reload --port 8000
   ```
   - API URL: `http://localhost:8000`
   - Swagger Documentation: `http://localhost:8000/docs`

### 3. Frontend Setup
1. Open a second terminal and navigate to the frontend folder:
   ```powershell
   cd frontend
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Start the Vite development server:
   ```powershell
   npm run dev
   ```
   - Web App URL: `http://localhost:5173`

---

## 🔐 Default Admin Account
- **Username:** `admin`
- **Password:** `admin123`
