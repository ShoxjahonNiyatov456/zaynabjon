"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowLeft } from "lucide-react";

interface OrderDetails {
  _id: string;
  phoneNumber: string;
  location: string;
  totalPrice: number;
  status: string;
  products: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: string;
}

export default function OrderSuccessPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`);
        if (!response.ok) {
          throw new Error("Buyurtma ma'lumotlarini olishda xatolik yuz berdi");
        }

        const data = await response.json();
        setOrder(data);
      } catch (error) {
        console.error("Error fetching order:", error);
        setError(error instanceof Error ? error.message : "Buyurtma ma'lumotlarini olishda xatolik yuz berdi");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <p>Yuklanmoqda...</p>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container mx-auto py-12">
        <Card className="max-w-lg mx-auto">
          <CardHeader>
            <CardTitle className="text-center text-destructive">Xatolik</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-center">{error || "Buyurtma topilmadi"}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Link href="/">
              <Button>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Bosh sahifaga qaytish
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
          <CardTitle className="text-2xl">Buyurtma muvaffaqiyatli qabul qilindi!</CardTitle>
          <p className="text-muted-foreground">Buyurtma raqami: {order._id}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-medium">Buyurtma ma'lumotlari</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <p className="text-muted-foreground">Telefon raqami:</p>
              <p>{order.phoneNumber}</p>

              <p className="text-muted-foreground">Manzil:</p>
              <p>{order.location}</p>

              <p className="text-muted-foreground">Holati:</p>
              <p>{order.status === "pending" ? "Kutilmoqda" :
                order.status === "processing" ? "Jarayonda" :
                  order.status === "delivered" ? "Yetkazildi" :
                    "Bekor qilindi"}</p>

              <p className="text-muted-foreground">Sana:</p>
              <p>{new Date(order.createdAt).toLocaleString()}</p>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Buyurtma qilingan mahsulotlar</h3>
            <div className="space-y-2">
              {order.products.map((product, index) => (
                <div key={index} className="flex justify-between text-sm border-b pb-2">
                  <div>
                    <p>{product.name}</p>
                    <p className="text-muted-foreground">{product.quantity} x {product.price.toLocaleString()} so'm</p>
                  </div>
                  <p className="font-medium">{(product.quantity * product.price).toLocaleString()} so'm</p>
                </div>
              ))}

              <div className="flex justify-between pt-2 font-bold">
                <p>Jami:</p>
                <p>{order.totalPrice.toLocaleString()} so'm</p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Bosh sahifaga qaytish
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}