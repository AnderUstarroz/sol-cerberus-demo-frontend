import { motion } from "framer-motion";
import styles from "./Network.module.scss";
import dynamic from "next/dynamic";
import { capitalize } from "../utils/strings";
import { clusters } from "../utils/helpers";
import { Tooltip } from "react-tooltip";

const Icon = dynamic(() => import("../icon"));
const Select = dynamic(() => import("../select"));

export default function Network({ cluster, setCluster, router }) {
  return (
    <motion.div
      className={styles.network}
      data-tooltip-id="cluster-tooltip"
      data-tooltip-html={
        "Demo only available on Devnet.<br />Update your wallet's settings<br />to match this network."
      }
      data-tooltip-place="bottom"
    >
      <Icon cType="antennae" />
      <Select
        options={clusters
          .filter((c) => c === "devnet")
          .map((c) => ({
            value: c,
            label: capitalize(c),
          }))}
        value={{
          value: cluster,
          label: capitalize(cluster),
        }}
        styles={{
          control: (baseStyles: any, state: any) => ({
            ...baseStyles,
            backgroundColor: "transparent",
            cursor: "pointer",
            boxShadow: "none",
            borderColor: "transparent",
            ":hover": {
              ...baseStyles[":hover"],
              borderColor: "transparent",
            },
          }),
          valueContainer: (baseStyles: any, state: any) => ({
            ...baseStyles,
            padding: "2px 0px 2px 5px",
          }),
          singleValue: (baseStyles: any, state: any) => ({
            ...baseStyles,
            color: "white",
          }),
          menu: (baseStyles: any, state: any) => ({
            ...baseStyles,
            color: "#8c8494",
            backgroundColor: "#0e0d0c",
          }),
          option: (baseStyles: any, state: any) => ({
            ...baseStyles,
            color: "#8c8494",
            backgroundColor: "#0e0d0c",
            ":hover": {
              ...baseStyles[":hover"],
              color: "white",
              cursor: "pointer",
            },
            ":active": {
              ...baseStyles[":active"],
              backgroundColor: state.isSelected
                ? "rgb(137, 137, 137, 0.3)"
                : "#0e0d0c",
            },
          }),
          dropdownIndicator: (baseStyles: any, state: any) => ({
            ...baseStyles,
            color: "white",
            padding: "8px 0",
          }),
        }}
        components={{
          IndicatorSeparator: () => null,
        }}
        onChange={(option: any, _) => {
          if (cluster !== option.value) {
            setCluster(option.value);
          }
        }}
      />
      <Tooltip id="cluster-tooltip" />
    </motion.div>
  );
}
