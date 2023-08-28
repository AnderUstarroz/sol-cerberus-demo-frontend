import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { Router } from "next/router";
import { ReactNode } from "react";

export interface LayoutPropsType {
  cluster: WalletAdapterNetwork;
  setCluster: Function;
  router: Router;
  children: ReactNode;
}
