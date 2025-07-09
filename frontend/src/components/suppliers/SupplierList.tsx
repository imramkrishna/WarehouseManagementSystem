import React, { useState } from 'react';
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

interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  status: 'active' | 'inactive' | 'pending';
  rating: number;
  totalOrders: number;
  totalValue: number;
  lastOrderDate: string;
  category: string;
  paymentTerms: string;
}

const mockSuppliers: Supplier[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    contactPerson: 'John Smith',
    email: 'john@techcorp.com',
    phone: '+1 (555) 123-4567',
    address: '123 Tech Street',
    city: 'San Francisco',
    country: 'USA',
    status: 'active',
    rating: 4.8,
    totalOrders: 156,
    totalValue: 245000,
    lastOrderDate: '2024-01-15',
    category: 'Electronics',
    paymentTerms: 'Net 30'
  },
  {
    id: '2',
    name: 'Global Manufacturing Ltd',
    contactPerson: 'Sarah Johnson',
    email: 'sarah@globalmanuf.com',
    phone: '+1 (555) 987-6543',
    address: '456 Industrial Ave',
    city: 'Chicago',
    country: 'USA',
    status: 'active',
    rating: 4.5,
    totalOrders: 89,
    totalValue: 180000,
    lastOrderDate: '2024-01-12',
    category: 'Manufacturing',
    paymentTerms: 'Net 45'
  },
  {
    id: '3',
    name: 'Office Supplies Pro',
    contactPerson: 'Mike Wilson',
    email: 'mike@officesupplies.com',
    phone: '+1 (555) 456-7890',
    address: '789 Business Blvd',
    city: 'New York',
    country: 'USA',
    status: 'pending',
    rating: 4.2,
    totalOrders: 34,
    totalValue: 45000,
    lastOrderDate: '2024-01-10',
    category: 'Office Supplies',
    paymentTerms: 'Net 15'
  },
  {
    id: '4',
    name: 'European Components AG',
    contactPerson: 'Hans Mueller',
    email: 'hans@eurocomp.de',
    phone: '+49 30 12345678',
    address: 'Hauptstraße 100',
    city: 'Berlin',
    country: 'Germany',
    status: 'inactive',
    rating: 3.9,
    totalOrders: 67,
    totalValue: 120000,
    lastOrderDate: '2023-12-20',
    category: 'Components',
    paymentTerms: 'Net 60'
  },
  {
    id: '5',
    name: 'Asian Trade Partners',
    contactPerson: 'Li Wei',
    email: 'li@asiantrade.com',
    phone: '+86 10 87654321',
    address: '888 Commerce Road',
    city: 'Shanghai',
    country: 'China',
    status: 'active',
    rating: 4.6,
    totalOrders: 203,
    totalValue: 380000,
    lastOrderDate: '2024-01-14',
    category: 'General',
    paymentTerms: 'Net 30'
  }
];

export function SupplierList() {
  const [suppliers] = useState<Supplier[]>(mockSuppliers);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

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
        className={`w-4 h-4 ${
          i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || supplier.category === categoryFilter;
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const statusCounts = suppliers.reduce((acc, supplier) => {
    acc[supplier.status] = (acc[supplier.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalValue = suppliers.reduce((sum, supplier) => sum + supplier.totalValue, 0);
  const averageRating = suppliers.reduce((sum, supplier) => sum + supplier.rating, 0) / suppliers.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Suppliers</h1>
          <p className="text-gray-600">Manage your supplier relationships and partnerships</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Supplier</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Suppliers</p>
              <p className="text-2xl font-bold text-gray-900">{suppliers.length}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Suppliers</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.active || 0}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-gray-600">{Math.round((statusCounts.active || 0) / suppliers.length * 100)}% of total</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center">
            {renderStars(averageRating)}
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
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
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{supplier.name}</h3>
                <p className="text-sm text-gray-600">{supplier.contactPerson}</p>
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

            <div className="space-y-3 mb-4">
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
              <span className="text-sm text-gray-500">{supplier.category}</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-xs text-gray-500">Total Orders</p>
                <p className="text-sm font-semibold text-gray-900">{supplier.totalOrders}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Value</p>
                <p className="text-sm font-semibold text-gray-900">${supplier.totalValue.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
              <div className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                <span>Last order: {new Date(supplier.lastOrderDate).toLocaleDateString()}</span>
              </div>
              <span>{supplier.paymentTerms}</span>
            </div>

            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="flex-1">
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
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your search or filter criteria</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add New Supplier
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}