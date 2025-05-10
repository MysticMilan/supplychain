'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useProductManagement } from '@/app/hooks/domin/useProductManagement';
import { Stage } from '@/app/types/enums';

interface ProductCheckInProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const ProductCheckIn: React.FC<ProductCheckInProps> = ({ onSuccess, onError }) => {
  const [checkInData, setCheckInData] = useState({
    productId: '',
    remarks: ''
  });

  const { updateProductStage, loading, error: productError } = useProductManagement();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCheckInData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { productId, remarks } = checkInData;

    // Validate inputs
    const productIdNum = Number(productId);
    if (isNaN(productIdNum) || productIdNum <= 0) {
      onError('Invalid product ID');
      return;
    }

    if (!remarks.trim()) {
      onError('Remarks are required for product check-in');
      return;
    }

    try {
      const result = await updateProductStage(productIdNum, Stage.Manufactured, remarks);

      if (result) {
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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          name="productId"
          placeholder="Enter product ID to check-in"
          value={checkInData.productId}
          onChange={handleInputChange}
          required
        />
        <Textarea
          name="remarks"
          placeholder="Enter remarks for product check-in"
          value={checkInData.remarks}
          onChange={handleInputChange}
          required
        />
        <Button 
          type="submit" 
          variant="primary"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Checking In...' : 'Check In Product'}
        </Button>
      </form>
    </div>
  );
};

export default ProductCheckIn;