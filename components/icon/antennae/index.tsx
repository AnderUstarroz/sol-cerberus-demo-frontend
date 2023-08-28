import * as React from "react";
import { IconType } from "../types";
import styles from "./Antennae.module.scss";

export default function Antennae({
  width,
  height,
  className,
  color,
  ...props
}: IconType) {
  return (
    <span className={styles.icon}>
      <svg
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 256 256"
        enableBackground="new 0 0 256 256"
        xmlSpace="preserve"
        width={width ? width : 14}
        height={height ? height : 14}
        className={`${className ? className : ""}`}
        {...props}
      >
        <g>
          <g>
            <g>
              <path
                fill={color ? color : "var(--iconFill0)"}
                d="M167.4,235.5v15.7H88.6v-15.7c0-8.7,7-15.7,15.7-15.7h15.7V116c-9.2-3.3-15.7-11.9-15.7-22.2c0-13,10.6-23.6,23.6-23.6c13,0,23.6,10.6,23.6,23.6c0,10.3-6.6,18.9-15.7,22.2v103.8h15.7C160.3,219.8,167.4,226.8,167.4,235.5z"
              />
            </g>
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
            <g />
          </g>
        </g>
      </svg>
      <span className="signal"></span>
    </span>
  );
}
