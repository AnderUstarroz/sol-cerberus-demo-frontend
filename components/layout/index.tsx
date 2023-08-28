import { useWallet } from "@solana/wallet-adapter-react";
import styles from "./Layout.module.scss";
import Headroom from "react-headroom";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { LayoutPropsType } from "./types";

const MobileNav = dynamic(() => import("../mobile_nav"));
const Nav = dynamic(() => import("../nav"));
const Network = dynamic(() => import("../network"), {
  ssr: false,
});

export default function Layout({
  cluster,
  setCluster,
  router,
  children,
}: LayoutPropsType) {
  const { publicKey } = useWallet();
  const [showLayout, setShowLayout] = useState(true);

  // Hide layout when wallet not connected
  useEffect(() => {
    if (!publicKey) {
      if (showLayout) {
        setShowLayout(false);
      }
    } else {
      if (!showLayout) {
        setShowLayout(true);
      }
    }
  }, [publicKey, router]);

  return (
    <>
      {!!showLayout && (
        <Headroom className={styles.HeadRoom}>
          <motion.header>
            <Nav />
            <Network
              cluster={cluster}
              setCluster={setCluster}
              router={router}
            />
            <MobileNav />
          </motion.header>
        </Headroom>
      )}
      <main>{children}</main>
    </>
  );
}
