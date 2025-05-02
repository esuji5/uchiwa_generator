import React from 'react';
import './App.css';
import { TextSettings } from './components/TextSettings';
import { UchiwaPreview } from './components/UchiwaPreview';
import { useUchiwaState } from './hooks/useUchiwaState';
import DecorationControls from './components/DecorationControls';

function App() {
  const {
    // 従来の単一テキスト用の状態と関数
    text, setText,
    textColor, setTextColor,
    bgColor, setBgColor,
    font, setFont,
    fontSize, setFontSize,
    fillMode, setFillMode,
    // 複数テキスト用の状態と関数
    textItems,
    addTextItem, updateTextItem, removeTextItem,
    handleTextDragStart,
    // その他の状態と関数
    decos, setDecos,
    selectedHeartSize, setSelectedHeartSize,
    isDownloading,
    svgRef,
    handleDownload,
    addDeco,
    handleDecoMouseDown,
    clearDecos,
    addRandomDecos,
    addRandomDecosByShape,
    copyShareableUrl
  } = useUchiwaState();

  return (
    <div className="app-container">
      <div className="container">
        <div className="header">
          <h1 className="title">推し活うちわジェネレーター</h1>
          <p className="subtitle">好きなテキストや図形を自由に配置してオリジナルうちわを作ろう！</p>
        </div>
        
        <div className="main-content">
          <div className="controls-container">
            <TextSettings 
              text={text}
              setText={setText}
              textColor={textColor}
              setTextColor={setTextColor}
              bgColor={bgColor}
              setBgColor={setBgColor}
              font={font}
              setFont={setFont}
              fontSize={fontSize}
              setFontSize={setFontSize}
              fillMode={fillMode}
              setFillMode={setFillMode}
              textItems={textItems}
              updateTextItem={updateTextItem}
              addTextItem={addTextItem}
              removeTextItem={removeTextItem}
            />
            
            <div style={{ marginTop: '15px' }}>
              <DecorationControls 
                selectedHeartSize={selectedHeartSize}
                setSelectedHeartSize={setSelectedHeartSize}
                addRandomDecos={addRandomDecos}
                addRandomDecosByShape={addRandomDecosByShape}
                addDeco={addDeco}
                clearDecos={clearDecos}
              />
            </div>
          </div>
          
          <UchiwaPreview
            text={text}
            textColor={textColor}
            bgColor={bgColor}
            font={font}
            fontSize={fontSize}
            fillMode={fillMode}
            textItems={textItems}
            handleTextDragStart={handleTextDragStart}
            decos={decos}
            isDownloading={isDownloading}
            svgRef={svgRef}
            handleDecoMouseDown={handleDecoMouseDown}
            setDecos={setDecos}
            handleDownload={handleDownload}
            copyShareableUrl={copyShareableUrl}
          />
        </div>
        
        <div className="footer" style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: '#666' }}>
          © 2025 推し活うちわジェネレーター - 好きな推しのうちわを簡単デザイン！<br />
          <a
            href="https://github.com/esuji5/uchiwa_generator"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}
          >
            <svg style={{ verticalAlign: 'middle', marginRight: 4 }} width="18" height="18" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
            </svg>
            GitHubリポジトリ
          </a>
        </div>
      </div>
    </div>
  );
}

export default App;