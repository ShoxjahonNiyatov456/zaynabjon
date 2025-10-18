"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import QuantitySelector from "./QuantitySelector";
import { useState } from "react";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  category: string;
}

interface ProductDetailsProps {
  product: Product;
}

export default function ProductDetails({ product }: ProductDetailsProps) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: quantity,
      image: product.image
    });

    toast({
      title: "Savatga qo'shildi",
      description: `${quantity} ta ${product.name} savatga qo'shildi`,
    });
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-3xl font-bold text-primary mt-2">{product.price.toLocaleString()} so'm</p>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">Tavsif</h2>
        <p className="text-gray-700">{product.description || "Tavsif mavjud emas"}</p>
      </div>

      <div className="mt-auto pt-4">
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="text-sm font-medium mb-2">Miqdorni tanlang</h3>
          <QuantitySelector
            quantity={quantity}
            setQuantity={setQuantity}
          />
        </div>

        <Button
          className="w-full"
          size="lg"
          onClick={handleAddToCart}
        >
          <ShoppingCart className="mr-2 h-5 w-5" />
          Savatga qo'shish
        </Button>
      </div>
    </div>
  );
}