import ReactSelect, { GroupBase, OptionsOrGroups } from "react-select";
import { GroupedOptionsType, OptionType } from "./types";

export const getValue = (
  options: OptionsOrGroups<any, GroupBase<ReactSelect>>,
  value: string
): any => {
  for (let option of options) {
    if (option.hasOwnProperty("options")) {
      for (let opt of (option as GroupedOptionsType).options) {
        if (value === opt.value) {
          return opt;
        }
      }
      return option;
    } else if (value === (option as OptionType).value) {
      return option;
    }
  }
  return null;
};

export const DEFAULT_STYLES = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    backgroundColor: "#0e0d0c",
    borderColor: "rgba(255, 255, 255, 0.06)",
    borderRadius: 0,
    boxShadow: "unset",
    fontSize: "14px",
    paddingTop: "5px",
    paddingBottom: "5px",
    paddingLeft: "10px",
    ":hover": {
      ...baseStyles[":hover"],
      borderColor: "inherit",
    },
  }),
  singleValue: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: "var(--textColor2)",
  }),
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: "var(--textColor2)",
    backgroundColor: "#0e0d0c",
  }),
  menuList: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: "var(--textColor2)",
    borderLeft: "1px solid rgba(255, 255, 255, 0.06)",
  }),
  indicatorSeparator: (baseStyles: any, state: any) => ({
    ...baseStyles,
    width: 0,
  }),
  dropdownIndicator: (baseStyles: any, state: any) => ({
    ...baseStyles,
    transition: "transform 0.5s",
    transform: `rotate(${state.isFocused ? "0deg" : "-90deg"})`,
    ":active": {
      transform: "rotate(0deg)",
    },
  }),
  option: (baseStyles: any, state: any) => {
    return {
      ...baseStyles,
      color: state.isSelected ? "var(--textColor2)" : "var(--textColor2)",
      backgroundColor: "#f8ebe3",
      ":hover": {
        ...baseStyles[":hover"],
        backgroundColor: state.isFocused ? "#e3be59" : "#e3be59",
        color: "white",
        cursor: "pointer",
      },
      ":active": {
        ...baseStyles[":active"],
        backgroundColor: state.isSelected ? "#d8bbaa" : "#d8bbaa",
        color: "white",
      },
    };
  },
};
