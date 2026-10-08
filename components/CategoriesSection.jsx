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
                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-neutral-400">
                    Atelier Archives
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-tight mt-1">
                    Explore By Category
                </h2>
                <p className="text-xs text-neutral-500 mt-1">Handcrafted luxury wardrobe essentials tailored for effortless living.</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                {categories.map((category, index) => (
                    <CategoryCard key={index} name={category.name} imgUrl={category.imgUrl} />
                ))}
            </div>
        </div>
    );
};