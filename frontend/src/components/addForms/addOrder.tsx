import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, ShoppingCart, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface AddOrderFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Supplier {
    id: number;
    company_name: string;
}

interface Warehouse {
    id: number;
    name: string;
}

export function AddOrderForm({ isOpen, onClose, onSuccess }: AddOrderFormProps) {
    const [formData, setFormData] = useState({
        order_type: 'outbound',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        customer_address: '',
        supplier_id: '',
        warehouse_id: '',
        expected_delivery_date: '',
        priority: 'medium',
        status: 'pending',
        total_amount: '',
        tax_amount: '0',
        shipping_amount: '0',
        discount_amount: '0',
        payment_status: 'pending',
        payment_method: '',
        shipping_method: '',
        tracking_number: '',
        notes: '',
        assigned_to: '',
        approved_by: ''
    });

    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

    useEffect(() => {
        if (isOpen) {
            fetchSuppliers();
            fetchWarehouses();
        }
    }, [isOpen]);

    const fetchSuppliers = async () => {
        try {
            const response = await axios.get(`${BACKEND_URI}/add/addOrder`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setSuppliers(response.data.suppliers || []);
        } catch (error) {
            console.error('Error fetching suppliers:', error);
        }
    };

    const fetchWarehouses = async () => {
        try {
            const response = await axios.get(`${BACKEND_URI}/profile/warehouses`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });
            setWarehouses(response.data.warehouses || []);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.order_type) newErrors.order_type = 'Order type is required';
        if (!formData.warehouse_id) newErrors.warehouse_id = 'Warehouse is required';
        if (!formData.total_amount) newErrors.total_amount = 'Total amount is required';
        if (!formData.expected_delivery_date) newErrors.expected_delivery_date = 'Expected delivery date is required';

        // Order type specific validation
        if (formData.order_type === 'inbound' && !formData.supplier_id) {
            newErrors.supplier_id = 'Supplier is required for inbound orders';
        }
        if (formData.order_type === 'outbound') {
            if (!formData.customer_name) newErrors.customer_name = 'Customer name is required for outbound orders';
            if (!formData.customer_email) newErrors.customer_email = 'Customer email is required for outbound orders';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await axios.post(`${BACKEND_URI}/profile/orders/add`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            onSuccess();
            onClose();
            // Reset form
            setFormData({
                order_type: 'outbound',
                customer_name: '',
                customer_email: '',
                customer_phone: '',
                customer_address: '',
                supplier_id: '',
                warehouse_id: '',
                expected_delivery_date: '',
                priority: 'medium',
                status: 'pending',
                total_amount: '',
                tax_amount: '0',
                shipping_amount: '0',
                discount_amount: '0',
                payment_status: 'pending',
                payment_method: '',
                shipping_method: '',
                tracking_number: '',
                notes: '',
                assigned_to: '',
                approved_by: ''
            });
        } catch (error: any) {
            console.error('Error creating order:', error);
            if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-green-100 rounded-lg dark:bg-green-900">
                            <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create New Order</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the order details</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {errors.general && (
                        <div className="flex items-center p-4 text-red-800 rounded-lg bg-red-50 dark:bg-red-900 dark:text-red-200">
                            <AlertCircle className="w-5 h-5 mr-2" />
                            <span>{errors.general}</span>
                        </div>
                    )}

                    {/* Order Type & Basic Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Order Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Order Type *
                                </label>
                                <select
                                    name="order_type"
                                    value={formData.order_type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="inbound">Inbound</option>
                                    <option value="outbound">Outbound</option>
                                    <option value="transfer">Transfer</option>
                                </select>
                                {errors.order_type && <p className="mt-1 text-sm text-red-600">{errors.order_type}</p>}
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Priority
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="picking">Picking</option>
                                    <option value="packed">Packed</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Customer Information (for outbound orders) */}
                    {formData.order_type === 'outbound' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Customer Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <Input
                                    label="Customer Name *"
                                    name="customer_name"
                                    value={formData.customer_name}
                                    onChange={handleInputChange}
                                    placeholder="Enter customer name"
                                    error={errors.customer_name}
                                />
                                <Input
                                    label="Customer Email *"
                                    name="customer_email"
                                    type="email"
                                    value={formData.customer_email}
                                    onChange={handleInputChange}
                                    placeholder="Enter customer email"
                                    error={errors.customer_email}
                                />
                                <Input
                                    label="Customer Phone"
                                    name="customer_phone"
                                    value={formData.customer_phone}
                                    onChange={handleInputChange}
                                    placeholder="Enter customer phone"
                                />
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Customer Address
                                </label>
                                <textarea
                                    name="customer_address"
                                    value={formData.customer_address}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter customer address"
                                />
                            </div>
                        </div>
                    )}

                    {/* Supplier Information (for inbound orders) */}
                    {formData.order_type === 'inbound' && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Supplier Information</h3>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                <div>
                                    <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Supplier *
                                    </label>
                                    <select
                                        name="supplier_id"
                                        value={formData.supplier_id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    >
                                        <option value="">Select supplier</option>
                                        {suppliers.map(supplier => (
                                            <option key={supplier.id} value={supplier.id}>
                                                {supplier.company_name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.supplier_id && <p className="mt-1 text-sm text-red-600">{errors.supplier_id}</p>}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Warehouse & Delivery */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Warehouse & Delivery</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Warehouse *
                                </label>
                                <select
                                    name="warehouse_id"
                                    value={formData.warehouse_id}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">Select warehouse</option>
                                    {warehouses.map(warehouse => (
                                        <option key={warehouse.id} value={warehouse.id}>
                                            {warehouse.name}
                                        </option>
                                    ))}
                                </select>
                                {errors.warehouse_id && <p className="mt-1 text-sm text-red-600">{errors.warehouse_id}</p>}
                            </div>
                            <Input
                                label="Expected Delivery Date *"
                                name="expected_delivery_date"
                                type="date"
                                value={formData.expected_delivery_date}
                                onChange={handleInputChange}
                                error={errors.expected_delivery_date}
                            />
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Shipping Method
                                </label>
                                <select
                                    name="shipping_method"
                                    value={formData.shipping_method}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">Select shipping method</option>
                                    <option value="standard">Standard</option>
                                    <option value="express">Express</option>
                                    <option value="overnight">Overnight</option>
                                </select>
                            </div>
                            <Input
                                label="Tracking Number"
                                name="tracking_number"
                                value={formData.tracking_number}
                                onChange={handleInputChange}
                                placeholder="Enter tracking number"
                            />
                        </div>
                    </div>

                    {/* Financial Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Financial Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="Total Amount *"
                                name="total_amount"
                                type="number"
                                step="0.01"
                                value={formData.total_amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                error={errors.total_amount}
                            />
                            <Input
                                label="Tax Amount"
                                name="tax_amount"
                                type="number"
                                step="0.01"
                                value={formData.tax_amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                            <Input
                                label="Shipping Amount"
                                name="shipping_amount"
                                type="number"
                                step="0.01"
                                value={formData.shipping_amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                            <Input
                                label="Discount Amount"
                                name="discount_amount"
                                type="number"
                                step="0.01"
                                value={formData.discount_amount}
                                onChange={handleInputChange}
                                placeholder="0.00"
                            />
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payment Status
                                </label>
                                <select
                                    name="payment_status"
                                    value={formData.payment_status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="refunded">Refunded</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Payment Method
                                </label>
                                <select
                                    name="payment_method"
                                    value={formData.payment_method}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="">Select payment method</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="online">Online</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Additional Information</h3>
                        <div>
                            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                Notes
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                placeholder="Enter any additional notes"
                            />
                        </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex justify-end pt-6 space-x-3 border-t dark:border-gray-700">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex items-center space-x-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />
                                    <span>Creating...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Create Order</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}