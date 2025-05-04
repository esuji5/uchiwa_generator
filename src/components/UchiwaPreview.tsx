// filepath: /Users/esuji/medi/uchiwa_generator/uchiwa-frontend/src/components/UchiwaPreview.tsx
import React from 'react';
import { DecoItem, TextItem } from '../types';
import DecoShape from './DecoShape';

interface UchiwaPreviewProps {
  // 従来の単一テキスト用のprops (オプショナルに変更)
  text?: string;
  textColor?: string;
  bgColor: string;
  font?: string;
  fontSize?: number;
  fillMode: string;
  
  // 複数テキスト用のprops
  textItems: TextItem[];
  handleTextDragStart: (id: string) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
  
  // その他のprops
  decos: DecoItem[];
  isDownloading: boolean;
  svgRef: React.RefObject<SVGSVGElement | null>;
  handleDecoMouseDown: (index: number) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => void;
  setDecos: React.Dispatch<React.SetStateAction<DecoItem[]>>;
  handleDownload: () => void;
  copyShareableUrl: () => void;
  copyParametersOnly?: () => void; // パラメータのみをコピーする関数
  downloadMethod: 'legacy' | 'domtoimage';
  setDownloadMethod: (method: 'legacy' | 'domtoimage') => void;
  resetAllSettings: () => void; // 全ての設定をリセットする関数
}

