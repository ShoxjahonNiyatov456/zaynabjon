'use client';

import { useState, useEffect } from 'react';
import { OrderList } from './components/order-list';
import { Order } from './types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailsLoading, setDetailsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('admin-token');

        if (!token) {
          throw new Error('Authentication token not found');
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
        setError('');
      } catch (err) {
        setError('Failed to load orders. Please try again later.');
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleViewDetails = async (order: Order) => {
    try {
      setDetailsLoading(true);
      const token = localStorage.getItem('admin-token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

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

      // Update selected order with detailed information
      setSelectedOrder(detailedOrder);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setSelectedOrder(order);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdateOrderStatus = async (order: Order, status: 'delivered' | 'cancelled') => {
    try {
      setDetailsLoading(true);
      const token = localStorage.getItem('admin-token');

      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status })
      });

      if (!response.ok) {
        throw new Error(`Failed to update order status to ${status}`);
      }
      const updatedOrder = await response.json();
      setOrders(prevOrders =>
        prevOrders.map(o =>
          o._id === updatedOrder._id ? updatedOrder : o
        )
      );
      if (selectedOrder && selectedOrder._id === updatedOrder._id) {
        setSelectedOrder(updatedOrder);
      }
    } catch (err) {
      console.error(`Error updating order status to ${status}:`, err);
    } finally {
      setDetailsLoading(false);
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
        onUpdateStatus={handleUpdateOrderStatus}
      />

      {selectedOrder && (
        <div className="mt-8 border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Buyurtma tafsilotlari</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Order ID</h3>
                <p>#{selectedOrder._id.slice(-6)}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Date</h3>
                <p>{selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : 'N/A'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${selectedOrder.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                  selectedOrder.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                    selectedOrder.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                  }`}>
                  {selectedOrder.status}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Buyurtma mahsulotlari</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mahsulot</TableHead>
                      <TableHead>Soni</TableHead>
                      <TableHead>Narxi</TableHead>
                      <TableHead className="text-right">Jami</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedOrder.products && selectedOrder.products.length > 0 ? (
                      selectedOrder.products.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price ? item.price.toFixed(2) : '0.00'}</TableCell>
                          <TableCell className="text-right">${item.price && item.quantity ? (item.price * item.quantity).toFixed(2) : '0.00'}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          {selectedOrder.items > 0 ? `${selectedOrder.items} mahsulot` : 'Mahsulotlar topilmadi'}
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Jami:
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        {selectedOrder.totalPrice ? selectedOrder.totalPrice.toFixed(2) : '0.00'}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}