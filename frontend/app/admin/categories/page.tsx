'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Search, Edit, Trash, Loader2 } from 'lucide-react';
import { categoriesApi } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

interface Category {
  _id: string;
  name: string;
  active: boolean;
  productCount?: number;
}

interface FormData {
  name: string;
  active: boolean;
}

export default function CategoriesPage() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    active: true,
  });

  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async (): Promise<void> => {
    try {
      setLoading(true);
      const data = await categoriesApi.getAll();
      setCategories(data);
      setError('');
    } catch (err: any) {
      setError('Failed to load categories');
      toast({
        title: 'Error',
        description: err.message || 'Failed to load categories',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddCategory = async (): Promise<void> => {
    try {
      setLoading(true);
      const categoryData = {
        name: formData.name,
        active: formData.active,
      };

      await categoriesApi.create(categoryData);
      await fetchCategories();
      setIsAddDialogOpen(false);
      resetForm();

      toast({
        title: 'Success',
        description: 'Category added successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to add category',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEditCategory = async (): Promise<void> => {
    if (!currentCategory) return;

    try {
      setLoading(true);
      const categoryData = {
        name: formData.name,
        active: formData.active,
      };

      await categoriesApi.update(currentCategory._id, categoryData);
      await fetchCategories();
      setIsEditDialogOpen(false);

      toast({
        title: 'Success',
        description: 'Category updated successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update category',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (): Promise<void> => {
    if (!currentCategory) return;

    try {
      setLoading(true);
      await categoriesApi.delete(currentCategory._id);
      await fetchCategories();
      setIsDeleteDialogOpen(false);

      toast({
        title: 'Success',
        description: 'Category deleted successfully',
      });
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to delete category',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (checked: boolean): void => {
    setFormData(prev => ({ ...prev, active: checked }));
  };

  const resetForm = (): void => {
    setFormData({
      name: '',
      active: true,
    });
  };

  const openEditDialog = (category: Category): void => {
    setCurrentCategory(category);
    setFormData({
      name: category.name,
      active: category.active,
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (category: Category): void => {
    setCurrentCategory(category);
    setIsDeleteDialogOpen(true);
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button onClick={() => setIsAddDialogOpen(true)} disabled={loading}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search categories..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      {loading && !categories.length ? (
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
                <TableHead>Name</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCategories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    No categories found
                  </TableCell>
                </TableRow>
              ) : (
                filteredCategories.map((category) => (
                  <TableRow key={category._id}>
                    <TableCell className="font-medium">{category.name}</TableCell>
                    <TableCell>{category.productCount || 0}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${category.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                        {category.active ? 'Active' : 'Inactive'}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditDialog(category)}
                        disabled={loading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openDeleteDialog(category)}
                        disabled={loading}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Add Category Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
            <DialogDescription>
              Add a new category to your menu
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="active" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleAddCategory} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Category Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
            <DialogDescription>
              Update category information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-name" className="text-right">
                Name
              </Label>
              <Input
                id="edit-name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="col-span-3"
                disabled={loading}
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-active" className="text-right">
                Active
              </Label>
              <div className="col-span-3 flex items-center">
                <Switch
                  id="edit-active"
                  checked={formData.active}
                  onCheckedChange={handleSwitchChange}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleEditCategory} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Category</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteCategory} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
