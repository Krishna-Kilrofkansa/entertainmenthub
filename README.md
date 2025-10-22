# 🎬 EntertainmentHub  
**All-in-One Platform for Movies, Anime, Manhwa, and Books**

> A unified entertainment discovery web app that lets users explore trending **Movies 🎥**, **Anime 🍥**, **Manhwa 📚**, and **Books 📖** — all in one place.

---

## 🌐 Live Demo
🔗 **Frontend:** [https://entertainmenthub-delta.vercel.app/](https://entertainmenthub-delta.vercel.app/)

---

## 📖 Overview
**EntertainmentHub** is a full-stack web application designed for entertainment lovers.  
It provides a single, modern, and responsive platform for discovering **movies, anime, manhwa, and books**.  
Built with a **React + Vite** frontend and a **Spring Boot** backend, it delivers a seamless, fast, and scalable experience powered by **MongoDB**.

---

## ✨ Features
✅ **Multi-Category Support** — Browse Movies, Anime, Manhwa, and Books  
✅ **Search Functionality** — Quickly find any title across categories  
✅ **Detailed Pages** — Title, synopsis, ratings, genres, and more  
✅ **User Accounts** — Login, register, and manage profiles  
✅ **RESTful API** — Powered by Spring Boot backend  
✅ **Responsive Design** — Fully optimized for mobile and desktop  
✅ **MongoDB Integration** — Persistent storage for users and content  
✅ **Scalable Architecture** — Independent frontend and backend for easy deployment  

---

## 🧰 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React, Vite, JavaScript, HTML5, CSS3 |
| **Backend** | Spring Boot, Java 17+ |
| **Database** | MongoDB (Native Driver) |
| **Build Tools** | Maven, npm |
| **Deployment** | Vercel (Frontend) + Custom Backend Host (Render) |
| **License** | MIT |

---

## 🧱 Project Structure
```

entertainmenthub/
│
├── Movie-app/           # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   └── utils/
│   ├── index.html
│   └── package.json
│
├── user-api/            # Backend (Spring Boot)
│   ├── src/main/java/com/entertainmenthub/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   └── service/
│   ├── src/main/resources/
│   │   ├── application.properties
│   └── pom.xml
│
├── LICENSE
└── README.md

````

---

## ⚙️ Installation & Setup

### 🧩 Prerequisites
- Node.js v16+
- npm or yarn
- JDK 17+
- Maven
- MongoDB (local or Atlas cluster)

---

### 🖥️ Backend Setup (Spring Boot)
```bash
# Navigate to backend
cd user-api

# Configure application.properties
spring.data.mongodb.uri=mongodb+srv://<username>:<password>@cluster.mongodb.net/entertainmenthub
server.port=8080
jwt.secret=<your_secret_key>

# Build & run backend
mvn clean install
mvn spring-boot:run
````

The backend will start on `http://localhost:8080`.

---

### 💻 Frontend Setup (React + Vite)

```bash
# Navigate to frontend
cd ../Movie-app

# Install dependencies
npm install

# Create an .env file
VITE_API_URL=http://localhost:8080/api

# Run in development mode
npm run dev
```

The frontend will start on `http://localhost:5173`.

---

## 🔗 API Overview (Example Endpoints)

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| `GET`  | `/api/movies`        | Fetch all movies    |
| `GET`  | `/api/anime`         | Fetch all anime     |
| `GET`  | `/api/manhwa`        | Fetch all manhwa    |
| `GET`  | `/api/books`         | Fetch all books     |
| `POST` | `/api/auth/register` | Register a new user |
| `POST` | `/api/auth/login`    | Authenticate user   |
| `GET`  | `/api/users/{id}`    | Get user profile    |

*(Actual endpoints may vary depending on your controller setup.)*

---

## 🗺️ Roadmap

| Feature               | Description                            | Status     |
| --------------------- | -------------------------------------- | ---------- |
| ⭐ Watchlist           | Save favorite titles across categories | 🚧 Planned |
| 💬 Reviews & Ratings  | Allow users to leave feedback          | 🚧 Planned |
| 🧠 Recommendations    | Personalized suggestions               | 🚧 Planned |
| 📱 Mobile App         | React Native version                   | 💡 Idea    |
| 🧑‍💼 Admin Dashboard | Manage content and users               | 🚧 Planned |

---

## 🔒 Security Best Practices

* Use HTTPS in production
* Store credentials securely in environment variables
* Validate and sanitize all user inputs
* Implement JWT-based authentication
* Apply rate-limiting and CORS configuration
* Keep all dependencies updated

---

## 🤝 Contributing

Contributions are always welcome!

### Steps to Contribute

1. **Fork** the repo
2. **Create** a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```
3. **Commit** your changes:

   ```bash
   git commit -m "Add your feature"
   ```
4. **Push** and open a **Pull Request**

Please ensure your code is clean and properly documented.

---

## 📝 License

This project is licensed under the **MIT License**.
See the [LICENSE](./LICENSE) file for more information.

---

## 👨‍💻 Author

**Krishna Kilrofkansa**
📍 Developer & Creator of EntertainmentHub
🔗 [GitHub Profile](https://github.com/Krishna-Kilrofkansa)

---

## 🖼️ Screenshots

Add screenshots to make the README visually appealing:

```markdown
Home Page
<img width="1919" height="863" alt="image" src="https://github.com/user-attachments/assets/602a496b-eec4-4444-9b8d-104b1260b066" />

<img width="1899" height="867" alt="image" src="https://github.com/user-attachments/assets/5213047e-80b4-4d73-a834-511a25dfb9de" />

<img width="1886" height="852" alt="image" src="https://github.com/user-attachments/assets/c1756050-d5b1-4de6-99ee-0490f24cf32a" />

```

---

⭐ **If you like this project, don’t forget to star the repository!**

```

---

Would you like me to add **modern badges** (e.g., License, Tech Stack, Build, Deploy) and a **hero banner** section at the top to make it look like a showcase-ready open-source README (like the ones on trending GitHub repos)?
```
