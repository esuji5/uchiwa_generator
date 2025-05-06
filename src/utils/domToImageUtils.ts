// @ts-ignore型エラーを無視するため、anyとしてインポート
import * as domtoimage from 'dom-to-image-more';
import { fonts } from '../constants';

// dom-to-image-moreを使用した画像ダウンロード関数
export const downloadWithDomToImage = (
  containerSelector: string,
  backgroundColor: string | null = null,
  filename = 'uchiwa.png',
  fontFamily = '"M PLUS Rounded 1c", sans-serif' // ユーザーが選択したフォント
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
        svgElement.setAttribute('viewBox', '0 0 360 360');

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

    const generateImage = () => {
      console.log('画像生成を開始します。');
      adjustSvgStyles();
      hideElements();

      return domtoimage.toPng(previewElement, {
        quality: 1,
        bgcolor: backgroundColor || 'transparent',
        cacheBust: true,
        filter: () => true,
        embedFonts: true,
      });
    };

    document.fonts.ready
      .then(() => {
        console.log('Document fonts ready.');
        setTimeout(() => {
          generateImage()
            .then((dataUrl: string) => {
              showElements();
              const link = document.createElement('a');
              link.download = filename;
              link.href = dataUrl;
              link.click();
              console.log('画像を生成し、ダウンロードを開始しました');
              resolve();
            })
            .catch((error: Error) => {
              console.error('画像生成エラー:', error);
              showElements();
              reject(error);
            });
        }, 300);
      })
      .catch((err) => {
        console.error('Font readiness check failed:', err);
        reject(new Error('フォントの準備確認に失敗しました'));
      });
  });
};
