"use client";

import { Button } from "@/components/ui/button";
import { Minus, Plus } from "lucide-react";

interface QuantitySelectorProps {
  quantity: number;
  setQuantity: (quantity: number) => void;
}

export default function QuantitySelector({ quantity, setQuantity }: QuantitySelectorProps) {
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex items-center justify-between mb-2">
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full border-2 border-primary"
        onClick={decreaseQuantity}
        disabled={quantity <= 1}
      >
        <Minus className="h-4 w-4 text-primary" />
      </Button>
      <span className="text-xl font-medium">{quantity}</span>
      <Button
        variant="outline"
        size="icon"
        className="h-10 w-10 rounded-full border-2 border-primary"
        onClick={increaseQuantity}
      >
        <Plus className="h-4 w-4 text-primary" />
      </Button>
    </div>
  );
}