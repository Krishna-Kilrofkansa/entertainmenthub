# Netflix-Style Entertainment Hub

A comprehensive React-based entertainment platform with Netflix-inspired design featuring Movies, Books, Anime, and Manhwa content.

## ✨ Features

### 🎬 Movies
- Hero carousel with auto-rotation and navigation
- TMDB API integration for movie details
- Inline expansion with trailers and cast info
- Netflix-style UI with red accents (#E50914)

### 📚 Books
- Google Books API integration
- Focus on novels and fiction stories
- Top 10 trending books section
- Advanced search with real-time results

### 🎌 Anime
- Jikan API integration (MyAnimeList data)
- Popular and trending anime
- Detailed anime information and ratings
- Genre-based browsing

### 📖 Manhwa
- Curated collection of popular manhwa
- Static placeholder data (Solo Leveling, Tower of God, etc.)
- No external API required
- Category-based exploration with MangaDex links

### 🎨 Design Features
- Netflix-inspired dark theme
- Hero Icons throughout the interface
- Responsive design (mobile & desktop)
- Inline card expansion system
- Cinematic hero sections

🔗 Live demo: [Entertainment Hub](https://movie-app-tau-beryl.vercel.app)

## 🛠 Tech Stack

- **Frontend:** React + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Hero Icons
- **APIs:** TMDB, Google Books, Jikan (Manhwa uses static data)
- **Deployment:** Vercel

## ⚙️ Installation

Make sure you have **Node.js** installed (v16+ recommended).

```bash
# Clone the repo
git clone https://github.com/Krishna-Kilrofkansa/Movie-app.git

cd Movie-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your API keys to .env file

# Start development server
npm run dev
```

## 🔑 API Setup

Create a `.env` file in the root directory with the following keys:

```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
VITE_GOOGLE_BOOKS_API_KEY=your_google_books_api_key_here
```

### Getting API Keys:
- **TMDB API**: Register at [themoviedb.org](https://www.themoviedb.org/settings/api)
- **Google Books API**: Get key from [Google Cloud Console](https://console.cloud.google.com/apis/library/books.googleapis.com)

## 📱 Usage

- **Movies**: Browse trending movies, search by title, view trailers and cast
- **Books**: Discover fiction novels, search by title/author, view book details
- **Anime**: Explore popular anime, search by title, view ratings and synopsis
- **Manhwa**: Browse curated manhwa collection, read on MangaDex


© 2025 Aakarshak Swaraj — Licensed under MIT License.
