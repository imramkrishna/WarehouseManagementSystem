import { Card } from '../ui/Card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Package,
  ShoppingCart,
  Warehouse,
  Users,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../ui/LoadingSpinner';


export function DashboardOverview() {
  const navigate = useNavigate();
  const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;
  const accessToken = localStorage.getItem('accessToken');
  interface DashboardStats {
    inventory: number;
    orders: number;
    warehouses: number;
    suppliers: number;
  }

  const [profile, setProfile] = useState<any>();
  const [data, setData] = useState<DashboardStats | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  async function getData() {
    try {
      setLoading(true);
      const response = await axios.get(`${BACKEND_URI}/profile/dashboard`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })
      console.log(response.data);
      setProfile(response.data.profile);
      setData(response.data.stats);
      setLoading(false);
    } catch (error) {
      setLoading(true)
      console.error('Error fetching dashboard data:', error);
    }
  }
  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">{<LoadingSpinner />}</div>
        <div className="ml-4 text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Inventory',
      value: data?.inventory || '0',
      change: '+12%',
      trend: 'up',
      icon: Package,
      color: 'blue'
    },
    {
      title: 'Pending Orders',
      value: '156',
      change: '-8%',
      trend: 'down',
      icon: ShoppingCart,
      color: 'green'
    },
    {
      title: 'Warehouses',
      value: data?.warehouses || '0',
      change: '+2',
      trend: 'up',
      icon: Warehouse,
      color: 'purple'
    },
    {
      title: 'Active Suppliers',
      value: data?.suppliers || '0',
      change: '+5%',
      trend: 'up',
      icon: Users,
      color: 'orange'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'inventory',
      message: 'Low stock alert for Product SKU-001',
      time: '2 minutes ago',
      status: 'warning'
    },
    {
      id: 2,
      type: 'order',
      message: 'Order #12345 has been shipped',
      time: '15 minutes ago',
      status: 'success'
    },
    {
      id: 3,
      type: 'supplier',
      message: 'New supplier "ABC Corp" added',
      time: '1 hour ago',
      status: 'info'
    },
    {
      id: 4,
      type: 'warehouse',
      message: 'Warehouse capacity at 85%',
      time: '2 hours ago',
      status: 'warning'
    }
  ];

  const getStatColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500'
    };
    return colors[color as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default:
        return <Package className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">Welcome back! Here's what's happening in your warehouse.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-300">{stat.title}</p>
                <p className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <TrendingUp className="w-4 h-4 mr-1 text-green-500" />
                  ) : (
                    <TrendingDown className="w-4 h-4 mr-1 text-red-500" />
                  )}
                  <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                    }`}>
                    {stat.change}
                  </span>
                  <span className="ml-1 text-sm text-gray-500">vs last month</span>
                </div>
              </div>
              <div className={`p-3 rounded-full ${getStatColor(stat.color)}`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">
                    {getStatusIcon(activity.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="mt-1 text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card>
          <div className="p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3">
              <button className="p-4 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                <Package className="w-6 h-6 mb-2 text-blue-600" />
                <p className="text-sm font-medium text-gray-900">Add Inventory</p>
                <p className="text-xs text-gray-500">Add new items</p>
              </button>
              <button className="p-4 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                <ShoppingCart className="w-6 h-6 mb-2 text-green-600" />
                <p className="text-sm font-medium text-gray-900">Create Order</p>
                <p className="text-xs text-gray-500">New purchase order</p>
              </button>
              <button className="p-4 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                <Warehouse className="w-6 h-6 mb-2 text-purple-600" />
                <p className="text-sm font-medium text-gray-900">Manage Warehouse</p>
                <p className="text-xs text-gray-500">Configure locations</p>
              </button>
              <button className="p-4 text-left transition-colors border border-gray-200 rounded-lg hover:bg-gray-50">
                <Users className="w-6 h-6 mb-2 text-orange-600" />
                <p className="text-sm font-medium text-gray-900">Add Supplier</p>
                <p className="text-xs text-gray-500">New supplier info</p>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}