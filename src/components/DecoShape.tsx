import type React from 'react';
import type { DecoItem } from '../types';

type Props = {
  x: number;
  y: number;
  color: string;
  size: number;
  rotate?: number;
  shape: DecoItem['shape'];
  onMouseDown: (e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
};

const DecoShape: React.FC<Props> = ({ x, y, color, size, rotate = 0, shape, onMouseDown }) => {
  let path = null;
  if (shape === 'heart') {
    path = (
      <path
        d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
        fill={color}
        transform={`translate(${x - size / 2},${y - size / 2}) scale(${size / 24})`}
      />
    );
  } else if (shape === 'star') {
    path = (
      <path
        d="M12 2l3.09 6.26L22 9.27l-5 4.87L18.18 22 12 18.27 5.82 22 7 14.14l-5-4.87 6.91-1.01z"
        fill={color}
        transform={`translate(${x - size / 2},${y - size / 2}) scale(${size / 24})`}
      />
    );
  } else if (shape === 'note') {
    path = (
      <path
        d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z"
        fill={color}
        transform={`translate(${x - size / 2},${y - size / 2}) scale(${size / 24})`}
      />
    );
  } else if (shape === 'sparkle') {
    path = (
      <path
        d="M12 2l2 7h7l-5.5 4 2 7-5.5-4-5.5 4 2-7L3 9h7z"
        fill={color}
        transform={`translate(${x - size / 2},${y - size / 2}) scale(${size / 24})`}
      />
    );
  } else if (shape === 'circle') {
    path = <circle cx={x} cy={y} r={size / 2} fill={color} />;
  }
  return (
    <g
      style={{ cursor: 'move' }}
      onMouseDown={onMouseDown}
      transform={`rotate(${rotate},${x},${y})`}
    >
      {path}
    </g>
  );
};

export default DecoShape;
