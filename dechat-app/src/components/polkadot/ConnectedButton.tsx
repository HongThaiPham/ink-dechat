"use client";
import { CircleUser } from "lucide-react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import { useWalletProvider } from "../providers/WalletProvider";
import { shorten } from "@/lib/utils";
import { toast } from "react-toastify";
import { useEffect } from "react";

const ConnectedButton = () => {
  const {
    connectedAccounts,
    disconnect,
    isConnected,
    selectedAccount,
    setSelectedAccount,
    activeProvider,
  } = useWalletProvider();

  useEffect(() => {
    if (
      selectedAccount &&
      connectedAccounts
        .map((one) => one.address)
        .includes(selectedAccount.address)
    ) {
      return;
    }

    setSelectedAccount(connectedAccounts[0]);
  }, [connectedAccounts, selectedAccount, setSelectedAccount]);

  if (!isConnected || !selectedAccount) return null;

  const handleDisconnectWallet = () => {
    if (disconnect) disconnect();
  };

  const handleCopyAddress = () => {
    if (selectedAccount) {
      navigator.clipboard.writeText(selectedAccount.address);
      toast.success("Address copied to clipboard");
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="rounded-full" variant={"secondary"}>
          <CircleUser className="mr-2" />
          {selectedAccount
            ? shorten(connectedAccounts[0].address, 6)
            : "Connect Wallet"}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-48 max-w-fit">
        <DropdownMenuLabel className="font-semibold">
          {activeProvider?.metadata.title}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {connectedAccounts.map((account, index) => (
          <DropdownMenuItem
            key={index}
            onClick={() => setSelectedAccount(account)}
            className="cursor-pointer flex flex-col justify-start items-start"
          >
            <h2 className="font-semibold uppercase">{account.name}</h2>
            <span>{shorten(account.address, 6)}</span>
          </DropdownMenuItem>
        ))}
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleCopyAddress}
          className="cursor-pointer"
        >
          Copy address
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={handleDisconnectWallet}
          className="cursor-pointer"
        >
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ConnectedButton;
