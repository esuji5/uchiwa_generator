import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// フォントを確実に読み込むためのヘルパー関数（ローカルフォント優先）
const preloadFont = async () => {
  try {
    // 使用できるフォントを確認する関数
    const checkFontAvailability = () => {
      // テスト用テキスト表示
      const testText = document.createElement('div');
      testText.id = 'font-test-element';
      testText.style.cssText = `
        position: absolute;
        visibility: hidden;
        opacity: 0;
        height: 0;
        font-size: 16px;
        white-space: nowrap;
      `;
      document.body.appendChild(testText);

      // フォントの可用性を確認
      const checkFont = (fontName: string) => {
        testText.style.fontFamily = `'${fontName}', sans-serif`;
        testText.textContent = 'あいうえお漢字サンプルABCDEF123456';
        const defaultWidth = testText.offsetWidth;

        // 実際にフォントが適用されているか確認（幅で判断）
        testText.style.fontFamily = `'${fontName}', serif`;
        const testWidth = testText.offsetWidth;

        return defaultWidth !== testWidth;
      };

      const results = {
        mPlusRounded: checkFont('M PLUS Rounded 1c'),
        hiragino: checkFont('ヒラギノ丸ゴ Pro'),
        hiraginoEn: checkFont('Hiragino Maru Gothic Pro'),
      };

      document.body.removeChild(testText);
      return results;
    };

    if (document.fonts) {
      // 両方のフォントとそれぞれの日英表記を読み込み試行
      const fontPromises = [
        // M PLUS フォント
        document.fonts.load('400 16px "M PLUS Rounded 1c"'),
        document.fonts.load('700 16px "M PLUS Rounded 1c"'),

        // ヒラギノ丸ゴシック（日英表記両方）
        document.fonts.load('400 16px "ヒラギノ丸ゴ Pro W4"'),
        document.fonts.load('700 16px "ヒラギノ丸ゴ Pro W4"'),
        document.fonts.load('400 16px "Hiragino Maru Gothic Pro"'),
        document.fonts.load('700 16px "Hiragino Maru Gothic Pro"'),
      ];

      try {
        await Promise.allSettled(fontPromises);
        console.log('フォント読み込み試行完了');

        // フォントが実際に使用可能か確認
        const fontAvailability = checkFontAvailability();
        console.log('フォント可用性確認結果:', fontAvailability);

        document.fonts.ready.then(() => {
          console.log('全てのフォントが準備完了しました');
        });
      } catch (loadError) {
        console.warn('一部フォントの読み込みに失敗:', loadError);
      }
    } else {
      // document.fontsがない場合の代替手段
      // フォント読み込み用のテキストを一時的に追加
      const tempElements: HTMLDivElement[] = [];

      const fontFamilies = [
        '"M PLUS Rounded 1c", sans-serif',
        '"ヒラギノ丸ゴ Pro W4", sans-serif',
        '"Hiragino Maru Gothic Pro", sans-serif',
      ];

      // 各フォント用の非表示要素を作成
      fontFamilies.forEach((fontFamily) => {
        const tempEl = document.createElement('div');
        tempEl.style.fontFamily = fontFamily;
        tempEl.style.visibility = 'hidden';
        tempEl.style.position = 'absolute';
        tempEl.style.fontSize = '16px';
        tempEl.style.fontWeight = '700';
        tempEl.textContent = 'あいうえお漢字サンプルABCDEF123456';
        document.body.appendChild(tempEl);
        tempElements.push(tempEl);
      });

      // 少し待機してからクリーンアップ
      setTimeout(() => {
        tempElements.forEach((el) => document.body.removeChild(el));
      }, 2000);
    }
  } catch (err) {
    console.error('フォント読み込みエラー:', err);
  }
};

// ページの読み込み時にフォントを先読み
preloadFont();

// フォントを確実に読み込むためのプリロードエレメントを作成
const createFontPreloader = () => {
  const preloader = document.createElement('div');
  preloader.id = 'font-preloader';
  preloader.innerText = 'あいうえお漢字サンプルABCDEF123';
  preloader.style.position = 'absolute';
  preloader.style.visibility = 'hidden';
  preloader.style.fontFamily = '"M PLUS Rounded 1c", sans-serif';
  preloader.style.fontWeight = 'bold';
  document.body.appendChild(preloader);
};

// ページ読み込み時にフォントプリローダーを作成
createFontPreloader();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
