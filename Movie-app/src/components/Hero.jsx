import React, { useState, useEffect } from 'react'
import { PlayIcon, InformationCircleIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { StarIcon } from '@heroicons/react/24/solid'

const Hero = ({ featuredMovies = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isTransitioning, setIsTransitioning] = useState(false)
    const [fadeClass, setFadeClass] = useState('opacity-100')

    // Auto-rotate through featured movies every 8 seconds
    useEffect(() => {
        if (featuredMovies.length <= 1) return

        const interval = setInterval(() => {
            handleTransition(() => setCurrentIndex((prev) => (prev + 1) % featuredMovies.length))
        }, 8000)

        return () => clearInterval(interval)
    }, [featuredMovies.length])

    const handleTransition = (callback) => {
        if (isTransitioning) return
        setIsTransitioning(true)
        setFadeClass('opacity-0')
        
        setTimeout(() => {
            callback()
            setFadeClass('opacity-100')
            setTimeout(() => setIsTransitioning(false), 200)
        }, 200)
    }

    const handlePrev = () => {
        handleTransition(() => 
            setCurrentIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)
        )
    }

    const handleNext = () => {
        handleTransition(() => 
            setCurrentIndex((prev) => (prev + 1) % featuredMovies.length)
        )
    }

    const handleIndicatorClick = (index) => {
        if (index !== currentIndex) {
            handleTransition(() => setCurrentIndex(index))
        }
    }

    if (!featuredMovies.length) return null

    const currentMovie = featuredMovies[currentIndex]
    const backdropUrl = currentMovie.backdrop_path
        ? `https://image.tmdb.org/t/p/original/${currentMovie.backdrop_path}`
        : currentMovie.poster_path
        ? `https://image.tmdb.org/t/p/original/${currentMovie.poster_path}`
        : '/hero-bg.png'

    return (
        <section className="hero-section">
            {/* Background Image with Fade Transition */}
            <div
                className={`hero-background transition-opacity duration-500 ease-in-out ${fadeClass}`}
                style={{
                    backgroundImage: `url(${backdropUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    backgroundRepeat: 'no-repeat'
                }}
            />

            {/* Netflix-style Gradient Overlay */}
            <div className="hero-overlay" />

            {/* Content */}
            <div className="hero-content">
                <div className={`hero-text transition-opacity duration-500 ease-in-out ${fadeClass}`}>
                    <h1 className="hero-title">{currentMovie.title}</h1>
                    <div className="hero-meta">
                        <div className="rating">
                            <StarIcon className="w-5 h-5 text-yellow-400" />
                            <span className="text-white font-semibold">
                                {currentMovie.vote_average?.toFixed(1) || 'N/A'}
                            </span>
                        </div>
                        <span className="separator">•</span>
                        <span className="year">{currentMovie.release_date?.split('-')[0] || 'N/A'}</span>
                        <span className="separator">•</span>
                        <span className="rating-badge">HD</span>
                    </div>
                    <p className="hero-description">
                        {currentMovie.overview?.length > 250
                            ? `${currentMovie.overview.substring(0, 250)}...`
                            : currentMovie.overview || 'No description available.'
                        }
                    </p>
                    <div className="hero-buttons">
                        <button className="play-btn group">
                            <PlayIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span>Play</span>
                        </button>
                        <button className="info-btn group">
                            <InformationCircleIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span>More Info</span>
                        </button>
                    </div>
                </div>

                {/* Navigation Arrows */}
                {featuredMovies.length > 1 && (
                    <>
                        <button
                            className="nav-arrow nav-arrow-left group"
                            onClick={handlePrev}
                            disabled={isTransitioning}
                            aria-label="Previous movie"
                        >
                            <ChevronLeftIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                        <button
                            className="nav-arrow nav-arrow-right group"
                            onClick={handleNext}
                            disabled={isTransitioning}
                            aria-label="Next movie"
                        >
                            <ChevronRightIcon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                        </button>
                    </>
                )}

                {/* Indicators */}
                {featuredMovies.length > 1 && (
                    <div className="hero-indicators">
                        {featuredMovies.map((_, index) => (
                            <button
                                key={index}
                                className={`indicator ${index === currentIndex ? 'active' : ''}`}
                                onClick={() => handleIndicatorClick(index)}
                                disabled={isTransitioning}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

export default Hero
