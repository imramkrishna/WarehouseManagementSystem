import { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Package,
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  AlertTriangle,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import axios from 'axios';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { AddInventoryForm } from '../addForms/addInventory';
import { UpdateInventoryForm } from '../addForms/updateInventory';

export interface InventoryItem {
  id: number;
  product_name: string;
  sku: string;
  barcode: string;
  description: string;
  category: string;
  brand: string;
  quantity_available: number;
  quantity_on_hand: number;
  quantity_reserved: number;
  minimum_stock_level: number;
  maximum_stock_level: number;
  reorder_point: number;
  reorder_quantity: number;
  unit_price: number;
  cost_price: number;
  unit_of_measure: string;
  location: string;
  status: 'active' | 'inactive' | 'discontinued';
  supplier_id: number;
  warehouse_id: number;
  batch_number: string;
  expiry_date: string | null;
  weight: string;
  dimensions: string;
  last_counted_date: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}

export function InventoryList() {
  const backendUrl = import.meta.env.VITE_BACKEND_URI;
  const [loading, setLoading] = useState<boolean>(true);
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [lowStockItems, setLowStockItems] = useState<InventoryItem[]>([]);
  const [outOfStockItems, setOutOfStockItems] = useState<InventoryItem[]>([]);
  const [totalInventoryValue, setTotalInventoryValue] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [showEditForm, setShowEditForm] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  const filteredInventory = inventoryItems.filter(item => {
    const matchesSearch = item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'in-stock':
      case 'active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400';
      case 'low-stock':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400';
      case 'out-of-stock':
      case 'inactive':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400';
      case 'discontinued':
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
      default:
        return 'bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300';
    }
  };
  async function fetchInventory() {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/profile/inventory`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      setInventoryItems(response.data.items || []);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching inventory:', error);
      setInventoryItems([]);
      setLoading(false); // Fix: Set to false instead of true
    }
  }
  useEffect(() => {
    fetchInventory();
  }, []);
  useEffect(() => {
    if (inventoryItems.length > 0) {
      const lowStockItems = inventoryItems.filter(item => item.quantity_available <= item.minimum_stock_level);
      const outOfStockItems = inventoryItems.filter(item => item.quantity_available === 0);
      const totalPrice = inventoryItems.reduce((total, item) =>
        total + parseFloat(item.unit_price.toString()) * item.quantity_available, 0
      );

      setLowStockItems(lowStockItems);
      setOutOfStockItems(outOfStockItems);
      setTotalInventoryValue(totalPrice);
    }
  }, [inventoryItems]);
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <LoadingSpinner />
        <div className="mt-4 text-slate-600 dark:text-slate-300">Loading inventory...</div>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'in-stock':
        return <TrendingUp className="w-4 h-4" />;
      case 'low-stock':
        return <AlertTriangle className="w-4 h-4" />;
      case 'out-of-stock':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };
  async function handleProductEdit(id: number) {
    const item = inventoryItems.find(item => item.id === id);
    if (!item) {
      console.error('Item not found for ID:', id);
      return;
    }
    console.log('handleProductEdit called with ID:', item);
    setSelectedItem(item);
    setShowEditForm(true);

  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Inventory Management</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">Manage your warehouse inventory and stock levels</p>
        </div>
        <Button
          className="flex items-center space-x-2 text-white shadow-lg bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 hover:shadow-emerald-500/50"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Item</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="p-6 transition-shadow border-slate-200 dark:border-slate-700 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Items</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{inventoryItems.length}</p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
              <Package className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">+12% from last month</span>
          </div>
        </Card>

        <Card className="p-6 transition-shadow border-slate-200 dark:border-slate-700 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Low Stock Items</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">{lowStockItems.length}</p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30">
              <AlertTriangle className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-slate-600 dark:text-slate-400">Requires attention</span>
          </div>
        </Card>

        <Card className="p-6 transition-shadow border-slate-200 dark:border-slate-700 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Out of Stock</p>
              <p className="text-2xl font-bold text-rose-600 dark:text-rose-400">{outOfStockItems.length}</p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-rose-100 to-red-100 dark:from-rose-900/30 dark:to-red-900/30">
              <TrendingDown className="w-6 h-6 text-rose-600 dark:text-rose-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-rose-600 dark:text-rose-400">Immediate action needed</span>
          </div>
        </Card>

        <Card className="p-6 transition-shadow border-slate-200 dark:border-slate-700 hover:shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Value</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">${totalInventoryValue.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-emerald-500" />
            <span className="text-emerald-600 dark:text-emerald-400">+8% from last month</span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6 border-slate-200 dark:border-slate-700">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute w-5 h-5 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 left-3 top-1/2" />
              <Input
                type="text"
                placeholder="Search by name or SKU..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 bg-white border rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Furniture">Furniture</option>
              <option value="Accessories">Accessories</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-white border rounded-lg border-slate-300 dark:border-slate-600 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="in-stock">In Stock</option>
              <option value="low-stock">Low Stock</option>
              <option value="out-of-stock">Out of Stock</option>
            </select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Inventory Table */}
      <Card className="border-slate-200 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500 dark:text-slate-400">
                  Product
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500 dark:text-slate-400">
                  SKU
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500 dark:text-slate-400">
                  Category
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500 dark:text-slate-400">
                  Quantity
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500 dark:text-slate-400">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500 dark:text-slate-400">
                  Location
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left uppercase text-slate-500 dark:text-slate-400">
                  Price
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-right uppercase text-slate-500 dark:text-slate-400">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y dark:bg-slate-900 divide-slate-200 dark:divide-slate-700">
              {filteredInventory.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
                  <td className="px-6 py-4 text-sm font-medium text-slate-900 dark:text-slate-100 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center w-10 h-10 mr-3 rounded-lg bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30">
                        <Package className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{item.product_name}</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Updated {new Date(item.updated_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.sku}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.category}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.quantity_available}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusIcon(item.status)}
                      <span className="ml-1 capitalize">{item.status.replace('-', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    {item.location}
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300 whitespace-nowrap">
                    ${parseFloat(item.unit_price.toString()).toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                    <div className="flex items-center justify-end space-x-2">
                      <Button onClick={() => handleProductEdit(item.id)} variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredInventory.length === 0 && (
          <div className="py-12 text-center">
            <Package className="w-12 h-12 mx-auto mb-4 text-slate-400 dark:text-slate-500" />
            <h3 className="mb-2 text-lg font-medium text-slate-900 dark:text-slate-100">No inventory items found</h3>
            <p className="text-slate-600 dark:text-slate-400">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </Card>

      <AddInventoryForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          fetchInventory();

        }}
      />
      <UpdateInventoryForm
        isOpen={showEditForm}
        onClose={() => {
          setShowEditForm(false);
          setSelectedItem(null);
        }}
        onSuccess={() => {
          fetchInventory();
          console.log('Inventory updated successfully!');
        }}
        inventory={selectedItem}
      />

    </div>

  );

}
