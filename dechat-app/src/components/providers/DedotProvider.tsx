"use client";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { DedotClient, WsProvider } from "dedot";
import { toast } from "react-toastify";

const DedotContext = createContext<{
  client: DedotClient | undefined;
}>({
  client: undefined,
});

const DedotProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [dedotClient, setDedotClient] = useState<DedotClient | undefined>(
    undefined
  );
  const initClient = useCallback(async () => {
    if (!dedotClient) {
      const wsProvider = new WsProvider(
        process.env.NEXT_PUBLIC_RPC_ENDPOINT as string
      );
      const client = await DedotClient.new(wsProvider);
      // await client.connect();
      console.log("Connected to dedot", client);
      setDedotClient(client);
    }
  }, [dedotClient]);

  useEffect(() => {
    toast.promise(initClient(), {
      pending: "Initializing client",
      success: "Initialized client",
      error: "Failed to initialize client",
    });
  }, [initClient]);
  return (
    <DedotContext.Provider
      value={{
        client: dedotClient,
      }}
    >
      {children}
    </DedotContext.Provider>
  );
};

export default DedotProvider;

export const useDedot = () => useContext(DedotContext);
