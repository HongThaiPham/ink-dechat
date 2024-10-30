"use client";
import React, { PropsWithChildren } from "react";
import { PolkadotWalletsContextProvider } from "@polkadot-onboard/react";
import { InjectedWalletProvider } from "@polkadot-onboard/injected-wallets";
import { WalletAggregator } from "@polkadot-onboard/core";
import { ThemeProvider } from "./ThemeProvider";
import { SiteHeader } from "../layout/SiteHeader";
import WalletProvider from "./WalletProvider";
import SiteFooter from "../layout/SiteFooter";
import DedotProvider from "./DedotProvider";
import ContractProvider from "./ContractProvider";
import { Toaster } from "../ui/sonner";
const APP_NAME = "DeChat";
const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const walletAggregator = new WalletAggregator([
    new InjectedWalletProvider({}, APP_NAME),
  ]);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <DedotProvider>
        <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
          <WalletProvider>
            <ContractProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
            </ContractProvider>
          </WalletProvider>
        </PolkadotWalletsContextProvider>
      </DedotProvider>
      <Toaster />
    </ThemeProvider>
  );
};

export default AppProvider;
