'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useProductManagement } from '@/app/hooks/domin/useProductManagement';

interface ProductMarkAsLostProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const ProductMarkAsLost: React.FC<ProductMarkAsLostProps> = ({ onSuccess, onError }) => {
  const [lostProductData, setLostProductData] = useState({
    productId: '',
    remarks: ''
  });

  const { markAsLost, loading, error: productError } = useProductManagement();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLostProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const result = await markAsLost(
        Number(lostProductData.productId), 
        lostProductData.remarks
      );

      if (result) {
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
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          name="productId"
          placeholder="Enter product ID to mark as lost"
          value={lostProductData.productId}
          onChange={handleInputChange}
          required
        />
        <Textarea
          name="remarks"
          placeholder="Enter remarks for marking product as lost"
          value={lostProductData.remarks}
          onChange={handleInputChange}
          required
        />
        <Button 
          type="submit" 
          variant="danger"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Marking as Lost...' : 'Mark Product as Lost'}
        </Button>
      </form>
    </div>
  );
};

export default ProductMarkAsLost;
