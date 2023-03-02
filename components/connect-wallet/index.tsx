import styles from "./styles.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_ANIMATION } from "../utils/animation";
import dynamic from "next/dynamic";

const Button = dynamic(() => import("../../components/button"));

export default function ConnectWallet() {
  return (
    <AnimatePresence>
      <motion.div
        className={`vhAligned ${styles.connectWallet}`}
        {...DEFAULT_ANIMATION}
      >
        <div>
          <h1>Sol Cerberus Demo</h1>
          <p>Connect your wallet to devnet network to start testing</p>
          <Button cType="wallet" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
