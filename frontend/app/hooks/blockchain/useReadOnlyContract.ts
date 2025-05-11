import { useMemo } from "react";
import { Contract } from "ethers";
import { ethers } from "ethers";
import { useContract } from "./useContract";
import supplyChainABI from "../../../contracts/SupplyChain.json";
import contractAddress from "../../../contracts/contract-address.json";

export function useReadOnlyContract(): Contract | null {

  const rpcURL = process.env.NEXT_PUBLIC_RPC_URL;

  const provider = useMemo(() => {
    if (!rpcURL) {
      return null;
    }
    return new ethers.JsonRpcProvider(rpcURL);
  }, [rpcURL]);

  const contract = useContract<Contract>(
    contractAddress.SupplyChain,
    supplyChainABI.abi,
    provider
  );
  return contract;
}
