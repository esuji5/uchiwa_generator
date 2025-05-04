import domtoimage from 'dom-to-image-more';
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
            
        // ローカルフォントがなければ読み込みを試みる
        const loadGoogleFont = () => {
          if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c"]')) {
            const linkEl = document.createElement('link');
            linkEl.rel = 'stylesheet';
            linkEl.href = 'https://fonts.googleapis.com/css2?family=M+PLUS+Rounded+1c:wght@400;500;700&display=swap';
            linkEl.crossOrigin = 'anonymous'; // CORS対策
            
            linkEl.onload = () => {
              console.log('Google Fonts CSS が読み込まれました。');
              // CSSロード後、フォント自体の準備を待つ
              document.fonts.load('1em "M PLUS Rounded 1c"').then(() => {
                console.log('Google Fonts (M PLUS Rounded 1c) が準備完了しました。');
                googleFontLoaded = true;
                checkCompletion();
              }).catch(err => {
                console.error("Google Font の読み込みに失敗:", err);
                googleFontLoaded = true; // エラーでも次に進む
                checkCompletion();
              });
            };
            
            linkEl.onerror = () => {
              console.error("Google Fonts CSS の読み込みに失敗しました。代替フォントを使用します。");
              googleFontLoaded = true; // エラーでも次に進む
              checkCompletion();
            };
            
            document.head.appendChild(linkEl);
          } else {
            // 既にlinkタグがある場合は、フォントの準備を直接待つ
            document.fonts.load('1em "M PLUS Rounded 1c"').then(() => {
              console.log('Google Fonts (M PLUS Rounded 1c) は既に準備完了しています。');
              googleFontLoaded = true;
              checkCompletion();
            }).catch(err => {
              console.error("Google Font の読み込みに失敗:", err);
              googleFontLoaded = true; // エラーでも次に進む
              checkCompletion();
            });
          }
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
            @font-face {
              font-family: 'Twemoji Mozilla';
              src: url('https://cdn.jsdelivr.net/npm/@svgmoji/twemoji@latest/fonts/TwitterColorEmoji-SVGinOT.ttf') format('truetype');
              font-weight: normal;
              font-style: normal;
              font-display: swap; /* フォント読み込み中の挙動 */
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
          
          // 絵文字が含まれているかチェック (テキストノードのみ)
          const hasEmoji = /[\p{Emoji}]/u.test(node.textContent || '');
          
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
          // domtoimage.toPng の style オプションから Twemoji を優先的に適用
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
            }
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
