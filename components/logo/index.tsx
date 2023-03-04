import SolCerberusImg from "../../public/images/sol_cerberus.webp";
import styles from "./styles.module.scss";
import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useAnimationControls } from "framer-motion";

const Flame = dynamic(() => import("../flame"));
const Flame2 = dynamic(() => import("../flame2"));

export default function Logo() {
  const controls = useAnimationControls();

  const handleImageLoad = () => {
    controls.start({
      opacity: 1,
      scale: 1,
      rotate: 720,
      transition: { duration: 0.6 },
    });
  };

  return (
    <div className={styles.container}>
      <motion.div animate={controls} initial={{ opacity: 0, scale: 0.1 }}>
        <Flame2 active={true}>
          <Flame active={true}>
            <div className={styles.logo}>
              <Image
                src={SolCerberusImg}
                width={200}
                onLoadingComplete={() => handleImageLoad()}
                alt="Sol Cerberus"
              />
            </div>
          </Flame>
        </Flame2>
      </motion.div>
    </div>
  );
}
