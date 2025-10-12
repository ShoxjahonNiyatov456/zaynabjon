"use client";

import ProductCard from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface RecommendedProductsProps {
  title: string;
  products: Product[];
  onProductClick: (product: Product) => void;
}

export default function RecommendedProducts({
  title,
  products,
  onProductClick
}: RecommendedProductsProps) {
  if (products.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="relative">
        <div className="flex overflow-x-auto pb-4 space-x-4 no-scrollbar">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onClick={onProductClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
}