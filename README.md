# 🍳 CookMaster - Recipe Sharing Platform

<div align="center">

![CookMaster Logo](https://img.shields.io/badge/CookMaster-Recipe%20Platform-ff6b6b?style=for-the-badge&logo=foodpanda&logoColor=white)

**A full-stack web application for sharing, discovering, and managing recipes.**

[![PHP](https://img.shields.io/badge/PHP-8.0+-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-7952B3?style=flat-square&logo=bootstrap&logoColor=white)](https://getbootstrap.com)
[![JWT](https://img.shields.io/badge/JWT-Authentication-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

</div>

---

## 📋 Table of Contents

- [About](#-about)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Installation](#-installation)
- [Default Credentials](#-default-credentials)
- [Screenshots](#-screenshots)
- [Live Demo](#-live-demo)

---

## 📖 About

**CookMaster** is a modern recipe sharing platform that allows users to discover, share, and manage their favorite recipes. The application features a responsive design, user authentication, recipe management, ratings, comments, and favorites functionality.

---

## ✨ Features

### 👤 User Features
- **User Registration & Authentication** - Secure JWT-based authentication
- **Browse Recipes** - Explore recipes by category, difficulty, or search
- **Recipe Details** - View full recipe information including ingredients, instructions, and prep time
- **Submit Recipes** - Share your own culinary creations with the community
- **Favorites** - Save recipes to your personal favorites list
- **Ratings** - Rate recipes from 1-5 stars
- **Comments** - Leave comments and engage with other users
- **Community Hub** - See recent activity and popular recipes

### 👨‍💼 Admin Features
- **Admin Dashboard** - Overview of platform statistics
- **User Management** - View, edit, and manage user accounts
- **Recipe Management** - Approve, edit, or delete recipes
- **Content Moderation** - Manage comments and ratings

---

## 🛠 Tech Stack

### Frontend
| Technology | Description |
|------------|-------------|
| **HTML5/CSS3** | Semantic markup and modern styling |
| **JavaScript (ES6+)** | Client-side logic and interactivity |
| **Bootstrap 5.3** | Responsive UI framework |
| **jQuery 3.7** | DOM manipulation and AJAX |
| **Font Awesome 6** | Icons and visual elements |
| **SPApp** | Single Page Application routing |
| **DataTables** | Advanced table functionality |

### Backend
| Technology | Description |
|------------|-------------|
| **PHP 8.0+** | Server-side programming |
| **Flight Framework** | Lightweight PHP micro-framework |
| **JWT (Firebase)** | JSON Web Token authentication |
| **PDO** | Database abstraction layer |

### Database
| Technology | Description |
|------------|-------------|
| **MySQL 8.0** | Relational database management |
| **utf8mb4** | Full Unicode support |

---

## 📁 Project Structure

```
CookMaster/
├── backend/
│   ├── index.php              # API entry point
│   ├── composer.json          # PHP dependencies
│   ├── .htaccess              # URL rewriting rules
│   ├── rest/
│   │   ├── config.php         # Database & JWT configuration
│   │   ├── dao/               # Data Access Objects
│   │   │   ├── BaseDAO.php
│   │   │   ├── UserDAO.php
│   │   │   ├── RecipeDAO.php
│   │   │   ├── CategoryDAO.php
│   │   │   ├── CommentDAO.php
│   │   │   ├── FavoriteDAO.php
│   │   │   └── RatingDAO.php
│   │   ├── services/          # Business Logic Layer
│   │   │   ├── BaseService.php
│   │   │   ├── UserService.php
│   │   │   ├── RecipeService.php
│   │   │   ├── CategoryService.php
│   │   │   ├── CommentService.php
│   │   │   ├── FavoriteService.php
│   │   │   └── RatingService.php
│   │   ├── routes/            # API Route Definitions
│   │   │   ├── AuthRoutes.php
│   │   │   ├── UserRoutes.php
│   │   │   ├── RecipeRoutes.php
│   │   │   ├── CategoryRoutes.php
│   │   │   ├── CommentRoutes.php
│   │   │   ├── FavoriteRoutes.php
│   │   │   └── RatingRoutes.php
│   │   └── middleware/
│   │       └── AuthMiddleware.php
│   └── vendor/                # Composer dependencies
│
├── frontend/
│   ├── index.html             # Main SPA entry
│   ├── assets/
│   │   ├── css/
│   │   │   ├── style.css      # Custom styles
│   │   │   └── spapp.css      # SPA styles
│   │   ├── js/
│   │   │   ├── app.js         # Main application logic
│   │   │   └── jquery.spapp.js
│   │   └── images/
│   ├── pages/                 # SPA page templates
│   │   ├── home.html
│   │   ├── recipes.html
│   │   ├── recipe-details.html
│   │   ├── login.html
│   │   ├── register.html
│   │   ├── submit-recipe.html
│   │   ├── favorites.html
│   │   ├── community.html
│   │   ├── admin-dashboard.html
│   │   ├── admin-users.html
│   │   └── admin-recipes.html
│   ├── services/              # Frontend API services
│   │   ├── api.js
│   │   ├── AuthService.js
│   │   ├── RecipeService.js
│   │   ├── UserService.js
│   │   ├── CommentService.js
│   │   ├── FavoriteService.js
│   │   ├── RatingService.js
│   │   └── ValidationService.js
│   └── utils/
│       └── helpers.js
│
└── cook_master.sql            # Database schema & seed data
```

---

## 🗄 Database Schema

### Tables Overview

| Table | Description |
|-------|-------------|
| `users` | User accounts and authentication |
| `categories` | Recipe categories (Italian, Desserts, etc.) |
| `recipes` | Recipe information and content |
| `comments` | User comments on recipes |
| `favorites` | User's saved recipes |
| `ratings` | Recipe ratings (1-5 stars) |

### Entity Relationship

```
users ──────┬──────── recipes
            │            │
            │            ├──── comments
            │            │
            │            ├──── favorites
            │            │
            └────────────┴──── ratings
                         │
categories ──────────────┘
```

---

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/register` | Register new user |
| `POST` | `/auth/login` | User login |
| `GET` | `/auth/me` | Get current user |
| `PUT` | `/auth/profile` | Update profile |

### Recipes
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/recipes` | Get all recipes |
| `GET` | `/recipes/{id}` | Get recipe by ID |
| `POST` | `/recipes` | Create new recipe |
| `PUT` | `/recipes/{id}` | Update recipe |
| `DELETE` | `/recipes/{id}` | Delete recipe |

### Categories
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/categories` | Get all categories |
| `GET` | `/categories/{id}` | Get category by ID |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/comments` | Get all comments |
| `GET` | `/comments/recipe/{id}` | Get comments for recipe |
| `POST` | `/comments` | Create comment |
| `DELETE` | `/comments/{id}` | Delete comment |

### Favorites
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/favorites` | Get user's favorites |
| `POST` | `/favorites` | Add to favorites |
| `DELETE` | `/favorites/{id}` | Remove from favorites |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/ratings/recipe/{id}` | Get recipe ratings |
| `POST` | `/ratings` | Rate a recipe |

---

## 🚀 Installation

### Prerequisites
- PHP 8.0 or higher
- MySQL 8.0 or higher
- Composer
- Web server (Apache/Nginx)

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/cookmaster.git
   cd cookmaster
   ```

2. **Install PHP dependencies**
   ```bash
   cd backend
   composer install
   ```

3. **Create database**
   ```sql
   CREATE DATABASE cook_master;
   ```

4. **Import database schema**
   ```bash
   mysql -u root -p cook_master < cook_master.sql
   ```

5. **Configure database connection**
   
   Edit `backend/rest/config.php`:
   ```php
   private static $host = "localhost";
   private static $db_name = "cook_master";
   private static $username = "your_username";
   private static $password = "your_password";
   ```

6. **Configure API URL**
   
   Edit `frontend/services/api.js`:
   ```javascript
   const API_BASE_URL = 'http://localhost/cookmaster/backend';
   ```

7. **Start your web server and navigate to the frontend**

---

## 🔐 Default Credentials

### Admin Account
| Field | Value |
|-------|-------|
| Email | `admin@cookmaster.com` |
| Password | `password` |

### Test User Accounts
| Email | Password | Role |
|-------|----------|------|
| `john@example.com` | `password` | User |
| `maria@example.com` | `password` | User |
| `chef.gordon@example.com` | `password` | User |

---

## 🌐 Live Demo

### 🔗 **[https://cookmaster.xo.je](https://cookmaster.xo.je)**

> ⚠️ **Note:** This application is hosted on a free hosting service (InfinityFree). Due to server limitations, you may experience:
> - **Slower loading times** - The initial page load may take a few seconds
> - **Occasional connection timeouts** - If the page doesn't load, please refresh
> - **Database connection delays** - API responses may be slower than expected
> 
> For the best experience, please be patient during the initial load. Once cached, the application should perform better.

---

## 👨‍💻 Author

**Vildana Delibasic**
- Email: vildanadelibasic7@gmail.com

---

## 📄 License

This project is created for educational purposes.

---

<div align="center">

**Made with ❤️ and lots of ☕**

</div>
