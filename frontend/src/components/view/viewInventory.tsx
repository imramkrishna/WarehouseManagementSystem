import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Package, Calendar, MapPin, DollarSign, BarChart3, Info } from 'lucide-react';

interface InventoryItem {
    id: number;
    sku: string;
    product_name: string;
    description: string;
    category: string;
    brand: string;
    supplier_name?: string;
    warehouse_name?: string;
    location: string;
    quantity_on_hand: number;
    quantity_reserved: number;
    quantity_available: number;
    unit_price: number;
    cost_price: number;
    minimum_stock_level: number;
    maximum_stock_level: number;
    reorder_point: number;
    reorder_quantity: number;
    unit_of_measure: string;
    expiry_date: string;
    batch_number: string;
    barcode: string;
    weight: string;
    dimensions: string;
    status: string;
    created_at: string;
    updated_at: string;
    created_by_name?: string;
    updated_by_name?: string;
}

interface ViewInventoryProps {
    isOpen: boolean;
    onClose: () => void;
    inventory: InventoryItem | null;
}

export function ViewInventory({ isOpen, onClose, inventory }: ViewInventoryProps) {
    if (!isOpen || !inventory) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'discontinued':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getStockStatus = () => {
        if (inventory.quantity_on_hand <= 0) return { status: 'Out of Stock', color: 'text-red-600' };
        if (inventory.quantity_on_hand <= inventory.minimum_stock_level) return { status: 'Low Stock', color: 'text-yellow-600' };
        return { status: 'In Stock', color: 'text-green-600' };
    };

    const stockStatus = getStockStatus();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{inventory.product_name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">SKU: {inventory.sku}</p>
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
                                <BarChart3 className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                            </div>
                            <div className="mt-2 space-y-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(inventory.status)}`}>
                                    {inventory.status}
                                </span>
                                <p className={`text-sm font-medium ${stockStatus.color}`}>{stockStatus.status}</p>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <Package className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">On Hand</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {inventory.quantity_on_hand.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500">{inventory.unit_of_measure}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Unit Price</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                ${inventory.unit_price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500">Cost: ${inventory.cost_price.toFixed(2)}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <MapPin className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Location</span>
                            </div>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                {inventory.location || 'Not specified'}
                            </p>
                            <p className="text-xs text-gray-500">{inventory.warehouse_name}</p>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <Info className="w-5 h-5" />
                            <span>Basic Information</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Product Name</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.product_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">SKU</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.sku}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.category}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Brand</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.brand || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.supplier_name || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Barcode</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.barcode || 'Not specified'}</p>
                            </div>
                        </div>
                        {inventory.description && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Quantity Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quantity Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity on Hand</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    {inventory.quantity_on_hand.toLocaleString()} {inventory.unit_of_measure}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity Reserved</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    {inventory.quantity_reserved.toLocaleString()} {inventory.unit_of_measure}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Quantity Available</label>
                                <p className="mt-1 text-lg font-semibold text-green-600">
                                    {inventory.quantity_available.toLocaleString()} {inventory.unit_of_measure}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stock Management */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock Management</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Minimum Stock Level</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.minimum_stock_level}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Maximum Stock Level</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.maximum_stock_level}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reorder Point</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.reorder_point}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reorder Quantity</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.reorder_quantity}</p>
                            </div>
                        </div>
                    </div>

                    {/* Physical Properties */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Physical Properties</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Weight</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.weight || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Dimensions</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.dimensions || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Batch Number</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{inventory.batch_number || 'Not specified'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Dates and Audit */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <Calendar className="w-5 h-5" />
                            <span>Important Dates</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expiry Date</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {inventory.expiry_date ? new Date(inventory.expiry_date).toLocaleDateString() : 'Not specified'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Created At</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(inventory.created_at).toLocaleDateString()} by {inventory.created_by_name || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(inventory.updated_at).toLocaleDateString()} by {inventory.updated_by_name || 'Unknown'}
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