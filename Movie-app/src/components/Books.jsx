import React, { useState, useEffect, useRef } from 'react'
import { FireIcon, BookOpenIcon, TrophyIcon, HeartIcon, RocketLaunchIcon, SparklesIcon, UserIcon, AcademicCapIcon, InformationCircleIcon } from '@heroicons/react/24/outline'
import Search from './Search'

const Books = () => {
    const [books, setBooks] = useState([])
    const [topBooks, setTopBooks] = useState([])
    const [featuredBook, setFeaturedBook] = useState(null)
    const [loading, setLoading] = useState(false)
    const [searchTerm, setSearchTerm] = useState('')
    const [activeCategory, setActiveCategory] = useState('fiction novels')
    const [expandedBook, setExpandedBook] = useState(null)
    const scrollRef = useRef(null)
    
    const GOOGLE_BOOKS_API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY
    
    const fetchBooks = async (query = 'fiction novels') => {
        setLoading(true)
        try {
            const url = `https://www.googleapis.com/books/v1/volumes?q=${query}+subject:fiction&orderBy=newest&maxResults=24&key=${GOOGLE_BOOKS_API_KEY}`
            const response = await fetch(url)
            const data = await response.json()
            const bookList = (data.items || []).sort((a, b) => {
                const dateA = new Date(a.volumeInfo.publishedDate || '1900-01-01')
                const dateB = new Date(b.volumeInfo.publishedDate || '1900-01-01')
                return dateB - dateA
            })
            setBooks(bookList)
            if (bookList.length > 0) {
                setFeaturedBook(bookList[0])
            }
        } catch (error) {
            console.error('Error fetching books:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchTopBooks = async () => {
        try {
            const url = `https://www.googleapis.com/books/v1/volumes?q=bestseller+novels+subject:fiction&orderBy=newest&maxResults=10&key=${GOOGLE_BOOKS_API_KEY}`
            const response = await fetch(url)
            const data = await response.json()
            const bookList = data.items || []
            setTopBooks(bookList)
        } catch (error) {
            console.error('Error fetching top books:', error)
        }
    }
    
    useEffect(() => {
        fetchBooks()
        fetchTopBooks()
    }, [])
    
    const categories = [
        { name: 'Popular Novels', query: 'fiction novels+subject:fiction', icon: TrophyIcon },
        { name: 'Classic Literature', query: 'classic literature+subject:fiction', icon: BookOpenIcon },
        { name: 'Mystery & Thriller', query: 'mystery thriller novels+subject:fiction', icon: SparklesIcon },
        { name: 'Romance Novels', query: 'romance novels+subject:fiction', icon: HeartIcon },
        { name: 'Sci-Fi Stories', query: 'science fiction novels+subject:fiction', icon: RocketLaunchIcon },
        { name: 'Fantasy Novels', query: 'fantasy novels+subject:fiction', icon: SparklesIcon },
        { name: 'Adventure Stories', query: 'adventure novels+subject:fiction', icon: UserIcon },
        { name: 'Young Adult', query: 'young adult novels+subject:fiction', icon: AcademicCapIcon }
    ]
    
    const handleCategoryClick = (category) => {
        setActiveCategory(category.query)
        fetchBooks(category.query)
    }

    const handleScroll = () => {
        const container = scrollRef.current
        if (container) {
            const cardWidth = 220
            const totalWidth = cardWidth * topBooks.length
            
            if (container.scrollLeft >= totalWidth) {
                container.scrollLeft = 0
            }
        }
    }
    
    return (
        <div className="books-section">
            {/* Hero Section */}
            {featuredBook && (
                <div className="books-hero">
                    <div className="hero-background">
                        <img 
                            src={featuredBook.volumeInfo.imageLinks?.large || featuredBook.volumeInfo.imageLinks?.thumbnail} 
                            alt={featuredBook.volumeInfo.title}
                        />
                        <div className="hero-overlay"></div>
                    </div>
                    <div className="hero-content">
                        <div className="hero-text">
                            <h1 className="hero-title">{featuredBook.volumeInfo.title}</h1>
                            <div className="hero-meta">
                                <span className="author">by {featuredBook.volumeInfo.authors?.[0]}</span>
                                <span className="separator">•</span>
                                <span className="rating">⭐ {featuredBook.volumeInfo.averageRating || 'N/A'}</span>
                                <span className="separator">•</span>
                                <span className="pages">{featuredBook.volumeInfo.pageCount} pages</span>
                            </div>
                            <p className="hero-description">
                                {featuredBook.volumeInfo.description?.substring(0, 300)}...
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
                {/* Top 10 Books Section */}
                <section className="netflix-row">
                    <h2 className="row-title">
                        <FireIcon className="w-6 h-6 text-red-500 inline mr-2" />
                        Top 10 Books Today
                    </h2>
                    <div className="row-content">
                        <div 
                            ref={scrollRef}
                            className="movie-row-scroll"
                            onScroll={handleScroll}
                        >
                            {[...topBooks, ...topBooks].map((book, index) => (
                                <div 
                                    key={`${book.id}-${index}`} 
                                    className="netflix-card"
                                    onClick={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
                                >
                                    <div className="card-image">
                                        <img 
                                            src={book.volumeInfo.imageLinks?.thumbnail || '/no-book.png'} 
                                            alt={book.volumeInfo.title}
                                            loading="lazy"
                                        />
                                        <div className="card-overlay">
                                            <div className="card-info">
                                                <h3>{book.volumeInfo.title}</h3>
                                                <div className="card-meta">
                                                    <span className="rating">⭐ {book.volumeInfo.averageRating || 'N/A'}</span>
                                                    <span className="year">{book.volumeInfo.publishedDate?.split('-')[0]}</span>
                                                </div>
                                                <p className="author">{book.volumeInfo.authors?.[0] || 'Unknown'}</p>
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
                <section className="books-search-section">
                    <Search 
                        searchTerm={searchTerm}
                        setSearchTerm={(term) => {
                            setSearchTerm(term)
                            if (term) {
                                fetchBooks(term + '+subject:fiction')
                            }
                        }}
                        placeholder="Search for novels, stories, authors, or genres..."
                    />
                </section>
                
                {/* Categories Section */}
                <section className="books-categories">
                    <h2 className="section-title">Browse by Genre</h2>
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
                
                {/* Books Grid */}
                <section className="books-content">
                    <h2 className="section-title flex items-center gap-2">
                        <BookOpenIcon className="w-8 h-8" />
                        Discover Books
                    </h2>
                    {loading ? (
                        <div className="books-loading">
                            <div className="loading-spinner"></div>
                            <p>Finding amazing books...</p>
                        </div>
                    ) : (
                        <div className="books-grid-wrapper">
                            {books.map((book, index) => (
                                <React.Fragment key={book.id}>
                                    <div 
                                        className="netflix-card"
                                        onClick={() => setExpandedBook(expandedBook === book.id ? null : book.id)}
                                    >
                                        <div className="card-image">
                                            <img 
                                                src={book.volumeInfo.imageLinks?.thumbnail || '/no-book.png'} 
                                                alt={book.volumeInfo.title}
                                                loading="lazy"
                                            />
                                            <div className="card-overlay">
                                                <div className="card-info">
                                                    <h3>{book.volumeInfo.title}</h3>
                                                    <div className="card-meta">
                                                        <span className="rating">⭐ {book.volumeInfo.averageRating || 'N/A'}</span>
                                                        <span className="year">{book.volumeInfo.publishedDate?.split('-')[0]}</span>
                                                    </div>
                                                    <p className="author">{book.volumeInfo.authors?.[0] || 'Unknown'}</p>
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
                                    
                                    {expandedBook === book.id && (
                                        <div className="inline-expansion-row">
                                            <div className="inline-expansion-content">
                                                <button 
                                                    className="inline-close-btn"
                                                    onClick={() => setExpandedBook(null)}
                                                >
                                                    ✕
                                                </button>
                                                <div className="inline-expansion-layout">
                                                    <div className="inline-expansion-details">
                                                        <h2 className="inline-expansion-title">{book.volumeInfo.title}</h2>
                                                        <div className="inline-expansion-meta">
                                                            <span>⭐ {book.volumeInfo.averageRating || 'N/A'}</span>
                                                            <span>{book.volumeInfo.publishedDate?.split('-')[0]}</span>
                                                            <span>{book.volumeInfo.pageCount} pages</span>
                                                        </div>
                                                        <p className="inline-expansion-description">
                                                            {book.volumeInfo.description || 'No description available'}
                                                        </p>
                                                        <div className="inline-expansion-categories">
                                                            {book.volumeInfo.categories?.slice(0, 3).map((category, idx) => (
                                                                <span key={idx} className="category-tag">{category}</span>
                                                            ))}
                                                        </div>
                                                        <div className="inline-expansion-actions">
                                                            <a 
                                                                href={book.volumeInfo.previewLink} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="btn-primary"
                                                            >
                                                                <BookOpenIcon className="w-4 h-4 inline mr-1" />
                                                                Read Preview
                                                            </a>
                                                        </div>
                                                    </div>
                                                    <div className="inline-expansion-image">
                                                        <img 
                                                            src={book.volumeInfo.imageLinks?.large || book.volumeInfo.imageLinks?.thumbnail || '/no-book.png'} 
                                                            alt={book.volumeInfo.title}
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

export default Books