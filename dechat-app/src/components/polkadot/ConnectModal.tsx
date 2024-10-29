"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { useWalletProvider } from "../providers/WalletProvider";

const ConnectModal = () => {
  const [open, setOpen] = useState(false);
  const { wallets, connect, isConnected } = useWalletProvider();

  if (isConnected) {
    return null;
  }
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Connect Wallet</Button>
      </DialogTrigger>
      <DialogContent
        className="flex flex-col overflow-hidden max-w-md"
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
      >
        <DialogHeader>
          <DialogTitle>Connect Wallet</DialogTitle>
          <DialogDescription>
            Choose a provider to connect to Polkadot
          </DialogDescription>
        </DialogHeader>

        {wallets &&
          wallets.map((w) => (
            <Button
              onClick={async () => {
                connect?.(w);
                setOpen(false);
              }}
              key={w.metadata.id}
              variant={"outline"}
            >
              {w.metadata.title.toUpperCase()}
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default ConnectModal;
