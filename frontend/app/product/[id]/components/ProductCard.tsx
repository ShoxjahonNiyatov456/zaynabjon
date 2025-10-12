"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

export default function ProductCard({ product, onClick }: ProductCardProps) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent any default behavior

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    });

    toast({
      title: "Savatga qo'shildi",
      description: `1 ta ${product.name} savatga qo'shildi`,
    });
  };

  return (
    <Card
      className="min-w-[250px] max-w-[250px] cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onClick(product)}
    >
      <div
        className="h-40 overflow-hidden cursor-pointer relative"
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onClick(product);
        }}
      >
        <img
          src={product.image || "/placeholder.svg?height=200&width=300&query=food"}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-300 hover:scale-110 hover:brightness-90"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-all duration-300"></div>
      </div>
      <CardHeader className="p-4">
        <CardTitle className="text-lg">{product.name}</CardTitle>
      </CardHeader>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <p className="font-semibold text-primary">{product.price.toLocaleString()} so'm</p>
        <Button size="sm" variant="outline" onClick={handleAddToCart}>
          <Plus className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}