import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import { ReactNode } from "react";

const Notification = dynamic(() => import("../notification"));

export function flashMsg(
  msg: string | ReactNode,
  variant: "error" | "info" | "success" = "error",
  duration: number = 5000
) {
  toast.custom(
    (t) => (
      <Notification
        id={t.id}
        visible={t.visible}
        message={msg}
        variant={variant}
        height={t.height}
        position={t.position}
      />
    ),
    {
      duration: duration,
    }
  );
}

export const DEFAULT_SELECT_STYLES = {
  control: (baseStyles: any, state: any) => ({
    ...baseStyles,
    backgroundColor: "#0e0d0c",
    boxShadow: "none",
    borderColor: "rgba(255, 255, 255, 0.06)",
    ":hover": {
      ...baseStyles[":hover"],
      borderColor: "#e3be59",
    },
  }),
  singleValue: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: "#8c8494",
  }),
  menu: (baseStyles: any, state: any) => ({
    ...baseStyles,
    color: "#8c8494",
    backgroundColor: "#0e0d0c",
  }),
  option: (baseStyles: any, state: any) => {
    return {
      ...baseStyles,
      color: "#8c8494",
      backgroundColor: "#0e0d0c",
      ":hover": {
        ...baseStyles[":hover"],
        backgroundColor: state.isFocused
          ? "rgb(137, 137, 137, 0.3)"
          : "#0e0d0c",
      },
      ":active": {
        ...baseStyles[":active"],
        backgroundColor: state.isSelected
          ? "rgb(137, 137, 137, 0.3)"
          : "#0e0d0c",
      },
    };
  },
};
