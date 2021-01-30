import * as React from "react"
import Svg, { SvgProps, Path } from "react-native-svg"

function SvgComponent(props: SvgProps) {
  return (
    <Svg
      width={451}
      height={439}
      viewBox="0 0 451 439"
      fill="none"
      
      {...props}
    >
      <Path d="M143.673 344.322C117.704 344.322 96.653 365.374 96.653 391.342C96.653 417.311 117.705 438.362 143.673 438.362C169.642 438.362 190.693 417.31 190.693 391.342C190.694 365.374 169.642 344.322 143.673 344.322ZM143.673 417.465C129.246 417.465 117.551 405.77 117.551 391.343C117.551 376.916 129.246 365.221 143.673 365.221C158.1 365.221 169.795 376.916 169.795 391.343C169.796 405.77 158.1 417.465 143.673 417.465Z" fill="red"/>
      <Path d="M342.204 344.322C316.235 344.322 295.184 365.374 295.184 391.342C295.184 417.311 316.236 438.362 342.204 438.362C368.172 438.362 389.224 417.31 389.224 391.342C389.224 365.374 368.173 344.322 342.204 344.322ZM342.204 417.465C327.777 417.465 316.082 405.77 316.082 391.343C316.082 376.916 327.777 365.221 342.204 365.221C356.631 365.221 368.326 376.916 368.326 391.343C368.327 405.77 356.631 417.465 342.204 417.465Z" fill="green"/>
      <Path d="M448.261 70.037C446.085 67.66 443.108 66.172 439.902 65.857L99.788 61.155L90.384 32.42C83.759 13.211 65.771 0.243015 45.453 0.0280151H10.449C4.678 0.0280151 0 4.70601 0 10.477C0 16.248 4.678 20.926 10.449 20.926H45.453C56.814 21.177 66.818 28.472 70.531 39.212L136.882 239.31L131.658 251.326C125.831 266.352 127.581 283.264 136.36 296.779C145.055 310.053 159.683 318.245 175.544 318.722H378.777C384.548 318.722 389.226 314.044 389.226 308.273C389.226 302.502 384.548 297.824 378.777 297.824H175.543C166.586 297.6 158.341 292.888 153.6 285.285C148.912 277.775 147.949 268.523 150.988 260.207L155.168 250.803L375.119 227.815C399.279 225.154 419.153 207.582 424.752 183.929L449.83 78.917C450.96 75.893 450.36 72.492 448.261 70.037ZM404.376 179.228C400.984 194.454 388.057 205.685 372.507 206.918L155.168 229.383L106.58 82.053L426.841 86.755L404.376 179.228Z" fill="black"/>
    </Svg>
  )
}

export default SvgComponent
