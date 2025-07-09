import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Warehouse,
  Search,
  Filter,
  Plus,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Users,
  Package,
  TrendingUp,
  MoreVertical,
  Building
} from 'lucide-react';

interface WarehouseData {
  id: string;
  name: string;
  code: string;
  location: string;
  manager: string;
  capacity: number;
  currentStock: number;
  status: 'active' | 'inactive' | 'maintenance';
  type: 'distribution' | 'storage' | 'fulfillment';
  lastUpdated: string;
}

const mockWarehouses: WarehouseData[] = [
  {
    id: '1',
    name: 'Main Distribution Center',
    code: 'MDC-001',
    location: 'New York, NY',
    manager: 'John Smith',
    capacity: 10000,
    currentStock: 8500,
    status: 'active',
    type: 'distribution',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    name: 'West Coast Fulfillment',
    code: 'WCF-002',
    location: 'Los Angeles, CA',
    manager: 'Sarah Johnson',
    capacity: 7500,
    currentStock: 6200,
    status: 'active',
    type: 'fulfillment',
    lastUpdated: '2024-01-14'
  },
  {
    id: '3',
    name: 'Regional Storage Hub',
    code: 'RSH-003',
    location: 'Chicago, IL',
    manager: 'Mike Davis',
    capacity: 5000,
    currentStock: 3800,
    status: 'maintenance',
    type: 'storage',
    lastUpdated: '2024-01-13'
  },
  {
    id: '4',
    name: 'East Coast Distribution',
    code: 'ECD-004',
    location: 'Atlanta, GA',
    manager: 'Lisa Wilson',
    capacity: 8000,
    currentStock: 7100,
    status: 'active',
    type: 'distribution',
    lastUpdated: '2024-01-15'
  }
];

export function WarehouseList() {
  const [warehouses] = useState<WarehouseData[]>(mockWarehouses);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const getStatusColor = (status: WarehouseData['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeColor = (type: WarehouseData['type']) => {
    switch (type) {
      case 'distribution':
        return 'bg-blue-100 text-blue-800';
      case 'storage':
        return 'bg-purple-100 text-purple-800';
      case 'fulfillment':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCapacityPercentage = (current: number, capacity: number) => {
    return Math.round((current / capacity) * 100);
  };

  const getCapacityColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-green-600';
  };

  const filteredWarehouses = warehouses.filter(warehouse => {
    const matchesSearch = warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || warehouse.status === statusFilter;
    const matchesType = typeFilter === 'all' || warehouse.type === typeFilter;

    return matchesSearch && matchesStatus && matchesType;
  });

  const totalCapacity = warehouses.reduce((sum, w) => sum + w.capacity, 0);
  const totalStock = warehouses.reduce((sum, w) => sum + w.currentStock, 0);
  const activeWarehouses = warehouses.filter(w => w.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Warehouse Management</h1>
          <p className="text-gray-600">Manage warehouse locations and capacity</p>
        </div>
        <Button className="flex items-center space-x-2">
          <Plus className="w-4 h-4" />
          <span>Add Warehouse</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Warehouses</p>
              <p className="text-2xl font-bold text-gray-900">{warehouses.length}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Warehouse className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-green-600">{activeWarehouses} active</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Capacity</p>
              <p className="text-2xl font-bold text-gray-900">{totalCapacity.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Building className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">sq ft</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Stock</p>
              <p className="text-2xl font-bold text-gray-900">{totalStock.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <Package className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
            <span className="text-green-600">{Math.round((totalStock / totalCapacity) * 100)}% utilized</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Staff Members</p>
              <p className="text-2xl font-bold text-gray-900">156</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Users className="w-6 h-6 text-orange-600" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <span className="text-gray-600">across all locations</span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 md:space-x-4">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                type="text"
                placeholder="Search warehouses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Types</option>
              <option value="distribution">Distribution</option>
              <option value="storage">Storage</option>
              <option value="fulfillment">Fulfillment</option>
            </select>

            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="w-4 h-4" />
              <span>More Filters</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => {
          const capacityPercentage = getCapacityPercentage(warehouse.currentStock, warehouse.capacity);

          return (
            <Card key={warehouse.id} className="p-6 transition-shadow hover:shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Warehouse className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{warehouse.name}</h3>
                    <p className="text-sm text-gray-500">{warehouse.code}</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-sm text-gray-600">
                  <MapPin className="w-4 h-4 mr-2" />
                  {warehouse.location}
                </div>

                <div className="flex items-center text-sm text-gray-600">
                  <Users className="w-4 h-4 mr-2" />
                  Manager: {warehouse.manager}
                </div>

                <div className="flex items-center justify-between">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(warehouse.status)}`}>
                    {warehouse.status.charAt(0).toUpperCase() + warehouse.status.slice(1)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(warehouse.type)}`}>
                    {warehouse.type.charAt(0).toUpperCase() + warehouse.type.slice(1)}
                  </span>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-gray-600">Capacity Utilization</span>
                    <span className={`text-sm font-medium ${getCapacityColor(capacityPercentage)}`}>
                      {capacityPercentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div
                      className={`h-2 rounded-full ${capacityPercentage >= 90 ? 'bg-red-500' :
                        capacityPercentage >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      style={{ width: `${capacityPercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between mt-1 text-xs text-gray-500">
                    <span>{warehouse.currentStock.toLocaleString()} used</span>
                    <span>{warehouse.capacity.toLocaleString()} total</span>
                  </div>
                </div>

                <div className="flex pt-3 space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="w-4 h-4 mr-1" />
                    Edit
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredWarehouses.length === 0 && (
        <Card className="p-12">
          <div className="text-center">
            <Warehouse className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">No warehouses found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        </Card>
      )}
    </div>
  );
}