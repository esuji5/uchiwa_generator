// filepath: /Users/esuji/medi/uchiwa_generator/uchiwa-frontend/src/hooks/useUchiwaState.tsx
import React, { useState, useRef, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HeartItem, DecoItem, TextItem } from '../types';
import { fonts, heartSizes, decoShapes, heartShapes } from '../constants';

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
      fillMode: data.fm || 'uchiwa'
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
  
  // 従来の単一テキスト用の状態（後方互換性のため残す）
  const [text, setText] = useState('ピース');
  const [textColor, setTextColor] = useState('#FF69B4');
  const [bgColor, setBgColor] = useState(initialState?.bgColor || '#000000');
  const [font, setFont] = useState('"M PLUS Rounded 1c", sans-serif');
  const [fontSize, setFontSize] = useState(60);
  const [fillMode, setFillMode] = useState(initialState?.fillMode || 'rounded'); // 'uchiwa', 'rounded', 'all', 'none'
  
  // 複数テキスト用の状態
  const [textItems, setTextItems] = useState<TextItem[]>(() => {
    // URLパラメータからの復元を優先
    if (initialState?.textItems) {
      return initialState.textItems;
    }
    
    // それ以外はローカルストレージから
    const saved = localStorage.getItem('uchiwa_text_items');
    if (saved) {
      try {
        const parsedItems = JSON.parse(saved);
        // 既存のアイテムに回転角度がなければ追加
        return parsedItems.map((item: TextItem) => ({
          ...item,
          rotate: item.rotate !== undefined ? item.rotate : 0
        }));
      } catch {}
    }
    // デフォルトで1つ目のテキスト項目を作成（従来のテキストと同じ内容）
    return [{
      id: uuidv4(),
      text: 'ピース',
      x: 180,
      y: 190,
      color: '#FF69B4',
      fontSize: 60,
      font: '"M PLUS Rounded 1c", sans-serif',
      rotate: 0
    }];
  });
  const [hearts, setHearts] = useState<HeartItem[]>(() => {
    const saved = localStorage.getItem('uchiwa_hearts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
  const [decos, setDecos] = useState<DecoItem[]>(() => {
    // URLパラメータからの復元を優先
    if (initialState?.decos) {
      return initialState.decos;
    }
    
    // それ以外はローカルストレージから
    const saved = localStorage.getItem('uchiwa_decos');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {}
    }
    return [];
  });
  const [selectedHeartSize, setSelectedHeartSize] = useState<number>(48);
  const [isDownloading, setIsDownloading] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);
  const dragIndex = useRef<number | null>(null);
  const offset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const dragDecoIndex = useRef<number | null>(null);
  const decoOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // 現在の状態をURLパラメータとして取得する関数
  const getShareableUrl = () => {
    const state = {
      textItems,
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

  // SVGをPNGとしてダウンロード
  const handleDownload = async () => {
    setIsDownloading(true);
    setTimeout(() => {
      const svg = document.getElementById('uchiwa-svg');
      if (!svg) {
        setIsDownloading(false);
        return;
      }
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 360;
        canvas.height = 360;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          // キャンバスの透明度を有効にする
          ctx.clearRect(0, 0, 360, 360);
          
          // noneモード時のみ背景を白で塗りつぶし
          if (fillMode === 'none') {
            ctx.fillStyle = '#fff';
            ctx.fillRect(0, 0, 360, 360);
          }
          
          ctx.drawImage(img, 0, 0);
          const a = document.createElement('a');
          a.download = 'uchiwa.png';
          // 透明度を保持したPNG形式で出力（品質は1.0で最高品質）
          a.href = canvas.toDataURL('image/png', 1.0);
          a.click();
        }
        URL.revokeObjectURL(url);
        setIsDownloading(false);
      };
      img.src = url;
    }, 0);
  };

  // 編集内容のlocalStorage保存・復元
  useEffect(() => {
    const saved = localStorage.getItem('uchiwa_all');
    if (saved) {
      try {
        const obj = JSON.parse(saved);
        if (typeof obj.text === 'string') setText(obj.text);
        if (typeof obj.textColor === 'string') setTextColor(obj.textColor);
        if (typeof obj.bgColor === 'string') setBgColor(obj.bgColor);
        if (typeof obj.font === 'string') setFont(obj.font);
        if (typeof obj.fontSize === 'number') setFontSize(obj.fontSize);
        if (typeof obj.fillMode === 'string') setFillMode(obj.fillMode);
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('uchiwa_all', JSON.stringify({
      text, textColor, bgColor, font, fontSize, fillMode
    }));
  }, [text, textColor, bgColor, font, fontSize, fillMode]);
  
  useEffect(() => {
    localStorage.setItem('uchiwa_text_items', JSON.stringify(textItems));
  }, [textItems]);

  useEffect(() => {
    localStorage.setItem('uchiwa_hearts', JSON.stringify(hearts));
  }, [hearts]);

  useEffect(() => {
    localStorage.setItem('uchiwa_decos', JSON.stringify(decos));
  }, [decos]);

  // ハート追加（従来のUI互換のため残す）
  const addHeart = (color: string, rotate: number = 0) => {
    setDecos([...decos, { x: 180, y: 200, color, size: selectedHeartSize, id: uuidv4(), rotate, shape: 'heart' }]);
  };

  // 図形追加（5つまで制限）
  const addDeco = (shape: DecoItem['shape'], color: string, rotate: number = 0) => {
    // 5つ以上の図形がある場合は追加しない
    if (decos.length >= 5) {
      alert('図形は最大5つまで追加できます');
      return;
    }
    setDecos([...decos, { x: 180, y: 200, color, size: selectedHeartSize, id: uuidv4(), rotate, shape }]);
  };

  // ハートのドラッグ移動
  const handleMouseDown = (index: number) => (e: React.MouseEvent<SVGGElement, MouseEvent>) => {
    dragIndex.current = index;
    const svgRect = svgRef.current?.getBoundingClientRect();
    if (!svgRect) return;
    offset.current = {
      x: e.clientX - hearts[index].x,
      y: e.clientY - hearts[index].y,
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (dragIndex.current === null) return;
    setHearts(prev => {
      const newHearts = [...prev];
      newHearts[dragIndex.current!] = {
        ...newHearts[dragIndex.current!],
        x: e.clientX - offset.current.x,
        y: e.clientY - offset.current.y,
      };
      return newHearts;
    });
  };

  const onMouseUp = () => {
    dragIndex.current = null;
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  // 図形のドラッグ移動
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

  // ハート削除
  const removeHeart = (id: string) => {
    setHearts(hearts.filter(h => h.id !== id));
  };

  // 図形削除
  const removeDeco = (id: string) => {
    setDecos(decos.filter(d => d.id !== id));
  };

  // ハート一括削除（図形全削除と同じ動作）
  const clearHearts = () => setDecos([]);

  // 図形一括削除
  const clearDecos = () => setDecos([]);

  // 文字領域を避けてハートをランダム配置
  const addRandomHearts = (count: number = 8) => {
    const lines = text.split(/\r?\n/);
    const textTop = 190 + (0 - (lines.length - 1) / 2) * fontSize - fontSize * 0.7;
    const textBottom = 190 + (lines.length - 1 - (lines.length - 1) / 2) * fontSize + fontSize * 0.7;
    const margin = 30;
    const minX = 50, maxX = 310, minY = 60, maxY = 320;
    const newHearts: DecoItem[] = [];
    for (let i = 0; i < count; i++) {
      let x = 0, y = 0, tries = 0;
      do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        tries++;
      } while (y > textTop - margin && y < textBottom + margin && tries < 20);
      const color = heartShapes[Math.floor(Math.random() * heartShapes.length)].color;
      const rotate = [-15, 0, 15][Math.floor(Math.random() * 3)];
      const size = heartSizes[Math.floor(Math.random() * heartSizes.length)].value;
      newHearts.push({ x, y, color, size, id: uuidv4(), rotate, shape: 'heart' });
    }
    setDecos([...decos, ...newHearts]);
  };

  // 図形をランダム配置（5つまでに制限）
  const addRandomDecos = (count: number = 8) => {
    // 既存の図形数を考慮して、追加可能な数を計算
    const maxAddableItems = Math.max(0, 5 - decos.length);
    if (maxAddableItems <= 0) {
      alert('図形は最大5つまで追加できます');
      return;
    }
    
    // 追加可能な数に制限
    const actualCount = Math.min(count, maxAddableItems);
    
    const lines = text.split(/\r?\n/);
    const textTop = 190 + (0 - (lines.length - 1) / 2) * fontSize - fontSize * 0.7;
    const textBottom = 190 + (lines.length - 1 - (lines.length - 1) / 2) * fontSize + fontSize * 0.7;
    const margin = 30;
    const minX = 50, maxX = 310, minY = 60, maxY = 320;
    const newDecos: DecoItem[] = [];
    for (let i = 0; i < actualCount; i++) {
      let x = 0, y = 0, tries = 0;
      do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        tries++;
        // 文字領域を避ける
      } while (y > textTop - margin && y < textBottom + margin && tries < 20);
      const deco = decoShapes[Math.floor(Math.random() * decoShapes.length)];
      const rotate = [-15, 0, 15][Math.floor(Math.random() * 3)];
      const size = heartSizes[Math.floor(Math.random() * heartSizes.length)].value;
      newDecos.push({ x, y, color: deco.color, size, id: uuidv4(), rotate, shape: deco.shape as DecoItem['shape'] });
    }
    setDecos([...decos, ...newDecos]);
  };

  // 図形ごとにランダム配置（5つまでに制限）
  const addRandomDecosByShape = (shape: DecoItem['shape'], count: number = 8) => {
    // 既存の図形数を考慮して、追加可能な数を計算
    const maxAddableItems = Math.max(0, 5 - decos.length);
    if (maxAddableItems <= 0) {
      alert('図形は最大5つまで追加できます');
      return;
    }
    
    // 追加可能な数に制限
    const actualCount = Math.min(count, maxAddableItems);
    
    const lines = text.split(/\r?\n/);
    const textTop = 190 + (0 - (lines.length - 1) / 2) * fontSize - fontSize * 0.7;
    const textBottom = 190 + (lines.length - 1 - (lines.length - 1) / 2) * fontSize + fontSize * 0.7;
    const margin = 30;
    const minX = 50, maxX = 310, minY = 60, maxY = 320;
    const newDecos: DecoItem[] = [];
    // 色はshapeごとにデフォルト色を使う
    const decoColor = decoShapes.find(d => d.shape === shape)?.color || '#FF4081';
    for (let i = 0; i < actualCount; i++) {
      let x = 0, y = 0, tries = 0;
      do {
        x = Math.random() * (maxX - minX) + minX;
        y = Math.random() * (maxY - minY) + minY;
        tries++;
      } while (y > textTop - margin && y < textBottom + margin && tries < 20);
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
      color: textColor,
      fontSize: 40,
      font: font,
      rotate: 0 // デフォルトの回転角度を0度に設定
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

  return {
    // 従来の単一テキスト用の状態と関数
    text, setText,
    textColor, setTextColor,
    bgColor, setBgColor,
    font, setFont,
    fontSize, setFontSize,
    fillMode, setFillMode,
    // 複数テキスト用の状態と関数
    textItems, setTextItems,
    addTextItem,
    updateTextItem,
    removeTextItem,
    handleTextDragStart,
    // その他の状態と関数
    hearts, setHearts,
    decos, setDecos,
    selectedHeartSize, setSelectedHeartSize,
    isDownloading, setIsDownloading,
    svgRef,
    handleDownload,
    addHeart,
    addDeco,
    handleMouseDown,
    handleDecoMouseDown,
    removeHeart,
    removeDeco,
    clearHearts,
    clearDecos,
    addRandomHearts,
    addRandomDecos,
    addRandomDecosByShape,
    // URLパラメータ関連
    getShareableUrl,
    copyShareableUrl
  };
};
