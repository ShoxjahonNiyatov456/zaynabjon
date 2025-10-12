"use client";

import React, { useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart, CartItem } from "@/context/CartContext";

interface AddToCartButtonProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image?: string;
  };
  onAddToCart?: () => void;
}

export default function AddToCartButton({ product, onAddToCart }: AddToCartButtonProps) {
  const { addItem } = useCart();
  const [isAnimating, setIsAnimating] = useState(false);
  const controls = useAnimation();
  const handleAddToCart = () => {
    // Create cart item
    const cartItem: CartItem = {
      productId: product._id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image
    };

    // Add to cart
    addItem(cartItem);

    // Start animation
    setIsAnimating(true);

    // Animate the button
    controls.start({
      scale: [1, 1.2, 0.8, 0.6, 0.4, 0.2],
      opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
      y: [0, -20, -40],
      x: [0, 50, 100],
      transition: { duration: 0.6, ease: "easeInOut" }
    }).then(() => {
      setIsAnimating(false);
      controls.set({ scale: 1, opacity: 1, y: 0, x: 0 });

      // Call onAddToCart callback if provided
      if (onAddToCart) onAddToCart();
    });
  };

  return (
    <div className="relative">
      <Button
        onClick={handleAddToCart}
        variant="default"
        className="flex items-center gap-2"
        disabled={isAnimating}
      >
        <ShoppingCart className="h-4 w-4" />
        Savatga qo'shish
      </Button>

      {isAnimating && (
        <motion.div
          className="absolute z-50 pointer-events-none"
          animate={controls}
        >
          <ShoppingCart className="h-6 w-6 text-primary" />
        </motion.div>
      )}
    </div>
  );
}