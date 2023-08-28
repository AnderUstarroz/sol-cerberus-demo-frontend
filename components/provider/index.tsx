import { WalletAdapterNetwork, WalletError } from "@solana/wallet-adapter-base";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  //   TorusWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { FC, ReactNode, useCallback, useMemo } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Notification } from "../notification";
import { SettingsProvider } from "./settings";
import { getClusterRPC } from "../utils/helpers";

const WalletContextProvider: FC<{
  cluster: WalletAdapterNetwork;
  children: ReactNode;
}> = ({ cluster, children }) => {
  const network = cluster;

  const wallets: any = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter(),
      new LedgerWalletAdapter(),
      new SolletWalletAdapter({ network }),
      new SolletExtensionWalletAdapter({ network }),
      // new TorusWalletAdapter(),
    ],
    [network]
  );

  const onError = useCallback(
    (error: WalletError) =>
      toast.custom((t) => (
        <Notification
          id={t.id}
          visible={t.visible}
          message={
            error.message ? `${error.name}: ${error.message}` : error.name
          }
          height={t.height}
          position={t.position}
          variant="error"
        />
      )),
    []
  );

  return (
    <ConnectionProvider endpoint={getClusterRPC(cluster)}>
      <WalletProvider wallets={wallets} onError={onError} autoConnect>
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

export const ContextProvider: FC<{
  cluster: WalletAdapterNetwork;
  children: ReactNode;
}> = ({ cluster, children }) => {
  return (
    <WalletContextProvider cluster={cluster}>
      <Toaster />
      <SettingsProvider>{children}</SettingsProvider>
    </WalletContextProvider>
  );
};
