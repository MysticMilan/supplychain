'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useProductManagement } from '../../hooks/domin/useProductManagement';
import { useBatchManagement } from '../../hooks/domin/useBatchManagement';

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

  const { addProduct, loading, error: productError } = useProductManagement();
  const { getBatchDetails } = useBatchManagement();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
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
      console.error(error);
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

    const { name, productType, description, batchNo } = productData;

    // Validate inputs
    if (!name.trim() || !productType.trim() || !description.trim()) {
      onError('Please fill in all required fields');
      return;
    }

    const batchNum = Number(batchNo);
    if (isNaN(batchNum) || batchNum <= 0) {
      onError('Invalid batch number');
      return;
    }

    // Verify batch details before submission
    const isValidBatch = await handleVerifyBatch();
    if (!isValidBatch) {
      onError('Please verify batch number');
      return;
    }

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
        onSuccess(result);
        
        // Reset form
        setProductData({
          name: '',
          productType: '',
          description: '',
          batchNo: '',
          manufacturedDate: '',
          expiryDate: '',
          price: ''
        });
      } else if (productError) {
        onError(productError);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <Card title="Add New Product">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          label="Product Name"
          value={productData.name}
          onChange={handleInputChange}
          placeholder="Enter product name"
          required
        />
        <Input
          name="productType"
          label="Product Type"
          value={productData.productType}
          onChange={handleInputChange}
          placeholder="Enter product type"
          required
        />
        <Textarea
          name="description"
          label="Product Description"
          value={productData.description}
          onChange={handleInputChange}
          placeholder="Describe the product"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-end space-x-2">
              <div className="flex-grow">
                <Input
                  type="number"
                  name="batchNo"
                  label="Batch Number"
                  value={productData.batchNo}
                  onChange={handleInputChange}
                  placeholder="Enter batch number"
                  required
                />
              </div>
              <Button
                type="button"
                onClick={handleVerifyBatch}
                className="mb-1"
                variant="secondary"
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
              <p className="text-sm text-red-600 mt-1">
                {batchError}
              </p>
            )}
          </div>
          <Input
            type="number"
            name="price"
            label="Price"
            value={productData.price}
            onChange={handleInputChange}
            placeholder="Enter product price"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="date"
            name="manufacturedDate"
            label="Manufactured Date"
            value={productData.manufacturedDate}
            onChange={handleInputChange}
            required
          />
          <Input
            type="date"
            name="expiryDate"
            label="Expiry Date"
            value={productData.expiryDate}
            onChange={handleInputChange}
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Adding Product...' : 'Add Product'}
        </Button>
      </form>
    </Card>
  );
}