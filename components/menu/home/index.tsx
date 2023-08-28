// import { scrollToElement } from "../../utils/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HomeMenuType } from "./types";
import Link from "next/link";

const SiteLinks = dynamic(() => import("../menu_item/site_links"));
const Button = dynamic(() => import("../../button"));
const MenuItem = dynamic(() => import("../menu_item"));

export default function HomeMenu({ toggle }: HomeMenuType) {
  // const ScrollSection = (section: string) => {
  //   if (toggle) {
  //     toggle();
  //   }
  //   scrollToElement(section);
  // };

  return (
    <motion.ul
      variants={{
        open: {
          transition: { staggerChildren: 0.07, delayChildren: 0.2 },
        },
        closed: {
          transition: { staggerChildren: 0.05, staggerDirection: -1 },
        },
      }}
    >
      <MenuItem className="leftItems" whileHover={{}} whileTap={{}}>
        <div>
          <SiteLinks toggle={toggle} />
        </div>
      </MenuItem>

      <MenuItem whileTap={{}} whileHover={{}}>
        <Button cType="transparent">
          <Link
            href="https://solcerberus.com/app"
            title="SC Manager"
            onClick={toggle}
          >
            SC Manager
          </Link>
        </Button>
      </MenuItem>
      <MenuItem whileTap={{}} whileHover={{}}>
        <Button cType="transparent">
          <Link
            href="https://docs.solcerberus.com/"
            title="Documentation"
            onClick={toggle}
          >
            Docs
          </Link>
        </Button>
      </MenuItem>
      <MenuItem whileTap={{}} whileHover={{}}>
        <Button cType="transparent">
          <Link
            href="https://demo.solcerberus.com/"
            title="Sol Cerberus demo"
            onClick={toggle}
          >
            Demo
          </Link>
        </Button>
      </MenuItem>
      <MenuItem whileTap={{}} whileHover={{}}>
        <Button cType="wallet" className="btnRadius2" />
      </MenuItem>
    </motion.ul>
  );
}
