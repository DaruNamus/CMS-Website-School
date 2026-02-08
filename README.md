# SMAN 1 Gebog Website

A modern, responsive, and dynamic school website for SMAN 1 Gebog, featuring a comprehensive Admin Dashboard (CMS) for managing content.

![Project Screenshot](public/screenshot.png) *(Place a screenshot here if available)*

## 🚀 Technologies Used

**Frontend:**
*   **React** (Vite)
*   **Tailwind CSS** (Styling)
*   **Lucide React** (Icons)
*   **React Router** (Navigation)

**Backend:**
*   **Node.js** & **Express.js**
*   **MySQL** (Database)
*   **Multer** (File Uploads)
*   **JWT** (implied auth structure)

## ✨ Key Features

*   **Public Portal**:
    *   **Home**: Dynamic hero section, latest news, and school highlights.
    *   **Profil**: Visi Misi, Sejarah, Struktur Organisasi, Kepala Sekolah, Guru & Staff.
    *   **Kesiswaan**: OSIS, Ekstrakurikuler, Prestasi Siswa.
    *   **Kurikulum**: Struktur Kurikulum & Program Unggulan.
    *   **Sarana Prasarana**: Gallery of school facilities with categorization.
    *   **Galeri**: Photo gallery with categories and lightbox view.
    *   **Berita**: Dynamic news and announcements system.
    *   **PPDB**: Information regarding student admission.
    
*   **Admin Dashboard** (`/admin`):
    *   **Content Management**: CRUD operations for News, Profile, Facilities, Extracurriculars, Curriculum, etc.
    *   **Photo Gallery**: Upload and manage gallery photos.
    *   **Staff Management**: Manage teacher and staff directory.
    *   **Secure Login**: Admin authentication system.

## 🛠️ Installation & Setup

### Prerequisites
*   Node.js installed.
*   MySQL Server (via XAMPP, Laragon, or standalone).

### 1. Database Setup
1.  Create a new MySQL database named `sma1gebog`.
2.  Import the database schema (or allow the server to initialize tables).
    *   *Note: The server includes scripts/logic to create necessary tables like `users`, `news`, `gallery_photos`, etc.*

### 2. Backend Setup
Navigate to the `server` folder and install dependencies:

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sma1gebog
PORT=5001
JWT_SECRET=your_secret_key_here
```

Start the backend server:

```bash
node index.js
```
*The server will run on `http://localhost:5001`*

### 3. Frontend Setup
Open a new terminal, navigate to the root directory, and install dependencies:

```bash
cd ..  # if inside server/
npm install
```

Start the development server:

```bash
npm run dev
```
*The frontend will run on `http://localhost:5173`*

## 📂 Project Structure

*   **/src**: React frontend source code.
    *   **/app/components**: Reusable UI components (Header, Footer, Admin Editors).
    *   **/app/pages**: Main page views (Home, Admin, Galeri, etc.).
*   **/server**: Node.js backend.
    *   **index.js**: Main server entry point and API routes.
    *   **/uploads**: Directory for uploaded images.

## 👥 Authors

*   Developed by **Adhya** & **Daru Team**

---
© 2024 SMAN 1 Gebog. All rights reserved.