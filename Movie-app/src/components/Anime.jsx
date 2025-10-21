import React, { useState, useEffect, useRef } from 'react'
import { FireIcon, PlayIcon, CheckCircleIcon, ClockIcon, BoltIcon, HeartIcon, FaceSmileIcon, FilmIcon, SparklesIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Search from './Search'

const Anime = () => {
    const [anime, setAnime] = useState([])
    const [topAnime, setTopAnime] = useState([])
    const [featuredAnime, setFeaturedAnime] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('airing')
    const [expandedAnime, setExpandedAnime] = useState(null)
    const scrollRef = useRef(null)
    
    const fetchAnime = async (type = 'airing') => {
        setLoading(true)
        try {
            const url = `https://api.jikan.moe/v4/anime?type=tv&status=${type}&limit=24`
            const response = await fetch(url)
            const data = await response.json()
            const animeList = data.data || []
            setAnime(animeList)
            if (animeList.length > 0) {
                setFeaturedAnime(animeList[0])
            }
        } catch (error) {
            console.error('Error fetching anime:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTopAnime = async () => {
        try {
            const url = 'https://api.jikan.moe/v4/top/anime?limit=10'
            const response = await fetch(url)
            const data = await response.json()
            const animeList = data.data || []
            setTopAnime(animeList)
        } catch (error) {
            console.error('Error fetching top anime:', error)
        }
    }

    const searchAnime = async (query) => {
        if (!query) return
        setLoading(true)
        try {
            const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=24`
            const response = await fetch(url)
            const data = await response.json()
            setAnime(data.data || [])
        } catch (error) {
            console.error('Error searching anime:', error)
        } finally {
            setLoading(false)
        }
    }
    
    useEffect(() => {
        fetchAnime()
        fetchTopAnime()
    }, [])
    
    const categories = [
        { name: 'Airing', query: 'airing', icon: PlayIcon },
        { name: 'Complete', query: 'complete', icon: CheckCircleIcon },
        { name: 'Upcoming', query: 'upcoming', icon: ClockIcon },
        { name: 'Action', query: 'action', icon: BoltIcon },
        { name: 'Romance', query: 'romance', icon: HeartIcon },
        { name: 'Comedy', query: 'comedy', icon: FaceSmileIcon },
        { name: 'Drama', query: 'drama', icon: FilmIcon },
        { name: 'Fantasy', query: 'fantasy', icon: SparklesIcon }
    ]
    
    const handleCategoryClick = (category) => {
        setActiveCategory(category.query)
        if (['action', 'romance', 'comedy', 'drama', 'fantasy'].includes(category.query)) {
            searchAnime(category.query)
        } else {
            fetchAnime(category.query)
        }
    }

    const handleScroll = () => {
        const container = scrollRef.current
        if (container) {
            const cardWidth = 220
            const totalWidth = cardWidth * topAnime.length
            
            if (container.scrollLeft >= totalWidth) {
                container.scrollLeft = 0
            }
        }
    }
    
    return (
        <div className="anime-section">
            {/* Hero Section */}
            {featuredAnime && (
                <div className="anime-hero">
                    <div className="hero-background">
                        <img 
                            src={featuredAnime.images?.jpg?.large_image_url || featuredAnime.images?.jpg?.image_url} 
                            alt={featuredAnime.title}
                        />
                        <div className="hero-overlay"></div>
                    </div>
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">{featuredAnime.title}</h1>
                            <div className="hero-meta">
                                <span className="score">⭐ {featuredAnime.score || 'N/A'}</span>
                                <span className="separator">•</span>
                                <span className="year">{featuredAnime.year}</span>
                                <span className="separator">•</span>
                                <span className="episodes">{featuredAnime.episodes} episodes</span>
                            </div>
                            <p className="hero-description">
                                {featuredAnime.synopsis?.substring(0, 300)}...
                            </p>
                            <div className="hero-buttons">
                                <button className="watch-btn flex items-center gap-2">
                                    <PlayIcon className="w-5 h-5" />
                                    Watch Now
                                </button>
                                <button className="info-btn flex items-center gap-2">
                                    <InformationCircleIcon className="w-5 h-5" />
                                    More Info
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="netflix-content">
                {/* Top 10 Anime Section */}
                <section className="netflix-row">
                    <h2 className="row-title">
                        <FireIcon className="w-6 h-6 text-red-500 inline mr-2" />
                        Top 10 Anime Today
                    </h2>
                    <div className="row-content">
                        <div 
                            ref={scrollRef}
                            className="movie-row-scroll"
                            onScroll={handleScroll}
                        >
                            {[...topAnime, ...topAnime].map((animeItem, index) => (
                                <div 
                                    key={`${animeItem.mal_id}-${index}`} 
                                    className={`netflix-card ${expandedAnime === animeItem.mal_id ? 'expanded' : ''}`}
                                    onClick={() => setExpandedAnime(expandedAnime === animeItem.mal_id ? null : animeItem.mal_id)}
                                >
                                    <div className="card-image">
                                        <img 
                                            src={animeItem.images?.jpg?.image_url || '/no-anime.png'} 
                                            alt={animeItem.title}
                                            loading="lazy"
                                        />
                                        <div className="card-overlay">
                                            <div className="card-info">
                                                <h3>{animeItem.title}</h3>
                                                <div className="card-meta">
                                                    <span className="rating">⭐ {animeItem.score || 'N/A'}</span>
                                                    <span className="year">{animeItem.year}</span>
                                                </div>
                                                <p className="episodes">{animeItem.episodes} episodes</p>
                                            </div>
                                        </div>
                                    </div>
                                    {index < 10 && (
                                        <div className="top-10-badge">{(index % 10) + 1}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Search Section */}
                <section className="anime-search-section">
                    <Search 
                        searchTerm={searchTerm}
                        setSearchTerm={(term) => {
                            setSearchTerm(term)
                            if (term) {
                                searchAnime(term)
                            }
                        }}
                        placeholder="Search for anime, genres, or studios..."
                    />
                </section>
                
                {/* Categories Section */}
                <section className="anime-categories">
                    <h2 className="section-title">Browse by Category</h2>
                    <div className="category-grid">
                        {categories.map((category) => (
                            <button
                                key={category.name}
                                onClick={() => handleCategoryClick(category)}
                                className={`category-card ${activeCategory === category.query ? 'active' : ''}`}
                            >
                                <category.icon className="w-6 h-6 category-icon" />
                                <span className="category-name">{category.name}</span>
                            </button>
                        ))}
                    </div>
                </section>
                
                {/* Anime Grid */}
                <section className="anime-content">
                    <h2 className="section-title flex items-center gap-2">
                        <PlayIcon className="w-8 h-8" />
                        Discover Anime
                    </h2>
                    {loading ? (
                        <div className="anime-loading">
                            <div className="loading-spinner"></div>
                            <p>Finding amazing anime...</p>
                        </div>
                    ) : (
                        <div className="anime-grid-wrapper">
                            {anime.map((animeItem) => (
                                <React.Fragment key={animeItem.mal_id}>
                                    <div 
                                        className="netflix-card"
                                        onClick={() => setExpandedAnime(expandedAnime === animeItem.mal_id ? null : animeItem.mal_id)}
                                    >
                                        <div className="card-image">
                                            <img 
                                                src={animeItem.images?.jpg?.image_url || '/no-anime.png'} 
                                                alt={animeItem.title}
                                                loading="lazy"
                                            />
                                            <div className="card-overlay">
                                                <div className="card-info">
                                                    <h3>{animeItem.title}</h3>
                                                    <div className="card-meta">
                                                        <span className="rating">⭐ {animeItem.score || 'N/A'}</span>
                                                        <span className="year">{animeItem.year}</span>
                                                    </div>
                                                    <p className="episodes">{animeItem.episodes} episodes</p>
                                                </div>
                                                <div className="card-actions">
                                                    <button className="btn-play flex items-center gap-1">
                                                        <PlayIcon className="w-4 h-4" />
                                                        Watch
                                                    </button>
                                                    <button className="btn-info flex items-center gap-1">
                                                        <InformationCircleIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {expandedAnime === animeItem.mal_id && (
                                        <div className="inline-expansion-row">
                                            <div className="inline-expansion-content">
                                                <button 
                                                    className="inline-close-btn"
                                                    onClick={() => setExpandedAnime(null)}
                                                >
                                                    ✕
                                                </button>
                                                <div className="inline-expansion-layout">
                                                    <div className="inline-expansion-details">
                                                        <h2 className="inline-expansion-title">{animeItem.title}</h2>
                                                        <div className="inline-expansion-meta">
                                                            <span>⭐ {animeItem.score || 'N/A'}</span>
                                                            <span>{animeItem.year}</span>
                                                            <span>{animeItem.episodes} episodes</span>
                                                            <span>{animeItem.status}</span>
                                                        </div>
                                                        <p className="inline-expansion-description">
                                                            {animeItem.synopsis || 'No synopsis available'}
                                                        </p>
                                                        <div className="inline-expansion-categories">
                                                            {animeItem.genres?.slice(0, 3).map((genre, idx) => (
                                                                <span key={idx} className="category-tag">{genre.name}</span>
                                                            ))}
                                                        </div>
                                                        <div className="inline-expansion-actions">
                                                            <a 
                                                                href={animeItem.url} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="btn-primary"
                                                            >
                                                                <PlayIcon className="w-4 h-4 inline mr-1" />
                                                                View on MyAnimeList
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="inline-expansion-image">
                                                        <img 
                                                            src={animeItem.images?.jpg?.large_image_url || animeItem.images?.jpg?.image_url || '/no-anime.png'} 
                                                            alt={animeItem.title}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    )
}

export default Anime