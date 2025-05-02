import React from 'react';

type Props = {
  x: number;
  y: number;
  color: string;
  size: number;
  rotate?: number;
  onMouseDown: (e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
};

const Heart: React.FC<Props> = ({ x, y, color, size, rotate = 0, onMouseDown }) => (
  <g style={{ cursor: 'move' }} onMouseDown={onMouseDown} transform={`rotate(${rotate},${x},${y})`}>
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill={color}
      transform={`translate(${x - size / 2},${y - size / 2}) scale(${size / 24})`}
    />
  </g>
);

export default Heart;
