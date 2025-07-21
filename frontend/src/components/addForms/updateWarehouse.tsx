import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Warehouse, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

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

interface UpdateWarehouseFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    warehouse: WarehouseData | null;
}

export function UpdateWarehouseForm({ isOpen, onClose, onSuccess, warehouse }: UpdateWarehouseFormProps) {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        country: '',
        zip_code: '',
        phone: '',
        email: '',
        warehouse_type: 'storage',
        status: 'active',
        total_capacity: '',
        available_capacity: '',
        manager_id: ''
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

    // Set form data from warehouse prop
    useEffect(() => {
        if (isOpen && warehouse) {
            setFormData({
                name: warehouse.name || '',
                address: warehouse.address || '',
                city: warehouse.city || '',
                state: warehouse.state || '',
                country: warehouse.country || '',
                zip_code: warehouse.zip_code || '',
                phone: warehouse.phone || '',
                email: warehouse.email || '',
                warehouse_type: warehouse.warehouse_type || 'storage',
                status: warehouse.status || 'active',
                total_capacity: warehouse.total_capacity?.toString() || '',
                available_capacity: warehouse.available_capacity?.toString() || '',
                manager_id: warehouse.manager_id?.toString() || ''
            });
        }
    }, [isOpen, warehouse]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors: Record<string, string> = {};

        if (!formData.name) newErrors.name = 'Warehouse name is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.country) newErrors.country = 'Country is required';
        if (!formData.zip_code) newErrors.zip_code = 'ZIP code is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.total_capacity) newErrors.total_capacity = 'Total capacity is required';
        if (!formData.available_capacity) newErrors.available_capacity = 'Available capacity is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Capacity validation
        const totalCapacity = parseInt(formData.total_capacity) || 0;
        const availableCapacity = parseInt(formData.available_capacity) || 0;

        if (totalCapacity <= 0) {
            newErrors.total_capacity = 'Total capacity must be greater than 0';
        }

        if (availableCapacity < 0) {
            newErrors.available_capacity = 'Available capacity cannot be negative';
        }

        if (availableCapacity > totalCapacity) {
            newErrors.available_capacity = 'Available capacity cannot exceed total capacity';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm() || !warehouse) return;

        setLoading(true);
        try {
            await axios.put(`${BACKEND_URI}/update/warehouse/${warehouse.id}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating warehouse:', error);
            if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Error updating warehouse. Please try again.' });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    // Show loading if no warehouse data
    if (!warehouse) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <Card className="w-full max-w-md p-6">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 border-2 border-blue-600 rounded-full border-t-transparent animate-spin" />
                        <span className="text-gray-600 dark:text-gray-400">Loading warehouse details...</span>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-100 rounded-lg dark:bg-blue-900">
                            <Warehouse className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Warehouse</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Modify the warehouse information</p>
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
                                label="Warehouse Name *"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Enter warehouse name"
                                error={errors.name}
                            />
                            <Input
                                label="Manager ID"
                                name="manager_id"
                                type="number"
                                value={formData.manager_id}
                                onChange={handleInputChange}
                                placeholder="Enter manager ID"
                            />
                            <Input
                                label="Phone *"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                error={errors.phone}
                            />
                            <Input
                                label="Email *"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter email address"
                                error={errors.email}
                            />
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Warehouse Type *
                                </label>
                                <select
                                    name="warehouse_type"
                                    value={formData.warehouse_type}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="distribution">Distribution</option>
                                    <option value="storage">Storage</option>
                                    <option value="fulfillment">Fulfillment</option>
                                </select>
                            </div>
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Status *
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                    <option value="maintenance">Maintenance</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Address Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Address Information</h3>
                        <div className="grid grid-cols-1 gap-4">
                            <Input
                                label="Address *"
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Enter street address"
                                error={errors.address}
                            />
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                                <Input
                                    label="City *"
                                    name="city"
                                    value={formData.city}
                                    onChange={handleInputChange}
                                    placeholder="Enter city"
                                    error={errors.city}
                                />
                                <Input
                                    label="State"
                                    name="state"
                                    value={formData.state}
                                    onChange={handleInputChange}
                                    placeholder="Enter state"
                                />
                                <Input
                                    label="ZIP Code *"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleInputChange}
                                    placeholder="Enter ZIP code"
                                    error={errors.zip_code}
                                />
                            </div>
                            <Input
                                label="Country *"
                                name="country"
                                value={formData.country}
                                onChange={handleInputChange}
                                placeholder="Enter country"
                                error={errors.country}
                            />
                        </div>
                    </div>

                    {/* Capacity Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Capacity Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="Total Capacity (sq ft) *"
                                name="total_capacity"
                                type="number"
                                value={formData.total_capacity}
                                onChange={handleInputChange}
                                placeholder="Enter total capacity"
                                error={errors.total_capacity}
                            />
                            <Input
                                label="Available Capacity (sq ft) *"
                                name="available_capacity"
                                type="number"
                                value={formData.available_capacity}
                                onChange={handleInputChange}
                                placeholder="Enter available capacity"
                                error={errors.available_capacity}
                            />
                        </div>

                        {/* Capacity Utilization Display */}
                        {formData.total_capacity && formData.available_capacity && (
                            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">Capacity Utilization</span>
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                                        {Math.round(((parseInt(formData.total_capacity) - parseInt(formData.available_capacity)) / parseInt(formData.total_capacity)) * 100)}%
                                    </span>
                                </div>
                                <div className="w-full h-2 bg-gray-200 rounded-full dark:bg-gray-700">
                                    <div
                                        className="h-2 bg-blue-500 rounded-full"
                                        style={{
                                            width: `${Math.round(((parseInt(formData.total_capacity) - parseInt(formData.available_capacity)) / parseInt(formData.total_capacity)) * 100)}%`
                                        }}
                                    />
                                </div>
                                <div className="flex justify-between mt-1 text-xs text-gray-500 dark:text-gray-400">
                                    <span>{(parseInt(formData.total_capacity) - parseInt(formData.available_capacity)).toLocaleString()} used</span>
                                    <span>{parseInt(formData.total_capacity).toLocaleString()} total</span>
                                </div>
                            </div>
                        )}
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
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    <span>Update Warehouse</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}