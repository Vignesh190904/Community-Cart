/**
 * Header component for vendor portal
 */

import React from 'react';
import { Bars3Icon, BellIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../../hooks/useAuth.jsx';
import Button from '../ui/Button';

const Header = ({ onMenuClick }) => {
  const { vendor } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between">
        {/* Left side - Menu button and title */}
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" />
          </button>
          
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              {vendor?.shop_name || 'Vendor Portal'}
            </h1>
            <p className="text-sm text-gray-500">
              Manage your store and orders
            </p>
          </div>
        </div>

        {/* Right side - Notifications and user menu */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md relative">
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-white"></span>
          </button>

          {/* Quick actions */}
          <div className="hidden sm:flex items-center space-x-2">
            <Button size="sm" variant="outline">
              Quick Add Product
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
