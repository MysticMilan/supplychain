"use client";

import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { toast } from "sonner";
import ProductList from "../shared/components/ProductList";
import ProductCheckIn from "../shared/components/ProductCheckIn";
import ProductMarkAsLost from "../shared/components/ProductMarkAsLost";
import ProductMarkAsSold from "../shared/components/ProductMarkAsSold";

import { useAccountContractInfo } from "../hooks/domin/useAccountContractInfo";
import { useMetamask } from "../hooks/blockchain/useMetamask";
import Navbar from "@/components/Navbar";
import Footer from '../shared/Footer';
import { Role, Stage } from "../types/enums";

export default function RetailerDashboard() {
  const { userExists, userDetails } = useAccountContractInfo();
  const { userAddress } = useMetamask();
  const [activeTab, setActiveTab] = useState("list");

  const handleSuccess = (message: string) => {
    toast.success(message);
  };

  const handleError = (message: string) => {
    toast.error(message);
  };

  // If no user address, show connection prompt
  if (!userAddress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <p className="text-green-800 text-center">
            Please connect your wallet to access the Retailer Dashboard.
          </p>
        </div>
      </div>
    );
  }

  // If user is not registered
  if (!userExists) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <p className="text-green-800 text-center">
            Your wallet is not registered in the system. Please complete
            registration.
          </p>
        </div>
      </div>
    );
  }

  // If user is not Retailer
  if (userDetails?.role !== Role.Retailer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <p className="text-green-800 text-center">Only Retailer can access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <div className="container mx-auto p-6 bg-white">
          <Navbar />
          <h1 className="text-3xl font-bold mb-6 text-green-800">Retailer Dashboard</h1>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex w-full space-x-2 overflow-x-auto bg-green-100 p-1 rounded-lg">
            <TabsTrigger
              value="list"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >Product List</TabsTrigger>
            <TabsTrigger
              value="product-checkin"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >Product Check-In</TabsTrigger>
            <TabsTrigger
              value="mark-as-lost"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >Mark as Lost</TabsTrigger>
            <TabsTrigger
              value="product-sold"
              className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
            >Mark as Sold</TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <ProductList onError={(error: string) => handleError(error)} />
          </TabsContent>

          <TabsContent value="product-checkin">
            <ProductCheckIn
              onSuccess={() => handleSuccess("Product checked in successfully")}
              onError={(error: string) => handleError(error)}
              productStage={Stage.Retailer}
            />
          </TabsContent>

          <TabsContent value="mark-as-lost">
            <ProductMarkAsLost
              onSuccess={() =>
                handleSuccess("Product marked as lost successfully")
              }
              onError={(error) => handleError(error)}
            />
          </TabsContent>

          <TabsContent value="product-sold">
            <ProductMarkAsSold
              onSuccess={() => handleSuccess("Product marked as sold successfully")}
              onError={(error: string) => handleError(error)}
            />
          </TabsContent>
        </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  );
}
