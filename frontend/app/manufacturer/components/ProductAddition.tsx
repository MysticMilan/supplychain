'use client';

import React, { useState } from 'react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useProductManagement } from '../../hooks/domin/useProductManagement';
import { useBatchManagement } from '../../hooks/domin/useBatchManagement';
import DoneDialog from '@/components/DoneDialog';

interface ProductAdditionProps {
  onSuccess: (productDetails: { productId: number; name: string; batchNo: number }) => void;
  onError: (error: string) => void;
}

export default function ProductAddition({ onSuccess, onError }: ProductAdditionProps) {
  const [productData, setProductData] = useState({
    name: '',
    productType: '',
    description: '',
    batchNo: '',
    manufacturedDate: '',
    expiryDate: '',
    price: ''
  });

  const [batchDetails, setBatchDetails] = useState<{ name: string } | null>(null);
  const [batchError, setBatchError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { addProduct, loading, error: productError } = useProductManagement();
  const { getBatchDetails } = useBatchManagement();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBatchKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const isValid = await handleVerifyBatch();
      if (isValid) {
        const priceInput = document.querySelector('input[name="price"]') as HTMLInputElement;
        if (priceInput) priceInput.focus();
      }
    }
  };

  const fetchBatchDetails = async (batchNo: number) => {
    try {
      const details = await getBatchDetails(batchNo);
      if (details && details.name) {
        setBatchDetails(details);
        setBatchError(null);
        return true;
      } else {
        setBatchDetails(null);
        setBatchError(`Batch does not exist for batch number ${batchNo}`);
        return false;
      }
    } catch (error) {
      setBatchDetails(null);
      setBatchError(`Batch does not exist for batch number ${batchNo}`);
      return false;
    }
  };

  const handleVerifyBatch = async () => {
    const batchNo = productData.batchNo;
    const batchNum = Number(batchNo);

    // Clear previous batch details
    setBatchDetails(null);
    setBatchError(null);

    // Validate batch number input
    if (batchNo.trim() === '') {
      setBatchError('Batch number cannot be empty');
      return false;
    }

    // Validate batch number format
    if (isNaN(batchNum) || batchNum <= 0) {
      setBatchError(`Invalid batch number: ${batchNo}`);
      return false;
    }

    // Fetch and verify batch details
    return await fetchBatchDetails(batchNum);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await addProduct(
        productData.name,
        productData.productType,
        productData.description,
        Number(productData.batchNo),
        new Date(productData.manufacturedDate),
        new Date(productData.expiryDate),
        Number(productData.price)
      );

      if (result) {
        const successMsg = `Product Added Successfully!

Product ID: ${result.productId}
Name: ${result.name}
Batch No: ${result.batchNo}`;

        setSuccessMessage(successMsg);
        onSuccess(result);

        // Reset form
        setProductData({
          name: '',
          productType: '',
          description: '',
          batchNo: '',
          manufacturedDate: '',
          expiryDate: '',
          price: '',
        });

        // Reset batch details and error
        setBatchDetails(null);
        setBatchError(null);

      } else if (productError) {
        onError(productError);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Add New Product</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {productError && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded mb-4">
            <p className="font-medium">{productError}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
          <Input
            type="text"
            name="name"
            placeholder="Enter product name"
            value={productData.name}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Type</label>
          <Input
            type="text"
            name="productType"
            placeholder="Enter product type"
            value={productData.productType}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product Description</label>
          <Textarea
            name="description"
            placeholder="Describe the product"
            value={productData.description}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">Batch Number</label>
            <div className="flex items-stretch gap-2 w-full">
              <div className="flex-grow">
                <Input
                  type="text"
                  name="batchNo"
                  placeholder="Enter batch number"
                  value={productData.batchNo}
                  onChange={handleInputChange}
                  onKeyDown={handleBatchKeyDown}
                  className="border-green-300 focus:border-green-500 focus:ring-green-500 h-10 w-full"
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleVerifyBatch}
                variant="primary"
                className="h-10 w-28 shrink-0"
              >
                Verify
              </Button>
            </div>
            {batchDetails && (
              <p className="text-sm text-green-600 mt-1">
                Batch Name: {batchDetails.name}
              </p>
            )}
            {batchError && (
              <p className="text-sm text-red-600 mt-1">{batchError}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
            <Input
              type="number"
              name="price"
              placeholder="Enter price"
              value={productData.price}
              onChange={handleInputChange}
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Manufactured Date</label>
            <Input
              type="date"
              name="manufacturedDate"
              value={productData.manufacturedDate}
              onChange={handleInputChange}
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Expiry Date</label>
            <Input
              type="date"
              name="expiryDate"
              value={productData.expiryDate}
              onChange={handleInputChange}
              className="border-green-300 focus:border-green-500 focus:ring-green-500"
              required
            />
          </div>
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </Button>
      </form>
      {successMessage && (
        <DoneDialog
          message={successMessage}
          onDone={() => setSuccessMessage(null)}
          autoHide={false}
        />
      )}
    </div>
  );
}