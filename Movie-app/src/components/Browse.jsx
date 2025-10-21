import React, { useState, useEffect, useRef } from 'react'
import Search from './Search'
import Moviecard from './Moviecard'
import Pagination from './Pagination'
import SortControls from './SortControls'
import GenreFilter from './GenreFilter'
import Spinner from './Spinner'

const Browse = ({ searchTerm, setSearchTerm, movielist, isloading, errormessage, genres, selectedGenres, onGenreChange, sortBy, onSortChange, currentPage, totalPages, onPageChange, expandedMovie, onMovieExpand, onMovieClose }) => {
    const [categoryData, setCategoryData] = useState({})
    const [expandedCategory, setExpandedCategory] = useState(null)
    const categoryRefs = useRef({})
    
    const V4_TOKEN = import.meta.env.VITE_TMDB_V4_TOKEN || import.meta.env.VITE_TMDB_API_KEY
    const V3_API_KEY = import.meta.env.VITE_TMDB_API_KEY_V3
    
    const API_OPTIONS = {
        method: "GET",
        headers: {
            accept: "application/json",
            ...(V4_TOKEN && { Authorization: `Bearer ${V4_TOKEN}` })
        }
    }
    
    const categories = [
        { title: "Trending This Week", type: "trending", endpoint: "/trending/movie/week" },
        { title: "Top Searches", type: "popular", endpoint: "/movie/popular" },
        { title: "Action Movies", type: "action", endpoint: "/discover/movie", params: { with_genres: "28" } },
        { title: "Comedy Movies", type: "comedy", endpoint: "/discover/movie", params: { with_genres: "35" } },
        { title: "Horror Movies", type: "horror", endpoint: "/discover/movie", params: { with_genres: "27" } },
        { title: "Romance Movies", type: "romance", endpoint: "/discover/movie", params: { with_genres: "10749" } },
        { title: "Sci-Fi Movies", type: "scifi", endpoint: "/discover/movie", params: { with_genres: "878" } },
        { title: "Documentary", type: "documentary", endpoint: "/discover/movie", params: { with_genres: "99" } },
        { title: "Animation", type: "animation", endpoint: "/discover/movie", params: { with_genres: "16" } },
        { title: "Drama Movies", type: "drama", endpoint: "/discover/movie", params: { with_genres: "18" } },
        { title: "Family Movies", type: "family", endpoint: "/discover/movie", params: { with_genres: "10751" } },
        { title: "Top Rated", type: "top-rated", endpoint: "/movie/top_rated" },
        { title: "Thriller Movies", type: "thriller", endpoint: "/discover/movie", params: { with_genres: "53" } }
    ]
    
    const fetchCategoryData = async (category) => {
        try {
            const params = { ...category.params }
            if (!V4_TOKEN && V3_API_KEY) params.api_key = V3_API_KEY
            
            const url = new URL(`https://api.themoviedb.org/3${category.endpoint}`)
            Object.entries(params).forEach(([key, value]) => {
                if (value) url.searchParams.set(key, value)
            })
            
            const response = await fetch(url.toString(), API_OPTIONS)
            if (response.ok) {
                const data = await response.json()
                return data.results?.slice(0, 10) || []
            }
        } catch (error) {
            console.error(`Error fetching ${category.type}:`, error)
        }
        return []
    }
    
    useEffect(() => {
        const loadCategories = async () => {
            const data = {}
            for (const category of categories) {
                data[category.type] = await fetchCategoryData(category)
            }
            setCategoryData(data)
        }
        loadCategories()
    }, [])

    return (
        <div className="browse-section">
            <div className="netflix-content">
                {/* Browse Categories */}
                <section className="browse-categories">
                    <h1 className="browse-title">Browse Categories</h1>
                    <div className="categories-grid">
                        {categories.map((category, index) => (
                            <div 
                                key={index}
                                ref={el => categoryRefs.current[category.type] = el}
                                className={`category-card ${expandedCategory === category.type ? 'expanded' : ''}`}
                                onClick={() => {
                                    const newExpanded = expandedCategory === category.type ? null : category.type
                                    setExpandedCategory(newExpanded)
                                    if (newExpanded) {
                                        setTimeout(() => {
                                            categoryRefs.current[category.type]?.scrollIntoView({
                                                behavior: 'smooth',
                                                block: 'start'
                                            })
                                        }, 100)
                                    }
                                }}
                            >
                                <div className="category-header">
                                    <h3>{category.title}</h3>
                                    {expandedCategory === category.type && (
                                        <button 
                                            className="category-close-btn"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                setExpandedCategory(null)
                                            }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                    <div className="category-preview">
                                        {categoryData[category.type]?.length > 0 ? (
                                            <img 
                                                src={`https://image.tmdb.org/t/p/w300${categoryData[category.type][0].poster_path}`}
                                                alt={categoryData[category.type][0].title}
                                                className="category-poster"
                                            />
                                        ) : (
                                            <div className="preview-placeholder">
                                                Loading...
                                            </div>
                                        )}
                                    </div>
                                </div>
                                
                                {expandedCategory === category.type && categoryData[category.type] && (
                                    <div className="category-movies">
                                        <div 
                                            className="movie-row-scroll"
                                            onScroll={(e) => {
                                                const container = e.target
                                                const cardWidth = 220
                                                const totalWidth = cardWidth * categoryData[category.type].length
                                                
                                                if (container.scrollLeft >= totalWidth) {
                                                    container.scrollLeft = 0
                                                }
                                            }}
                                        >
                                            {[...categoryData[category.type], ...categoryData[category.type]].map((movie, index) => (
                                                <div 
                                                    key={`${movie.id}-${index}`}
                                                    className={`netflix-card ${expandedMovie === movie.id ? 'expanded' : ''}`}
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        onMovieExpand(movie.id)
                                                    }}
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
                                )}
                            </div>
                        ))}
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
                                onSortChange={onSortChange}
                            />
                            <GenreFilter
                                genres={genres}
                                selectedGenres={selectedGenres}
                                onGenreChange={onGenreChange}
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
                                            onExpand={onMovieExpand}
                                            onClose={onMovieClose}
                                        />
                                    </li>
                                ))}
                            </div>
                            
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={onPageChange}
                            />
                        </>
                    )}
                </section>
            </div>
        </div>
    )
}

export default Browse