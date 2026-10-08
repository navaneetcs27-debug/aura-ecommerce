import { useState } from "react";
import Head from "next/head";
import { SearchBar } from "../components/search/SearchBar";
import { FiltersBar } from "../components/search/FiltersBar";
import { ResultsContainer } from "../components/search/ResultsContainer";
import { ResultsSummary } from "../components/search/ResultsSummary";

const SearchPage = () => {
    const [currPage, setCurrPage] = useState(1);
    const resultsPerPage = 12;

    const onPageUpdate = (newIndex) => {
        setCurrPage(newIndex);
    };

    return (
        <>
            <Head>
                <title>Search & Collections - AURA STYLE</title>
                <meta name="description" content="Search through our luxury collection of clothing, coats, blouses, sweaters and accessories." />
            </Head>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="text-center pt-2">
                    <h1 className="text-2xl sm:text-4xl font-black text-black tracking-tight">
                        Explore Atelier Catalog
                    </h1>
                    <p className="text-xs sm:text-sm text-black font-bold mt-1">
                        Filter by certified fibres, silhouettes, color palettes, and price points.
                    </p>
                </div>

                <SearchBar />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
                    {/* Left: Filters Sidebar */}
                    <div className="lg:col-span-3 bg-white p-5 rounded-3xl border border-[#dfdcd3] shadow-xs sticky top-36">
                        <FiltersBar />
                    </div>

                    {/* Right: Results Section */}
                    <div className="lg:col-span-9 space-y-6">
                        <ResultsSummary count={24} currPage={currPage} resultsPerPage={resultsPerPage} onPageUpdate={onPageUpdate} />
                        <ResultsContainer currPage={currPage} resultsPerPage={resultsPerPage} />
                    </div>
                </div>
            </div>
        </>
    );
};


export default SearchPage;