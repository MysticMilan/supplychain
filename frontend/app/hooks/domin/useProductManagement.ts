import { useState, useCallback } from "react";
import { useSupplyChainContract } from "../blockchain/useSupplyChainContract";
import { IProduct, IStageDetails } from "../../types/interface";
import { Stage } from "../../types/enums";
import { useReadOnlyContract } from "../blockchain/useReadOnlyContract";

export function useProductManagement() {
  const contract = useSupplyChainContract();
  const readOnlyContract = useReadOnlyContract();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateContract = useCallback((): boolean => {
    if (!contract) {
      setError(
        "Please switch to the correct network and connect your wallet. Contract not found."
      );
      return false;
    }
    setError(null);
    return true;
  }, [contract]);

  const addProduct = useCallback(
    async (
      name: string,
      productType: string,
      description: string,
      batchNo: number,
      manufacturedDate: Date,
      expiryDate: Date,
      price: number
    ): Promise<{ productId: number; name: string; batchNo: number } | null> => {
      if (!validateContract()) return null;

      if (!name.trim() || name.length < 2) {
        setError("Name is required and must be at least 2 characters.");
        return null;
      }

      if (price <= 0) {
        setError("Price must be greater than zero.");
        return null;
      }

      if (batchNo <= 0) {
        setError("Invalid batch number.");
        return null;
      }

      const now = Math.floor(Date.now() / 1000);
      const manufacturedTimestamp = Math.floor(
        manufacturedDate.getTime() / 1000
      );
      const expiryTimestamp = Math.floor(expiryDate.getTime() / 1000);

      if (manufacturedTimestamp >= now) {
        setError("Manufacture date must be in the past.");
        return null;
      }

      if (expiryTimestamp <= manufacturedTimestamp) {
        setError("Expiry date must be after manufacture date.");
        return null;
      }

      setLoading(true);
      setError(null);

      try {
        const tx = await contract!.addProduct(
          name,
          productType,
          description,
          batchNo,
          manufacturedTimestamp,
          expiryTimestamp,
          price
        );
        const receipt = await tx.wait();

        for (const log of receipt.logs) {
          if (log.transactionHash !== receipt.hash) continue;

          try {
            const parsedLog = contract?.interface.parseLog(log);
            if (parsedLog?.name === "ProductAdded") {
              const [productId, productName, productBatchNo] = parsedLog.args;
              return {
                productId: Number(productId),
                name: productName,
                batchNo: Number(productBatchNo),
              };
            }
          } catch (error) {
            setError("Failed to parse event log.");
          }
        }

        setError("ProductAdded event not found in transaction receipt.");
        return null;
      } catch (err: any) {
        setError(
          "Error adding product: " +
            (err?.reason ||
              err?.revert?.args?.[0] ||
              err?.toString()?.match(/: (.*?)(?=\s*\()/)?.[1] ||
              "Unknown error")
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [contract, validateContract]
  );

  const productCheckIn = useCallback(
    async (
      productId: number,
      newStage: Stage,
      remark: string
    ): Promise<boolean> => {
      if (!validateContract()) return false;

      if (productId <= 0) {
        setError("Invalid product ID.");
        return false;
      }

      if (Object.values(Stage).includes(newStage) === false) {
        setError("Invalid stage selected.");
        return false;
      }

      const finalRemark = remark?.trim() || "Product checked in";

      setLoading(true);
      setError(null);

      try {
        const tx = await contract!.productCheckIn(
          productId,
          newStage,
          finalRemark
        );
        const receipt = await tx.wait();

        for (const log of receipt.logs) {
          if (log.transactionHash !== receipt.hash) continue;

          try {
            const parsedLog = contract?.interface.parseLog(log);
            if (parsedLog?.name === "ProductStageUpdated") {
              return true;
            }
          } catch (error) {
            setError("Failed to parse event log.");
          }
        }

        setError("ProductStageUpdated event not found in transaction receipt.");
        return false;
      } catch (err: any) {
        // console.log(err);
        setError(
          "Error during product check-in: " +
            (err?.reason ||
              err?.revert?.args?.[0] ||
              err?.toString()?.match(/: (.*?)(?=\s*\()/)?.[1] ||
              "Unknown error")
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [contract, validateContract]
  );

  const productStageUpdate = useCallback(
    async (
      productId: number,
      newStage: Stage,
      remark: string
    ): Promise<boolean> => {
      if (!validateContract()) return false;

      if (productId <= 0) {
        setError("Invalid product ID.");
        return false;
      }

      if (Object.values(Stage).includes(newStage) === false) {
        setError("Invalid stage selected.");
        return false;
      }

      if (!remark.trim() || remark.length < 5) {
        setError("Remark is required and must be meaningful.");
        return false;
      }

      setLoading(true);
      setError(null);

      try {
        const tx = await contract!.productStageUpdate(
          productId,
          newStage,
          remark
        );
        const receipt = await tx.wait();

        for (const log of receipt.logs) {
          if (log.transactionHash !== receipt.hash) continue;

          try {
            const parsedLog = contract?.interface.parseLog(log);
            if (parsedLog?.name === "ProductStageUpdated") {
              return true;
            }
          } catch (error) {
            setError("Failed to parse event log.");
          }
        }

        setError("ProductStageUpdated event not found in transaction receipt.");
        return false;
      } catch (err: any) {
        setError(
          "Error updating product Stage: " +
            (err?.reason ||
              err?.revert?.args?.[0] ||
              err?.toString()?.match(/: (.*?)(?=\s*\()/)?.[1] ||
              "Unknown error")
        );
        return false;
      } finally {
        setLoading(false);
      }
    },
    [contract, validateContract]
  );

  const getProductDetails = useCallback(
    async (
      productId: number
    ): Promise<{
      product: IProduct;
      batch: { name: string; description: string };
      stages: IStageDetails[];
    } | null> => {
      if (!readOnlyContract) {
        setError("ReadOnly contract not found.");
        return null;
      }

      if (productId <= 0) {
        setError("Invalid product ID.");
        return null;
      }
      setLoading(true);
      setError(null);

      try {
        const [product, batch, stages] =
          await readOnlyContract!.getProductDetails(productId);

        const formattedStages: IStageDetails[] = stages.map((stage: any) => ({
          user: {
            wallet: stage.user.wallet,
            name: stage.user.name,
            place: stage.user.place,
            role: Number(stage.user.role),
            status: Number(stage.user.status),
          },
          stage: Number(stage.stage),
          stageCount: Number(stage.stageCount),
          entryTime: new Date(Number(stage.entryTime) * 1000),
          exitTime: new Date(Number(stage.exitTime) * 1000),
          remark: stage.remark,
        }));

        return {
          product: {
            productId: Number(product.productId),
            name: product.name,
            batchNo: Number(product.batchNo),
            stage: Number(product.stage),
            productType: product.productType,
            description: product.description,
            manufacturedDate: new Date(Number(product.manufacturedDate) * 1000),
            expiryDate: new Date(Number(product.expiryDate) * 1000),
            price: Number(product.price),
          },
          batch: {
            name: batch.name,
            description: batch.description,
          },
          stages: formattedStages,
        };
      } catch (err: any) {
        setError(
          "Error fetching product details: " +
            (err?.reason ||
              err?.revert?.args?.[0] ||
              err?.toString()?.match(/: (.*?)(?=\s*\()/)?.[1] ||
              "Unknown error")
        );
        return null;
      } finally {
        setLoading(false);
      }
    },
    [readOnlyContract]
  );

  const getProductsByUser = useCallback(async (): Promise<
    IProduct[] | null
  > => {
    if (!validateContract()) return null;

    setLoading(true);
    setError(null);

    try {
      const products = await contract!.getProductsByUser();
      return products.map((p: any) => ({
        productId: Number(p.productId),
        name: p.name,
        batchNo: Number(p.batchNo),
        stage: Number(p.stage),
        productType: p.productType,
        description: p.description,
        manufacturedDate: new Date(Number(p.manufacturedDate) * 1000),
        expiryDate: new Date(Number(p.expiryDate) * 1000),
        price: Number(p.price),
      }));
    } catch (err: any) {
      setError(
        "Error fetching user products: " +
          (err?.reason ||
            err?.revert?.args?.[0] ||
            err?.toString()?.match(/: (.*?)(?=\s*\()/)?.[1] ||
            "Unknown error")
      );
      return null;
    } finally {
      setLoading(false);
    }
  }, [contract, validateContract]);

  return {
    addProduct,
    productCheckIn,
    productStageUpdate,
    getProductDetails,
    getProductsByUser,
    loading,
    error,
  };
}
