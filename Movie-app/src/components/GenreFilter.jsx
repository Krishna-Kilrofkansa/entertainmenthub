import React from 'react'

const GenreFilter = ({ genres, selectedGenres = [], onGenreChange }) => {
    if (!genres || !Array.isArray(genres) || genres.length === 0) return null;
    if (!Array.isArray(selectedGenres)) return null;

    return (
        <div className="genre-filter">
            <h3 className="genre-title">Filter by Genre</h3>
            <div className="genre-grid">
                {genres.map((genre) => (
                    <button
                        key={genre.id}
                        onClick={() => onGenreChange(genre.id)}
                        className={`genre-tag ${selectedGenres.includes(genre.id) ? 'active' : ''}`}
                    >
                        {genre.name}
                    </button>
                ))}
            </div>
            {selectedGenres.length > 0 && (
                <button 
                    onClick={() => onGenreChange('clear')}
                    className="clear-genres-btn"
                >
                    Clear All
                </button>
            )}
        </div>
    )
}

export default GenreFilter
