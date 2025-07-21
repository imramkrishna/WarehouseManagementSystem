import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { X, Users, MapPin, Phone, Mail, Star, Calendar, CreditCard } from 'lucide-react';

interface SupplierData {
    id: number;
    company_name: string;
    contact_person: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zip_code: string;
    country: string;
    tax_id: string;
    payment_terms: string;
    rating: number;
    status: 'active' | 'inactive' | 'pending';
    created_at: string;
    updated_at: string;
    created_by_name?: string;
    total_orders?: number;
    total_amount?: number;
    last_order_date?: string;
}

interface ViewSupplierProps {
    isOpen: boolean;
    onClose: () => void;
    supplier: SupplierData | null;
}

export function ViewSupplier({ isOpen, onClose, supplier }: ViewSupplierProps) {
    if (!isOpen || !supplier) return null;

    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
            case 'inactive':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
            default:
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
        }
    };

    const renderStars = (rating: number) => {
        return Array.from({ length: 5 }, (_, index) => (
            <Star
                key={index}
                className={`w-4 h-4 ${index < rating
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300 dark:text-gray-600'
                    }`}
            />
        ));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{supplier.company_name}</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Supplier ID: {supplier.id}</p>
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
                                <Users className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Status</span>
                            </div>
                            <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full mt-2 ${getStatusColor(supplier.status)}`}>
                                {supplier.status}
                            </span>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <Star className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Rating</span>
                            </div>
                            <div className="flex items-center mt-2 space-x-1">
                                {renderStars(supplier.rating)}
                                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                                    ({supplier.rating}/5)
                                </span>
                            </div>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <CreditCard className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Orders</span>
                            </div>
                            <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                                {supplier.total_orders || 0}
                            </p>
                        </div>
                        <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                            <div className="flex items-center space-x-2">
                                <CreditCard className="w-5 h-5 text-gray-500" />
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Total Amount</span>
                            </div>
                            <p className="mt-1 text-lg font-bold text-gray-900 dark:text-white">
                                ${supplier.total_amount?.toFixed(2) || '0.00'}
                            </p>
                        </div>
                    </div>

                    {/* Company Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Company Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.company_name}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Person</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.contact_person}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Tax ID</label>
                                <p className="mt-1 font-mono text-sm text-gray-900 dark:text-white">{supplier.tax_id || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Terms</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.payment_terms || 'Not specified'}</p>
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
                                    <a href={`mailto:${supplier.email}`}>{supplier.email}</a>
                                </p>
                            </div>
                            <div>
                                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    <Phone className="w-4 h-4" />
                                    <span>Phone</span>
                                </label>
                                <p className="mt-1 text-sm text-blue-600 dark:text-blue-400">
                                    <a href={`tel:${supplier.phone}`}>{supplier.phone}</a>
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
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.address}</p>
                            </div>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.city}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.state || 'Not specified'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">ZIP Code</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.zip_code}</p>
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">{supplier.country}</p>
                            </div>
                        </div>
                    </div>

                    {/* Business Metrics */}
                    {(supplier.total_orders || supplier.last_order_date) && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Metrics</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Orders</label>
                                    <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
                                        {supplier.total_orders || 0}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Total Business</label>
                                    <p className="mt-1 text-lg font-semibold text-green-600">
                                        ${supplier.total_amount?.toFixed(2) || '0.00'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Order</label>
                                    <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                        {supplier.last_order_date ? new Date(supplier.last_order_date).toLocaleDateString() : 'No orders'}
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
                                    {new Date(supplier.created_at).toLocaleDateString()} by {supplier.created_by_name || 'Unknown'}
                                </p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Last Updated</label>
                                <p className="mt-1 text-sm text-gray-900 dark:text-white">
                                    {new Date(supplier.updated_at).toLocaleDateString()}
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