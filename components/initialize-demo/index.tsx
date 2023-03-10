import styles from "./styles.module.scss";
import { motion } from "framer-motion";
import { DEFAULT_ANIMATION } from "../utils/animation";
import dynamic from "next/dynamic";
import { InitializeDemoPropsType } from "./types";

const Button = dynamic(() => import("../button"));
const Logo = dynamic(() => import("../../components/logo"));

export default function InitializeDemo({
  initialize,
}: InitializeDemoPropsType) {
  return (
    <motion.div
      className={`vhAligned ${styles.initialize}`}
      {...DEFAULT_ANIMATION}
    >
      <div>
        <Logo />
        <h1>Sol Cerberus Demo</h1>
        <p>Learn how easy is to enhance security in your Solana programs</p>
        <Button className="button1" onClick={() => initialize()}>
          Initialize Demo
        </Button>
      </div>
    </motion.div>
  );
}
