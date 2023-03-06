// import { scrollToElement } from "../../utils/navigation";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { HomeMenuType } from "./types";
import Link from "next/link";
import { useRouter } from "next/router";

const SiteLinks = dynamic(() => import("../menu_item/site_links"));
const Button = dynamic(() => import("../../button"));
const MenuItem = dynamic(() => import("../menu_item"));

export default function HomeMenu({ toggle }: HomeMenuType) {
  const router = useRouter();

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
          <Button cType="transparent">
            <Link
              href="https://docs.solcerberus.com"
              title="Documentation"
              onClick={toggle}
            >
              Docs
            </Link>
          </Button>
          <Button cType="transparent">
            <Link
              href={`/${router.query.id ? `?id=${router.query.id}` : ""}`}
              title="Sol Cerberus demo"
              onClick={toggle}
            >
              Demo
            </Link>
          </Button>
        </div>
      </MenuItem>

      {/* <MenuItem whileTap={{}} whileHover={{}}>
        <div className="vAligned gap5">
          <Button cType="transparent" style={{ paddingBottom: 4 }}>
            <Link
              title="Visit Website"
              href={"/"}
              target="_blank"
              onClick={toggle}
            >
              <Icon cType="web" height={size} width={size} />
            </Link>
          </Button>
        </div>
      </MenuItem> */}
      <MenuItem whileTap={{}} whileHover={{}}>
        <Button cType="wallet" className="btnRadius2" />
      </MenuItem>
    </motion.ul>
  );
}
