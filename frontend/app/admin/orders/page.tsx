'use client';

import { useState, useEffect } from 'react';
import { OrderList } from './components/order-list';
import { OrderDetails } from './components/order-details';
import { Order } from './types';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsOpen, setDetailsOpen] = useState<boolean>(false);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`);

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
        setError('');
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');

        // Fallback to mock data for development
        setOrders([
          { _id: '12345', customer: 'John Doe', date: '2023-06-15', total: 125.00, status: 'Processing', items: 2 },
          { _id: '12344', customer: 'Jane Smith', date: '2023-06-14', total: 78.50, status: 'Delivered', items: 1 },
          { _id: '12343', customer: 'Bob Johnson', date: '2023-06-13', total: 249.99, status: 'Delivered', items: 3 },
          { _id: '12342', customer: 'Alice Brown', date: '2023-06-12', total: 45.75, status: 'Cancelled', items: 1 },
          { _id: '12341', customer: 'Charlie Wilson', date: '2023-06-11', total: 156.25, status: 'Delivered', items: 2 },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Handle view order details
  const handleViewDetails = async (order: Order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);

    // If order doesn't have products details, fetch them
    if (!order.products) {
      try {
        setDetailsLoading(true);
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`);

        if (!response.ok) {
          throw new Error('Failed to fetch order details');
        }

        const detailedOrder = await response.json();

        // Update the order in the orders array with the detailed information
        setOrders(prevOrders =>
          prevOrders.map(o =>
            o._id === detailedOrder._id ? detailedOrder : o
          )
        );

        // Update selected order
        setSelectedOrder(detailedOrder);
      } catch (err) {
        console.error('Error fetching order details:', err);
        // Add mock products for development
        setSelectedOrder({
          ...order,
          products: [
            { product: 'prod1', productName: 'Chicken Burger', quantity: 1, price: 12.99 },
            { product: 'prod2', productName: 'French Fries', quantity: 1, price: 4.99 }
          ]
        });
      } finally {
        setDetailsLoading(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
      </div>

      <OrderList
        orders={orders}
        loading={loading}
        error={error}
        onViewDetails={handleViewDetails}
      />

      <OrderDetails
        order={selectedOrder}
        open={detailsOpen}
        loading={detailsLoading}
        onClose={() => setDetailsOpen(false)}
      />
    </div>
  );
}