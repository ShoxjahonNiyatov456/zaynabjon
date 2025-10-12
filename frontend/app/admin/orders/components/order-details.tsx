'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Order, OrderProduct } from "../types";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2 } from "lucide-react";

interface OrderDetailsProps {
  order: Order | null;
  open: boolean;
  loading: boolean;
  onClose: () => void;
}

export function OrderDetails({
  order,
  open,
  loading,
  onClose
}: OrderDetailsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : !order ? (
          <div className="text-center py-4">Order not found</div>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Order ID</h3>
                <p>#{order._id}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Date</h3>
                <p>{new Date(order.date).toLocaleDateString()}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Customer</h3>
                <p>{order.customer}</p>
              </div>
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(order.status)}`}>
                  {order.status}
                </span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Order Items</h3>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {order.products && order.products.length > 0 ? (
                      order.products.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>{item.productName}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>${item.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">${(item.price * item.quantity).toFixed(2)}</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center py-4">
                          No items found
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-bold">
                        Total:
                      </TableCell>
                      <TableCell className="text-right font-bold">
                        ${order.total.toFixed(2)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}