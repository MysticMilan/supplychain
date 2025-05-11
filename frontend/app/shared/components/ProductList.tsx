'use client';

import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProductManagement } from '@/app/hooks/domin/useProductManagement';
import { useAccountContractInfo } from '@/app/hooks/domin/useAccountContractInfo';
import { IProduct } from '@/app/types/interface';
import { Stage } from '@/app/types/enums';
import { useMetamask } from '@/app/hooks/blockchain/useMetamask';

interface ProductListProps {
  onError: (error: string) => void;
}

const ProductList: React.FC<ProductListProps> = ({ onError }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStage, setFilterStage] = useState<Stage | string>('all');

  const { getProductsByUser } = useProductManagement();
  const { userExists } = useAccountContractInfo();
  const { userAddress } = useMetamask();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const userProducts = await getProductsByUser();
        console.log("userProducts: ", userProducts);
        if (userProducts) {
          setProducts(userProducts);
        }
        setLoading(false);
      } catch (err) {
        onError(err instanceof Error ? err.message : 'Failed to fetch products');
        setLoading(false);
      }
    };

    fetchProducts();
  }, [userAddress, userExists, onError, getProductsByUser]);

  // Filter products by stage
  const filteredProducts = products.filter((product: IProduct) => 
    filterStage === 'all' || product.stage === Number(filterStage)
  );

  const renderProductTable = () => {
    if (loading) {
      return <p className="text-center font-semibold">Loading products...</p>;
    }

    if (filteredProducts.length === 0) {
      return <p className="text-center font-semibold">No products found</p>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-green-100 border-b border-green-200">
              <th className="p-2 text-left">S.N.</th>
              <th className="p-2 text-left">Product ID</th>
              <th className="p-2 text-left">Name</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Batch No</th>
              <th className="p-2 text-left">Manufactured Date</th>
              <th className="p-2 text-left">Expiry Date</th>
              <th className="p-2 text-left">Price</th>
              <th className="p-2 text-left">Current Stage</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product, index) => (
              <tr 
                key={product.productId} 
                className="border-b border-green-100 hover:bg-green-50 transition-colors duration-200"
              >
                <td className="p-2">{index + 1}</td>
                <td className="p-2">{product.productId}</td>
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.productType}</td>
                <td className="p-2">{product.batchNo}</td>
                <td className="p-2">
                  {product.manufacturedDate.toLocaleDateString()}
                </td>
                <td className="p-2">
                  {product.expiryDate.toLocaleDateString()}
                </td>
                <td className="p-2">${product.price}</td>
                <td className="p-2">{Stage[product.stage]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="space-y-4 p-4 bg-green-50 rounded-lg shadow-md border border-green-200">
      <div className="flex justify-between items-center mb-4">
        <div className="w-64">
          <label className="block text-sm font-medium mb-1">Filter by Stage</label>
          <Select 
            value={filterStage.toString()} 
            onValueChange={(value: string) => setFilterStage(value)}
          >
            <SelectTrigger className="border-green-300 focus:border-green-500">
              <SelectValue placeholder="Select Stage" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="hover:bg-green-100">All Stages</SelectItem>
              {Object.values(Stage)
                .filter(stage => typeof stage === 'number')
                .map((stage) => (
                  <SelectItem 
                    key={stage} 
                    value={stage.toString()} 
                    className="hover:bg-green-100"
                  >
                    {Stage[stage as Stage]}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        </div>
        <button 
          onClick={() => {
            setLoading(true);
            getProductsByUser().then((userProducts) => {
              if (userProducts) {
                setProducts(userProducts);
              }
              setLoading(false);
            }).catch((err) => {
              onError(err instanceof Error ? err.message : 'Failed to fetch products');
              setLoading(false);
            });
          }} 
          disabled={loading}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Product Table */}
      <div className="mt-4">
        {renderProductTable()}
      </div>
    </div>
  );
};

export default ProductList;