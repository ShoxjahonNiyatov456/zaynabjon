'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { productsApi, categoriesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ProductList } from './components/product-list';
import { ProductForm } from './components/product-form';
import { DeleteProduct } from './components/delete-product';
import { Product, Category, ProductFormData } from './types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const { toast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await productsApi.getAll();
      setProducts(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load products');
      toast({
        title: 'Error',
        description: err.message || 'Failed to load products',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const data = await categoriesApi.getAll();
      setCategories(data);
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to load categories',
        variant: 'destructive',
      });
    }
  };

  const handleAddProduct = async (productData: ProductFormData): Promise<void> => {
    try {
      setLoading(true);
      const formData = new globalThis.FormData();

      // Add text fields
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('description', productData.description);

      // Add image files
      if (productData.images && productData.images.length > 0) {
        for (let i = 0; i < productData.images.length; i++) {
          formData.append('images', productData.images[i]);
        }
      }

      await productsApi.create(formData);
      await fetchProducts();
      setIsAddDialogOpen(false);

      toast({
        title: 'Success',
        description: 'Product added successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditProduct = async (productData: ProductFormData): Promise<void> => {
    if (!currentProduct) return;

    try {
      setLoading(true);
      const formData = new globalThis.FormData();

      // Add text fields
      formData.append('name', productData.name);
      formData.append('price', productData.price);
      formData.append('category', productData.category);
      formData.append('description', productData.description);

      // Add image files
      if (productData.images && productData.images.length > 0) {
        for (let i = 0; i < productData.images.length; i++) {
          formData.append('images', productData.images[i]);
        }
      }

      await productsApi.update(currentProduct._id, formData);
      await fetchProducts();
      setIsEditDialogOpen(false);

      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProduct = async (): Promise<void> => {
    if (!currentProduct) return;

    try {
      setLoading(true);
      await productsApi.delete(currentProduct._id);
      await fetchProducts();
      setIsDeleteDialogOpen(false);

      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete product',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const openEditDialog = (product: Product): void => {
    setCurrentProduct(product);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (product: Product): void => {
    setCurrentProduct(product);
    setIsDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      <ProductList
        products={products}
        categories={categories}
        loading={loading}
        error={error}
        onEdit={openEditDialog}
        onDelete={openDeleteDialog}
      />

      {/* Add Product Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Add Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            categories={categories}
            loading={loading}
            onSubmit={handleAddProduct}
            onCancel={() => setIsAddDialogOpen(false)}
            submitLabel="Add Product"
          />
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm
            initialData={currentProduct || undefined}
            categories={categories}
            loading={loading}
            onSubmit={handleEditProduct}
            onCancel={() => setIsEditDialogOpen(false)}
            submitLabel="Update Product"
          />
        </DialogContent>
      </Dialog>

      {/* Delete Product Dialog */}
      <DeleteProduct
        product={currentProduct}
        open={isDeleteDialogOpen}
        loading={loading}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={handleDeleteProduct}
      />
    </div>
  );
}