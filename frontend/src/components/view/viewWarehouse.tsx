import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Warehouse, MapPin, Phone, Mail, Calendar, BarChart3, User, AlertCircle } from 'lucide-react';
interface WarehouseData {
    id: number;
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
    phone: string;
    email: string;
    warehouse_type: 'distribution' | 'storage' | 'fulfillment';
    status: 'active' | 'inactive' | 'maintenance';
    total_capacity: number;
    available_capacity: number;
    manager_id: number;
    created_at: string;
    updated_at: string;
    created_by: number;
}

interface ViewWarehouseProps {
    isOpen: boolean;
    onClose: () => void;
    warehouse: WarehouseData | null;
}

export function ViewWarehouse({ isOpen, onClose, warehouse }: ViewWarehouseProps) {
    if (!isOpen || !warehouse) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'maintenance':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type.toLowerCase()) {
            case 'distribution':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'storage':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'fulfillment':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getCapacityColor = (utilization: number) => {
        if (utilization >= 90) return 'bg-red-500';
        if (utilization >= 75) return 'bg-yellow-500';
        if (utilization >= 50) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const usedCapacity = warehouse.total_capacity - warehouse.available_capacity;
    const utilizationPercentage = (usedCapacity / warehouse.total_capacity) * 100;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                            <Warehouse className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{warehouse.name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Warehouse ID: {warehouse.id}</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Status and Quick Info */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <AlertCircle className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                            </div>
                            <div className="mt-2 space-y-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(warehouse.status)}`}>
                                    {warehouse.status}
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(warehouse.warehouse_type)}`}>
                                    {warehouse.warehouse_type}
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <BarChart3 className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Capacity</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {warehouse.total_capacity.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">sq ft</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <BarChart3 className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Available</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-green-600">
                                {warehouse.available_capacity.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">sq ft</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <BarChart3 className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Utilization</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {Math.round(utilizationPercentage)}%
                            </p>
                            <p className="text-xs text-gray-500">{usedCapacity.toLocaleString()} used</p>
                        </div>
                    </div>

                    {/* Capacity Visualization */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <BarChart3 className="w-5 h-5" />
                            <span>Capacity Overview</span>
                        </h3>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-sm text-gray-600 dark:text-gray-400">Capacity Utilization</span>
                                <span className="text-sm font-medium text-gray-900 dark:text-white">
                                    {Math.round(utilizationPercentage)}%
                                </span>
                            </div>
                            <div className="w-full h-4 bg-gray-200 rounded-full dark:bg-gray-700">
                                <div
                                    className={`h-4 rounded-full ${getCapacityColor(utilizationPercentage)}`}
                                    style={{ width: `${Math.min(utilizationPercentage, 100)}%` }}
                                />
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>{usedCapacity.toLocaleString()} used</span>
                                <span>{warehouse.total_capacity.toLocaleString()} total</span>
                            </div>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse Name</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{warehouse.name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(warehouse.warehouse_type)}`}>
                                    {warehouse.warehouse_type}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Manager</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{warehouse.manager_id || 'Not assigned'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Status</label>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(warehouse.status)}`}>
                                    {warehouse.status}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <Phone className="w-5 h-5" />
                            <span>Contact Information</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Mail className="w-4 h-4" />
                                    <span>Email</span>
                                </label>
                                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                    <a href={`mailto:${warehouse.email}`}>{warehouse.email}</a>
                                </p>
                            </div>
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Phone className="w-4 h-4" />
                                    <span>Phone</span>
                                </label>
                                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                    <a href={`tel:${warehouse.phone}`}>{warehouse.phone}</a>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <MapPin className="w-5 h-5" />
                            <span>Address Information</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Street Address</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{warehouse.address}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{warehouse.city}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{warehouse.state || 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ZIP Code</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{warehouse.zip_code}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{warehouse.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Capacity Details */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <BarChart3 className="w-5 h-5" />
                            <span>Capacity Details</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Capacity</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    {warehouse.total_capacity.toLocaleString()} sq ft
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Available Capacity</label>
                                <p className="mt-1 text-lg font-semibold text-green-600">
                                    {warehouse.available_capacity.toLocaleString()} sq ft
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Used Capacity</label>
                                <p className="mt-1 text-lg font-semibold text-blue-600">
                                    {usedCapacity.toLocaleString()} sq ft
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Activity Metrics */}
                    {(warehouse.total_capacity) && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Activity Metrics</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Inventory Items</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                        {warehouse.total_capacity || 0}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Orders</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                        {warehouse.total_capacity || 0}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Activity</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {warehouse.updated_at ? new Date(warehouse.updated_at).toLocaleDateString() : 'No recent activity'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Audit Information */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <Calendar className="w-5 h-5" />
                            <span>Audit Information</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(warehouse.created_at).toLocaleDateString()} by {warehouse.created_by || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(warehouse.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Close Button */}
                    <div className="flex justify-end pt-6 border-t dark:border-gray-700">
                        <Button onClick={onClose}>
                            Close
                        </Button>
                    </div>
                </div>
            </Card>
        </div>
    );
}