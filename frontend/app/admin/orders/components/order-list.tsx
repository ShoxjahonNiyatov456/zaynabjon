'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Search, Loader2 } from 'lucide-react';
import { Order } from '../types';

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  error: string;
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (order: Order, status: 'delivered' | 'cancelled') => void;
}

export function OrderList({
  orders,
  loading,
  error,
  onUpdateStatus,
}: OrderListProps) {


  const [searchQuery, setSearchQuery] = useState<string>('');
  const filteredOrders = orders.filter(order =>
    order._id.includes(searchQuery) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <>
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by order ID or customer name..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {loading && !orders.length ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-red-500">{error}</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Miqdori</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">#{order._id.slice(-6)}</TableCell>
                    <TableCell>
                      {order.products && order.products.length > 0
                        ? order.products.map(p => `${p.name}`).join(', ')
                        : order.items > 0 ? `${order.items} items` : 'No products'}
                    </TableCell>
                    <TableCell>{order.products?.reduce((total, item) => total + item.quantity, 0) || 0}</TableCell>
                    <TableCell>{order?.totalPrice || 0}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-green-50 hover:bg-green-100 text-green-600"
                          onClick={() => onUpdateStatus(order, 'delivered')}
                          disabled={loading}
                        >
                          ✅
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="bg-red-50 hover:bg-red-100 text-red-600"
                          onClick={() => onUpdateStatus(order, 'cancelled')}
                          disabled={loading}
                        >
                          ❌
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </>
  );
}