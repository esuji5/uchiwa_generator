export type HeartItem = {
  x: number;
  y: number;
  color: string;
  size: number;
  id: string;
  rotate?: number;
};

export type DecoItem = {
  x: number;
  y: number;
  color: string;
  size: number;
  id: string;
  rotate?: number;
  shape: 'heart' | 'star' | 'note' | 'sparkle' | 'circle';
};

export type TextItem = {
  id: string;
  text: string;
  x: number;
  y: number;
  color: string;
  fontSize: number;
  font: string;
  rotate: number; // 回転角度（度数法）
};
