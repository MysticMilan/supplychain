'use client';

import React, { useState } from 'react';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import { useBatchManagement } from '../../hooks/domin/useBatchManagement';
import DoneDialog from '@/components/DoneDialog';

interface BatchCreationProps {
  onSuccess: (batchDetails: { batchId: number; name: string }) => void;
  onError: (error: string) => void;
}

export default function BatchCreation({ onSuccess, onError }: BatchCreationProps) {
  const [batchData, setBatchData] = useState({
    name: '',
    description: ''
  });

  const [successMessage, setSuccessMessage] = useState<string | null>(null);

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

    try {
      const result = await createBatch(batchData.name, batchData.description);
      
      if (result) {
        const successMsg = `Batch Created Successfully!

Batch ID: ${result.batchId}
Name: ${result.name}`;
        
        setSuccessMessage(successMsg);
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
    <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-green-800 mb-6">Create New Batch</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Batch Name</label>
          <Input
            type="text"
            name="name"
            placeholder="Enter batch name"
            value={batchData.name}
            onChange={handleInputChange}
            className="w-full border border-green-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Batch Description</label>
          <Textarea
            name="description"
            placeholder="Describe the batch details"
            value={batchData.description}
            onChange={handleInputChange}
            className="w-full border border-green-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition duration-200 ease-in-out"
            required
          />
        </div>
        <Button 
          type="submit" 
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 text-white p-2.5 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          {loading ? 'Creating Batch...' : 'Create Batch'}
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