import React, {useEffect, useState, useRef, useCallback, useMemo} from 'react'
import { useScroll } from 'framer-motion'
import { gsap } from 'gsap'
import { FilmIcon, BookOpenIcon, PlayIcon, DocumentTextIcon, MagnifyingGlassIcon, Squares2X2Icon, SparklesIcon, UserIcon } from '@heroicons/react/24/outline'
import Search from "./components/Search.jsx";
import Spinner from "./components/Spinner.jsx";
import Moviecard from "./components/Moviecard.jsx";
import Pagination from "./components/Pagination.jsx";
import SortControls from "./components/SortControls.jsx";
import GenreFilter from "./components/GenreFilter.jsx";
import PersonalityRecommender from "./components/PersonalityRecommender.jsx";
import Hero from "./components/Hero.jsx";
import Browse from "./components/Browse.jsx";
import Books from "./components/Books.jsx";
import Anime from "./components/Anime.jsx";
import Manhwa from "./components/Manhwa.jsx";
import LoginModal from "./components/LoginModal.jsx";
import AuthService from "./services/auth.service.jsx";
import UserService from "./services/user.service.js";

import {useDebounce} from "react-use";

const API_BASE_URL = "https://api.themoviedb.org/3"
const ALLOWED_ENDPOINTS = ['/search/movie', '/discover/movie', '/genre/movie/list', '/trending/movie/week'];

// Support both TMDB v4 Bearer token and v3 API key via env
const V4_TOKEN = import.meta.env.VITE_TMDB_V4_TOKEN || import.meta.env.VITE_TMDB_API_KEY;
const V3_API_KEY = import.meta.env.VITE_TMDB_API_KEY_V3;

