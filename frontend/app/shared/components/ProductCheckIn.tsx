'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useProductManagement } from '@/app/hooks/domin/useProductManagement';
import { Stage } from '@/app/types/enums';
import DoneDialog from '@/components/DoneDialog';

interface ProductCheckInProps {
  onSuccess: () => void;
  onError: (error: string) => void;
  productStage: Stage;
}

const ProductCheckIn: React.FC<ProductCheckInProps> = ({ 
  onSuccess, 
  onError, 
  productStage 
}) => {
  const [checkInData, setCheckInData] = useState({
    productId: '',
    remarks: ''
  });

  const { productCheckIn, loading, error: productError } = useProductManagement();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckInData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await productCheckIn(
        Number(checkInData.productId), 
        productStage, 
        checkInData.remarks
      );

      if (result) {
        const successMsg = `Product Check-In Successful!

Product ID: ${checkInData.productId}
Stage: ${Stage[productStage]}`;
        
        setSuccessMessage(successMsg);
        onSuccess();
        
        // Reset form
        setCheckInData({
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
      <h2 className="text-2xl font-bold text-green-800 mb-6">Product Check-In</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Product ID</label>
          <Input
            type="number"
            name="productId"
            placeholder="Enter product ID to check-in"
            value={checkInData.productId}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Remarks</label>
          <Textarea
            name="remarks"
            placeholder="Enter remarks for product check-in"
            value={checkInData.remarks}
            onChange={handleInputChange}
            className="border-green-300 focus:border-green-500 focus:ring-green-500"
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {loading ? 'Checking In...' : 'Check In Product'}
        </Button>
      </form>
      {successMessage && (
        <DoneDialog
          message={successMessage}
          onDone={() => setSuccessMessage(null)}
        />
      )}
    </div>
  );
};

export default ProductCheckIn;