"use client";
import { useDedot } from "@/components/providers/DedotProvider";
import { Contract, ContractMetadata } from "dedot/contracts";
import { useMemo } from "react";
import { DechatContractApi } from "@/lib/dechat";
import dechatMetadata from "@/artifacts/dechat.json" assert { type: "json" };
import { useMutation } from "@tanstack/react-query";
import { useWalletProvider } from "@/components/providers/WalletProvider";

const useDechatContract = () => {
  const { client } = useDedot();
  const { signer, selectedAccount } = useWalletProvider();
  const contract = useMemo(() => {
    if (!client) return undefined;
    return new Contract<DechatContractApi>(
      client,
      dechatMetadata as ContractMetadata,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESSS as string
    );
  }, [client]);

  const useCreateRoom = (name: string) =>
    useMutation({
      mutationKey: ["create-room", name],
      mutationFn: async () => {
        if (!contract || !selectedAccount) return;
        const { raw } = await contract.query.createRoom(name, {
          caller: selectedAccount.address,
        });
        return contract.tx.createRoom(name, {
          gasLimit: raw.gasRequired,
        });
      },
    });
  return { contract, useCreateRoom };
};

export default useDechatContract;
