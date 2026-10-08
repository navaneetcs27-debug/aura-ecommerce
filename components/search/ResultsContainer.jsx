import { ProductCard } from "../product/ProductCard";
import { PRODUCTS } from "../../data/products";
import { useRouter } from 'next/router';
import { useEffect, useState } from "react";

const safeJsonParse = (str, fallback = []) => {
    if (!str) return fallback;
    try {
        return JSON.parse(str);
    } catch (e) {
        return fallback;
    }
};

export const ResultsContainer = ({ currPage = 1, resultsPerPage = 12 }) => {
    const startIndex = (currPage - 1) * resultsPerPage;
    const endIndex = startIndex + resultsPerPage;

    const router = useRouter();
    const { categories, colors, gender, price, q } = router.query;
    const [products, setProducts] = useState(PRODUCTS);

    useEffect(() => {
        const genderCodes = {
            "Female": "F",
            "Male": "M"
        };

        let updatedProducts = PRODUCTS;

        // Text search
        if (q) {
            const query = q.toLowerCase();
            updatedProducts = updatedProducts.filter(
                (p) =>
                    p.title.toLowerCase().includes(query) ||
                    (p.category && p.category.toLowerCase().includes(query)) ||
                    (p.color && p.color.toLowerCase().includes(query)) ||
                    (p.description && p.description.toLowerCase().includes(query))
            );
        }

        const parsedCategories = safeJsonParse(categories);
        if (parsedCategories.length > 0) {
            updatedProducts = updatedProducts.filter((p) =>
                parsedCategories.includes(p.category)
            );
        }

        const parsedColors = safeJsonParse(colors);
        if (parsedColors.length > 0) {
            updatedProducts = updatedProducts.filter((p) =>
                parsedColors.includes(p.color)
            );
        }

        const parsedGender = safeJsonParse(gender);
        if (parsedGender && parsedGender.length > 0) {
            const genderCode = genderCodes[parsedGender] || parsedGender;
            updatedProducts = updatedProducts.filter(
                (p) => p.gender === genderCode || p.gender === parsedGender
            );
        }

        const parsedPrice = safeJsonParse(price);
        if (parsedPrice.length === 2) {
            const [min, max] = parsedPrice;
            updatedProducts = updatedProducts.filter(
                (p) => Number(p.price) >= min && Number(p.price) <= max
            );
        }

        setProducts(updatedProducts);
    }, [categories, colors, gender, price, q]);

    if (products.length === 0) {
        return (
            <div className="w-full py-16 bg-white rounded-3xl border border-neutral-300 text-center p-8 shadow-sm">
                <span className="text-4xl block mb-2">🔍</span>
                <h3 className="text-base font-black text-black">No matching products found</h3>
                <p className="text-xs text-black font-bold mt-1">Try clearing some filters or searching for something else.</p>
            </div>
        );
    }

    return (
        <div className="w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.slice(startIndex, endIndex).map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ResultsContainer;