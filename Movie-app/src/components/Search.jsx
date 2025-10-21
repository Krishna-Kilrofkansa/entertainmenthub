import React, { useCallback } from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'

const Search = ({searchTerm, setSearchTerm, placeholder = "Search..."}) => {
    const handleChange = useCallback((event) => {
        setSearchTerm(event.target.value);
    }, [setSearchTerm]);

    return (
        <div className="search">
            <div className="search-input-wrapper">
                <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    className="search-input"
                    onChange={handleChange}
                    value={searchTerm}
                    placeholder={placeholder}
                />
            </div>
        </div>
    )
}
export default Search
