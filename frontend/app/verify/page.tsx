'use client';

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useProductManagement } from "../hooks/domin/useProductManagement";
import { IBatch, IProduct, IStageDetails } from "../types/interface";
import { Role , Stage } from "../types/enums";

export default function VerifyPage() {
    const [productId, setProductId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [productData, setProductData] = useState<{
        product: IProduct;
        batch: IBatch;
        stages: IStageDetails[];
    } | null>(null);

    const { getProductDetails } = useProductManagement();

    const handleVerify = async () => {
        setError(null);
        setLoading(true);
        setProductData(null);

        try {
            const parsedId = parseInt(productId);
            if (isNaN(parsedId) || parsedId < 0) {
                setError("Please enter a valid product ID.");
                setLoading(false);
                return;
            }

            const details = await getProductDetails(parsedId);
            if (!details) {
                setError("No product found with this ID.");
                setLoading(false);
                return;
            }

            setProductData(details);
        } catch (err: unknown) {
            setError("Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-green-50">
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
                        />
                        <button
                            onClick={handleVerify}
                            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            {loading ? "Verifying..." : "Verify"}
                        </button>
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
    );
}
