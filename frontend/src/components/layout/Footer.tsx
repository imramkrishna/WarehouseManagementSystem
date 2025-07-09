import React from 'react';

export function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 py-4 px-6 transition-colors">
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          © 2024 Warehouse Management System. All rights reserved.
        </div>
        <div className="flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-gray-900 dark:hover:text-white transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}