const API_OPTIONS = V4_TOKEN ? {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${V4_TOKEN}`
    }
} : {
    method: "GET",
    headers: {
        accept: "application/json"
    }
}

const App = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [errormessage, setErrormessage] = useState('');
    const [movielist, setMovielist] = useState([]);
    const [isloading, setIsloading] = useState(false);
    const [debounceSearchterm, setDebounceSearchterm] = useState('')
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [sortBy, setSortBy] = useState('popularity.desc');

    const [genres, setGenres] = useState([]);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [expandedMovie, setExpandedMovie] = useState(null);
    const [topMovies, setTopMovies] = useState([]);
    const [showAIRecommender, setShowAIRecommender] = useState(false);
    const [showBrowse, setShowBrowse] = useState(false);
    const [activeCategory, setActiveCategory] = useState('movies');
    const [topMoviesLoaded, setTopMoviesLoaded] = useState(false);
    const movieListRef = useRef(null);
    const { scrollY } = useScroll();
    const [isScrolled, setIsScrolled] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [watchlist, setWatchlist] = useState(new Set());

    // Check for logged-in user on app startup
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            UserService.getWatchlist().then((response) => {
        // Create a Set of item IDs for quick lookups
                const watchlistIds = new Set(response.data.map(item => item.itemId));
                setWatchlist(watchlistIds);
      });
        }
    }, []);

   const handleAddToWatchlist = (itemId, itemType) => {
    UserService.addToWatchlist(itemId, itemType).then(() => {
        // Optimistically update the UI for a fast user experience
        setWatchlist(prev => new Set(prev).add(itemId.toString()));
    }).catch((error) => {
        console.error('Error adding to watchlist:', error);
        // Optionally, revert the UI change if the API call fails
        setWatchlist(prev => {
            const next = new Set(prev);
            next.delete(itemId.toString());
            return next;
        });
    }); // Corrected from };
};

const handleRemoveFromWatchlist = (itemId, itemType) => {
    UserService.removeFromWatchlist(itemId, itemType).then(() => {
        setWatchlist(prev => {
            const next = new Set(prev);
            next.delete(itemId.toString());
            return next;
        });
    }).catch((error) => {
        console.error('Error removing from watchlist:', error);
        // Optionally, revert the UI change if the API call fails
        setWatchlist(prev => new Set(prev).add(itemId.toString()));
    }); 
}

    // Logout function
    const logOut = () => {
        AuthService.logout();
        setCurrentUser(undefined);
        setWatchlist(new Set());
        setShowProfileMenu(false);
    };

    // Handle scroll-based navigation styling
    useEffect(() => {
        const unsubscribe = scrollY.on("change", (latest) => {
            setIsScrolled(latest > 50);
        });
        return unsubscribe;
    }, [scrollY]);



    // Memoized URL builder to prevent object creation on every call
    const buildSafeUrl = useMemo(() => (endpoint, params = {}) => {
        if (!ALLOWED_ENDPOINTS.includes(endpoint)) {
            throw new Error('Unauthorized API endpoint');
        }
        
        try {
            const url = new URL(`${API_BASE_URL}${endpoint}`);
            
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null) url.searchParams.set(key, value);
            });
            
            return url.toString();
        } catch (error) {
            throw new Error(`Invalid URL construction: ${error.message}`);
        }
    }, []);

    useDebounce(() => setDebounceSearchterm(searchTerm), 1000,[searchTerm]);

    const fetchGenres = async() => {
        try {
            const genreEndpoint = buildSafeUrl('/genre/movie/list');
            console.log('🎭 API CALL: Fetching genres from:', genreEndpoint);
            const response = await fetch(genreEndpoint, API_OPTIONS);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Genres fetched successfully:', data.genres?.length, 'genres');
                setGenres(data.genres || []);
            }
        } catch (error) {
            console.error('❌ Error fetching genres:', error);
        }
    };

    const fetchTopMovies = async() => {
        if (topMoviesLoaded) {
            console.log('⏭️ Skipping top movies fetch - already loaded');
            return;
        }
        
        try {
            const topMoviesEndpoint = buildSafeUrl('/trending/movie/week');
            console.log('🔥 API CALL: Fetching top movies from:', topMoviesEndpoint);
            const response = await fetch(topMoviesEndpoint, API_OPTIONS);
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Top movies fetched successfully:', data.results?.length, 'movies, using first 10');
                setTopMovies(data.results?.slice(0, 10) || []);
                setTopMoviesLoaded(true);
            }
        } catch (error) {
            console.error('❌ Error fetching top movies:', error);
            setTopMoviesLoaded(true);
        }
    };

    const fetchMovies = async(query='', page=1) => {
        setIsloading(true);
        setErrormessage('');
        try{
            // Authentication parameters
            const params = { page };
            if (!V4_TOKEN && V3_API_KEY) params.api_key = V3_API_KEY;
            
            // Query parameters
            if (query) {
                params.query = query;
            } else {
                // Filtering parameters
                if (sortBy) params.sort_by = sortBy;
                if (selectedGenres.length > 0) params.with_genres = selectedGenres.join(',');
            }
            
            const endpoint = buildSafeUrl(query ? '/search/movie' : '/discover/movie', params);
            console.log('🎬 API CALL: Fetching movies from:', endpoint);
            console.log('📄 Page:', page, '| Query:', query || 'none', '| Sort:', sortBy, '| Genres:', selectedGenres.length);
            const response = await fetch(endpoint, API_OPTIONS);

            if(!response.ok) {
                let errorMessage = 'Error fetching movies';
                try {
                    const errData = await response.json();
                    if (errData && errData.status_message) errorMessage = errData.status_message;
                } catch {}
                throw new Error(errorMessage);
            }
            const data = await response.json();
            const results = Array.isArray(data.results) ? data.results : [];
            console.log('✅ Movies fetched successfully:', results.length, 'movies on page', page, 'of', data.total_pages);
            // Limit to maximum 100 pages to prevent excessive API calls
            setTotalPages(Math.min(data.total_pages || 1, 100));
            if(results.length === 0) {
                setErrormessage(query ? 'No movies found for your search.' : 'No movies to display.');
                setMovielist([]);
            } else {
                setMovielist(results);
            }

        }catch(e){
            console.error(`Error in fetchMovies:${e}`);
            setErrormessage(e?.message || 'Error in fetchMovies');
        }finally {
            setIsloading(false);
        }
    }

    useEffect(() => {
        fetchGenres(); // Fetch genres on component mount
        fetchTopMovies(); // Fetch top movies on component mount
    }, []);

    useEffect(() => {
        setCurrentPage(1); // Reset to page 1 when search, sort, or genre changes
        fetchMovies(debounceSearchterm, 1);
    }, [debounceSearchterm, sortBy, selectedGenres])

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
        fetchMovies(debounceSearchterm, newPage);
    }

    const handleSortChange = (newSortBy) => {
        setSortBy(newSortBy);
        setCurrentPage(1); // Reset to page 1 when sorting changes
    }

    const handleGenreChange = (genreId) => {
        if (genreId === 'clear') {
            setSelectedGenres([]);
        } else {
            setSelectedGenres(prev => 
                prev.includes(genreId) 
                    ? prev.filter(id => id !== genreId)
                    : [...prev, genreId]
            );
        }
        setCurrentPage(1); // Reset to page 1 when genre changes
    }
    
    const handleMovieExpand = useCallback((movieId) => {
        setExpandedMovie(movieId)
        
        // Animate other cards to move aside
        const listItems = movieListRef.current?.querySelectorAll('li')
        listItems?.forEach((item) => {
            const itemMovieId = parseInt(item.dataset.movieId, 10)
            if (itemMovieId !== movieId) {
                gsap.to(item, {
                    scale: 0.9,
                    opacity: 0.6,
                    duration: 0.3,
                    ease: "power2.out"
                })
            }
        })
    }, [])
    
    const handleMovieClose = useCallback(() => {
        setExpandedMovie(null)
        
        // Animate cards back to normal
        const listItems = movieListRef.current?.querySelectorAll('li')
        listItems?.forEach((item) => {
            gsap.to(item, {
                scale: 1,
                opacity: 1,
                duration: 0.3,
                ease: "power2.out"
            })
        })
    }, [])
    
    // Handle outside click to close expanded movie
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (expandedMovie && !e.target.closest('.movie-card.expanded')) {
                handleMovieClose()
            }
        }
        
        if (expandedMovie) {
            document.addEventListener('click', handleOutsideClick)
        }
        
        return () => {
            document.removeEventListener('click', handleOutsideClick)
        }
    }, [expandedMovie, handleMovieClose])
    return (
        <main className="netflix-app">
            {/* Netflix-Style Navigation */}
            <nav className={`netflix-nav ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-container">
                    <div className="nav-logo">
                        <span className="text-netflix-red font-bold text-2xl cursor-pointer">MovieFinder</span>
                    </div>
                    <div className="nav-links">
                        <button 
                            className={`nav-link ${activeCategory === 'movies' && !showAIRecommender && !showBrowse ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory('movies')
                                setShowAIRecommender(false)
                                setShowBrowse(false)
                            }}
                        >
                            <FilmIcon className="w-5 h-5" />
                            Movies
                        </button>
                        <button 
                            className={`nav-link ${activeCategory === 'books' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory('books')
                                setShowAIRecommender(false)
                                setShowBrowse(false)
                            }}
                        >
                            <BookOpenIcon className="w-5 h-5" />
                            Books
                        </button>
                        <button 
                            className={`nav-link ${activeCategory === 'anime' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory('anime')
                                setShowAIRecommender(false)
                                setShowBrowse(false)
                            }}
                        >
                            <PlayIcon className="w-5 h-5" />
                            Anime
                        </button>
                        <button 
                            className={`nav-link ${activeCategory === 'manhwa' ? 'active' : ''}`}
                            onClick={() => {
                                setActiveCategory('manhwa')
                                setShowAIRecommender(false)
                                setShowBrowse(false)
                            }}
                        >
                            <DocumentTextIcon className="w-5 h-5" />
                            Manhwa
                        </button>
                        <button 
                            className={`nav-link ${showBrowse ? 'active' : ''}`}
                            onClick={() => {
                                setShowBrowse(true)
                                setShowAIRecommender(false)
                            }}
                        >
                            <Squares2X2Icon className="w-5 h-5" />
                            Browse All
                        </button>
                        <button 
                            className={`nav-link ${showAIRecommender ? 'active' : ''}`}
                            onClick={() => {
                                setShowAIRecommender(true)
                                setShowBrowse(false)
                            }}
                        >
                            <SparklesIcon className="w-5 h-5" />
                            AI Picks
                        </button>
                    </div>
                    <div className="nav-right">
                        {currentUser ? (
                            <div className="nav-profile" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                                <div className="profile-avatar">{(currentUser.username || currentUser.email?.split('@')[0] || 'U').charAt(0).toUpperCase()}</div>
                                <span className="profile-name">{currentUser.username || currentUser.email?.split('@')[0] || 'User'}</span>
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                {showProfileMenu && (
                                    <div className="profile-dropdown">
                                        <button onClick={logOut} className="logout-btn">
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <button 
                                className="login-btn"
                                onClick={() => setShowLogin(true)}
                            >
                                <UserIcon className="w-5 h-5" />
                                Login
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            {showAIRecommender ? (
                <div className="netflix-content">
                    <PersonalityRecommender />
                </div>
            ) : showBrowse ? (
                <Browse 
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    movielist={movielist}
                    isloading={isloading}
                    errormessage={errormessage}
                    genres={genres}
                    selectedGenres={selectedGenres}
                    onGenreChange={handleGenreChange}
                    sortBy={sortBy}
                    onSortChange={handleSortChange}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    expandedMovie={expandedMovie}
                    onMovieExpand={handleMovieExpand}
                    onMovieClose={handleMovieClose}
                />
            ) : activeCategory === 'books' ? (
                <Books />
            ) : activeCategory === 'anime' ? (
                <Anime />
            ) : activeCategory === 'manhwa' ? (
                <Manhwa />
            ) : (
                <>
                    {/* Full-screen Hero Section */}
                    <Hero featuredMovies={topMovies} />

                    {/* Netflix-style Content Rows */}
                    <div className="netflix-content">
                        {/* Trending This Week */}
                        <section className="netflix-row">
                            <h2 className="row-title">Trending This Week</h2>
                            <div className="row-content">
                                <div 
                                    className="movie-row-scroll"
                                    onScroll={(e) => {
                                        const container = e.target;
                                        const cardWidth = 220; // Approximate card width + gap
                                        const totalWidth = cardWidth * topMovies.length;
                                        
                                        if (container.scrollLeft >= totalWidth) {
                                            container.scrollLeft = 0;
                                        }
                                    }}
                                >
                                    {[...topMovies, ...topMovies].map((movie, index) => (
                                        <div 
                                            key={`${movie.id}-${index}`}
                                            className={`netflix-card ${expandedMovie === movie.id ? 'expanded' : ''}`}
                                            onClick={() => setExpandedMovie(expandedMovie === movie.id ? null : movie.id)}
                                        >
                                            <div className="card-image">
                                                <img 
                                                    src={movie.poster_path ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}` : '/no-movie.png'} 
                                                    alt={movie.title}
                                                    loading="lazy"
                                                />
                                                <div className="card-overlay">
                                                    <div className="card-info">
                                                        <h3>{movie.title}</h3>
                                                        <div className="card-meta">
                                                            <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                                                            <span className="year">{movie.release_date?.split('-')[0]}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </section>

                        {/* Search Section */}
                        <section className="netflix-search-section">
                            <div className="search-container">
                                <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                            </div>
                        </section>

                        {/* Popular Movies */}
                        <section className="netflix-row" id="popular">
                            <div className="row-header">
                                <h2 className="row-title">Popular Movies</h2>
                                <div className="row-controls">
                                    <SortControls
                                        sortBy={sortBy}
                                        onSortChange={handleSortChange}
                                    />
                                    <GenreFilter
                                        genres={genres}
                                        selectedGenres={selectedGenres}
                                        onGenreChange={handleGenreChange}
                                    />
                                </div>
                            </div>
                            
                            {isloading ? (
                                <div className="loading-container">
                                    <Spinner/>
                                </div>
                            ) : errormessage ? (
                                <div className="error-container">
                                    <p className="text-red-400">{errormessage}</p>
                                </div>
                            ) : (
                                <>
                                    <div className="movie-grid">
                                        {movielist.map((movie) => (
                                            <li key={movie.id} data-movie-id={movie.id}>
                                                <Moviecard 
                                                    movie={movie}
                                                    isExpanded={expandedMovie === movie.id}
                                                    onExpand={handleMovieExpand}
                                                    onClose={handleMovieClose}
                                                    isWatchlisted={watchlist.has(movie.id.toString())}
                                                    onAddToWatchlist={handleAddToWatchlist}
                                                    onRemoveFromWatchlist={handleRemoveFromWatchlist}
                                                    currentUser={currentUser}
                                                />
                                            </li>
                                        ))}
                                    </div>
                                    
                                    <Pagination
                                        currentPage={currentPage}
                                        totalPages={totalPages}
                                        onPageChange={handlePageChange}
                                    />
                                </>
                            )}
                        </section>
                    </div>

                </>
            )}
            
            <LoginModal 
                isOpen={showLogin} 
                onClose={() => setShowLogin(false)}
                onLogin={(userData) => {
                    setCurrentUser(userData)
                    setShowLogin(false)
                }}
            />
        </main>
    );
}
export default App
