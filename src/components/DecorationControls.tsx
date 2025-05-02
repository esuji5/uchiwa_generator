import React from 'react';
import { DecoItem } from '../types';
import { heartSizes, decoShapes } from '../constants';

interface DecorationControlsProps {
  selectedHeartSize: number;
  setSelectedHeartSize: (size: number) => void;
  addDeco: (shape: DecoItem['shape'], color: string, rotate: number) => void;
  addRandomDecos: () => void;
  addRandomDecosByShape: (shape: DecoItem['shape'], count?: number) => void;
  clearDecos: () => void;
}

const DecorationControls: React.FC<DecorationControlsProps> = ({
  selectedHeartSize,
  setSelectedHeartSize,
  addDeco,
  addRandomDecos,
  addRandomDecosByShape,
  clearDecos
}) => {
  return (
    <div className="control-panel">
      <h2 className="section-title">デコレーション</h2>
      <div className="control-section">
        <div className="input-group">
          <label>サイズ</label>
          <div className="radio-group" style={{ display: 'flex', gap: 15, marginTop: 5 }}>
            {heartSizes.map(s => (
              <label key={s.value} style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="radio"
                  name="deco-size"
                  value={s.value}
                  checked={selectedHeartSize === s.value}
                  onChange={() => setSelectedHeartSize(s.value)}
                  style={{ accentColor: 'var(--primary-color)', marginRight: 6 }}
                />
                {s.label}
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="control-section">

      <div style={{ marginBottom: 10, display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {decoShapes.map(d => (
          <div key={d.shape} className="deco-btn-group" style={{ marginBottom: 5 }}>
            <button
              onClick={() => addDeco(d.shape as DecoItem['shape'], d.color, 0)}
              className="btn"
              style={{
                backgroundColor: d.color,
                color: '#fff',
                borderRadius: '6px 0 0 6px',
                padding: '4px 10px',
                fontSize: 13,
              }}
            >
              {d.label}
            </button>
            <button
              onClick={() => addDeco(d.shape as DecoItem['shape'], d.color, -15)}
              className="btn"
              style={{
                backgroundColor: d.color,
                color: '#fff',
                borderRadius: 0,
                borderLeft: '1px solid rgba(255,255,255,0.3)',
                transform: 'rotate(-15deg)',
                padding: '4px 6px',
                fontSize: '11px',
              }}
            >↺</button>
            <button
              onClick={() => addDeco(d.shape as DecoItem['shape'], d.color, 15)}
              className="btn"
              style={{
                backgroundColor: d.color,
                color: '#fff',
                borderRadius: 0,
                borderLeft: '1px solid rgba(255,255,255,0.3)',
                transform: 'rotate(15deg)',
                padding: '4px 6px',
                fontSize: '11px',
              }}
            >↻</button>
            <button
              onClick={() => addRandomDecosByShape(d.shape as DecoItem['shape'])}
              className="btn"
              style={{
                backgroundColor: '#fff',
                color: d.color,
                border: `1px solid ${d.color}`,
                borderRadius: '0 6px 6px 0',
                borderLeft: 0,
                fontSize: '11px',
                padding: '4px 6px',
              }}
            >R</button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 12 }}>
        <button 
          onClick={() => addRandomDecos()} 
          className="btn btn-accent"
          style={{ padding: '5px 12px', fontSize: 13 }}
        >全ランダム配置</button>
        <button 
          onClick={clearDecos} 
          className="btn btn-outline"
          style={{ color: '#ff4455', padding: '5px 12px', fontSize: 13 }}
        >図形全削除</button>
      </div>
    </div>
    </div>
  );
};

export default DecorationControls;
