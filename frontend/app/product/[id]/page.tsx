"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import ProductDetails from "./components/ProductDetails";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export default function ProductPage() {
  const { id } = useParams();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`);
        if (!response.ok) {
          throw new Error("Mahsulot ma'lumotlarini olishda xatolik yuz berdi");
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Error fetching product:", error);
        setError(error instanceof Error ? error.message : "Mahsulot ma'lumotlarini olishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleGoBack = () => {
    router.back();
  };
  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Xatolik</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error || "Mahsulot topilmadi"}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={handleGoBack}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Orqaga qaytish
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-8 px-4">
        <Button variant="ghost" onClick={handleGoBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Orqaga qaytish
        </Button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Mahsulot rasmi */}
            <div className="relative h-[400px] overflow-hidden">
              <img
                src={product.image || "/placeholder.svg?height=400&width=600&query=food"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 bg-gradient-to-t from-black/50 to-transparent w-full h-1/4"></div>
            </div>

            {/* Mahsulot ma'lumotlari */}
            <div className="p-6 md:p-8">
              <ProductDetails product={product} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}