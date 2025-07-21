import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import {
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Truck,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal
} from 'lucide-react';
import axios from 'axios';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { AddOrderForm } from '../addForms/addOrder';
import { UpdateOrderForm } from '../addForms/updateOrder';
import { ViewOrder } from '../view/viewOrders';

const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
interface Order {
  id: number;
  order_number: string;
  order_type: 'inbound' | 'outbound';
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  supplier_id: number | null;
  warehouse_id: number;
  order_date: string;
  expected_delivery_date: string;
  actual_delivery_date: string | null;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total_amount: string;
  tax_amount: string;
  shipping_amount: string;
  discount_amount: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  payment_method: 'cash' | 'card' | 'bank_transfer' | 'online';
  shipping_method: 'standard' | 'express' | 'overnight';
  tracking_number: string | null;
  notes: string | null;
  created_by: number;
  assigned_to: number | null;
  approved_by: number | null;
  created_at: string;
  updated_at: string;
}
export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false)
  const [selectedItem, setSelectedItem] = useState<Order | null>(null)
  const [showView, setShowView] = useState<boolean>(false);
  const [viewSelected, setViewSelected] = useState<Order | null>(null);

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'processing':
        return <Package className="w-4 h-4 text-blue-500" />;
      case 'shipped':
        return <Truck className="w-4 h-4 text-purple-500" />;
      case 'delivered':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Order['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  async function fetchOrders() {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URI}/profile/orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      })
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
    setLoading(false);

  }

  useEffect(() => {
    fetchOrders()
  }, [])
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">{<LoadingSpinner />}</div>
        <div className="ml-4 text-gray-500">Loading orders...</div>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
          <p className="text-gray-600">Manage and track all customer orders</p>
        </div>
        <Button
          className="flex items-center space-x-2"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">{statusCounts.pending || 0}</p>
            </div>
            <Clock className="w-8 h-8 text-yellow-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Processing</p>
              <p className="text-2xl font-bold text-blue-600">{statusCounts.processing || 0}</p>
            </div>
            <Package className="w-8 h-8 text-blue-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Shipped</p>
              <p className="text-2xl font-bold text-purple-600">{statusCounts.shipped || 0}</p>
            </div>
            <Truck className="w-8 h-8 text-purple-500" />
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Delivered</p>
              <p className="text-2xl font-bold text-green-600">{statusCounts.delivered || 0}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col gap-4 sm:flex-row">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <Input
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Orders Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200 bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Order
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Priority
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Items
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Total
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Order Date
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Expected Delivery
                </th>
                <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {order.order_number}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.customer_name || "NO NAME PROVIDED"}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(order.status)}
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(order.priority)}`}>
                      {order.priority.charAt(0).toUpperCase() + order.priority.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {order.order_number}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    ${order.total_amount}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(order.order_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                    {new Date(order.expected_delivery_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <Button onClick={() => {
                        setViewSelected(order)
                        setShowView(true)
                      }} variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button onClick={() => {
                        setShowUpdateForm(true)
                        setSelectedItem(order)
                      }} variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AddOrderForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSuccess={() => {
          fetchOrders();
        }}
      />
      <UpdateOrderForm
        order={selectedItem}
        isOpen={showUpdateForm}
        onClose={() => {
          setShowUpdateForm(false);
          setSelectedItem(null);
        }}
        onSuccess={() => {
          fetchOrders();
        }}
      />
      <ViewOrder
        isOpen={showView}
        onClose={() => {
          setShowView(false)
          setViewSelected(null)
        }}
        order={viewSelected}
      />

    </div>
  );
}