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
        <div className="max-w-xl mx-auto px-4 py-2">
            <form onSubmit={handleSearch} className="relative flex items-center">
                <input
                    type="text"
                    placeholder="Search by keywords, style, color, category..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full pl-11 pr-24 py-3.5 text-xs sm:text-sm font-semibold text-neutral-950 placeholder-neutral-500 bg-white rounded-2xl border border-neutral-300 shadow-2xs focus:outline-none focus:border-neutral-950 focus:ring-2 focus:ring-neutral-200 transition"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-5 h-5 text-neutral-700 absolute left-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
                <button
                    type="submit"
                    className="absolute right-2 px-4 py-2 bg-neutral-950 text-white text-xs font-extrabold rounded-xl hover:bg-black transition shadow-xs"
                >
                    Search
                </button>
            </form>
        </div>
    );
};