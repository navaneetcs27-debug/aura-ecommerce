import { CategoryCard } from "./CategoryCard";

export const CategoriesSection = () => {
    const categories = [
        {
            name: "Shirts",
            imgUrl: "/images/products/white_shirt(men).jpg"
        },
        {
            name: "Coats",
            imgUrl: "/images/categories/coats.webp"
        },
        {
            name: "Blouses",
            imgUrl: "/images/categories/blouses.webp"
        },
        {
            name: "Sweaters",
            imgUrl: "/images/categories/sweaters.webp"
        },
        {
            name: "Dresses",
            imgUrl: "/images/categories/dress.jpeg"
        },
        {
            name: "Skirts",
            imgUrl: "/images/categories/skirts.webp"
        },
    ];

    return (
        <div>
            <div className="text-center mb-8">
                <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                    Curated Lines
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
                    Browse By Category
                </h2>
                <p className="text-xs text-slate-500 mt-1">Discover handcrafted luxury essentials tailored for modern living.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                {categories.map((category, index) => (
                    <CategoryCard key={index} name={category.name} imgUrl={category.imgUrl} />
                ))}
            </div>
        </div>
    );
};