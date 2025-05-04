// filepath: /Users/esuji/medi/uchiwa_generator/uchiwa-frontend/src/hooks/useUchiwaState.tsx
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { DecoItem, TextItem, DownloadMethod } from '../types';
import { fonts, heartSizes, decoShapes } from '../constants';
import { downloadWithDomToImage } from '../utils/domToImageUtils';

// URLパラメータをエンコードする関数（マルチバイト文字に対応）
const encodeState = (state: {
  textItems: TextItem[],
  decos: DecoItem[],
  bgColor: string,
  fillMode: string
}) => {
  const data = {
    t: state.textItems.map(item => ({
      text: item.text,
      x: Math.round(item.x),
      y: Math.round(item.y),
      c: item.color,
      s: item.fontSize,
      f: item.font,
      r: item.rotate || 0
    })),
    d: state.decos.map(deco => ({
      x: Math.round(deco.x),
      y: Math.round(deco.y),
      c: deco.color,
      s: deco.size,
      r: deco.rotate || 0,
      t: deco.shape
    })),
    bg: state.bgColor,
    fm: state.fillMode
  };
  // マルチバイト文字に対応するためにencodeURIComponentを使用
  return encodeURIComponent(JSON.stringify(data));
};

// URLパラメータをデコードする関数（マルチバイト文字に対応）
const decodeState = (encoded: string) => {
  try {
    // URLパラメータをデコード
    const decodedData = decodeURIComponent(encoded);
    const data = JSON.parse(decodedData);
    
    return {
      textItems: (data.t || []).map((item: any) => ({
        id: uuidv4(),
        text: item.text || '',
        x: item.x || 180,
        y: item.y || 180,
        color: item.c || '#FF69B4',
        fontSize: item.s || 40,
        font: item.f || fonts[0].value,
        rotate: item.r || 0
      })),
      decos: (data.d || []).slice(0, 5).map((deco: any) => ({
        id: uuidv4(),
        x: deco.x || 180,
        y: deco.y || 180,
        color: deco.c || '#FF69B4',
        size: deco.s || 48,
        rotate: deco.r || 0,
        shape: deco.t || 'heart'
      })),
      bgColor: data.bg || '#000000',
      fillMode: data.fm || 'rounded'
    };
  } catch (e) {
    console.error('URLパラメータの解析に失敗しました', e);
    return null;
  }
};

