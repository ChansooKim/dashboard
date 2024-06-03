import { useState } from 'react';
import { FaSearch } from "react-icons/fa";

const SearchEngineSwitcher = () => {
    const [query, setQuery] = useState('');
    const [engine, setEngine] = useState('google');

    const handleSearch = (e) => {
        e.preventDefault();
        let searchUrl = '';
        if (engine === 'google') {
            searchUrl = `https://www.google.com/search?q=${query}`;
        } else if (engine === 'naver') {
            searchUrl = `https://search.naver.com/search.naver?query=${query}`;
        }
        // window.location.href = searchUrl;
        let popup = window.open(searchUrl);
    };

    return (
        <div className="flex flex-col items-center justify-center p-6">
            <form onSubmit={handleSearch} className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                    <select
                        value={engine}
                        onChange={(e) => setEngine(e.target.value)}
                        className="p-2 border border-gray-300 rounded mr-2"
                    >
                        <option value="google">Google</option>
                        <option value="naver">Naver</option>
                    </select>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        className="p-2 border border-gray-300 rounded flex-grow mr-2"
                    />
                    <button type="submit"  className="rounded whitespace-nowrap">
                        <FaSearch/>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SearchEngineSwitcher;