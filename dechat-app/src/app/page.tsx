"use client";

import useDechatContract from "@/hooks/useContract";

export default function Home() {
  const contract = useDechatContract();
  console.log({ contract });
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
