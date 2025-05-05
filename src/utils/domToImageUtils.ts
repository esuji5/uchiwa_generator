// @ts-ignore型エラーを無視するため、anyとしてインポート
import * as domtoimage from 'dom-to-image-more';
import { fonts } from '../constants';

// dom-to-image-moreを使用した画像ダウンロード関数
export const downloadWithDomToImage = (
  containerSelector: string,
  backgroundColor: string | null = null,
  filename: string = 'uchiwa.png',
    fontFamily: string = '"M PLUS Rounded 1c", sans-serif' // ユーザーが選択したフォント

): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    // プレビュー要素を取得
    const previewElement = document.querySelector(containerSelector) as HTMLElement;
    if (!previewElement) {
      reject(new Error('プレビュー要素が見つかりませんでした'));
      return;
    }
    
    // スタイル情報を保存
    const originalStyles = new Map<Element, string>();
    
    // ダウンロード前に非表示にしたい要素を一時的に隠す
    const hideElements = () => {
      // 削除ボタンを非表示
      const deleteButtons = document.querySelectorAll('.deco-delete-button');
      deleteButtons.forEach((el: Element) => {
        originalStyles.set(el, (el as HTMLElement).style.cssText);
        (el as HTMLElement).style.display = 'none';
      });
      
      // 位置マーカーを非表示
      const positionMarkers = document.querySelectorAll('circle[fill="rgba(255,0,0,0.5)"]');
      positionMarkers.forEach((el: Element) => {
        originalStyles.set(el, (el as HTMLElement).style.cssText);
        (el as HTMLElement).style.display = 'none';
      });
    };
    
    // 非表示にした要素を元に戻す
    const showElements = () => {
      // 削除ボタンを再表示
      const deleteButtons = document.querySelectorAll('.deco-delete-button');
      deleteButtons.forEach((el: Element) => {
        if (originalStyles.has(el)) {
          (el as HTMLElement).style.cssText = originalStyles.get(el) || '';
        } else {
          (el as HTMLElement).style.display = '';
        }
      });
      
      // 位置マーカーを再表示
      const positionMarkers = document.querySelectorAll('circle[fill="rgba(255,0,0,0.5)"]');
      positionMarkers.forEach((el: Element) => {
        if (originalStyles.has(el)) {
          (el as HTMLElement).style.cssText = originalStyles.get(el) || '';
        } else {
          (el as HTMLElement).style.display = '';
        }
      });
      
      // スタイル情報をクリア
      originalStyles.clear();
    };
    
    // SVG要素のスタイルを調整（縮小や位置ずれを防止）
    const adjustSvgStyles = () => {
      const svgElement = document.getElementById('uchiwa-svg');
      if (svgElement) {
        // 属性を明示的に設定
        svgElement.setAttribute('width', '360');
        svgElement.setAttribute('height', '360');
        svgElement.setAttribute('viewBox', `0 0 360 360`);
        
        // CSSスタイルを一括設定
        svgElement.style.cssText = `
          width: 360px !important;
          height: 360px !important;
          margin: 0 !important;
          padding: 0 !important;
          display: block !important;
          position: relative !important;
          left: 0 !important;
          top: 0 !important;
          transform: none !important;
          max-width: 360px !important;
          max-height: 360px !important;
          border: none !important;
        `;
      }
      
      // コンテナのスタイルも一括設定
      previewElement.style.cssText = `
        width: 360px !important;
        height: 360px !important;
        padding: 0 !important;
        margin: 0 !important;
        border: none !important;
        overflow: hidden !important;
        position: relative !important;
        display: block !important;
        max-width: 360px !important;
        max-height: 360px !important;
        background-color: ${backgroundColor || 'transparent'} !important;
      `;
    };
    
        // フォントと要素の準備を行う
    // Google Fontsをロードする
    const loadRequiredFonts = () => {
      return new Promise<void>((resolve) => {
        console.log('必要なフォントを読み込みます...');
        let googleFontLoaded = false;
        let twemojiFontLoaded = false;

        const checkCompletion = () => {
          if (googleFontLoaded && twemojiFontLoaded) {
            console.log('すべてのフォントの準備ができました。');
            // フォントレンダリングの安定のため少し待機
            setTimeout(resolve, 300);
          }
        };

        // 1. Google Fonts (M PLUS Rounded 1c) の読み込みとフォールバック処理
        // まず、アプリケーションがindex.tsxで既にロードしたフォントを使えるか確認
        const checkLocalFonts = () => {
          console.log('ローカルに読み込み済みのフォントを確認します。');
          document.fonts.ready.then(() => {
            const fontCheck = document.fonts.check('1em "M PLUS Rounded 1c"');
            if (fontCheck) {
              console.log('M PLUS Rounded 1cフォントはすでにロード済みです。');
              googleFontLoaded = true;
              checkCompletion();
              return true;
            }
            return false;
          });
          return false;
        };
            
        // ローカルフォントがなければ読み込みを試みる - 直接TTFを参照するスタイルを追加
        const loadGoogleFont = () => {
          // M PLUS Rounded 1c フォントを直接参照するスタイルを作成
          const fontStyleId = 'mplus-rounded-font-face';
          if (!document.getElementById(fontStyleId)) {
            const styleEl = document.createElement('style');
            styleEl.id = fontStyleId;
            
            // 直接TTFファイルを参照するスタイルを定義
            styleEl.textContent = `
              /* M PLUS Rounded 1c フォントの直接参照 */
              @font-face {
                font-family: 'M PLUS Rounded 1c';
                font-style: normal;
                font-weight: 400;
                font-display: swap;
                src: local('M PLUS Rounded 1c'), local('M PLUS Rounded 1c Regular'),
                     url('https://fonts.gstatic.com/s/mplusrounded1c/v16/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064ZsK.ttf') format('truetype');
              }
              @font-face {
                font-family: 'M PLUS Rounded 1c';
                font-style: normal;
                font-weight: 700;
                font-display: swap;
                src: local('M PLUS Rounded 1c Bold'),
                     url('https://fonts.gstatic.com/s/mplusrounded1c/v16/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064ZsK.ttf') format('truetype');
              }
            `;
            document.head.appendChild(styleEl);

            // Google Fontsサーバーへのプリコネクト設定
            if (!document.querySelector('link[rel="preconnect"][href="https://fonts.googleapis.com"]')) {
              const preconnectLink = document.createElement('link');
              preconnectLink.rel = 'preconnect';
              preconnectLink.href = 'https://fonts.googleapis.com';
              document.head.appendChild(preconnectLink);
              
              const gstaticLink = document.createElement('link');
              gstaticLink.rel = 'preconnect';
              gstaticLink.href = 'https://fonts.gstatic.com';
              gstaticLink.crossOrigin = 'anonymous';
              document.head.appendChild(gstaticLink);
            }
            
            // 既存のlinkタグがあれば、それは使わずに新しいスタイルを優先
            const existingLink = document.querySelector('link[href*="fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c"]');
            if (existingLink) {
              console.log('既存のGoogle Fontsリンクがありますが、ローカル定義を優先します');
            }
          }
          
          // フォントの準備を待つ - Promise.allSettledで確実に進行
          Promise.allSettled([
            document.fonts.load('1em "M PLUS Rounded 1c"'),
            document.fonts.load('700 1em "M PLUS Rounded 1c"')
          ]).then((results) => {
            const successCount = results.filter(r => r.status === 'fulfilled').length;
            if (successCount > 0) {
              console.log(`M PLUS Rounded 1c フォントが準備完了しました (${successCount}/${results.length}成功)`);
            } else {
              console.warn('フォント読み込みは失敗しましたが、処理を続行します');
            }
            googleFontLoaded = true; // どちらの場合も処理を続行
            checkCompletion();
          }).catch(err => {
            console.error("M PLUS Rounded 1c フォントの読み込みでエラー:", err);
            googleFontLoaded = true; // エラーでも次に進む
            checkCompletion();
          });
        };
        
        // ローカルフォントを確認し、なければ読み込む
        if (!checkLocalFonts()) {
          loadGoogleFont();
        }

        // 2. Twemoji フォントの読み込み (@font-face)
        const twemojiStyleId = 'twemoji-font-face';
        if (!document.getElementById(twemojiStyleId)) {
          const styleEl = document.createElement('style');
          styleEl.id = twemojiStyleId;
          styleEl.textContent = `
            /* 絵文字の表示を改善するためのフォント定義 */
            @font-face {
              font-family: 'Twemoji Mozilla';
              /* システムのネイティブ絵文字フォントを使用 */
              src: local('Apple Color Emoji'), local('Segoe UI Emoji'), local('Noto Color Emoji'), local('Segoe UI Symbol');
              unicode-range: U+1F300-1F5FF, U+1F600-1F64F, U+1F680-1F6FF, U+2600-26FF, U+2700-27BF, U+1F1E6-1F1FF, U+1F191-1F251, U+1F004, U+1F0CF, U+1F170-1F171, U+1F17E-1F17F, U+1F18E, U+3030, U+2B50, U+2B55, U+2934-2935, U+2B05-2B07, U+2B1B-2B1C, U+3297, U+3299, U+303D, U+00A9, U+00AE, U+2122, U+23F3, U+24C2, U+23E9-23EF, U+25AA-25AB, U+25FB-25FE, U+25B6, U+25C0, U+2B06, U+2197-2198, U+2195, U+2194, U+21A9-21AA, U+21AA, U+231A-231B, U+1F190, U+1F19A;
              font-weight: normal;
              font-style: normal;
              font-display: swap;
            }
          `;
          document.head.appendChild(styleEl);
          
          // @font-face 定義後、フォントの準備を待つ
          document.fonts.load('1em "Twemoji Mozilla"').then(() => {
              console.log('Twemoji Mozilla フォントが準備完了しました。');
              twemojiFontLoaded = true;
              checkCompletion();
          }).catch(err => {
              console.error("Twemoji Font の読み込みに失敗:", err);
              // エラーが発生しても次に進む
              twemojiFontLoaded = true;
              checkCompletion();
          });
        } else {
          // 既にstyleタグがある場合は、フォントの準備を直接待つ
          document.fonts.load('1em "Twemoji Mozilla"').then(() => {
              console.log('Twemoji Mozilla フォントは既に準備完了しています。');
              twemojiFontLoaded = true;
              checkCompletion();
          }).catch(err => {
              console.error("Twemoji Font の読み込みに失敗:", err);
              // エラーが発生しても次に進む
              twemojiFontLoaded = true;
              checkCompletion();
          });
        }
      });
    };
    
    // フォントを読み込む
    loadRequiredFonts().then(() => {
      console.log('フォントの読み込み処理が完了しました。画像生成を開始します。');
      
      // SVGスタイルを調整
      adjustSvgStyles();
      
      // 非表示にしたい要素を隠す
      hideElements();

      // テキスト要素のフォントを設定 (Twemoji対応)
      const setFontForTextElements = () => {
        // SVG内のテキスト要素を取得
        const svgElement = document.getElementById('uchiwa-svg');
        if (!svgElement) return;

        // 最初にスタイル要素を追加（テキスト要素に影響するスタイル）
        if (!svgElement.querySelector('style#embedded-font')) {
          const styleEl = document.createElementNS('http://www.w3.org/2000/svg', 'style');
          styleEl.id = 'embedded-font';
          // Twemojiを最優先に設定し、絵文字のレンダリングを確実にする
          styleEl.textContent = `
            text, tspan {
              font-family: "Twemoji Mozilla", "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", "Segoe UI Emoji", "Apple Color Emoji", sans-serif !important;
              font-weight: bold !important;
              -webkit-font-smoothing: antialiased !important;
              text-rendering: optimizeLegibility !important;
            }
          `;
          svgElement.insertBefore(styleEl, svgElement.firstChild);
        }

        // すべてのテキスト要素とtspan要素に属性として設定
        const textNodes = svgElement.querySelectorAll('text, tspan');
        textNodes.forEach(node => {
          // Twemojiを最優先に設定
          node.setAttribute('font-family', '"Twemoji Mozilla", "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", "Segoe UI Emoji", "Apple Color Emoji", sans-serif');
          node.setAttribute('font-weight', 'bold');
          
          // 絵文字が含まれているかチェック (ES5互換の方法で)
          // 絵文字の一般的なUnicode範囲をチェック
          const textContent = node.textContent || '';
          const hasEmoji = (function(text) {
            // 簡易的な絵文字検出（完全ではありませんが、一般的な絵文字をカバー）
            const emojiRanges = [
              [0x1F600, 0x1F64F], // 顔文字、感情
              [0x1F300, 0x1F5FF], // その他の絵文字
              [0x1F680, 0x1F6FF], // 輸送と地図の記号
              [0x1F700, 0x1F77F], // 錬金術記号
              [0x1F780, 0x1F7FF], // 幾何学的形状
              [0x1F800, 0x1F8FF], // 補足矢印
              [0x1F900, 0x1F9FF], // 補足記号と絵文字
              [0x1FA00, 0x1FA6F], // チェス駒
              [0x1FA70, 0x1FAFF]  // 記号
            ];
            
            for (let i = 0; i < text.length; i++) {
              const code = text.codePointAt(i) || 0;
              // サロゲートペアのチェック
              if (code > 0xFFFF) {
                i++; // サロゲートペアの2バイト目をスキップ
              }
              
              // 絵文字範囲のチェック
              for (const [start, end] of emojiRanges) {
                if (code >= start && code <= end) {
                  return true;
                }
              }
            }
            return false;
          })(textContent);
          
          // 既存のスタイル属性に追加
          const currentStyle = node.getAttribute('style') || '';
          // Twemojiを適用し、絵文字の表示を最適化
          node.setAttribute('style', `${currentStyle}; 
            font-family: "Twemoji Mozilla", "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", "Segoe UI Emoji", "Apple Color Emoji", sans-serif !important; 
            font-weight: bold !important;
            -webkit-font-smoothing: antialiased !important;
            text-rendering: optimizeLegibility !important;
            ${hasEmoji ? 'font-feature-settings: "liga" 1 !important;' : ''}
          `);
          
          // 絵文字を含むテキストノードには特別な属性を設定
          if (hasEmoji) {
            node.setAttribute('data-contains-emoji', 'true');
          }
        });
      };
      
      // フォント設定を適用
      setFontForTextElements();

        try {
          // シンプルな設定で画像生成を行う
          // 事前に外部スタイルシートをインラインに変換
          // CORSエラー回避のため、Google Fontsのリンクをコメントアウト
          const externalStylesheets = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
          const googleFontLinks = externalStylesheets.filter(link => 
            (link as HTMLLinkElement).href && 
            (link as HTMLLinkElement).href.includes('fonts.googleapis.com')
          );
          
          // 一時的にGoogle Fontsのリンクを非アクティブ化
          googleFontLinks.forEach(link => {
            link.setAttribute('data-original-href', (link as HTMLLinkElement).href);
            (link as HTMLLinkElement).href = '';
          });
          
          // fontのCORS問題を避けるため、一時的なインラインスタイルを追加
          const fontInlineStyle = document.createElement('style');
          fontInlineStyle.id = 'temp-font-style-for-export';
          fontInlineStyle.textContent = `
            text, tspan {
              font-family: "Twemoji Mozilla", "M PLUS Rounded 1c", sans-serif !important;
              font-weight: bold !important;
              -webkit-font-smoothing: antialiased !important;
            }
            
            /* 直接TTFファイルを参照する定義を追加 */
            @font-face {
              font-family: 'M PLUS Rounded 1c';
              font-style: normal;
              font-weight: 400;
              font-display: swap;
              src: local('M PLUS Rounded 1c'), 
                   url('https://fonts.gstatic.com/s/mplusrounded1c/v16/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064ZsK.ttf') format('truetype');
            }
            
            @font-face {
              font-family: 'M PLUS Rounded 1c';
              font-style: normal;
              font-weight: 700;
              font-display: swap;
              src: local('M PLUS Rounded 1c Bold'), 
                   url('https://fonts.gstatic.com/s/mplusrounded1c/v16/VdGBAYIAV6gnpUpoWwNkYvrugw9RuM064ZsK.ttf') format('truetype');
            }
          `;
          document.head.appendChild(fontInlineStyle);
          
          // フォント関連のエラーを無視するようにする
          const originalConsoleError = console.error;
          console.error = function(msg, ...args) {
            // フォント関連のネットワークエラーを無視
            if (typeof msg === 'string' && 
                (msg.includes('NetworkError') || 
                 msg.includes('Failed to read the \'cssRules\'') ||
                 msg.includes('Font'))) {
              console.warn('フォントエラーを無視: ', msg);
              return;
            }
            originalConsoleError.apply(console, [msg, ...args]);
          };
          
          // 標準オプションでより少ないスタイルを使用
          return domtoimage.toPng(previewElement, {
            quality: 1,
            bgcolor: backgroundColor || 'transparent',
            cacheBust: true,
            filter: () => true, // すべてのノードを含める
            style: {
              // テキスト要素のフォント設定に Twemoji を最優先で追加
              'text': {
                'font-family': '"Twemoji Mozilla", "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", "Segoe UI Emoji", "Apple Color Emoji", sans-serif',
                'font-weight': 'bold',
                '-webkit-font-smoothing': 'antialiased',
                'text-rendering': 'optimizeLegibility'
              },
              'tspan': {
                'font-family': '"Twemoji Mozilla", "M PLUS Rounded 1c", "Hiragino Maru Gothic ProN", "ヒラギノ丸ゴ ProN W4", "Segoe UI Emoji", "Apple Color Emoji", sans-serif',
                'font-weight': 'bold',
                '-webkit-font-smoothing': 'antialiased',
                'text-rendering': 'optimizeLegibility'
              },
              // 絵文字を含む要素に特別なスタイルを適用
              '[data-contains-emoji="true"]': {
                'font-family': '"Twemoji Mozilla", sans-serif',
                'font-feature-settings': '"liga" 1'
              }
            }}

          ).finally(() => {
            // コンソールエラー処理を元に戻す
            console.error = originalConsoleError;
          }).then((dataUrl) => {
            // Google Fontsのリンクを元に戻す
            googleFontLinks.forEach(link => {
              const originalHref = (link as HTMLLinkElement).getAttribute('data-original-href');
              if (originalHref) {
                (link as HTMLLinkElement).href = originalHref;
              }
            });
            
            // 一時的なスタイルを削除
            const tempFontStyle = document.getElementById('temp-font-style-for-export');
            if (tempFontStyle) {
              document.head.removeChild(tempFontStyle);
            }
            
            return dataUrl;
          });
        } catch (error) {
          console.error('DOM操作エラー', error);
          showElements();
          throw error;
        }
      })
      .then((dataUrl: string) => {
        try {
          // データURLの検証
          if (!dataUrl || !dataUrl.startsWith('data:image/png;base64,')) {
            throw new Error('無効な画像データが生成されました');
          }
          
          // ダウンロードリンクを作成
          const link = document.createElement('a');
          link.download = filename;
          link.href = dataUrl;
          link.click();
          
          // 成功のログを出力
          console.log('画像を生成し、ダウンロードを開始しました');
          
          // 非表示にした要素を元に戻す
          showElements();
          resolve();
        } catch (downloadError) {
          console.error('ダウンロード処理エラー:', downloadError);
          showElements();
          reject(downloadError);
        }
      })
      .catch((error: Error) => {
        console.error('画像生成エラー:', error);
        
        // 非表示にした要素を元に戻す
        showElements();
        reject(error);
      });
  });
};
