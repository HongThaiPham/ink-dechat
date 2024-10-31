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
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const APP_NAME = "DeChat";
const queryClient = new QueryClient();
const AppProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const walletAggregator = new WalletAggregator([
    new InjectedWalletProvider({}, APP_NAME),
  ]);
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <DedotProvider>
          <PolkadotWalletsContextProvider walletAggregator={walletAggregator}>
            <WalletProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <div className="flex-1">{children}</div>
                <SiteFooter />
              </div>
            </WalletProvider>
          </PolkadotWalletsContextProvider>
        </DedotProvider>
        <ToastContainer />
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default AppProvider;
