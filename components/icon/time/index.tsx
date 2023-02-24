import * as React from "react";
import { IconType } from "../types";
function Info(props: IconType) {
  return (
    <svg
      version="1.1"
      id="Capa_1"
      x="0px"
      y="0px"
      viewBox="0 0 705.299 705.299"
      xmlSpace="preserve"
      width={props.width ? props.width : 14}
      height={props.height ? props.height : 14}
      className={props.className ? props.className : ""}
      onClick={props.onClick ? props.onClick : undefined}
    >
      <g>
        <g>
          <path
            d="M395.233,117.99V91.598l64.906,0.023v-5.55C460.151,38.549,421.636,0,374.08,0h-62.632
			c-47.511,0-86.06,38.549-86.06,86.071v5.515l66.343,0.023v26.163C152.565,141.993,46.651,263.051,46.651,409.157
			c0,163.594,132.571,296.142,296.107,296.142c163.537,0,296.107-132.548,296.107-296.142
			C638.876,263.557,533.698,142.786,395.233,117.99z M342.758,637.52c-125.907,0-228.339-102.433-228.339-228.362
			c0-125.896,102.433-228.305,228.339-228.305c125.895,0,228.339,102.41,228.339,228.305
			C571.097,535.087,468.665,637.52,342.758,637.52z"
            fill={props.color ? props.color : "var(--iconFill0)"}
          />
          <path
            d="M651.987,153.333l-48.017-48.028c-4.274-4.286-10.065-6.688-16.098-6.688s-11.823,2.401-16.097,6.665l-38.929,38.939
			l80.246,80.2l38.894-38.917C660.869,176.612,660.869,162.227,651.987,153.333z"
            fill={props.color ? props.color : "var(--iconFill0)"}
          />
          <path
            d="M341.724,195.237c-117.714,0.54-212.966,96.125-212.966,213.92c0,118.231,95.815,214.022,214.012,214.022
			c118.185,0,213.989-95.769,214-214H341.724V195.237z"
            fill={props.color ? props.color : "var(--iconFill0)"}
          />
        </g>
      </g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
      <g></g>
    </svg>
  );
}

export default Info;
