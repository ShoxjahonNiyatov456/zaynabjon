export interface Order {
  _id: string;
  customer: string;
  date: string;
  total: number;
  status: 'Processing' | 'Delivered' | 'Cancelled';
  items: number;
  products?: OrderProduct[];
}

export interface OrderProduct {
  product: string;
  productName: string;
  quantity: number;
  price: number;
}