'use client';

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, DollarSign, ShoppingCart } from "lucide-react";
import { ordersApi, productsApi } from "@/lib/api";
import { useAuth } from "@/lib/auth";

type Product = {
  _id: string;
  name: string;
  price: number;
  sellCount?: number;
};

export default function AdminDashboard() {
  const { checkAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [metrics, setMetrics] = useState({
    revenue: 0,
    ordersCount: 0,
    productsCount: 0,
    popularProducts: [] as Product[],
  });

  useEffect(() => {
    const init = async () => {
      const authed = checkAuth();
      if (!authed) return;

      try {
        setLoading(true);
        const [orders, products] = await Promise.all([
          ordersApi.getAll(),
          productsApi.getAll(),
        ]);

        const revenue = Array.isArray(orders)
          ? orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0)
          : 0;
        const ordersCount = Array.isArray(orders) ? orders.length : 0;
        const productsCount = Array.isArray(products) ? products.length : 0;

        const popularProducts = Array.isArray(products)
          ? [...products]
            .sort((a, b) => (b.sellCount || 0) - (a.sellCount || 0))
            .slice(0, 3)
          : [];

        setMetrics({ revenue, ordersCount, productsCount, popularProducts });
      } catch (err) {
        console.error("Admin dashboard ma'lumotlarini olishda xatolik:", err);
        setError("Maʼlumotlarni olishda xatolik yuz berdi.");
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? "loading" : formatCurrency(metrics.revenue)}
            </div>
            <p className="text-xs text-muted-foreground">Admin buyurtmalaridan hisoblandi</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : metrics.ordersCount}</div>
            <p className="text-xs text-muted-foreground">Jami buyurtmalar soni</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Products</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : metrics.productsCount}</div>
            <p className="text-xs text-muted-foreground">Jami mahsulotlar soni</p>
          </CardContent>
        </Card>
      </div>

      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Popular Products</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Yuklanmoqda...</p>
          ) : metrics.popularProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground">Hali mashhur mahsulotlar yoʻq.</p>
          ) : (
            <div className="space-y-8">
              {metrics.popularProducts.map((p) => (
                <div key={p._id} className="flex items-center">
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{p.name}</p>
                    <p className="text-sm text-muted-foreground">Sold: {p.sellCount ?? 0} units</p>
                  </div>
                  <div className="ml-auto font-medium">{formatCurrency(p.price || 0)}</div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}