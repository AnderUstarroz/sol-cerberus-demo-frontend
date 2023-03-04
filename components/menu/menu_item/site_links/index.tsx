import SolCerberusLogo from "../../../../public/images/logo.webp";
import dynamic from "next/dynamic";
import styles from "./SiteLinks.module.scss";
import Link from "next/link";
import Image from "next/image";

const Button = dynamic(() => import("../../../button"));

export default function SiteLinks({
  toggle,
}: {
  toggle: () => void | undefined;
}) {
  return (
    <div className={styles.siteLinks}>
      <Button cType="transparent">
        <Link
          href="https://solcerberus.com"
          onClick={toggle}
          className={styles.logo}
        >
          <Image src={SolCerberusLogo} fill alt="Sol Cerberus" />
        </Link>
      </Button>
      <Button cType="transparent">
        <Link
          href="https://solcerberus.com"
          className={styles.siteName}
          title="Homepage"
          onClick={toggle}
        >
          Sol Cerberus
        </Link>
      </Button>
    </div>
  );
}
