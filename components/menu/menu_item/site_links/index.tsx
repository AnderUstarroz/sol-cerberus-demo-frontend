import dynamic from "next/dynamic";
import styles from "./SiteLinks.module.scss";
import Link from "next/link";
import { flashMsg } from "../../../utils/helpers";
import { motion } from "framer-motion";

const Button = dynamic(() => import("../../../button"));
const Icon = dynamic(() => import("../../../icon"));

export default function SiteLinks({
  toggle,
}: {
  toggle: () => void | undefined;
}) {
  return (
    <div className={styles.siteLinks}>
      <Button cType="transparent">
        <Link href="/" onClick={toggle} className={styles.logo}>
              <span>
                <Icon
                  cType="sol"
                  width={12}
                  height={12}
                  color="var(--color1)"
                />
              </span>
        </Link>
      </Button>
      <Button cType="transparent">
        <Link href="/" className={styles.siteName} title="Homepage" onClick={toggle}>
            La vida es asi
        </Link>
      </Button>
    </div>
  );
}
