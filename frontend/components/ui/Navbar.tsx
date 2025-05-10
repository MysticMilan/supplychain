'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMetamask } from '@/app/hooks/blockchain/useMetamask';
import { Button } from './Button';

const NAV_ITEMS = [
  { href: '/manufacturer', label: 'Manufacturer' },
  { href: '/distributor', label: 'Distributor' },
  { href: '/retailer', label: 'Retailer' },
  { href: '/admin', label: 'Admin' }
];

export function Navbar() {
  const pathname = usePathname();
  const { userAddress, connectWallet, disconnectWallet } = useMetamask();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 text-xl font-bold text-gray-900">
              ChiyaChain
            </Link>
            <div className="ml-10 flex items-baseline space-x-4">
              {NAV_ITEMS.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pathname === item.href 
                      ? 'bg-gray-900 text-white' 
                      : 'text-gray-600 hover:bg-gray-200 hover:text-gray-900'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            {userAddress ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </span>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={disconnectWallet}
                >
                  Disconnect
                </Button>
              </div>
            ) : (
              <Button onClick={connectWallet}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
