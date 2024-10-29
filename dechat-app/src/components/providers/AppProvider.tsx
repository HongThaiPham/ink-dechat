"use client";
import React, { PropsWithChildren } from "react";
import { PolkadotWalletsContextProvider } from "@polkadot-onboard/react";
import { InjectedWalletProvider } from "@polkadot-onboard/injected-wallets";
import { WalletAggregator } from "@polkadot-onboard/core";
import { ThemeProvider } from "./ThemeProvider";
import { SiteHeader } from "../layout/SiteHeader";
import WalletProvider from "./WalletProvider";
import SiteFooter from "../layout/SiteFooter";
const APP_NAME = "Polakdot Dapp Template";
const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const walletAggregator = new WalletAggregator([
    new InjectedWalletProvider({}, APP_NAME),
  ]);
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
        <WalletProvider>
          <div className="relative flex min-h-screen flex-col">
            <SiteHeader />
            <div className="flex-1">{children}</div>
            <SiteFooter />
          </div>
        </WalletProvider>
      </PolkadotWalletsContextProvider>
    </ThemeProvider>
  );
};

export default AppProvider;
