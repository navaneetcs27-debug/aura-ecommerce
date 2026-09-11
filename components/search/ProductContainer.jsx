import React from "react";
import { ProductCard } from "../product/ProductCard";

const ProductContainer = ({ product }) => {
    return (
        <div className="w-full">
            <ProductCard product={product} />
        </div>
    );
};

export default ProductContainer;