import * as React from "react";
import { IconType } from "../types";

function Calendar(props: IconType) {
  return (
    <svg
      onClick={props.onClick ? props.onClick : undefined}
      version="1.1"
      id="Capa_1"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      width={props.width ? props.width : 20}
      height={props.height ? props.height : 20}
      viewBox="0 0 15.315 15.315"
      xmlSpace="preserve"
    >
      <g>
        <g>
          <path
            fill={props.color ? props.color : "var(--iconFill0)"}
            d="M3.669,3.71h0.696c0.256,0,0.464-0.165,0.464-0.367V0.367C4.829,0.164,4.621,0,4.365,0H3.669
			C3.414,0,3.206,0.164,3.206,0.367v2.976C3.205,3.545,3.413,3.71,3.669,3.71z"
          />
          <path
            fill={props.color ? props.color : "var(--iconFill0)"}
            d="M10.95,3.71h0.696c0.256,0,0.464-0.165,0.464-0.367V0.367C12.11,0.164,11.902,0,11.646,0H10.95
			c-0.256,0-0.463,0.164-0.463,0.367v2.976C10.487,3.545,10.694,3.71,10.95,3.71z"
          />
          <path
            fill={props.color ? props.color : "var(--iconFill0)"}
            d="M14.512,1.42h-1.846v2.278c0,0.509-0.458,0.923-1.021,0.923h-0.696
			c-0.563,0-1.021-0.414-1.021-0.923V1.42H5.384v2.278c0,0.509-0.458,0.923-1.021,0.923H3.669c-0.562,0-1.02-0.414-1.02-0.923V1.42
			H0.803c-0.307,0-0.557,0.25-0.557,0.557V14.76c0,0.307,0.25,0.555,0.557,0.555h13.709c0.308,0,0.557-0.248,0.557-0.555V1.977
			C15.069,1.67,14.82,1.42,14.512,1.42z M14.316,9.49v4.349c0,0.096-0.078,0.176-0.175,0.176H7.457H1.174
			c-0.097,0-0.175-0.08-0.175-0.176V10.31V5.961c0-0.096,0.078-0.176,0.175-0.176h6.683h6.284l0,0c0.097,0,0.175,0.08,0.175,0.176
			V9.49z"
          />
          <rect
            x="2.327"
            y="8.93"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.735"
            height="1.736"
          />
          <rect
            x="5.28"
            y="8.93"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.735"
            height="1.736"
          />
          <rect
            x="8.204"
            y="8.93"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.734"
            height="1.736"
          />
          <rect
            x="11.156"
            y="8.93"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.736"
            height="1.736"
          />
          <rect
            x="2.363"
            y="11.432"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.736"
            height="1.736"
          />
          <rect
            x="5.317"
            y="11.432"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.735"
            height="1.736"
          />
          <rect
            x="8.241"
            y="11.432"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.734"
            height="1.736"
          />
          <rect
            x="11.194"
            y="11.432"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.735"
            height="1.736"
          />
          <rect
            x="8.215"
            y="6.47"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.735"
            height="1.735"
          />
          <rect
            x="11.17"
            y="6.47"
            fill={props.color ? props.color : "var(--iconFill0)"}
            width="1.734"
            height="1.735"
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

export default Calendar;