"use client";
import React, { PropsWithChildren, useMemo } from "react";
import { useDedot } from "./DedotProvider";
import { Contract, ContractMetadata } from "dedot/contracts";
import { DechatContractApi } from "@/lib/dechat";
import dechatMetadata from "@/artifacts/dechat.json" assert { type: "json" };

const ContractContext = React.createContext<{
  dechat: Contract<DechatContractApi> | undefined;
}>({
  dechat: undefined,
});

const ContractProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const { client } = useDedot();
  const contract = useMemo(() => {
    if (!client) return undefined;
    return new Contract<DechatContractApi>(
      client,
      dechatMetadata as ContractMetadata,
      process.env.NEXT_PUBLIC_CONTRACT_ADDRESSS as string
    );
  }, [client]);
  return (
    <ContractContext.Provider value={{ dechat: contract }}>
      {children}
    </ContractContext.Provider>
  );
};

export default ContractProvider;
