import styles from "./styles.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { DEFAULT_ANIMATION } from "../utils/animation";
import PhantomStep1 from "../../public/images/phantom/phantom-step1.webp";
import PhantomStep2 from "../../public/images/phantom/phantom-step2.webp";
import PhantomStep3 from "../../public/images/phantom/phantom-step3.webp";
import dynamic from "next/dynamic";
import Image from "next/image";

const Button = dynamic(() => import("../../components/button"));
const Logo = dynamic(() => import("../../components/logo"));
const Icon = dynamic(() => import("../../components/icon"));

export default function ConnectWallet({ setMainModalContent }) {
  return (
    <AnimatePresence>
      <motion.div
        className={`vhAligned ${styles.connectWallet}`}
        {...DEFAULT_ANIMATION}
      >
        <div>
          <Logo />
          <h1>Sol Cerberus Demo</h1>
          <p>
            Connect your wallet to{" "}
            <span>
              <Button
                className="aligned gap5"
                cType="transparent"
                onClick={() =>
                  setMainModalContent(
                    <>
                      <span className="infoIco">
                        <Icon cType="info" width={26} height={26} />
                      </span>
                      <h3>Connect to Devnet network</h3>
                      <p className="mb-big">
                        If you use a Phantom wallet, please follow these steps
                        to connect to Devnet network.
                      </p>
                      <ul className="sqList">
                        <li>
                          <p className="mb-med">
                            Click on the Phantom wallet icon
                          </p>
                          <div className="txtCenter">
                            <Image
                              src={PhantomStep1}
                              alt="Click on Phantom icon"
                            />
                          </div>
                        </li>
                        <li>
                          <p className="mb-med">Click on settings button</p>
                          <div className="txtCenter">
                            <Image
                              src={PhantomStep2}
                              alt="Click on settings button"
                            />
                          </div>
                        </li>
                        <li>
                          <p className="mb-med">
                            Click on <strong>Developer Settings</strong>
                          </p>
                        </li>
                        <li>
                          <p className="mb-med">Activate Devnet</p>
                          <div
                            style={{
                              position: "relative",
                              height: 150,
                            }}
                          >
                            <Image
                              fill
                              src={PhantomStep3}
                              style={{
                                objectFit: "contain",
                              }}
                              alt="Activate Devnet"
                            />
                          </div>
                        </li>
                      </ul>
                    </>
                  )
                }
              >
                devnet network <Icon cType="info" />
              </Button>
            </span>
          </p>
          <Button cType="wallet" />
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
