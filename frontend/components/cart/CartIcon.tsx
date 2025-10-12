"use client";

import React, { useEffect } from "react";
import { ShoppingCart } from "lucide-react";
import { motion, useAnimation } from "framer-motion";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function CartIcon() {
  const { totalItems } = useCart();
  const controls = useAnimation();

  // Animate cart icon when totalItems changes
  useEffect(() => {
    if (totalItems > 0) {
      controls.start({
        scale: [1, 1.2, 1],
        rotate: [0, 15, -15, 0],
        transition: { duration: 0.4, ease: "easeInOut" }
      });
    }
  }, [totalItems, controls]);

  return (
    <Link href="/ordering" className="relative">
      <motion.div
        className="relative"
        animate={controls}
      >
        <ShoppingCart className="h-6 w-6" />
        {totalItems > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {totalItems}
          </Badge>
        )}
      </motion.div>
    </Link>
  );
}