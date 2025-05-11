"use client";

import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { toast } from "sonner";
import ProductAddition from "./components/ProductAddition";
import ProductList from "../shared/components/ProductList";
import BatchCreation from "./components/BatchCreation";
import ProductCheckIn from "../shared/components/ProductCheckIn";
import ProductMarkAsLost from "../shared/components/ProductMarkAsLost";

import { useAccountContractInfo } from "../hooks/domin/useAccountContractInfo";
import { useMetamask } from "../hooks/blockchain/useMetamask";
import Navbar from "@/components/Navbar";
import { Role, Stage } from "../types/enums";

export default function ManufacturerDashboard() {
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
            Please connect your wallet to access the Manufacturer Dashboard.
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

  // If user is not Manufacturer
  if (userDetails?.role !== Role.Manufacturer) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="bg-white p-6 rounded-lg shadow-md border border-green-200">
          <p className="text-green-800 text-center">Only Manufacturer can access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 bg-white min-h-screen">
      <Navbar />
      <h1 className="text-3xl font-bold mb-6 text-green-800">Manufacturer Dashboard</h1>

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
            value="batch" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >Create Batch</TabsTrigger>
          <TabsTrigger 
            value="product-add" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >Add Product</TabsTrigger>
          <TabsTrigger 
            value="mark-as-lost" 
            className="data-[state=active]:bg-green-600 data-[state=active]:text-white"
          >Mark as Lost</TabsTrigger>
        </TabsList>

        <TabsContent value="list">
          <ProductList onError={(error: string) => handleError(error)} />
        </TabsContent>

        <TabsContent value="product-checkin">
          <ProductCheckIn
            onSuccess={() => handleSuccess("Product checked in successfully")}
            onError={(error: string) => handleError(error)}
            productStage={Stage.Manufactured}
          />
        </TabsContent>

        <TabsContent value="batch">
          <BatchCreation
            onSuccess={({ batchId, name }) =>
              handleSuccess(
                `Batch ${name} (ID: ${batchId}) created successfully`
              )
            }
            onError={(error: string) => handleError(error)}
          />
        </TabsContent>

        <TabsContent value="product-add">
          <ProductAddition
            onSuccess={({ productId, name, batchNo }) =>
              handleSuccess(
                `Product ${name} (ID: ${productId}, Batch: ${batchNo}) added successfully`
              )
            }
            onError={(error: string) => handleError(error)}
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
      </Tabs>
    </div>
  );
}
