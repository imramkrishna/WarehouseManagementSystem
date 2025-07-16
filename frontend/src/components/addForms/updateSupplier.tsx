import React, { useState, useEffect } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Users, Save, AlertCircle } from 'lucide-react';
import axios from 'axios';

interface UpdateSupplierFormProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    supplierId: number | null;
}

export function UpdateSupplierForm({ isOpen, onClose, onSuccess, supplierId }: UpdateSupplierFormProps) {
    const [formData, setFormData] = useState({
        company_name: '',
        contact_person: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: '',
        tax_id: '',
        payment_terms: '',
        rating: '0',
        status: 'active'
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

    useEffect(() => {
        if (isOpen && supplierId) {
            fetchSupplier();
        }
    }, [isOpen, supplierId]);

    const fetchSupplier = async () => {
        try {
            setInitialLoading(true);
            const response = await axios.get(`${BACKEND_URI}/profile/suppliers/${supplierId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
            });

            const supplier = response.data.supplier;
            setFormData({
                company_name: supplier.company_name || '',
                contact_person: supplier.contact_person || '',
                email: supplier.email || '',
                phone: supplier.phone || '',
                address: supplier.address || '',
                city: supplier.city || '',
                state: supplier.state || '',
                zip_code: supplier.zip_code || '',
                country: supplier.country || '',
                tax_id: supplier.tax_id || '',
                payment_terms: supplier.payment_terms || '',
                rating: supplier.rating?.toString() || '0',
                status: supplier.status || 'active'
            });
        } catch (error) {
            console.error('Error fetching supplier:', error);
            setErrors({ general: 'Error loading supplier details' });
        } finally {
            setInitialLoading(false);
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

        if (!formData.company_name) newErrors.company_name = 'Company name is required';
        if (!formData.contact_person) newErrors.contact_person = 'Contact person is required';
        if (!formData.email) newErrors.email = 'Email is required';
        if (!formData.phone) newErrors.phone = 'Phone is required';
        if (!formData.address) newErrors.address = 'Address is required';
        if (!formData.city) newErrors.city = 'City is required';
        if (!formData.country) newErrors.country = 'Country is required';

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (formData.email && !emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Rating validation
        const rating = parseInt(formData.rating);
        if (rating < 0 || rating > 5) {
            newErrors.rating = 'Rating must be between 0 and 5';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);
        try {
            await axios.put(`${BACKEND_URI}/profile/suppliers/${supplierId}`, formData, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating supplier:', error);
            if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    if (initialLoading) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
                <Card className="w-full max-w-md p-6">
                    <div className="flex items-center justify-center space-x-2">
                        <div className="w-6 h-6 border-2 border-purple-600 rounded-full border-t-transparent animate-spin" />
                        <span className="text-gray-600 dark:text-gray-400">Loading supplier details...</span>
                    </div>
                </Card>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 z-10 flex items-center justify-between p-6 bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-purple-100 rounded-lg dark:bg-purple-900">
                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Update Supplier</h2>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Modify the supplier information</p>
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

                    {/* Company Information */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Company Information</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="Company Name *"
                                name="company_name"
                                value={formData.company_name}
                                onChange={handleInputChange}
                                placeholder="Enter company name"
                                error={errors.company_name}
                            />
                            <Input
                                label="Contact Person *"
                                name="contact_person"
                                value={formData.contact_person}
                                onChange={handleInputChange}
                                placeholder="Enter contact person name"
                                error={errors.contact_person}
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
                            <Input
                                label="Phone *"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Enter phone number"
                                error={errors.phone}
                            />
                            <Input
                                label="Tax ID"
                                name="tax_id"
                                value={formData.tax_id}
                                onChange={handleInputChange}
                                placeholder="Enter tax ID"
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
                                    <option value="pending">Pending</option>
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
                                    label="ZIP Code"
                                    name="zip_code"
                                    value={formData.zip_code}
                                    onChange={handleInputChange}
                                    placeholder="Enter ZIP code"
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
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">Business Details</h3>
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <Input
                                label="Payment Terms"
                                name="payment_terms"
                                value={formData.payment_terms}
                                onChange={handleInputChange}
                                placeholder="e.g., Net 30, Net 60"
                            />
                            <div>
                                <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Rating (0-5)
                                </label>
                                <select
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
                                >
                                    <option value="0">0 - Not rated</option>
                                    <option value="1">1 - Poor</option>
                                    <option value="2">2 - Fair</option>
                                    <option value="3">3 - Good</option>
                                    <option value="4">4 - Very Good</option>
                                    <option value="5">5 - Excellent</option>
                                </select>
                                {errors.rating && <p className="mt-1 text-sm text-red-600">{errors.rating}</p>}
                            </div>
                        </div>
                    </div>
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
                                    <span>Update Supplier</span>
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}