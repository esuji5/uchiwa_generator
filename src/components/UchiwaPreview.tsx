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
  downloadMethod: 'domtoimage';
  setDownloadMethod: (method: 'domtoimage') => void;
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
                    {/* 縁取りなし */}
                    {(!item.outlineType || item.outlineType === 'none') && (
                      <>
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
                      </>
                    )}

                    {/* テキスト→黒→白 の順の縁取り */}
                    {item.outlineType === 'black-white' && (
                      <>
                        {/* 外側の白縁 */}
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
                        {/* 内側の黒縁 */}
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
                      </>
                    )}

                    {/* テキスト→白→黒 の順の縁取り */}
                    {item.outlineType === 'white-black' && (
                      <>
                        {/* 外側の黒縁 */}
                        <text
                          x={item.x}
                          y={item.y + (i - (arr.length - 1) / 2) * item.fontSize}
                          textAnchor="middle"
                          fontFamily={item.font}
                          fontSize={item.fontSize}
                          fontWeight="bold"
                          stroke="#000"
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
                        {/* 内側の白縁 */}
                        <text
                          x={item.x}
                          y={item.y + (i - (arr.length - 1) / 2) * item.fontSize}
                          textAnchor="middle"
                          fontFamily={item.font}
                          fontSize={item.fontSize}
                          fontWeight="bold"
                          stroke="#fff"
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
                      </>
                    )}

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
                {/* 白縁 (常に標準の縁取り) */}
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
        {/* 2×2のグリッドレイアウトでボタンをまとめる */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(2, 1fr)', 
          gap: '10px', 
          width: '100%', 
          maxWidth: '500px',
          margin: '0 auto'
        }}>
          <button 
            onClick={handleDownload}
            className="download-button"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '8px',
              height: '40px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>{isDownloading ? '保存中...' : 'ダウンロード'}</span>
          </button>
          
          <button
            onClick={copyShareableUrl}
            className="share-button"
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '8px',
              height: '40px'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
            </svg>
            <span>共有リンクのコピー</span>
          </button>
          
          {/* パラメータのみコピーボタン */}
          {copyParametersOnly ? (
            <button
              onClick={copyParametersOnly}
              className="params-button"
              style={{ 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '5px',
                padding: '8px',
                height: '40px'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              <span>パラメータのみコピー</span>
            </button>
          ) : (
            // パラメータコピー機能がない場合は空のセルを表示
            <div></div>
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
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '5px',
              padding: '8px',
              height: '40px',
              backgroundColor: '#f8d7da',
              borderColor: '#f5c2c7',
              color: '#842029'
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
              <path d="M21 3v5h-5"></path>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
              <path d="M8 16H3v5"></path>
            </svg>
            <span>リセット</span>
          </button>
        </div>
      </div>
      
      {/* サンプル画像セクション */}
      <div className="sample-images-section" style={{ 
        marginTop: '20px', 
        padding: '15px',
        borderTop: '1px solid #eee'
      }}>
        <h3 style={{ 
          fontSize: '16px', 
          textAlign: 'center', 
          marginBottom: '15px' 
        }}>サンプルテンプレート</h3>
        
        <div style={{ 
          display: 'flex', 
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '15px'
        }}>
          {/* ピースしてサンプル */}
          <div className="sample-item" style={{ 
            textAlign: 'center',
            width: '100px',
            cursor: 'pointer' 
          }}>
            <a href="?state=%7B%22t%22%3A%5B%7B%22text%22%3A%22%E3%83%94%E2%88%92%E3%82%B9%22%2C%22x%22%3A179%2C%22y%22%3A157%2C%22c%22%3A%22%23ffe54f%22%2C%22s%22%3A125%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A0%7D%2C%7B%22text%22%3A%22%E3%81%97%E3%81%A6%22%2C%22x%22%3A145%2C%22y%22%3A264%2C%22c%22%3A%22%23ffe54f%22%2C%22s%22%3A83%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A1%7D%2C%7B%22text%22%3A%22%F0%9F%98%8E%22%2C%22x%22%3A283%2C%22y%22%3A282%2C%22c%22%3A%22%23ffe54f%22%2C%22s%22%3A114%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A0%7D%5D%2C%22d%22%3A%5B%7B%22x%22%3A190%2C%22y%22%3A62%2C%22c%22%3A%22%23FF4081%22%2C%22s%22%3A120%2C%22r%22%3A15%2C%22t%22%3A%22heart%22%7D%2C%7B%22x%22%3A143%2C%22y%22%3A330%2C%22c%22%3A%22%23FF4081%22%2C%22s%22%3A80%2C%22r%22%3A-15%2C%22t%22%3A%22heart%22%7D%2C%7B%22x%22%3A29%2C%22y%22%3A238%2C%22c%22%3A%22%23FF4081%22%2C%22s%22%3A48%2C%22r%22%3A-15%2C%22t%22%3A%22heart%22%7D%2C%7B%22x%22%3A233%2C%22y%22%3A332%2C%22c%22%3A%22%23E040FB%22%2C%22s%22%3A48%2C%22r%22%3A15%2C%22t%22%3A%22sparkle%22%7D%2C%7B%22x%22%3A69%2C%22y%22%3A50%2C%22c%22%3A%22%23E040FB%22%2C%22s%22%3A80%2C%22r%22%3A-15%2C%22t%22%3A%22sparkle%22%7D%5D%2C%22bg%22%3A%22%23000000%22%2C%22fm%22%3A%22rounded%22%7D">
              <img 
                src="/uchiwa_generator/sample_piece_shite.png" 
                alt="ピースしてサンプル" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  border: '1px solid #ddd', 
                  marginBottom: '5px'
                }} 
              />
              <div style={{ fontSize: '12px' }}>ピースして</div>
            </a>
          </div>
          
          {/* ウインクしてサンプル */}
          <div className="sample-item" style={{ 
            textAlign: 'center',
            width: '100px',
            cursor: 'pointer' 
          }}>
            <a href="?state=%7B%22t%22%3A%5B%7B%22text%22%3A%22%E3%82%A6%E3%82%A3%5Cn%E3%83%B3%E3%82%AF%22%2C%22x%22%3A136%2C%22y%22%3A164%2C%22c%22%3A%22%2380deea%22%2C%22s%22%3A127%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A0%7D%2C%7B%22text%22%3A%22%E3%81%97%E3%81%A6%22%2C%22x%22%3A249%2C%22y%22%3A319%2C%22c%22%3A%22%2380deea%22%2C%22s%22%3A67%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A-9%7D%2C%7B%22text%22%3A%22%F0%9F%98%89+%22%2C%22x%22%3A298%2C%22y%22%3A135%2C%22c%22%3A%22%23ffe54f%22%2C%22s%22%3A114%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A13%7D%5D%2C%22d%22%3A%5B%7B%22x%22%3A117%2C%22y%22%3A301%2C%22c%22%3A%22%23FFD600%22%2C%22s%22%3A120%2C%22r%22%3A-15%2C%22t%22%3A%22star%22%7D%2C%7B%22x%22%3A299%2C%22y%22%3A227%2C%22c%22%3A%22%23FFD600%22%2C%22s%22%3A80%2C%22r%22%3A15%2C%22t%22%3A%22star%22%7D%2C%7B%22x%22%3A300%2C%22y%22%3A42%2C%22c%22%3A%22%23FFD600%22%2C%22s%22%3A48%2C%22r%22%3A0%2C%22t%22%3A%22star%22%7D%5D%2C%22bg%22%3A%22%23000000%22%2C%22fm%22%3A%22rounded%22%7D">
              <img 
                src="/uchiwa_generator/sample_wink_shite.png" 
                alt="ウィンクしてサンプル" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  border: '1px solid #ddd', 
                  marginBottom: '5px'
                }} 
              />
              <div style={{ fontSize: '12px' }}>ウインクして</div>
            </a>
          </div>
          
          {/* 指ハートしてサンプル */}
          <div className="sample-item" style={{ 
            textAlign: 'center',
            width: '100px',
            cursor: 'pointer' 
          }}>
            <a href="?state=%7B%22t%22%3A%5B%7B%22text%22%3A%22%E6%8C%87%22%2C%22x%22%3A105%2C%22y%22%3A126%2C%22c%22%3A%22%23ffe54f%22%2C%22s%22%3A172%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A0%7D%2C%7B%22text%22%3A%22%E3%83%8F%E2%88%92%E3%83%88%5Cn%22%2C%22x%22%3A253%2C%22y%22%3A244%2C%22c%22%3A%22%23ffe54f%22%2C%22s%22%3A76%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A0%7D%2C%7B%22text%22%3A%22%E3%81%97%E3%81%A6%22%2C%22x%22%3A308%2C%22y%22%3A271%2C%22c%22%3A%22%23ffe54f%22%2C%22s%22%3A40%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A1%7D%2C%7B%22text%22%3A%22%F0%9F%AB%B0%22%2C%22x%22%3A123%2C%22y%22%3A292%2C%22c%22%3A%22%23ffe54f%22%2C%22s%22%3A153%2C%22f%22%3A%22%5C%22M+PLUS+Rounded+1c%5C%22%2C+sans-serif%22%2C%22r%22%3A-45%7D%5D%2C%22d%22%3A%5B%7B%22x%22%3A219%2C%22y%22%3A277%2C%22c%22%3A%22%23FF4081%22%2C%22s%22%3A80%2C%22r%22%3A-15%2C%22t%22%3A%22heart%22%7D%2C%7B%22x%22%3A297%2C%22y%22%3A322%2C%22c%22%3A%22%23FF4081%22%2C%22s%22%3A48%2C%22r%22%3A15%2C%22t%22%3A%22heart%22%7D%2C%7B%22x%22%3A266%2C%22y%22%3A115%2C%22c%22%3A%22%23FF4081%22%2C%22s%22%3A120%2C%22r%22%3A15%2C%22t%22%3A%22heart%22%7D%5D%2C%22bg%22%3A%22%23000000%22%2C%22fm%22%3A%22rounded%22%7D">
              <img 
                src="/uchiwa_generator/sample_yubiheart_shite.png" 
                alt="指ハートしてサンプル" 
                style={{ 
                  width: '100%', 
                  height: 'auto', 
                  borderRadius: '8px',
                  border: '1px solid #ddd', 
                  marginBottom: '5px'
                }} 
              />
              <div style={{ fontSize: '12px' }}>指ハートして</div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
