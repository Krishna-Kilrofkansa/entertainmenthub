import React, { useState, useEffect, useRef } from 'react'
import { FireIcon, DocumentTextIcon, SparklesIcon, StarIcon, BoltIcon, HeartIcon, FilmIcon, BookOpenIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Search from './Search'

const Manhwa = () => {
    const [manhwa, setManhwa] = useState([])
    const [topManhwa, setTopManhwa] = useState([])
    const [featuredManhwa, setFeaturedManhwa] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('popular')
    const [expandedManhwa, setExpandedManhwa] = useState(null)
    const scrollRef = useRef(null)
    
    const fetchManhwa = async (type = 'popular') => {
        setLoading(true)
        try {
            let url = '/api/mangadex/manga?limit=20&includes[]=cover_art&includes[]=author&includes[]=artist'
            
            if (type === 'popular') {
                url += '&order[followedCount]=desc'
            } else if (type === 'latest') {
                url += '&order[updatedAt]=desc'
            } else if (type === 'rating') {
                url += '&order[rating]=desc'
            }
            
            const response = await fetch(url)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const text = await response.text()
            if (!text) {
                console.log('Empty response, using fallback data')
                setManhwa([])
                setLoading(false)
                return
            }
            const data = JSON.parse(text)
            
            const manhwaList = data.data.map(manga => {
                const coverRel = manga.relationships.find(rel => rel.type === 'cover_art')
                let coverFileName = null
                if (coverRel) {
                    // Check if cover data is included in the response
                    const coverData = data.included?.find(item => item.type === 'cover_art' && item.id === coverRel.id)
                    coverFileName = coverData?.attributes?.fileName
                }
                return {
                    id: manga.id,
                    title: manga.attributes.title.en || manga.attributes.title.ja || Object.values(manga.attributes.title)[0],
                    description: manga.attributes.description.en || Object.values(manga.attributes.description)[0] || 'No description available',
                    status: manga.attributes.status,
                    year: manga.attributes.year,
                    tags: manga.attributes.tags.slice(0, 3).map(tag => tag.attributes.name.en),
                    contentRating: manga.attributes.contentRating,
                    coverArt: coverFileName
                }
            })
            
            setManhwa(manhwaList)
            if (manhwaList.length > 0) {
                setFeaturedManhwa(manhwaList[0])
            }
        } catch (error) {
            console.error('Error fetching manhwa:', error)
        }
        setLoading(false)
    }

    const fetchTopManhwa = async () => {
        try {
            const response = await fetch('/api/mangadex/manga?limit=10&includes[]=cover_art&order[followedCount]=desc')
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const text = await response.text()
            if (!text) {
                console.log('Empty response for top manhwa')
                return
            }
            const data = JSON.parse(text)
            
            const topManhwaList = data.data.map(manga => {
                const coverRel = manga.relationships.find(rel => rel.type === 'cover_art')
                let coverFileName = null
                if (coverRel) {
                    const coverData = data.included?.find(item => item.type === 'cover_art' && item.id === coverRel.id)
                    coverFileName = coverData?.attributes?.fileName
                }
                return {
                    id: manga.id,
                    title: manga.attributes.title.en || manga.attributes.title.ja || Object.values(manga.attributes.title)[0],
                    status: manga.attributes.status,
                    year: manga.attributes.year,
                    tags: manga.attributes.tags.slice(0, 3).map(tag => tag.attributes.name.en),
                    contentRating: manga.attributes.contentRating,
                    coverArt: coverFileName
                }
            })
            
            setTopManhwa(topManhwaList)
        } catch (error) {
            console.error('Error fetching top manhwa:', error)
        }
    }

    const searchManhwa = async (query) => {
        if (!query) return
        setLoading(true)
        try {
            const response = await fetch(`/api/mangadex/manga?title=${encodeURIComponent(query)}&limit=20&includes[]=cover_art`)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const text = await response.text()
            if (!text) {
                console.log('Empty search response')
                setManhwa([])
                setLoading(false)
                return
            }
            const data = JSON.parse(text)
            
            const searchResults = data.data.map(manga => {
                const coverRel = manga.relationships.find(rel => rel.type === 'cover_art')
                let coverFileName = null
                if (coverRel) {
                    const coverData = data.included?.find(item => item.type === 'cover_art' && item.id === coverRel.id)
                    coverFileName = coverData?.attributes?.fileName
                }
                return {
                    id: manga.id,
                    title: manga.attributes.title.en || manga.attributes.title.ja || Object.values(manga.attributes.title)[0],
                    description: manga.attributes.description.en || Object.values(manga.attributes.description)[0] || 'No description available',
                    status: manga.attributes.status,
                    year: manga.attributes.year,
                    tags: manga.attributes.tags.slice(0, 3).map(tag => tag.attributes.name.en),
                    contentRating: manga.attributes.contentRating,
                    coverArt: coverFileName
                }
            })
            
            setManhwa(searchResults)
        } catch (error) {
            console.error('Error searching manhwa:', error)
        }
        setLoading(false)
    }
    
    useEffect(() => {
        fetchManhwa()
        fetchTopManhwa()
    }, [])
    
    const categories = [
        { name: 'Popular', query: 'popular', icon: FireIcon },
        { name: 'Latest', query: 'latest', icon: SparklesIcon },
        { name: 'Top Rated', query: 'rating', icon: StarIcon },
        { name: 'Action', query: 'action', icon: BoltIcon },
        { name: 'Romance', query: 'romance', icon: HeartIcon },
        { name: 'Drama', query: 'drama', icon: FilmIcon },
        { name: 'Fantasy', query: 'fantasy', icon: SparklesIcon },
        { name: 'Slice of Life', query: 'slice of life', icon: BookOpenIcon }
    ]
    
    const handleCategoryClick = (category) => {
        setActiveCategory(category.query)
        if (['action', 'romance', 'drama', 'fantasy', 'slice of life'].includes(category.query)) {
            searchManhwa(category.query)
        } else {
            fetchManhwa(category.query)
        }
    }

    const getCoverUrl = (coverArt, mangaId) => {
        if (coverArt) {
            return `/covers/${mangaId}/${coverArt}.256.jpg`
        }
        return null
    }

    const handleScroll = () => {
        const container = scrollRef.current
        if (container) {
            const cardWidth = 220
            const totalWidth = cardWidth * topManhwa.length
            
            if (container.scrollLeft >= totalWidth) {
                container.scrollLeft = 0
            }
        }
    }
    
    return (
        <div className="manhwa-section">
            {/* Hero Section */}
            {featuredManhwa && (
                <div className="manhwa-hero">
                    <div className="hero-background">
                        {getCoverUrl(featuredManhwa.coverArt, featuredManhwa.id) ? (
                            <img 
                                src={getCoverUrl(featuredManhwa.coverArt, featuredManhwa.id)} 
                                alt={featuredManhwa.title}
                                className="hero-bg-image"
                            />
                        ) : (
                            <div className="hero-placeholder">
                                <h1 className="placeholder-title">{featuredManhwa.title}</h1>
                            </div>
                        )}
                        <div className="hero-overlay"></div>
                    </div>
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">{featuredManhwa.title}</h1>
                            <div className="hero-meta">
                                <span className="status">{featuredManhwa.status}</span>
                                <span className="separator">•</span>
                                <span className="year">{featuredManhwa.year}</span>
                                <span className="separator">•</span>
                                <span className="rating">{featuredManhwa.contentRating}</span>
                            </div>
                            <p className="hero-description">
                                {featuredManhwa.description?.substring(0, 300)}...
                            </p>
                            <div className="hero-buttons">
                                <button className="read-btn flex items-center gap-2">
                                    <BookOpenIcon className="w-5 h-5" />
                                    Read Now
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
                {/* Top 10 Manhwa Section */}
                <section className="netflix-row">
                    <h2 className="row-title">
                        <FireIcon className="w-6 h-6 text-red-500 inline mr-2" />
                        Top 10 Manhwa Today
                    </h2>
                    <div className="row-content">
                        <div 
                            ref={scrollRef}
                            className="movie-row-scroll"
                            onScroll={handleScroll}
                        >
                            {[...topManhwa, ...topManhwa].map((manhwaItem, index) => (
                                <div 
                                    key={`${manhwaItem.id}-${index}`} 
                                    className="netflix-card"
                                    onClick={() => setExpandedManhwa(expandedManhwa === manhwaItem.id ? null : manhwaItem.id)}
                                >
                                    <div className="card-image">
                                        {getCoverUrl(manhwaItem.coverArt, manhwaItem.id) ? (
                                            <img 
                                                src={getCoverUrl(manhwaItem.coverArt, manhwaItem.id)} 
                                                alt={manhwaItem.title}
                                                className="card-cover"
                                            />
                                        ) : (
                                            <div className="manhwa-placeholder">
                                                <DocumentTextIcon className="w-12 h-12 text-white" />
                                                <h4>{manhwaItem.title}</h4>
                                            </div>
                                        )}
                                        <div className="card-overlay">
                                            <div className="card-info">
                                                <h3>{manhwaItem.title}</h3>
                                                <div className="card-meta">
                                                    <span className="status">{manhwaItem.status}</span>
                                                    <span className="year">{manhwaItem.year}</span>
                                                </div>
                                                <p className="rating">{manhwaItem.contentRating}</p>
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
                <section className="manhwa-search-section">
                    <Search 
                        searchTerm={searchTerm}
                        setSearchTerm={(term) => {
                            setSearchTerm(term)
                            if (term) {
                                searchManhwa(term)
                            }
                        }}
                        placeholder="Search for manhwa, genres, or authors..."
                    />
                </section>
                
                {/* Categories Section */}
                <section className="manhwa-categories">
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
                
                {/* Manhwa Grid */}
                <section className="manhwa-content">
                    <h2 className="section-title flex items-center gap-2">
                        <DocumentTextIcon className="w-8 h-8" />
                        Discover Manhwa
                    </h2>
                    {loading ? (
                        <div className="manhwa-loading">
                            <div className="loading-spinner"></div>
                            <p>Finding amazing manhwa...</p>
                        </div>
                    ) : (
                        <div className="manhwa-grid-wrapper">
                            {manhwa.map((manhwaItem) => (
                                <React.Fragment key={manhwaItem.id}>
                                    <div 
                                        className="netflix-card"
                                        onClick={() => setExpandedManhwa(expandedManhwa === manhwaItem.id ? null : manhwaItem.id)}
                                    >
                                        <div className="card-image">
                                            {getCoverUrl(manhwaItem.coverArt, manhwaItem.id) ? (
                                                <img 
                                                    src={getCoverUrl(manhwaItem.coverArt, manhwaItem.id)} 
                                                    alt={manhwaItem.title}
                                                    className="card-cover"
                                                />
                                            ) : (
                                                <div className="manhwa-placeholder">
                                                    <DocumentTextIcon className="w-12 h-12 text-white" />
                                                    <h4>{manhwaItem.title}</h4>
                                                </div>
                                            )}
                                            <div className="card-overlay">
                                                <div className="card-info">
                                                    <h3>{manhwaItem.title}</h3>
                                                    <div className="card-meta">
                                                        <span className="status">{manhwaItem.status}</span>
                                                        <span className="year">{manhwaItem.year}</span>
                                                    </div>
                                                    <p className="rating">{manhwaItem.contentRating}</p>
                                                </div>
                                                <div className="card-actions">
                                                    <button className="btn-play flex items-center gap-1">
                                                        <BookOpenIcon className="w-4 h-4" />
                                                        Read
                                                    </button>
                                                    <button className="btn-info flex items-center gap-1">
                                                        <InformationCircleIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {expandedManhwa === manhwaItem.id && (
                                        <div className="inline-expansion-row">
                                            <div className="inline-expansion-content">
                                                <button 
                                                    className="inline-close-btn"
                                                    onClick={() => setExpandedManhwa(null)}
                                                >
                                                    ✕
                                                </button>
                                                <div className="inline-expansion-layout">
                                                    <div className="inline-expansion-details">
                                                        <h2 className="inline-expansion-title">{manhwaItem.title}</h2>
                                                        <div className="inline-expansion-meta">
                                                            <span>{manhwaItem.status}</span>
                                                            <span>{manhwaItem.year}</span>
                                                            <span>{manhwaItem.contentRating}</span>
                                                        </div>
                                                        <p className="inline-expansion-description">
                                                            {manhwaItem.description || 'No description available'}
                                                        </p>
                                                        <div className="inline-expansion-categories">
                                                            {manhwaItem.tags?.slice(0, 3).map((tag, idx) => (
                                                                <span key={idx} className="category-tag">{tag}</span>
                                                            ))}
                                                        </div>
                                                        <div className="inline-expansion-actions">
                                                            <a 
                                                                href={`https://mangadex.org/title/${manhwaItem.id}`} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="btn-primary"
                                                            >
                                                                <BookOpenIcon className="w-4 h-4 inline mr-1" />
                                                                Read on MangaDex
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="inline-expansion-image">
                                                        {getCoverUrl(manhwaItem.coverArt, manhwaItem.id) ? (
                                                            <img 
                                                                src={getCoverUrl(manhwaItem.coverArt, manhwaItem.id)} 
                                                                alt={manhwaItem.title}
                                                                className="expansion-cover"
                                                            />
                                                        ) : (
                                                            <div className="manhwa-placeholder-large">
                                                                <DocumentTextIcon className="w-24 h-24 text-white" />
                                                                <h4>{manhwaItem.title}</h4>
                                                            </div>
                                                        )}
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

export default Manhwa