"use client";
import { Account, BaseWallet } from "@polkadot-onboard/core";
import { useWallets } from "@polkadot-onboard/react";
import { useLocalStorage } from "usehooks-ts";
import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface WalletContextState {
  connect?: (w: BaseWallet) => void;
  disconnect?: () => void;
  reconnect?: () => void;
  isConnected?: boolean;
  activeProvider?: BaseWallet;
  connectedAccounts: Account[];
  wallets?: BaseWallet[];
  signer?: BaseWallet["signer"] | undefined;
  selectedAccount?: Account | undefined;
  setSelectedAccount: (account: Account) => void;
}

export const WalletContext = createContext<WalletContextState>({
  connectedAccounts: [],
  setSelectedAccount: () => {},
});

const WalletProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [selectedProvider, setSelectedProvider] = useLocalStorage(
    "PROVIDER",
    ""
  );
  const [selectedAccount, setSelectedAccount] = useLocalStorage<
    Account | undefined
  >("SELECTED_ACCOUNT", undefined);

  const { wallets } = useWallets();
  const [connectedAccounts, setConnectedAccounts] = useState<Account[]>([]);

  const connect = useCallback(
    async (w: BaseWallet) => {
      await w.connect();
      setSelectedProvider(w.metadata.id);
      const unsub = await w.subscribeAccounts((accounts) => {
        setConnectedAccounts(accounts);
      });

      return () => {
        return unsub();
      };
    },
    [setSelectedProvider]
  );

  const disconnect = async () => {
    const w = wallets?.find((w) => w.metadata.id === selectedProvider);
    if (w) {
      await w.disconnect();
      setSelectedProvider("");
      setConnectedAccounts([]);
    }
  };

  const isConnected = useMemo(() => {
    return connectedAccounts.length > 0;
  }, [connectedAccounts]);

  const activeProvider = useMemo(() => {
    return wallets?.find((w) => w.metadata.id === selectedProvider);
  }, [selectedProvider, wallets]);

  const reconnect = useCallback(async () => {
    if (selectedProvider != "") {
      if (!activeProvider) return;
      await connect(activeProvider);
    }
  }, [activeProvider, connect, selectedProvider]);

  const signer = useMemo(() => {
    if (!activeProvider) return undefined;
    return activeProvider.signer;
  }, [activeProvider]);

  useEffect(() => {
    reconnect();
  }, [reconnect, wallets]);

  return (
    <WalletContext.Provider
      value={{
        connect,
        disconnect,
        reconnect,
        isConnected,
        activeProvider,
        connectedAccounts,
        wallets,
        signer,
        setSelectedAccount,
        selectedAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export default WalletProvider;

export const useWalletProvider = () => useContext(WalletContext);
