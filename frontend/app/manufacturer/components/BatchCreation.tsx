'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useBatchManagement } from '../../hooks/domin/useBatchManagement';

interface BatchCreationProps {
  onSuccess: (batchDetails: { batchId: number; name: string }) => void;
  onError: (error: string) => void;
}

export default function BatchCreation({ onSuccess, onError }: BatchCreationProps) {
  const [batchData, setBatchData] = useState({
    name: '',
    description: ''
  });

  const { createBatch, loading, error: batchError } = useBatchManagement();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBatchData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const { name, description } = batchData;

    // Validate inputs
    if (!name.trim() || !description.trim()) {
      onError('Please fill in batch name and description');
      return;
    }

    try {
      const result = await createBatch(name, description);
      
      if (result) {
        onSuccess(result);
        
        // Reset form
        setBatchData({
          name: '',
          description: ''
        });
      } else if (batchError) {
        onError(batchError);
      }
    } catch (err) {
      onError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <Card title="Create New Batch">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="name"
          label="Batch Name"
          value={batchData.name}
          onChange={handleInputChange}
          placeholder="Enter batch name"
          required
        />
        <Textarea
          name="description"
          label="Batch Description"
          value={batchData.description}
          onChange={handleInputChange}
          placeholder="Describe the batch details"
          required
        />
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full"
        >
          {loading ? 'Creating Batch...' : 'Create Batch'}
        </Button>
      </form>
    </Card>
  );
}