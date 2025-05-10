'use client';

import { ethers } from 'ethers';
import Navbar from '@/components/Navbar';
import AddUserForm from './components/AddUserForm';
import UserList from './components/UserList';
import { useMetamask }  from '@/app/hooks/blockchain/useMetamask';
import { useAccountContractInfo } from '@/app/hooks/domin/useAccountContractInfo';

export default function AdminDashboard() {

    const { userAddress } = useMetamask();
    const { owner } = useAccountContractInfo();

      // If no user address, show connection prompt
      if (!userAddress) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p>
                Please connect your wallet to access the Admin Dashboard.
              </p>
            </div>
          </div>
        );
      }
    
      // If user is not Admin
      if (userAddress && owner && ethers.getAddress(userAddress) !== ethers.getAddress(owner)) {
        return (
          <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p>Only Admin can access this dashboard.</p>
            </div>
          </div>
        );
      }
      
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <main className="max-w-5xl mx-auto p-6">
                <h1 className="text-3xl font-bold text-green-800 mb-6">Admin Dashboard</h1>
                <AddUserForm />
                <UserList />
            </main>
        </div>
    );
}
