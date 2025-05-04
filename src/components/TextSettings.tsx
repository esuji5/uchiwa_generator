import React from 'react';
import { fonts, fillModes } from '../constants';
import { TextItem, DownloadMethod } from '../types';

interface TextSettingsProps {
  // 単一テキスト用の props を削除
  // text: string;
  // setText: (text: string) => void;
  // textColor: string;
  // setTextColor: (color: string) => void;
  // font: string;
  // setFont: (font: string) => void;
  // fontSize: number;
  // setFontSize: (size: number) => void;

  // 維持する props
  bgColor: string; 
  setBgColor: (color: string) => void;
  fillMode: string;
  setFillMode: (mode: string) => void;
  textItems: TextItem[];
  updateTextItem: (id: string, updates: Partial<TextItem>) => void;
  addTextItem: () => void;
  removeTextItem: (id: string) => void;
  downloadMethod: DownloadMethod;
  setDownloadMethod: (method: DownloadMethod) => void;
}

export const TextSettings: React.FC<TextSettingsProps> = ({
  // 単一テキスト用の props を削除
  // text,
  // setText,
  // textColor,
  // setTextColor,
  // font,
  // setFont,
  // fontSize,
  // setFontSize,

  // 維持する props
  bgColor,
  setBgColor,
  fillMode,
  setFillMode,
  textItems,
  updateTextItem,
  addTextItem,
  removeTextItem,
  downloadMethod,
  setDownloadMethod
}) => {
  // 単一テキストとの同期用 useEffect を削除
  // React.useEffect(() => { ... }, [...]);

  // 背景設定部分
  const BackgroundSettings = () => (
    <div className="control-section">
      <h3 className="section-title">背景設定</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 15 }}>
        <div className="input-group" style={{ flex: 1, minWidth: 120 }}>
          <label htmlFor="bg-color">背景色</label>
          <div className="color-picker-container">
            <div className="color-picker-preview" style={{ backgroundColor: bgColor }}></div>
            <input 
              id="bg-color"
              type="color" 
              value={bgColor} 
              onChange={e => setBgColor(e.target.value)}
              style={{ flex: 1 }}
            />
          </div>
        </div>
        
        <div className="input-group" style={{ flex: 1, minWidth: 180 }}>
          <label htmlFor="fill-mode">塗りつぶしモード</label>
          <select 
            id="fill-mode"
            value={fillMode}
            onChange={e => setFillMode(e.target.value)}
          >
            {fillModes.map(mode => (
              <option key={mode.value} value={mode.value}>{mode.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
  
  return (
    <div className="control-panel text-settings">
      
      <BackgroundSettings />
      
      <h2 className="section-title">テキスト設定</h2>
      {/* 複数テキストモード */}
      <div className="control-section">
          {textItems.length === 0 && <div className="empty-state">テキストがありません</div>}
          
          {textItems.map(item => (
            <div key={item.id} className="text-item-settings control-section" style={{ padding: '12px', backgroundColor: 'var(--bg-color)', borderRadius: 'var(--border-radius)', marginBottom: '15px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: 'var(--primary-dark)' }}>テキスト #{textItems.indexOf(item) + 1}</h3>
                {textItems.length > 1 && (
                  <button
                    onClick={() => removeTextItem(item.id)}
                    style={{ 
                      backgroundColor: '#ff5252',
                      color: 'white',
                      border: 'none',
                      padding: '3px 6px',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    削除
                  </button>
                )}
              </div>
                
              <div className="input-group">
                <label htmlFor={`text-input-${item.id}`}>テキスト内容</label>
                <textarea
                  id={`text-input-${item.id}`}
                  value={item.text}
                  onChange={e => updateTextItem(item.id, { text: e.target.value })}
                  rows={3}
                  placeholder="ここにテキストを入力..."
                />
              </div>
                
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                <div className="input-group" style={{ flex: 1, minWidth: 120 }}>
                  <label htmlFor={`text-color-${item.id}`} style={{ fontSize: 13, marginBottom: 3 }}>テキスト色</label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {/* カラーパレット（明るめの色を追加） */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 4 }}>
                      {[ '#ffe54f', '#FF69B4','#80deea', '#ffb114', '#81f784',
                       '#ff2222', '#ce93d8', '#ffffff'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => updateTextItem(item.id, { color: c })}
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 4,
                            border: c === item.color ? '2px solid #1976d2' : '1px solid #bbb',
                            background: c,
                            display: 'inline-block',
                            cursor: 'pointer',
                            boxSizing: 'border-box',
                            outline: 'none',
                          }}
                          aria-label={`色 ${c}`}
                        />
                      ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <input 
                        id={`text-color-${item.id}`}
                        type="color" 
                        value={item.color} 
                        onChange={e => updateTextItem(item.id, { color: e.target.value })}
                        style={{ width: 28, height: 28 }}
                      />
                      <span style={{ marginLeft: 8, fontSize: 12 }}>{item.color}</span>
                    </div>
                  </div>
                </div>
                
                <div className="input-group" style={{ flex: 1, minWidth: 120 }}>
                  <label htmlFor={`font-size-${item.id}`}>サイズ</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <input
                      id={`font-size-${item.id}`}
                      type="range"
                      min="20"
                      max="200"
                      value={item.fontSize}
                      onChange={e => updateTextItem(item.id, { fontSize: Number(e.target.value) })}
                      style={{ flex: 1 }}
                    />
                    <span style={{ fontWeight: 'bold', minWidth: '45px', textAlign: 'right' }}>{item.fontSize}px</span>
                  </div>
                </div>
              </div>
              
              <div className="input-group">
                <label htmlFor={`font-family-${item.id}`}>フォント</label>
                <select 
                  id={`font-family-${item.id}`}
                  value={item.font}
                  onChange={e => updateTextItem(item.id, { font: e.target.value })}
                >
                  {fonts.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="input-group">
                <label htmlFor={`rotate-${item.id}`} style={{ fontSize: 13, marginBottom: 3 }}>回転角度: {item.rotate || 0}°</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <button
                    onClick={() => updateTextItem(item.id, { rotate: Math.max(-45, (item.rotate || 0) - 5) })}
                    style={{ 
                      padding: '2px 6px', 
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    -5°
                  </button>
                  <input
                    id={`rotate-${item.id}`}
                    type="range"
                    min="-45"
                    max="45"
                    value={item.rotate || 0}
                    onChange={e => updateTextItem(item.id, { rotate: Number(e.target.value) })}
                    style={{ flex: 1 }}
                  />
                  <button
                    onClick={() => updateTextItem(item.id, { rotate: Math.min(45, (item.rotate || 0) + 5) })}
                    style={{ 
                      padding: '2px 6px', 
                      backgroundColor: '#f0f0f0',
                      border: '1px solid #ddd',
                      borderRadius: 4,
                      cursor: 'pointer',
                      fontSize: 12
                    }}
                  >
                    +5°
                  </button>
                </div>
              </div>
            </div>
          ))}
          
          {textItems.length < 5 && (
            <button 
              onClick={addTextItem}
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '10px' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              テキスト追加（{textItems.length}/5）
            </button>
          )}
          
          {/* ダウンロード設定 */}
          <div className="setting-section" style={{ marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>ダウンロード設定</h3>
            <div className="download-method-selector">
              <div className="label" style={{ marginBottom: '5px' }}>ダウンロード方法:</div>
              <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="downloadMethod" 
                    value="domtoimage" 
                    checked={downloadMethod === 'domtoimage'} 
                    onChange={() => setDownloadMethod('domtoimage')} 
                  />
                  dom-to-image-more (推奨)
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input 
                    type="radio" 
                    name="downloadMethod" 
                    value="legacy" 
                    checked={downloadMethod === 'legacy'} 
                    onChange={() => setDownloadMethod('legacy')} 
                  />
                  従来の方法
                </label>
              </div>
              <div className="description" style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                {downloadMethod === 'domtoimage' 
                  ? 'dom-to-image-more: フォント・図形表示に優れたモダンな方法です。'
                  : '従来の方法: 互換性優先の方法です。問題がある場合はこちらをお試しください。'}
              </div>
            </div>
          </div>
        </div>
    </div>
  );
};
