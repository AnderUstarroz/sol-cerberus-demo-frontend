import styles from "./styles.module.scss";
import { AnimatePresence, motion } from "framer-motion";
import { DEFAULT_ANIMATION } from "../utils/animation";
import dynamic from "next/dynamic";
import { InitializeDemoPropsType } from "./types";
import { useEffect, useState } from "react";
import { shortKey } from "sol-cerberus-js";
import { myAppId } from "../utils/sol-cerberus-demo";
import { PublicKey } from "@solana/web3.js";

const Button = dynamic(() => import("../button"));
const Logo = dynamic(() => import("../../components/logo"));

export default function InitializeDemo({
  initialize,
}: InitializeDemoPropsType) {
  const [appPubkey, setAppPubkey] = useState(null);

  useEffect(() => {
    setAppPubkey(sessionStorage.getItem("DefaultSolCerberusAPP"));
  }, []);

  return (
    <motion.div
      className={`vhAligned ${styles.initialize}`}
      {...DEFAULT_ANIMATION}
    >
      <div>
        <Logo />
        <h1>Sol Cerberus Demo</h1>
        <p>Learn how easy is to enhance security in your Solana programs</p>
        <AnimatePresence>
          {appPubkey ? (
            <Button className="button1">
              <a href={`/?id=${myAppId(new PublicKey(appPubkey))}`}>
                {shortKey(appPubkey)} Demo
              </a>
            </Button>
          ) : (
            <Button className="button1" onClick={() => initialize()}>
              Initialize Demo
            </Button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
