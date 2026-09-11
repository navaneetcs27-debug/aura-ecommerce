import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export const SearchBar = () => {
    const router = useRouter();
    const [query, setQuery] = useState(router.query.q || "");

    useEffect(() => {
        if (router.query.q) {
            setQuery(router.query.q);
        }
    }, [router.query.q]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.push({
            pathname: '/search',
            query: {
                ...router.query,
                q: query
            }
        });
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-4">
            <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Search by keywords, style, color, category..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-11 pr-24 py-3 text-xs sm:text-sm bg-white rounded-2xl border border-slate-200 shadow-xs focus:outline-none focus:border-slate-400 focus:ring-2 focus:ring-slate-100 transition"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 text-slate-400 absolute left-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <button
                    type="submit"
                    className="absolute right-2 px-4 py-1.5 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition"
                >
                    Search
                </button>
            </form>
        </div>
    );
};