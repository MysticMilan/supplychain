'use client';

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/Button";

import { useProductManagement } from "../hooks/domin/useProductManagement";
import { IBatch, IProduct, IStageDetails } from "../types/interface";
import { Role, Stage } from "../types/enums";

interface VerifyResult {
    product: IProduct;
    batch: IBatch;
    stages: IStageDetails[];
}

import Footer from '../shared/Footer';

export default function VerifyPage() {
    const [productId, setProductId] = useState("");
    const [productData, setProductData] = useState<VerifyResult | null>(null);
    const { getProductDetails, error, loading } = useProductManagement();

    const handleVerify = async () => {
        setProductData(null);

        try {
            const details = await getProductDetails(parseInt(productId));
            if (details) {
                setProductData(details);
            }
        } catch {
            // Error handled by the hook
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-green-50">
          <div className="flex-grow">
            <Navbar />
            <div className="max-w-3xl mx-auto mt-10 px-4">
                <div className="bg-white border border-green-200 rounded-2xl shadow-lg p-8">
                    <h1 className="text-4xl font-bold mb-6 text-green-800 text-center">
                        Verify Your Tea Product
                    </h1>

                    <div className="flex gap-3 mb-6">
                        <input
                            type="number"
                            className="w-full border border-green-300 px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition"
                            placeholder="Enter Product ID"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !loading) {
                                    e.preventDefault();
                                    handleVerify();
                                }
                            }}
                        />
                        <Button
                            onClick={handleVerify}
                            disabled={loading}
                            variant="primary"
                            className="px-6 py-3 transform hover:scale-105 transition duration-300"
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </Button>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg mb-4 text-center">
                            {error}
                        </div>
                    )}

                    {productData && (
                        <>
                            <div className="bg-green-50 border border-green-200 p-6 rounded-lg shadow-md mb-6">
                                <h2 className="text-2xl font-semibold text-green-800 mb-4 border-b border-green-200 pb-2">
                                    Product Information
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    <p><strong className="text-green-700">Product ID:</strong> {productData.product.productId}</p>
                                    <p><strong className="text-green-700">Name:</strong> {productData.product.name}</p>
                                    <p><strong className="text-green-700">Type:</strong> {productData.product.productType}</p>
                                    <p><strong className="text-green-700">Batch No:</strong> {productData.product.batchNo}</p>
                                    <p><strong className="text-green-700">Batch Name:</strong> {productData.batch.name}</p>
                                    <p><strong className="text-green-700">Price:</strong> ₹{productData.product.price}</p>
                                    <p><strong className="text-green-700">Current Stage:</strong> {Stage[productData.product.stage]}</p>
                                    <p><strong className="text-green-700">Manufactured:</strong> {productData.product.manufacturedDate.toLocaleDateString()}</p>
                                    <p><strong className="text-green-700">Expiry:</strong> {productData.product.expiryDate.toLocaleDateString()}</p>
                                </div>
                                <p className="mt-4 text-gray-600 italic">{productData.product.description}</p>
                            </div>

                            {productData.stages.length > 0 && (
                                <div className="bg-white border border-green-200 p-6 rounded-lg shadow-md">
                                    <h2 className="text-2xl font-semibold text-green-800 mb-4 border-b border-green-200 pb-2">Tracking History</h2>
                                    <ul className="space-y-4">
                                        {productData.stages.map((entry, i) => (
                                            <li key={i} className="bg-green-50 border border-green-100 p-4 rounded-lg">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <p><strong className="text-green-700">Handler:</strong> {entry.user.name}</p>
                                                    <p><strong className="text-green-700">Role:</strong> {Role[entry.user.role]}</p>
                                                    <p><strong className="text-green-700">Place:</strong> {entry.user.place}</p>
                                                    <p><strong className="text-green-700">Stage:</strong> {Stage[entry.stage]}</p>
                                                    <p><strong className="text-green-700">Entered:</strong> {entry.entryTime.toLocaleString()}</p>
                                                    <p><strong className="text-green-700">Exited:</strong> {entry.exitTime && entry.exitTime.toISOString() !== new Date(0).toISOString() ? entry.exitTime.toLocaleString() : "Still there"}</p>
                                                </div>
                                                <p className="mt-2 text-gray-600 italic"><strong className="text-green-700">Remark:</strong> {entry.remark}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
        <Footer />
        </div>
    );
}
