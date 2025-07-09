import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Download, 
  Calendar,
  Filter,
  Package,
  ShoppingCart,
  DollarSign,
  Users,
  Eye,
  RefreshCw
} from 'lucide-react';

interface ReportData {
  id: string;
  title: string;
  description: string;
  type: 'inventory' | 'sales' | 'financial' | 'operational';
  lastGenerated: string;
  status: 'ready' | 'generating' | 'error';
}

const mockReports: ReportData[] = [
  {
    id: '1',
    title: 'Inventory Summary Report',
    description: 'Complete overview of current inventory levels and stock movements',
    type: 'inventory',
    lastGenerated: '2024-01-15 10:30 AM',
    status: 'ready'
  },
  {
    id: '2',
    title: 'Sales Performance Report',
    description: 'Monthly sales analysis with trends and forecasting',
    type: 'sales',
    lastGenerated: '2024-01-15 09:15 AM',
    status: 'ready'
  },
  {
    id: '3',
    title: 'Financial Summary',
    description: 'Revenue, costs, and profit analysis for the current period',
    type: 'financial',
    lastGenerated: '2024-01-14 04:45 PM',
    status: 'ready'
  },
  {
    id: '4',
    title: 'Operational Efficiency Report',
    description: 'Warehouse operations and productivity metrics',
    type: 'operational',
    lastGenerated: '2024-01-14 02:20 PM',
    status: 'generating'
  }
];

const chartData = [
  { month: 'Jan', inventory: 12450, sales: 8900, orders: 156 },
  { month: 'Feb', inventory: 13200, sales: 9500, orders: 178 },
  { month: 'Mar', inventory: 11800, sales: 10200, orders: 192 },
  { month: 'Apr', inventory: 14100, sales: 11800, orders: 210 },
  { month: 'May', inventory: 13600, sales: 12400, orders: 225 },
  { month: 'Jun', inventory: 15200, sales: 13100, orders: 248 }
];

export function ReportDashboard() {
  const [reports] = useState<ReportData[]>(mockReports);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [selectedType, setSelectedType] = useState('all');

  const getTypeColor = (type: ReportData['type']) => {
    switch (type) {
      case 'inventory':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'sales':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'financial':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'operational':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getStatusColor = (status: ReportData['status']) => {
    switch (status) {
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'generating':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTypeIcon = (type: ReportData['type']) => {
    switch (type) {
      case 'inventory':
        return <Package className="w-5 h-5" />;
      case 'sales':
        return <ShoppingCart className="w-5 h-5" />;
      case 'financial':
        return <DollarSign className="w-5 h-5" />;
      case 'operational':
        return <Users className="w-5 h-5" />;
      default:
        return <BarChart3 className="w-5 h-5" />;
    }
  };

  const filteredReports = reports.filter(report => 
    selectedType === 'all' || report.type === selectedType
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports & Analytics</h1>
          <p className="text-gray-600 dark:text-gray-300">Generate and view comprehensive business reports</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <span>Schedule Report</span>
          </Button>
          <Button className="flex items-center space-x-2">
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">$124,580</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900">
              <DollarSign className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500 dark:text-green-300" />
            <span className="text-green-600 dark:text-green-400">+12.5% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Orders Processed</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">1,248</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900">
              <ShoppingCart className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500 dark:text-green-300" />
            <span className="text-green-600 dark:text-green-400">+8.2% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Inventory Turnover</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">6.4x</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full dark:bg-purple-900">
              <Package className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingDown className="w-4 h-4 mr-1 text-red-500 dark:text-red-300" />
            <span className="text-red-600 dark:text-red-400">-2.1% from last month</span>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">Efficiency Score</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">94.2%</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full dark:bg-orange-900">
              <BarChart3 className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          <div className="flex items-center mt-4 text-sm">
            <TrendingUp className="w-4 h-4 mr-1 text-green-500 dark:text-green-300" />
            <span className="text-green-600 dark:text-green-400">+3.8% from last month</span>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Inventory Trends</h3>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-1 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>
          
          {/* Simple chart representation */}
          <div className="space-y-4">
            {chartData.slice(-4).map((data, index) => (
              <div key={data.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm text-gray-600 dark:text-gray-300">{data.month}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Inventory</span>
                    <span className="text-sm font-medium">{data.inventory.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-blue-500 rounded-full" 
                      style={{ width: `${(data.inventory / 16000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Sales Performance</h3>
            <Button variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-1" />
              Refresh
            </Button>
          </div>
          
          <div className="space-y-4">
            {chartData.slice(-4).map((data, index) => (
              <div key={data.month} className="flex items-center space-x-4">
                <div className="w-12 text-sm text-gray-600 dark:text-gray-300">{data.month}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-700 dark:text-gray-300">Sales</span>
                    <span className="text-sm font-medium">${data.sales.toLocaleString()}</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <div 
                      className="h-2 bg-green-500 rounded-full" 
                      style={{ width: `${(data.sales / 14000) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reports List */}
      <Card>
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Available Reports</h3>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Filter className="w-4 h-4 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="inventory">Inventory</option>
                  <option value="sales">Sales</option>
                  <option value="financial">Financial</option>
                  <option value="operational">Operational</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {filteredReports.map((report) => (
            <div key={report.id} className="p-6 hover:bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-start space-x-4">
                  <div className={`p-2 rounded-lg ${getTypeColor(report.type).replace('text-', 'text-').replace('bg-', 'bg-')}`}>
                    {getTypeIcon(report.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1 text-lg font-medium text-gray-900 dark:text-gray-100">{report.title}</h4>
                    <p className="mb-2 text-sm text-gray-600 dark:text-gray-300">{report.description}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>Last generated: {report.lastGenerated}</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(report.status)}`}>
                        {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-1" />
                    View
                  </Button>
                  <Button variant="outline" size="sm" disabled={report.status !== 'ready'}>
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" disabled={report.status === 'generating'}>
                    {report.status === 'generating' ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-1" />
                        Generate
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}