export const useUchiwaState = () => {
  // URLパラメータからの状態復元を試みる
  const getInitialStateFromUrl = () => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const stateParam = urlParams.get('state');
      if (stateParam) {
        try {
          return decodeState(stateParam);
        } catch (e) {
          console.error('URLパラメータの復元に失敗しました', e);
        }
      }
    }
    return null;
  };
  
  const initialState = getInitialStateFromUrl();
  
  // 複数テキスト用の状態
  const [textItems, setTextItems] = useState<TextItem[]>(() => {
    // URLパラメータからの復元を優先
    if (initialState?.textItems && initialState.textItems.length > 0) {
      return initialState.textItems;
    }
    
    // ローカルストレージから (キーを変更または削除検討)
    const saved = localStorage.getItem('uchiwa_text_items');
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        if (Array.isArray(parsedItems) && parsedItems.length > 0) {
          // 既存のアイテムに回転角度がなければ追加
          return parsedItems.map((item: TextItem) => ({
            ...item,
            rotate: item.rotate !== undefined ? item.rotate : 0
          }));
        }
      } catch {}
    }
    // デフォルトで中央に1つテキスト項目を作成
    return [{
      id: uuidv4(),
      text: 'テキスト', // デフォルトテキスト変更
      x: 180,
      y: 180, // 中央寄りに変更
      color: '#FF69B4',
      fontSize: 60,
      font: '"M PLUS Rounded 1c", sans-serif',
      rotate: 0
    }];
  });
  const [bgColor, setBgColor] = useState(initialState?.bgColor || '#000000');
  const [fillMode, setFillMode] = useState(initialState?.fillMode || 'rounded'); // 'uchiwa', 'rounded', 'all', 'none'
  
  const [decos, setDecos] = useState<DecoItem[]>(() => {
    // URLパラメータからの復元を優先
    if (initialState?.decos) {
      return initialState.decos;
    }
    
    // ローカルストレージから
    const saved = localStorage.getItem('uchiwa_decos');
    if (saved) {
      try {
        const parsedDecos = JSON.parse(saved);
        if (Array.isArray(parsedDecos)) {
          return parsedDecos;
        }
      } catch {}
    }
    return [];
  });
  const [selectedHeartSize, setSelectedHeartSize] = useState<number>(48);
  const [isDownloading, setIsDownloading] = useState(false);
  // downloadMethodはdomtoimage固定
  const downloadMethod: DownloadMethod = 'domtoimage';
  const setDownloadMethod = () => {}; // 互換性のために空関数を保持
  const svgRef = useRef<SVGSVGElement>(null);
  const dragDecoIndex = useRef<number | null>(null);
  const decoOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 現在の状態をURLパラメータとして取得する関数
  const getShareableUrl = () => {
    const state = {
      textItems, // textItems を使用
      decos,
      bgColor,
      fillMode
    };
    
    const encodedState = encodeState(state);
    const url = new URL(window.location.href);
    url.search = `?state=${encodedState}`;
    return url.toString();
  };
  
  // 共有用URLをクリップボードにコピー
  const copyShareableUrl = () => {
    const url = getShareableUrl();
    navigator.clipboard.writeText(url)
      .then(() => {
        alert('共有用URLをクリップボードにコピーしました！');
      })
      .catch(() => {
        alert('URLのコピーに失敗しました。');
      });
  };
  
  // パラメータのみをクリップボードにコピー
  const copyParametersOnly = () => {
    const url = getShareableUrl();
    const urlObj = new URL(url);
    // パラメータの前に「?」をつけてコピー
    const params = `?${urlObj.searchParams.toString()}`;
    navigator.clipboard.writeText(params)
      .then(() => {
        alert('?付きパラメータをクリップボードにコピーしました！');
      })
      .catch(() => {
        alert('パラメータのコピーに失敗しました。');
      });
  };

  // dom-to-image-moreを使用した画像ダウンロード関数
  const handleDomToImageDownload = () => {
    setIsDownloading(true);

    downloadWithDomToImage(
      '.preview-svg-container', 
      fillMode === 'none' ? '#ffffff' : null,
      'uchiwa.png' // フォントファミリー引数は削除
    )
    .then(() => {
      setIsDownloading(false);
    })
    .catch((error) => {
      console.error('画像生成エラー:', error);
      alert('画像の生成に失敗しました。別の方法で試してください。');
      setIsDownloading(false);
    });
  };

  // handleDownload を簡略化
  const handleDownload = () => {
    // dom-to-image のみ実行
    handleDomToImageDownload();
  };

  // ローカルストレージ保存・復元ロジックを修正
  useEffect(() => {
    // uchiwa_all の読み込みを削除
    // const saved = localStorage.getItem('uchiwa_all');
    // ...
  }, []);

  useEffect(() => {
    // uchiwa_all の保存を削除
    // localStorage.setItem('uchiwa_all', JSON.stringify({ ... }));
  }, []); // 依存配列を空にするか、関連する状態に変更
  
  useEffect(() => {
    localStorage.setItem('uchiwa_text_items', JSON.stringify(textItems));
  }, [textItems]);

  useEffect(() => {
    localStorage.setItem('uchiwa_decos', JSON.stringify(decos));
  }, [decos]);

  // 図形追加 (addDeco) は変更なし
  const addDeco = (shape: DecoItem['shape'], color: string, rotate: number = 0) => {
    // 5つ以上の図形がある場合は追加しない
    if (decos.length >= 5) {
      alert('図形は最大5つまで追加できます');
      return;
    }
    setDecos([...decos, { x: 180, y: 200, color, size: selectedHeartSize, id: uuidv4(), rotate, shape }]);
  };

  // 図形のドラッグ移動 (handleDecoMouseDown, onDecoMouseMove, onDecoMouseUp) は変更なし
  const handleDecoMouseDown = (index: number) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
    dragDecoIndex.current = index;
    decoOffset.current = {
      x: e.clientX - decos[index].x,
      y: e.clientY - decos[index].y,
    };
    document.addEventListener('mousemove', onDecoMouseMove);
    document.addEventListener('mouseup', onDecoMouseUp);
  };

  const onDecoMouseMove = (e: MouseEvent) => {
    if (dragDecoIndex.current === null) return;
    setDecos(prev => {
      const newDecos = [...prev];
      newDecos[dragDecoIndex.current!] = {
        ...newDecos[dragDecoIndex.current!],
        x: e.clientX - decoOffset.current.x,
        y: e.clientY - decoOffset.current.y,
      };
      return newDecos;
    });
  };

  const onDecoMouseUp = () => {
    dragDecoIndex.current = null;
    document.removeEventListener('mousemove', onDecoMouseMove);
    document.removeEventListener('mouseup', onDecoMouseUp);
  };

  // 図形削除
  const removeDeco = (id: string) => {
    setDecos(decos.filter(d => d.id !== id));
  };

  // 図形一括削除
  const clearDecos = () => setDecos([]);

  // 図形をランダム配置（5つまでに制限）
  const addRandomDecos = (count: number = 8) => {
    const maxAddableItems = Math.max(0, 5 - decos.length);
    if (maxAddableItems <= 0) {
      alert('図形は最大5つまで追加できます');
      return;
    }
    const actualCount = Math.min(count, maxAddableItems);
    
    const minX = 50, maxX = 310, minY = 60, maxY = 320;
    const newDecos: DecoItem[] = [];
    for (let i = 0; i < actualCount; i++) {
      let x = Math.random() * (maxX - minX) + minX;
      let y = Math.random() * (maxY - minY) + minY;
      // TODO: 必要であれば textItems の領域との衝突判定を追加
      const deco = decoShapes[Math.floor(Math.random() * decoShapes.length)];
      const rotate = [-15, 0, 15][Math.floor(Math.random() * 3)];
      const size = heartSizes[Math.floor(Math.random() * heartSizes.length)].value;
      newDecos.push({ x, y, color: deco.color, size, id: uuidv4(), rotate, shape: deco.shape as DecoItem['shape'] });
    }
    setDecos([...decos, ...newDecos]);
  };

  // 図形ごとにランダム配置（5つまでに制限）
  const addRandomDecosByShape = (shape: DecoItem['shape'], count: number = 8) => {
    const maxAddableItems = Math.max(0, 5 - decos.length);
    if (maxAddableItems <= 0) {
      alert('図形は最大5つまで追加できます');
      return;
    }
    const actualCount = Math.min(count, maxAddableItems);
    
    const minX = 50, maxX = 310, minY = 60, maxY = 320;
    const newDecos: DecoItem[] = [];
    const decoColor = decoShapes.find(d => d.shape === shape)?.color || '#FF4081';
    for (let i = 0; i < actualCount; i++) {
      let x = Math.random() * (maxX - minX) + minX;
      let y = Math.random() * (maxY - minY) + minY;
      // TODO: 必要であれば textItems の領域との衝突判定を追加
      const rotate = [-15, 0, 15][Math.floor(Math.random() * 3)];
      const size = heartSizes[Math.floor(Math.random() * heartSizes.length)].value;
      newDecos.push({ x, y, color: decoColor, size, id: uuidv4(), rotate, shape });
    }
    setDecos([...decos, ...newDecos]);
  };

  // テキスト項目を追加する
  const addTextItem = () => {
    // 5つまで追加可能
    if (textItems.length >= 5) return;
    
    // より視覚的に均等な配置にするための調整値
    const centerX = 180;
    const centerY = 180;
    const radius = 70; // 中央からの配置半径
    
    // 位置をテキスト数に応じて最適な配置で計算
    let newX = centerX;
    let newY = centerY;
    
    switch (textItems.length) {
      case 0:
        // 1つ目：中央
        newX = centerX;
        newY = centerY;
        break;
      case 1:
        // 2つ目：上部
        newX = centerX;
        newY = centerY - radius;
        break;
      case 2:
        // 3つ目：右側
        newX = centerX + radius;
        newY = centerY;
        break;
      case 3:
        // 4つ目：下部
        newX = centerX;
        newY = centerY + radius;
        break;
      case 4:
        // 5つ目：左側
        newX = centerX - radius;
        newY = centerY;
        break;
      default:
        // 念のため
        newX = centerX;
        newY = centerY;
    }
    
    setTextItems([...textItems, {
      id: uuidv4(),
      text: '',
      x: newX,
      y: newY,
      color: '#FF69B4', // デフォルト色を直接指定
      fontSize: 40,
      font: '"M PLUS Rounded 1c", sans-serif', // デフォルトフォントを直接指定
      rotate: 0
    }]);
  };

  // テキスト項目を更新する
  const updateTextItem = (id: string, updates: Partial<TextItem>) => {
    setTextItems(textItems.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  // テキスト項目を削除する
  const removeTextItem = (id: string) => {
    setTextItems(textItems.filter(item => item.id !== id));
  };

  // テキストアイテムの位置を移動する
  const handleTextDragStart = (id: string) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
    const item = textItems.find(item => item.id === id);
    if (!item) return;
    
    const dragOffset = {
      x: e.clientX - item.x,
      y: e.clientY - item.y
    };

    const onMouseMove = (moveEvent: MouseEvent) => {
      setTextItems(prev => prev.map(textItem => 
        textItem.id === id 
          ? { 
              ...textItem, 
              x: moveEvent.clientX - dragOffset.x,
              y: moveEvent.clientY - dragOffset.y,
              rotate: textItem.rotate || 0 // rotateプロパティがなければ0を設定
            } 
          : textItem
      ));
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  // リセット機能 (resetAllSettings) を修正
  const resetAllSettings = () => {
    if (window.confirm('すべての設定をリセットし、トップページに戻りますか？変更内容は失われます。')) {
      // 単一テキスト関連のデフォルト値設定を削除
      // setTextColor('#FF69B4');
      // setFont('"M PLUS Rounded 1c", sans-serif');
      // setFontSize(60);
      
      // bgColor と fillMode はリセット
      setBgColor('#000000');
      setFillMode('rounded');
      
      // デフォルトのテキストアイテムを1つ設定 (初期化ロジックと合わせる)
      setTextItems([{
        id: uuidv4(),
        text: 'テキスト',
        x: 180,
        y: 180,
        color: '#FF69B4',
        fontSize: 60,
        font: '"M PLUS Rounded 1c", sans-serif',
        rotate: 0
      }]);
      
      // 図形をクリア
      setDecos([]);
      // setHearts([]); // hearts は削除済み
      
      // URLをトップに戻す
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  };

  return {
    // 維持する状態と関数
    bgColor, setBgColor,
    fillMode, setFillMode,
    textItems, setTextItems,
    addTextItem,
    updateTextItem,
    removeTextItem,
    handleTextDragStart,
    decos, setDecos,
    selectedHeartSize, setSelectedHeartSize,
    isDownloading, setIsDownloading,
    downloadMethod, setDownloadMethod, // downloadMethod は維持 (UIで選択肢が残る場合)
    svgRef,
    handleDownload, // handleDownload は簡略化されたもの
    addDeco,
    handleDecoMouseDown,
    removeDeco,
    clearDecos,
    addRandomDecos,
    addRandomDecosByShape,
    getShareableUrl,
    copyShareableUrl,
    copyParametersOnly,
    resetAllSettings
  };
};
