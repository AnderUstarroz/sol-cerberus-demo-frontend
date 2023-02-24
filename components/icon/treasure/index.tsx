import * as React from "react"
import { IconType } from "../types"

export default function Treasure(props: IconType) {
  return (
    <svg
      version="1.1"
      id="Layer_1"
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      viewBox="0 0 48 48"
      enableBackground="new 0 0 48 48"
      width={props.width ? props.width : 50}
      height={props.height ? props.height : 50}
    >
      <polygon fill="#4E342E" points="6,25 9,18 6,13 42,13 39,18 42,25 " />
      <path
        fill="#795548"
        d="M42,42H6V25h36V42z M42,13c0,0-0.125-7-5-7S15.813,6,11,6c-5,0-5,7-5,7H42z"
      />
      <path fill="#5D4037" d="M42,32H6v-2h36V32z M42,36H6v2h36V36z" />
      <path
        fill="#FFAB00"
        d="M28,25v4c0,2.2-1.8,4-4,4s-4-1.8-4-4v-4H28z M6,42h6c0-3.313-2.686-6-6-6V42z M42,36c-3.314,0-6,2.687-6,6h6
   V36z M24,9c-2.2,0-4,1.8-4,4h8C28,10.8,26.2,9,24,9z"
      />
      <polygon fill="#212121" points="9,18 6,13 42,13 39,18 " />
      <path
        fill="#FFC400"
        d="M38,25c0-1.657-1.343-3-3-3c0-1.657-1.343-3-3-3c-0.473,0-0.914,0.119-1.312,0.314
   C30.265,18.535,29.449,18,28.5,18c-0.488,0-0.941,0.146-1.326,0.388C26.844,18.146,26.44,18,26,18c-0.375,0-0.721,0.109-1.021,0.289
   C24.87,17.009,23.808,16,22.5,16c-1.231,0-2.249,0.892-2.456,2.063C19.868,18.024,19.687,18,19.5,18
   c-1.308,0-2.37,1.009-2.479,2.289C16.721,20.109,16.375,20,16,20c-1.105,0-2,0.896-2,2c0,0.018,0.005,0.034,0.005,0.051
   C13.842,22.018,13.673,22,13.5,22c-1.381,0-2.5,1.119-2.5,2.5c0,0.171,0.018,0.338,0.05,0.5H38z"
      />
      <path
        fill="#FFE57F"
        d="M37.942,24.424c-0.026-0.134-0.071-0.26-0.114-0.386c-0.016-0.045-0.025-0.093-0.043-0.138
   c-0.065-0.165-0.146-0.319-0.238-0.468c-0.001-0.001-0.002-0.003-0.002-0.004C37.016,22.574,36.078,22,35,22
   c-0.786,0-1.496,0.309-2.031,0.804C32.989,22.706,33,22.604,33,22.5c0-0.829-0.672-1.5-1.5-1.5c-0.756,0-1.375,0.562-1.479,1.289
   C29.721,22.109,29.375,22,29,22c-0.16,0-0.313,0.023-0.463,0.059C28.085,21.42,27.343,21,26.5,21c-0.59,0-1.126,0.213-1.554,0.556
   C24.744,20.666,23.951,20,23,20c-0.873,0-1.608,0.563-1.88,1.343C20.8,21.126,20.415,21,20,21c-0.873,0-1.608,0.563-1.88,1.343
   C17.8,22.126,17.415,22,17,22c-0.676,0-1.272,0.338-1.634,0.852C14.908,22.333,14.246,22,13.5,22c-0.815,0-1.532,0.396-1.989,1h0
   c0,0,0,0,0,0c-0.068,0.09-0.128,0.186-0.183,0.285c-0.017,0.03-0.034,0.061-0.05,0.092c-0.043,0.085-0.082,0.171-0.116,0.262
   c-0.025,0.065-0.043,0.133-0.062,0.201c-0.019,0.068-0.04,0.135-0.053,0.206C11.018,24.193,11,24.344,11,24.5
   c0,0.171,0.018,0.338,0.05,0.5h7.672h5.789h6.211H32h6C38,24.802,37.979,24.61,37.942,24.424z"
      />
      <path
        fill="#FF1744"
        d="M22,21l-1,2l-2-1l1-2L22,21z M30,20l-2,1l1,2l2-1L30,20z"
      />
      <path
        fill="#3E2723"
        d="M24,31L24,31c-0.55,0-1-0.45-1-1v-1c0-0.55,0.45-1,1-1h0c0.55,0,1,0.45,1,1v1C25,30.55,24.55,31,24,31z"
      />
    </svg>
  )
}
