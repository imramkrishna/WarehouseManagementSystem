import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Package, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface AddInventoryFormProps {
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

export function AddInventoryForm({ isOpen, onClose, onSuccess }: AddInventoryFormProps) {
    const [formData, setFormData] = useState({
        sku: '',
        product_name: '',
        description: '',
        category: '',
        brand: '',
        supplier_id: '',
        warehouse_id: '',
        location: '',
        quantity_on_hand: '',
        quantity_reserved: '0',
        unit_price: '',
        cost_price: '',
        minimum_stock_level: '',
        maximum_stock_level: '',
        reorder_point: '',
        reorder_quantity: '',
        unit_of_measure: '',
        expiry_date: '',
        batch_number: '',
        barcode: '',
        weight: '',
        dimensions: '',
        status: 'active'
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
            const response = await axios.get(`${BACKEND_URI}/profile/suppliers`, {
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
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.sku) newErrors.sku = 'SKU is required';
        if (!formData.product_name) newErrors.product_name = 'Product name is required';
        if (!formData.category) newErrors.category = 'Category is required';
        if (!formData.supplier_id) newErrors.supplier_id = 'Supplier is required';
        if (!formData.warehouse_id) newErrors.warehouse_id = 'Warehouse is required';
        if (!formData.quantity_on_hand) newErrors.quantity_on_hand = 'Quantity on hand is required';
        if (!formData.unit_price) newErrors.unit_price = 'Unit price is required';
        if (!formData.cost_price) newErrors.cost_price = 'Cost price is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await axios.post(`${BACKEND_URI}/add/addInventory`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            onSuccess();
            onClose();
            // Reset form
            setFormData({
                sku: '',
                product_name: '',
                description: '',
                category: '',
                brand: '',
                supplier_id: '',
                warehouse_id: '',
                location: '',
                quantity_on_hand: '',
                quantity_reserved: '0',
                unit_price: '',
                cost_price: '',
                minimum_stock_level: '',
                maximum_stock_level: '',
                reorder_point: '',
                reorder_quantity: '',
                unit_of_measure: '',
                expiry_date: '',
                batch_number: '',
                barcode: '',
                weight: '',
                dimensions: '',
                status: 'active'
            });
        } catch (error: any) {
            console.error('Error adding inventory:', error);
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
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                            <Package className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Add New Inventory Item</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Fill in the details for the new inventory item</p>
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

                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Basic Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="SKU *"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                placeholder="Enter SKU"
                                error={errors.sku}
                            />
                            <Input
                                label="Product Name *"
                                name="product_name"
                                value={formData.product_name}
                                onChange={handleInputChange}
                                placeholder="Enter product name"
                                error={errors.product_name}
                            />
                            <Input
                                label="Category *"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                placeholder="Enter category"
                                error={errors.category}
                            />
                            <Input
                                label="Brand"
                                name="brand"
                                value={formData.brand}
                                onChange={handleInputChange}
                                placeholder="Enter brand"
                            />
                            <Input
                                label="Barcode"
                                name="barcode"
                                value={formData.barcode}
                                onChange={handleInputChange}
                                placeholder="Enter barcode"
                            />
                            <Input
                                label="Batch Number"
                                name="batch_number"
                                value={formData.batch_number}
                                onChange={handleInputChange}
                                placeholder="Enter batch number"
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                    placeholder="Enter product description"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Supplier & Warehouse */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Supplier & Location</h3>
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
                                label="Location"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange}
                                placeholder="e.g., A1-B2-C3"
                            />
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
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="discontinued">Discontinued</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Quantity & Pricing */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Quantity & Pricing</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Input
                                label="Quantity on Hand *"
                                name="quantity_on_hand"
                                type="number"
                                value={formData.quantity_on_hand}
                                onChange={handleInputChange}
                                placeholder="0"
                                error={errors.quantity_on_hand}
                            />
                            <Input
                                label="Quantity Reserved"
                                name="quantity_reserved"
                                type="number"
                                value={formData.quantity_reserved}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                            <Input
                                label="Unit of Measure"
                                name="unit_of_measure"
                                value={formData.unit_of_measure}
                                onChange={handleInputChange}
                                placeholder="pieces, kg, liters"
                            />
                            <Input
                                label="Unit Price *"
                                name="unit_price"
                                type="number"
                                step="0.01"
                                value={formData.unit_price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                error={errors.unit_price}
                            />
                            <Input
                                label="Cost Price *"
                                name="cost_price"
                                type="number"
                                step="0.01"
                                value={formData.cost_price}
                                onChange={handleInputChange}
                                placeholder="0.00"
                                error={errors.cost_price}
                            />
                        </div>
                    </div>

                    {/* Stock Levels */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Stock Management</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="Minimum Stock Level"
                                name="minimum_stock_level"
                                type="number"
                                value={formData.minimum_stock_level}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                            <Input
                                label="Maximum Stock Level"
                                name="maximum_stock_level"
                                type="number"
                                value={formData.maximum_stock_level}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                            <Input
                                label="Reorder Point"
                                name="reorder_point"
                                type="number"
                                value={formData.reorder_point}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                            <Input
                                label="Reorder Quantity"
                                name="reorder_quantity"
                                type="number"
                                value={formData.reorder_quantity}
                                onChange={handleInputChange}
                                placeholder="0"
                            />
                        </div>
                    </div>

                    {/* Physical Properties */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Physical Properties</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                            <Input
                                label="Weight"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                placeholder="e.g., 1.5kg"
                            />
                            <Input
                                label="Dimensions"
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleInputChange}
                                placeholder="e.g., 10x20x30cm"
                            />
                            <Input
                                label="Expiry Date"
                                name="expiry_date"
                                type="date"
                                value={formData.expiry_date}
                                onChange={handleInputChange}
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
                                    <span>Adding...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Add Inventory Item</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}