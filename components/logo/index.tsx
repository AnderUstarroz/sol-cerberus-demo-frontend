import SolCerberusImg from "../../public/images/sol_cerberus.webp";
import styles from "./styles.module.scss";
import dynamic from "next/dynamic";
import Image from "next/image";

const Flame = dynamic(() => import("../flame"));
const Flame2 = dynamic(() => import("../flame2"));

export default function Logo() {
    return (
      <Flame2 active={true}>
        <Flame active={true}>
          <div className={styles.logo}>
            <Image src={SolCerberusImg} width={200} alt="Sol Cerberus" />
          </div>
        </Flame>
      </Flame2>
  )
}
