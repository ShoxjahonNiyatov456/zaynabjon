export interface Product {
  _id: string;
  name: string;
  price: number;
  category: string;
  categoryName?: string;
  description?: string;
  imageUrl?: string;
}

export interface Category {
  _id: string;
  name: string;
}

export interface FormData {
  name: string;
  price: string;
  category: string;
  description: string;
  imageUrl: string;
}