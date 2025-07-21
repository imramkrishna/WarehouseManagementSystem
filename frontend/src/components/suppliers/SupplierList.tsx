import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Search,
  Filter,
  Plus,
  Edit,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  Clock,
  MoreVertical
} from 'lucide-react';
import axios from 'axios';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { AddSupplierForm } from '../addForms/addSupplier';
import { UpdateSupplierForm } from '../addForms/updateSupplier';

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
interface Supplier {
  id: number;
  company_name: string;
  contact_person: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  payment_terms: string;
  tax_id: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  updated_by: number;
}
export function SupplierList() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({});
  const [totalRating, setTotalRating] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Supplier | null>(null)

  const getStatusColor = (status: Supplier['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
          }`}
      />
    ));
  };
  async function fetchSuppliers() {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URI}/profile/suppliers`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      setSuppliers(response.data.suppliers);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching warehouses:', error);
      setLoading(true);
    }
  }
  useEffect(() => {
    fetchSuppliers();
  }, [])
  useEffect(() => {
    setLoading(true)
    if (suppliers.length > 0) {
      const statusCounts = suppliers.reduce((acc, supplier) => {
        acc[supplier.status] = (acc[supplier.status] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);
      const totalRating = suppliers.reduce((sum, supplier) => sum + (supplier.rating || 0), 0);
      const averageRating = suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) / suppliers.length;
      setStatusCounts(statusCounts);
      setTotalRating(totalRating);
      setAverageRating(averageRating);
      setLoading(false);
    }


  }, [suppliers])
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.contact_person.toLowerCase().includes(searchTerm.toLowerCase()) ||
      supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    const matchesCategory = categoryFilter === 'all';
    return matchesSearch && matchesStatus && matchesCategory;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">{<LoadingSpinner />}</div>
        <div className="ml-4 text-gray-500">Loading Suppliers...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier relationships and partnerships</p>
        </div>
        <Button
          className="flex items-center space-x-2"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.active || 0}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">{Math.round((statusCounts.active || 0) / suppliers.length * 100)}% of total</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Ratings</p>
              <p className="text-2xl font-bold text-gray-900">{totalRating.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-green-600">+8% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            {renderStars(averageRating)}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 lg:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="Office Supplies">Office Supplies</option>
              <option value="Components">Components</option>
              <option value="General">General</option>
            </select>
          </div>
        </div>
      </Card>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="p-6 transition-shadow hover:shadow-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="mb-1 text-lg font-semibold text-gray-900">{supplier.company_name}</h3>
                <p className="text-sm text-gray-600">{supplier.contact_person}</p>
              </div>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(supplier.status)}`}>
                  {supplier.status.charAt(0).toUpperCase() + supplier.status.slice(1)}
                </span>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="mb-4 space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                <span className="truncate">{supplier.email}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                <span>{supplier.phone}</span>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                <span className="truncate">{supplier.city}, {supplier.country}</span>
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                {renderStars(supplier.rating)}
                <span className="ml-2 text-sm text-gray-600">({supplier.rating})</span>
              </div>
              <span className="text-sm text-gray-500">{supplier.state}</span>
            </div>

            <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Last order: {new Date(supplier.updated_at).toLocaleDateString()}</span>
              </div>
              <span>{supplier.payment_terms}</span>
            </div>

            <div className="flex space-x-2">
              <Button onClick={() => {
                setSelectedItem(supplier)
                setShowEditForm(true);
              }} variant="outline" size="sm" className="flex-1">
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1">
                <Package className="w-4 h-4 mr-1" />
                Orders
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredSuppliers.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No suppliers found</h3>
            <p className="mb-4 text-gray-600">Try adjusting your search or filter criteria</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Supplier
            </Button>
          </div>
        </Card>
      )}

      <AddSupplierForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          fetchSuppliers(); // Refresh the list
          console.log('Supplier added successfully!');
        }}
      />
      <UpdateSupplierForm
        isOpen={showEditForm}
        onClose={() => {
          setSelectedItem(null);
          setShowEditForm(false);
        }}
        supplier={selectedItem}
        onSuccess={() => fetchSuppliers}
      />

    </div>
  );
}