export const UchiwaPreview: React.FC<UchiwaPreviewProps> = ({
  text = '', // デフォルト値を設定
  textColor = '#ffffff', // デフォルト値を設定
  bgColor,
  font = '"M PLUS Rounded 1c", sans-serif', // デフォルト値を設定
  fontSize = 100, // デフォルト値を設定
  fillMode,
  textItems,
  handleTextDragStart,
  decos,
  isDownloading,
  svgRef,
  handleDecoMouseDown,
  setDecos,
  handleDownload,
  copyShareableUrl,
  copyParametersOnly,
  downloadMethod,
  setDownloadMethod,
  resetAllSettings
}) => {
  return (
    <div className="preview-container">
      <h2 className="preview-title">プレビュー</h2>
      <div className="preview-svg-container">
        <svg 
          id="uchiwa-svg" 
          ref={svgRef}
          width="360" 
          height="360" 
          viewBox="0 0 360 360"
          style={{ 
            background: fillMode === 'all' ? bgColor : 'transparent',
            '--main-font': 'inherit'
          } as React.CSSProperties}
        >
          {/* 角丸背景の塗りつぶしモードのとき */}
          {fillMode === 'rounded' && (
            <>
              <defs>
                <clipPath id="rounded-corners">
                  <rect
                    x="0"
                    y="0"
                    width="360"
                    height="360"
                    rx="40"
                    ry="40"
                  />
                </clipPath>
              </defs>
              <rect
                x="0"
                y="0"
                width="360"
                height="360"
                fill={bgColor}
                clipPath="url(#rounded-corners)"
              />
              <rect
                x="1"
                y="1"
                width="358"
                height="358"
                rx="40"
                ry="40"
                fill="none"
                stroke="#333"
                strokeWidth="2"
              />
            </>
          )}
          {/* テキスト要素（複数対応）*/}
          {textItems.length > 0 ? (
            // 複数テキストモード
            textItems.map((item) => (
              <g 
                key={item.id} 
                style={{ cursor: 'move' }} 
                onMouseDown={handleTextDragStart(item.id)}
                transform={`rotate(${item.rotate || 0}, ${item.x}, ${item.y})`}
              >
                {item.text.split(/\r?\n/).map((line, i, arr) => (
                  <g key={`${item.id}-${i}`}>
                    {/* 白縁 */}
                    <text
                      x={item.x}
                      y={item.y + (i - (arr.length - 1) / 2) * item.fontSize}
                      textAnchor="middle"
                      fontFamily={item.font}
                      fontSize={item.fontSize}
                      fontWeight="bold"
                      stroke="#fff"
                      strokeWidth={Math.max(16, item.fontSize/3.5)}
                      paintOrder="stroke"
                      fill="none"
                      style={{ 
                        dominantBaseline: 'middle',
                        fontFamily: item.font
                      }}
                    >
                      {line}
                    </text>
                    {/* 黒縁 */}
                    <text
                      x={item.x}
                      y={item.y + (i - (arr.length - 1) / 2) * item.fontSize}
                      textAnchor="middle"
                      fontFamily={item.font}
                      fontSize={item.fontSize}
                      fontWeight="bold"
                      stroke="#000"
                      strokeWidth={Math.max(10, item.fontSize/6)}
                      paintOrder="stroke"
                      fill="none"
                      style={{ 
                        dominantBaseline: 'middle',
                        fontFamily: item.font
                      }}
                    >
                      {line}
                    </text>
                    {/* 本体 */}
                    <text
                      x={item.x}
                      y={item.y + (i - (arr.length - 1) / 2) * item.fontSize}
                      textAnchor="middle"
                      fontFamily={item.font}
                      fontSize={item.fontSize}
                      fontWeight="bold"
                      fill={item.color}
                      style={{ 
                        dominantBaseline: 'middle',
                        fontFamily: item.font
                      }}
                    >
                      {line}
                    </text>
                  </g>
                ))}
                {!isDownloading && (
                  <circle
                    cx={item.x}
                    cy={item.y}
                    r={4}
                    fill="rgba(255,0,0,0.5)"
                    stroke="#fff"
                    strokeWidth={1}
                    style={{ display: isDownloading ? 'none' : 'block' }}
                  />
                )}
              </g>
            ))
          ) : (
            // 後方互換性のための従来の単一テキストモード
            text.split(/\r?\n/).map((line, i, arr) => (
              <g key={i}>
                {/* 白縁 */}
                <text
                  x="180"
                  y={205 + (i - (arr.length - 1) / 2) * fontSize}
                  textAnchor="middle"
                  fontFamily={font}
                  fontSize={fontSize}
                  fontWeight="bold"
                  stroke="#fff"
                  strokeWidth={Math.max(16, fontSize/3.5)}
                  paintOrder="stroke"
                  fill="none"
                  style={{ 
                    dominantBaseline: 'middle',
                    fontFamily: font
                  }}
                >
                  {line}
                </text>
                {/* 黒縁 */}
                <text
                  x="180"
                  y={205 + (i - (arr.length - 1) / 2) * fontSize}
                  textAnchor="middle"
                  fontFamily={font}
                  fontSize={fontSize}
                  fontWeight="bold"
                  stroke="#000"
                  strokeWidth={Math.max(10, fontSize/6)}
                  paintOrder="stroke"
                  fill="none"
                  style={{ 
                    dominantBaseline: 'middle',
                    fontFamily: font
                  }}
                >
                  {line}
                </text>
                {/* 本体 */}
                <text
                  x="180"
                  y={205 + (i - (arr.length - 1) / 2) * fontSize}
                  textAnchor="middle"
                  fontFamily={font}
                  fontSize={fontSize}
                  fontWeight="bold"
                  fill={textColor}
                  style={{ 
                    dominantBaseline: 'middle',
                    fontFamily: font
                  }}
                >
                  {line}
                </text>
              </g>
            ))
          )}
          {/* ハート・図形マーク（テキストより前面に描画） */}
          {decos.map((deco, i) => (
            <g key={deco.id}>
              <DecoShape
                x={deco.x}
                y={deco.y}
                color={deco.color}
                size={deco.size}
                rotate={deco.rotate}
                shape={deco.shape}
                onMouseDown={handleDecoMouseDown(i)}
              />
              {/* 削除ボタン（図形の右上に小さく表示） */}
              {!isDownloading && (
                <g
                  className="deco-delete-button"
                  style={{ cursor: 'pointer', display: isDownloading ? 'none' : 'block' }}
                  onClick={() => setDecos(decos.filter(d => d.id !== deco.id))}
                >
                  <circle cx={deco.x + deco.size/2 - 8} cy={deco.y - deco.size/2 + 8} r="10" fill="#fff" stroke="#888" strokeWidth="1" />
                  <text
                    x={deco.x + deco.size/2 - 8}
                    y={deco.y - deco.size/2 + 13}
                    textAnchor="middle"
                    fontSize="14"
                    fontWeight="bold"
                    fill="#d00"
                  >×</text>
                </g>
              )}
            </g>
          ))}
        </svg>
      </div>
      <div className="preview-actions">
        <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <label style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            background: downloadMethod === 'domtoimage' ? '#f0f8ff' : 'transparent',
            padding: '4px 8px',
            borderRadius: '4px',
            border: downloadMethod === 'domtoimage' ? '1px solid #007bff' : '1px solid transparent'
          }}>
            <input
              type="radio"
              name="downloadMethod"
              value="domtoimage"
              checked={downloadMethod === 'domtoimage'}
              onChange={() => setDownloadMethod('domtoimage')}
              style={{ 
                marginRight: '5px',
                accentColor: '#007bff',
                width: '16px',
                height: '16px',
                visibility: 'visible',
                opacity: 1
              }}
            />
            新しい方法
          </label>
          <label style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            cursor: 'pointer',
            background: downloadMethod === 'legacy' ? '#f0f8ff' : 'transparent',
            padding: '4px 8px',
            borderRadius: '4px',
            border: downloadMethod === 'legacy' ? '1px solid #007bff' : '1px solid transparent'
          }}>
            <input
              type="radio"
              name="downloadMethod"
              value="legacy"
              checked={downloadMethod === 'legacy'}
              onChange={() => setDownloadMethod('legacy')}
              style={{ 
                marginRight: '5px',
                accentColor: '#007bff',
                width: '16px',
                height: '16px',
                visibility: 'visible',
                opacity: 1
              }}
            />
            従来の方法
          </label>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'center' }}>
          <button 
            onClick={handleDownload}
            className="download-button"
            style={{ width: '100%', maxWidth: '250px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            {isDownloading ? '保存中...' : '画像をダウンロード'}
          </button>
          <button
            onClick={copyShareableUrl}
            className="share-button"
            style={{ width: '100%', maxWidth: '250px' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            共有リンクをコピー
          </button>
          
          {/* パラメータのみコピーボタンを表示 */}
          {copyParametersOnly && (
            <button
              onClick={copyParametersOnly}
              className="params-button"
              style={{ width: '100%', maxWidth: '250px' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              ?付きパラメータをコピー
            </button>
          )}
          
          {/* すべての設定をリセットするボタン */}
          <button
            onClick={() => {
              resetAllSettings();
              // URLをトップに戻す (パス部分をクリア)
              window.history.pushState({}, '', window.location.pathname.split('?')[0]);
            }}
            className="reset-button"
            style={{ 
              width: '100%', 
              maxWidth: '250px', 
              marginTop: '10px',
              backgroundColor: '#f8d7da',
              borderColor: '#f5c2c7',
              color: '#842029'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            すべての設定をリセット
          </button>
        </div>
      </div>
    </div>
  );
};
