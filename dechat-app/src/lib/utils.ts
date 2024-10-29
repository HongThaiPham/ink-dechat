import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const shorten = (str: string, size = 10) => {
  let result = str;
  if (str && str.length > 2 * size) {
    const start = str.slice(0, size);
    const end = str.slice(-size);
    result = `${start}...${end}`;
  }
  return result;
};

/**
 * Format on=chain balance
 *
 * @param balance
 * @param decimal
 */
export const formatBalance = (
  balance: bigint,
  decimal: number = 12
): string => {
  return (parseFloat(balance.toString()) / Math.pow(10, decimal)).toString();
};

export const truncateHash = (
  hash: string | undefined,
  paddingLength = 6
): string | undefined => {
  if (!hash?.length) return undefined;
  if (hash.length <= paddingLength * 2 + 1) return hash;
  return hash.replace(
    hash.substring(paddingLength, hash.length - paddingLength),
    "…"
  );
};
