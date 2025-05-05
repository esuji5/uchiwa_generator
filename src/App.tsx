import React from 'react';
import './App.css';
import { TextSettings } from './components/TextSettings';
import { UchiwaPreview } from './components/UchiwaPreview';
import { useUchiwaState } from './hooks/useUchiwaState';
import DecorationControls from './components/DecorationControls';

function App() {
  const {
    // 単一テキスト用の状態と関数を削除
    // text, setText,
    // textColor, setTextColor,
    // font, setFont,
    // fontSize, setFontSize,
    
    // 維持する状態と関数
    bgColor, setBgColor,
    fillMode, setFillMode,
    textItems,
    addTextItem, updateTextItem, removeTextItem,
    handleTextDragStart,
    decos, setDecos,
    selectedHeartSize, setSelectedHeartSize,
    isDownloading,
    svgRef,
    handleDownload, // 簡略化された handleDownload
    downloadMethod, setDownloadMethod, // downloadMethod は UI 次第で削除検討
    addDeco,
    handleDecoMouseDown,
    clearDecos,
    addRandomDecos,
    addRandomDecosByShape,
    copyShareableUrl,
    copyParametersOnly,
    resetAllSettings
  } = useUchiwaState();

  // 強化したフォント読み込み確認
  const [fontsLoaded, setFontsLoaded] = React.useState(false);
  
  React.useEffect(() => {
    // フォント読み込みの状態を確認する関数
    const checkFontAvailability = () => {
      // テスト用テキスト表示
      const testText = document.createElement('div');
      testText.style.cssText = `
        position: absolute; visibility: hidden; opacity: 0;
        height: 0; font-size: 16px; white-space: nowrap;
      `;
      testText.textContent = 'あいうえお漢字サンプルABCDEF123456';
      document.body.appendChild(testText);
      
      // 基準幅を取得（sans-serif）
      testText.style.fontFamily = 'sans-serif';
      const defaultWidth = testText.offsetWidth;
      
      // 各フォントでの表示幅を確認
      const fontTests = [
        { name: 'M PLUS Rounded 1c', family: '"M PLUS Rounded 1c", sans-serif' },
        { name: 'ヒラギノ丸ゴ', family: '"ヒラギノ丸ゴ Pro W4", "Hiragino Maru Gothic Pro", sans-serif' }
      ];
      
      const results = fontTests.map(font => {
        testText.style.fontFamily = font.family;
        const width = testText.offsetWidth;
        const available = defaultWidth !== width;
        
        return { 
          name: font.name, 
          available, 
          width 
        };
      });
      
      // どれか一つでも利用可能なフォントがあるか確認
      const anyFontAvailable = results.some(r => r.available);
      
      // 検証用に結果をログに出力
      console.log('フォント利用可能状況:', {
        利用可能なフォントあり: anyFontAvailable,
        'sans-serif幅': defaultWidth,
        詳細: results
      });
      
      document.body.removeChild(testText);
      return anyFontAvailable;
    };
    
    if (document.fonts) {
      // フォント読み込みを強化（3回試行）
      let attempts = 0;
      const maxAttempts = 3;
      
      const tryLoadFonts = () => {
        attempts++;
        console.log(`フォント読み込み試行 (${attempts}/${maxAttempts})`);
        
        // フォントロード処理をallSettledで行い、一部失敗してもすべてを待つ
        Promise.allSettled([
          // ローカルと代替フォントの両方をロード試行
          // document.fonts.load('400 16px "M PLUS Rounded 1c"'),
          document.fonts.load('700 16px "M PLUS Rounded 1c"'),
          // fallback fonts
          // document.fonts.load('400 16px "Hiragino Maru Gothic Pro"'),
          // document.fonts.load('700 16px "Hirag　ino Maru Gothic Pro"')
        ]).then((results) => {
          // 読み込み結果を確認
          const successCount = results.filter(r => r.status === 'fulfilled').length;
          console.log(`フォント読み込み試行結果: 成功=${successCount}/${results.length}`);
          
          // 読み込み完了後、実際に利用可能か確認
          const isAvailable = checkFontAvailability();
          
          if (isAvailable) {
            console.log('必要なフォントが利用可能になりました');
            setFontsLoaded(true);
          } else if (attempts < maxAttempts) {
            // 読み込みが成功しなかった場合、少し待って再試行
            console.log('フォント未準備、再試行します');
            setTimeout(tryLoadFonts, 800);
          } else {
            console.warn('フォント読み込みの最大試行回数に達しました、フォールバックを使用します');
            // いずれにしてもアプリケーションを表示する
            setFontsLoaded(true);
          }
        }).catch(err => {
          console.warn('フォント読み込みエラー:', err);
          // ネットワークエラーなどの場合でも、ローカルフォントを確認
          const isAvailable = checkFontAvailability();
          if (isAvailable) {
            console.log('エラー発生しましたが、フォントは利用可能です');
            setFontsLoaded(true);
          } else if (attempts < maxAttempts) {
            // エラー時も再試行
            console.log('フォント未準備とエラー発生、再試行します');
            setTimeout(tryLoadFonts, 800);
          } else {
            console.warn('フォント読み込み試行終了、フォールバックに切り替えます');
            setFontsLoaded(true);
          }
        });
      };
      
      tryLoadFonts();
    } else {
      // document.fontsが使えない環境では即座に読み込み完了とする
      setFontsLoaded(true);
    }
  }, []);
  
  // フォントローディングのためのフォールバックフォントリスト
  const fontFamily = fontsLoaded 
    ? '"M PLUS Rounded 1c", "Kosugi Maru", "Hiragino Maru Gothic Pro", "ヒラギノ丸ゴ Pro W4", sans-serif'
    : '"M PLUS Rounded 1c", "Kosugi Maru", "Hiragino Maru Gothic Pro", "ヒラギノ丸ゴ Pro W4", "メイリオ", "Meiryo", sans-serif';
  
  return (
    <div className="app-container" style={{ fontFamily }}>
      {!fontsLoaded && (
        <div style={{ 
          position: 'fixed', 
          bottom: '10px', 
          right: '10px', 
          background: 'rgba(255,255,255,0.9)', 
          padding: '8px 12px', 
          borderRadius: '4px',
          fontSize: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 9999
        }}>
          フォント読み込み中...
        </div>
      )}
      <div className="container">
        <div className="header">
          <h1 className="title">推し活うちわジェネレーター</h1>
          <p className="subtitle">好きなテキストや図形を自由に配置してオリジナルうちわを作ろう！</p>
        </div>
        
        <div className="main-content">
          <div className="controls-container">
            <TextSettings 
              // 維持する props
              bgColor={bgColor}
              setBgColor={setBgColor}
              fillMode={fillMode}
              setFillMode={setFillMode}
              textItems={textItems}
              updateTextItem={updateTextItem}
              addTextItem={addTextItem}
              removeTextItem={removeTextItem}
              downloadMethod={downloadMethod} // UI 次第で削除検討
              setDownloadMethod={setDownloadMethod} // UI 次第で削除検討
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
            // 単一テキスト props を削除
            // text={text}
            // textColor={textColor}
            // font={font}
            // fontSize={fontSize}
            
            // 維持する props
            bgColor={bgColor}
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
            copyParametersOnly={copyParametersOnly}
            downloadMethod={downloadMethod} // UI 次第で削除検討
            setDownloadMethod={setDownloadMethod} // UI 次第で削除検討
            resetAllSettings={resetAllSettings} // resetAllSettings は維持
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