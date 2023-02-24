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
