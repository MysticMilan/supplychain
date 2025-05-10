'use client';

import React, { useState } from 'react';
import { ethers } from 'ethers';
import Navbar from '@/components/Navbar';
import AddUserForm from './components/AddUserForm';
import UserList from './components/UserList';
import { useMetamask } from '@/app/hooks/blockchain/useMetamask';
import { useAccountContractInfo } from '@/app/hooks/domin/useAccountContractInfo';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { toast } from 'sonner';

export default function AdminDashboard() {
  const { userAddress } = useMetamask();
  const { owner } = useAccountContractInfo();
  const [activeTab, setActiveTab] = useState('user-list');

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  const handleError = (error: string | null) => {
    toast.error(error ?? '');
  };

  // If no user address, show connection prompt
  if (!userAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
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
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <p>Only Admin can access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white">
      <Navbar />
      <Toaster />

      <h1 className="text-3xl font-bold mb-6 text-green-800">Admin Dashboard</h1>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full space-x-2 overflow-x-auto bg-green-100 p-1 rounded-lg">
          <TabsTrigger 
            value="user-list" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >User List</TabsTrigger>
          <TabsTrigger 
            value="add-user" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >Add User</TabsTrigger>
        </TabsList>

        <TabsContent value="user-list">
          <UserList onError={(error: string | null) => handleError(error ?? '')} />
        </TabsContent>

        <TabsContent value="add-user">
          <AddUserForm
            onSuccess={(userName: string) => handleSuccess(`User ${userName} added successfully`)}
            onError={(error: string) => handleError(error)}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
