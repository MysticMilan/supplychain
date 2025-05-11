'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useProductManagement } from '@/app/hooks/domin/useProductManagement';
import ConfirmDialog from '@/components/ConfirmDialog';
import DoneDialog from '@/components/DoneDialog';
import { Stage } from '@/app/types/enums';


interface ProductSoldProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const ProductMarkAsSold: React.FC<ProductSoldProps> = ({ onSuccess, onError }) => {
  const [soldProductData, setSoldProductData] = useState({
    productId: '',
    remarks: ''
  });

  const { productStageUpdate, loading, error: productError } = useProductManagement();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSoldProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmMarkAsSold = async () => {
    setShowConfirmDialog(false);

    try {
      const result = await productStageUpdate(
        Number(soldProductData.productId),
        Stage.Sold,
        soldProductData.remarks
      );

      if (result) {
        const successMsg = `Product sold data updated successfully!

Product ID: ${soldProductData.productId}
Remarks: ${soldProductData.remarks}`;

        setSuccessMessage(successMsg);
        onSuccess();

        // Reset form
        setSoldProductData({
          productId: '',
          remarks: ''
        });
      } else if (productError) {
        onError(productError);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Mark Product as Sold</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {productError && (
          <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-2 rounded mb-4">
            <p className="font-medium">{productError}</p>
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
          <Input
            type="number"
            name="productId"
            placeholder="Enter Product ID to mark as sold"
            value={soldProductData.productId}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
          <Textarea
            name="remarks"
            placeholder="Enter remarks for the sold product"
            value={soldProductData.remarks}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          className="w-full"
        >
          {loading ? 'Marking as Sold...' : 'Mark Product as Sold'}
        </Button>
      </form>
      {showConfirmDialog && (
        <ConfirmDialog
          message={`Are you sure you want to mark Product ID ${soldProductData.productId} as sold?

Remarks: ${soldProductData.remarks}`}
          onConfirm={confirmMarkAsSold}
          onCancel={() => setShowConfirmDialog(false)}
        />
      )}
      {successMessage && (
        <DoneDialog
          message={successMessage}
          onDone={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
};

export default ProductMarkAsSold;
