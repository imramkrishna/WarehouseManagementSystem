import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { Package, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

export function LoginForm() {
  const [email, setEmail] = useState('admin@warehouse.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
 
  useEffect(() => {
    if (!isLoading && user) {
      navigate('/dashboard');
    }
  }, [user, isLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await login(email, password);
      addNotification({
        type: 'success',
        title: 'Login Successful',
        message: 'Welcome back to the warehouse management system!'
      });
      // No need to navigate here; useEffect will handle it
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Login Failed',
        message: 'Invalid email or password. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 transition-colors bg-gradient-to-br from-slate-50 via-emerald-50 to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="w-full max-w-md">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center mb-4 text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Home
        </button>

        <div className="overflow-hidden bg-white shadow-2xl dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="p-8 text-center bg-gradient-to-r from-emerald-500 to-teal-600">
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-white/20 backdrop-blur-sm">
                <Package className="w-8 h-8 text-white" />
              </div>
            </div>
            <h1 className="mb-2 text-2xl font-bold text-white">WareFlow</h1>
            <p className="text-emerald-50">Sign in to your account</p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute w-5 h-5 text-slate-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-slate-500" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute w-5 h-5 text-slate-400 transform -translate-y-1/2 left-3 top-1/2 dark:text-slate-500" />
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="pl-10 pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute text-slate-400 transform -translate-y-1/2 right-3 top-1/2 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-400"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="text-emerald-600 border-slate-300 rounded dark:border-slate-600 focus:ring-emerald-500 dark:bg-slate-700"
                  />
                  <span className="ml-2 text-sm text-slate-600 dark:text-slate-400">Remember me</span>
                </label>
                <a href="#" className="text-sm text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 dark:hover:text-emerald-300">
                  Forgot password?
                </a>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 shadow-lg hover:shadow-emerald-500/50 transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Demo credentials: admin@warehouse.com / password
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}