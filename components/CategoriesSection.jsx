import { CategoryCard } from "./CategoryCard";

export const CategoriesSection = () => {
    const categories = [
        {
            name: "Tailored Shirts",
            subtitle: "Egyptian Cotton",
            categoryKey: "Shirts",
            count: "5",
            imgUrl: "/images/products/white_shirt(men).jpg"
        },
        {
            name: "Winter Outerwear",
            subtitle: "Virgin Wool & Cashmere",
            categoryKey: "Coats",
            count: "5",
            imgUrl: "/images/categories/coats.webp"
        },
        {
            name: "Silk Blouses",
            subtitle: "Mulberry Silk",
            categoryKey: "Blouses",
            count: "5",
            imgUrl: "/images/categories/blouses.webp"
        },
        {
            name: "Merino Knitwear",
            subtitle: "Extra-Fine Wool",
            categoryKey: "Sweaters",
            count: "3",
            imgUrl: "/images/categories/sweaters.webp"
        },
        {
            name: "Evening Dresses",
            subtitle: "Fluid Silhouettes",
            categoryKey: "Dresses",
            count: "3",
            imgUrl: "/images/categories/dress.jpeg"
        },
        {
            name: "Tailored Skirts",
            subtitle: "Structured A-Line",
            categoryKey: "Skirts",
            count: "2",
            imgUrl: "/images/categories/skirts.webp"
        },
    ];

    return (
        <div>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                <div>
                    <span className="text-xs font-black uppercase tracking-[0.25em] text-neutral-700">
                        Atelier Archives
                    </span>
                    <h2 className="text-2xl sm:text-3xl font-black text-neutral-950 tracking-tight mt-1">
                        Explore Wardrobe Disciplines
                    </h2>
                </div>
                <p className="text-xs sm:text-sm text-neutral-800 font-medium max-w-sm">
                    Structured silhouettes and certified organic natural fibres designed for lasting rotation.
                </p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-5">
                {categories.map((category, index) => (
                    <CategoryCard 
                        key={index} 
                        name={category.name} 
                        subtitle={category.subtitle}
                        categoryKey={category.categoryKey}
                        count={category.count}
                        imgUrl={category.imgUrl} 
                    />
                ))}
            </div>
        </div>
    );
};