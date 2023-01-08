import React from "react";

interface IconProps {
  width: number;
  [x: string]: any;
}

interface IconBaseProps extends IconProps {
  path: string;
  viewBoxWidth: number;
  viewBoxHeight: number;
}

const IconBase: React.FC<IconBaseProps> = ({
  width,
  path,
  viewBoxWidth,
  viewBoxHeight,
  ...rest
}) => {
  const heightAspectRatio = viewBoxHeight / viewBoxWidth;
  const height = width * heightAspectRatio;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={width}
      height={height}
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      <path fill="currentColor" d={path} />
    </svg>
  );
};

export const BikeIcon: React.FC<IconProps> = ({ width, ...rest }) => (
  <IconBase
    width={width}
    viewBoxWidth={640}
    viewBoxHeight={512}
    path="M347.2 32C356.1 32 364.3 36.94 368.4 44.82L466.1 232.1C480.1 226.9 496.2 224 512 224C582.7 224 640 281.3 640 352C640 422.7 582.7 480 512 480C441.3 480 384 422.7 384 352C384 308.6 405.6 270.2 438.7 247.1L417.5 206.7L334 359.7C331.2 364.8 325.9 368 320 368H255C247.1 431.1 193.3 480 128 480C57.31 480 0 422.7 0 352C0 281.3 57.31 223.1 128 223.1C142.9 223.1 157.2 226.5 170.5 231.2L197 178.2L166.9 128H112C103.2 128 96 120.8 96 112C96 103.2 103.2 96 112 96H176C181.6 96 186.8 98.95 189.7 103.8L223.5 160H392.9L342.3 64H304C295.2 64 288 56.84 288 48C288 39.16 295.2 32 304 32H347.2zM416 352C416 405 458.1 448 512 448C565 448 608 405 608 352C608 298.1 565 256 512 256C501.5 256 491.5 257.7 482.1 260.8L526.2 344.5C530.3 352.4 527.3 362 519.5 366.2C511.6 370.3 501.1 367.3 497.8 359.5L453.8 275.7C430.8 293.2 416 320.9 416 352V352zM156 260.2C147.2 257.5 137.8 256 127.1 256C74.98 256 31.1 298.1 31.1 352C31.1 405 74.98 448 127.1 448C175.6 448 215.1 413.4 222.7 368H133.2C118.9 368 109.6 352.1 116 340.2L156 260.2zM291.7 336L216.5 210.7L153.9 336H291.7zM242.7 192L319.3 319.8L389 192H242.7z"
    {...rest}
  />
);

export const DeparturesIcon: React.FC<IconProps> = ({ width, ...rest }) => (
  <IconBase
    width={width}
    viewBoxWidth={512}
    viewBoxHeight={512}
    path="M256 480C264.8 480 272 487.2 272 496C272 504.8 264.8 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C264.8 0 272 7.164 272 16C272 24.84 264.8 32 256 32C132.3 32 32 132.3 32 256C32 379.7 132.3 480 256 480zM506.6 244C510 247.1 512 251.4 512 256C512 260.6 510 264.9 506.6 267.1L362.6 395.1C356 401.8 345.9 401.2 340 394.6C334.2 388 334.8 377.9 341.4 372L453.9 271.1H175.1C167.2 271.1 159.1 264.8 159.1 255.1C159.1 247.2 167.2 239.1 175.1 239.1H453.9L341.4 139.1C334.8 134.1 334.2 123.1 340 117.4C345.9 110.8 356 110.2 362.6 116L506.6 244z"
    {...rest}
  />
);

export const ArrivalsIcon: React.FC<IconProps> = ({ width, ...rest }) => (
  <IconBase
    width={width}
    viewBoxWidth={512}
    viewBoxHeight={512}
    path="M480 256C480 132.3 379.7 32 256 32C247.2 32 240 24.84 240 16C240 7.164 247.2 0 256 0C397.4 0 512 114.6 512 256C512 397.4 397.4 512 256 512C247.2 512 240 504.8 240 496C240 487.2 247.2 480 256 480C379.7 480 480 379.7 480 256zM346.6 244C350 247.1 352 251.4 352 256C352 260.6 350 264.9 346.6 267.1L202.6 395.1C196 401.8 185.9 401.2 180 394.6C174.2 388 174.8 377.9 181.4 372L293.9 271.1H16C7.164 271.1 0 264.8 0 255.1C0 247.2 7.164 239.1 16 239.1H293.9L181.4 139.1C174.8 134.1 174.2 123.1 180 117.4C185.9 110.8 196 110.2 202.6 116L346.6 244z"
    {...rest}
  />
);

export const BackIcon: React.FC<IconProps> = ({ width, ...rest }) => (
  <IconBase
    width={width}
    viewBoxWidth={384}
    viewBoxHeight={512}
    path="M41.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L109.3 256 278.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
    {...rest}
  />
);

export const ForwardIcon: React.FC<IconProps> = ({ width, ...rest }) => (
  <IconBase
    width={width}
    viewBoxWidth={448}
    viewBoxHeight={512}
    path="M443.7 266.8l-165.9 176C274.5 446.3 269.1 448 265.5 448c-3.986 0-7.988-1.375-11.16-4.156c-6.773-5.938-7.275-16.06-1.118-22.59L393.9 272H16.59c-9.171 0-16.59-7.155-16.59-15.1S7.421 240 16.59 240h377.3l-140.7-149.3c-6.157-6.531-5.655-16.66 1.118-22.59c6.789-5.906 17.27-5.469 23.45 1.094l165.9 176C449.4 251.3 449.4 260.7 443.7 266.8z"
    {...rest}
  />
);
