'use client';

import React, { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useProductManagement } from '@/app/hooks/domin/useProductManagement';
import { toast } from 'sonner';

interface MarkAsLostProps {
  onSuccess: () => void;
  onError: (error: string) => void;
}

const MarkAsLost: React.FC<MarkAsLostProps> = ({ onSuccess, onError }) => {
  const [lostData, setLostData] = useState({
    productId: '',
    remarks: ''
  });

  const { markAsLost, loading, error: productError } = useProductManagement();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setLostData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { productId, remarks } = lostData;

    // Validate inputs
    const productIdNum = Number(productId);
    if (isNaN(productIdNum) || productIdNum <= 0) {
      onError('Invalid product ID');
      return;
    }

    if (!remarks.trim()) {
      onError('Remarks are required for marking product as lost');
      return;
    }

    try {
      const result = await markAsLost(productIdNum, remarks);

      if (result) {
        toast.success('Product marked as lost successfully');
        onSuccess();
        
        // Reset form
        setLostData({
          productId: '',
          remarks: ''
        });
      } else if (productError) {
        onError(productError);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      toast.error(errorMessage);
      onError(errorMessage);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          type="number"
          name="productId"
          placeholder="Enter product ID to mark as lost"
          value={lostData.productId}
          onChange={handleInputChange}
          required
        />
        <Textarea
          name="remarks"
          placeholder="Enter remarks for lost product"
          value={lostData.remarks}
          onChange={handleInputChange}
          required
        />
        <Button 
          type="submit" 
          variant="danger"
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Marking as Lost...' : 'Mark as Lost'}
        </Button>
      </form>
    </div>
  );
};

export default MarkAsLost;
