'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useProductManagement } from '@/app/hooks/domin/useProductManagement';
import ConfirmDialog from '@/components/ConfirmDialog';
import DoneDialog from '@/components/DoneDialog';
import { Stage } from '@/app/types/enums';


interface ProductMarkAsLostProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const ProductMarkAsLost: React.FC<ProductMarkAsLostProps> = ({ onSuccess, onError }) => {
  const [lostProductData, setLostProductData] = useState({
    productId: '',
    remarks: ''
  });

  const { productStageUpdate, loading, error: productError } = useProductManagement();
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLostProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(true);
  };

  const confirmMarkAsLost = async () => {
    setShowConfirmDialog(false);

    try {
      const result = await productStageUpdate(
        Number(lostProductData.productId),
        Stage.Lost,
        lostProductData.remarks
      );

      if (result) {
        const successMsg = `Product Marked as Lost Successfully!

Product ID: ${lostProductData.productId}
Remarks: ${lostProductData.remarks}`;
        
        setSuccessMessage(successMsg);
        onSuccess();
        
        // Reset form
        setLostProductData({
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
      <h2 className="text-2xl font-bold text-green-800 mb-6">Mark Product as Lost</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
          <Input
            type="number"
            name="productId"
            placeholder="Enter product ID to mark as lost"
            value={lostProductData.productId}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
          <Textarea
            name="remarks"
            placeholder="Enter remarks for marking product as lost"
            value={lostProductData.remarks}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 text-white"
        >
          {loading ? 'Marking as Lost...' : 'Mark Product as Lost'}
        </Button>
      </form>
      {showConfirmDialog && (
        <ConfirmDialog
          message={`Are you sure you want to mark Product ID ${lostProductData.productId} as lost?

Remarks: ${lostProductData.remarks}`}
          onConfirm={confirmMarkAsLost}
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

export default ProductMarkAsLost;
