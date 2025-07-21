import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, ShoppingCart, Calendar, MapPin, DollarSign, Truck, User, AlertCircle } from 'lucide-react';

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

interface ViewOrderProps {
    isOpen: boolean;
    onClose: () => void;
    order: Order | null;
}

export function ViewOrder({ isOpen, onClose, order }: ViewOrderProps) {
    if (!isOpen || !order) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            case 'shipped':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
            case 'delivered':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'cancelled':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority.toLowerCase()) {
            case 'urgent':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'high':
                return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200';
            case 'medium':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'low':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const getPaymentStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'paid':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            case 'refunded':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                            <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Order {order.order_number}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{order.order_type.charAt(0).toUpperCase() + order.order_type.slice(1)} Order</p>
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
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                    {order.status}
                                </span>
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(order.priority)}`}>
                                    {order.priority} priority
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                ${order.total_amount}
                            </p>
                            <p className="text-xs text-gray-500">Net: ${order.total_amount}</p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <Calendar className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Delivery Date</span>
                            </div>
                            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                {new Date(order.expected_delivery_date).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <DollarSign className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Payment</span>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getPaymentStatusColor(order.payment_status)}`}>
                                {order.payment_status}
                            </span>
                            <p className="mt-1 text-xs text-gray-500">{order.payment_method || 'Not specified'}</p>
                        </div>
                    </div>

                    {/* Customer/Supplier Information */}
                    {order.order_type === 'outbound' && order.customer_name && (
                        <div className="space-y-4">
                            <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                                <User className="w-5 h-5" />
                                <span>Customer Information</span>
                            </h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Customer Name</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.customer_name}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.customer_email}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Phone</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.customer_phone || 'Not provided'}</p>
                                </div>
                                {order.customer_address && (
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Address</label>
                                        <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.customer_address}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {order.order_type === 'inbound' && order.supplier_id && (
                        <div className="space-y-4">
                            <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                                <User className="w-5 h-5" />
                                <span>Supplier Information</span>
                            </h3>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Supplier</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.supplier_id}</p>
                            </div>
                        </div>
                    )}

                    {/* Warehouse & Shipping */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <Truck className="w-5 h-5" />
                            <span>Warehouse & Shipping</span>
                        </h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Warehouse</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.warehouse_id}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shipping Method</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.shipping_method || 'Not specified'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tracking Number</label>
                                <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">
                                    {order.tracking_number || 'Not assigned'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Expected Delivery</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(order.expected_delivery_date).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial Breakdown */}
                    <div className="space-y-4">
                        <h3 className="flex items-center space-x-2 text-lg font-medium text-gray-900 dark:text-white">
                            <DollarSign className="w-5 h-5" />
                            <span>Financial Breakdown</span>
                        </h3>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Subtotal</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    ${(
                                        Number(order.total_amount) -
                                        Number(order.tax_amount) -
                                        Number(order.shipping_amount) +
                                        Number(order.discount_amount)
                                    ).toFixed(2)}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    ${order.tax_amount}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Shipping</label>
                                <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                    ${order.shipping_amount}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Discount</label>
                                <p className="mt-1 text-lg font-semibold text-green-600">
                                    -${order.discount_amount}
                                </p>
                            </div>
                        </div>
                        <div className="pt-4 border-t">
                            <div className="flex items-center justify-between">
                                <span className="text-lg font-medium text-gray-900 dark:text-white">Total Amount</span>
                                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                                    ${order.total_amount}
                                </span>
                            </div>
                            <div className="flex items-center justify-between mt-2">
                                <span className="text-sm text-gray-500">Net Amount (after discount)</span>
                                <span className="text-lg font-semibold text-green-600">
                                    ${order.total_amount}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Assignment & Notes */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Assignment & Notes</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Assigned To</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.assigned_to || 'Not assigned'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Approved By</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{order.approved_by || 'Not approved'}</p>
                            </div>
                        </div>
                        {order.notes && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Notes</label>
                                <p className="p-3 mt-1 text-sm text-gray-900 rounded-lg dark:text-white bg-gray-50 dark:bg-gray-800">
                                    {order.notes}
                                </p>
                            </div>
                        )}
                    </div>

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
                                    {new Date(order.created_at).toLocaleDateString()} by {order.created_by || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(order.updated_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
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