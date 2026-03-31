# 🎬 Movie Review Social Network

A fullstack social platform where users can discover movies, write reviews, and interact with other users.

---

## 🚀 Features

- 🔍 Search movies using an external API
- 📝 Create and share movie reviews
- ❤️ Like posts
- 💬 Comment on reviews
- 👥 Follow other users
- 📰 Personalized feed based on following
- ⚡ Debounced search for better performance
- 🔒 Secure API handling (no API keys exposed on frontend)
- ♾️ Infinite scroll with efficient pagination for smooth user experience

---

## 🛠️ Tech Stack

### Frontend

- React
- TypeScript
- TailwindCSS

### Backend

- Express
- Node.js
- TypeScript

### Database

- PostgreSQL (hosted on Neon)
- Drizzle ORM

### External APIs

- Movie data powered by The Movie Database (TMDB)

---

## 🧠 Architecture

The app follows a **Frontend → Backend → Database / External API** pattern:

- The frontend communicates only with the backend
- The backend handles:
  - database operations (PostgreSQL via Drizzle)
  - secure API requests (TMDB)

- Improves security, scalability, and maintainability

---

## ⚡ Performance Optimizations

- Debounced search input to reduce unnecessary API calls
- Backend caching for trending movies
- Efficient database queries using Drizzle ORM

---

## 🔒 Security

- API keys stored securely in environment variables
- No sensitive data exposed in the frontend
- Backend acts as a secure proxy for external APIs
- User passwords are hashed before storage
- Authentication implemented using JWT (JSON Web Tokens)
- Protected routes handled via authentication middleware

---

## 🗄️ Database

- Uses PostgreSQL hosted on Neon
- Schema managed with Drizzle ORM
- Supports relational features for:
  - users
  - posts
  - comments
  - likes
  - follows

---

## 🌍 Deployment

- Frontend deployed on Vercel
- Backend deployed on Railway
- Database hosted on Neon

---
