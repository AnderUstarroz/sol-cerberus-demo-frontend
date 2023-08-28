import React from "react";
import ReactSelect from "react-select";
import { motion } from "framer-motion";
import { SelectPropsType } from "./types";
import { DEFAULT_STYLES, getValue } from "./settings";

const Select: React.FC<SelectPropsType> = ({
  value,
  styles,
  options,
  label,
  ...props
}) => {
  return (
    <motion.label className={props.className ? props.className : props.name}>
      <ReactSelect
        options={options}
        value={typeof value === "string" ? getValue(options, value) : value}
        styles={styles ? styles : DEFAULT_STYLES}
        {...props}
      />
      {!!label && <span>{label}</span>}
    </motion.label>
  );
};

export default Select;
