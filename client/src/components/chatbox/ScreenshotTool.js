import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

const ScreenshotTool = () => {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionBox, setSelectionBox] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const selectionRef = useRef(null);

  const startSelecting = () => {
    setIsSelecting(true);
    // 初始化选择框状态
    setSelectionBox({ x: 0, y: 0, width: 400, height: 400 });
  };

  const onMouseDown = (e) => {
    if (!isSelecting) return;
    const startX = e.pageX;
    const startY = e.pageY;
    console.log(startX, startY);
    setSelectionBox({ ...selectionBox, x: startX, y: startY });

    const onMouseMove = (e) => {
      const width = e.pageX - startX;
      const height = e.pageY - startY;
      setSelectionBox({ x: startX, y: startY, width, height });
    };

    const onMouseUp = () => {
      setIsSelecting(false);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const captureScreenshot = () => {
    html2canvas(document.body).then((canvas) => {
      const ctx = canvas.getContext('2d');
      // 创建一个新的 canvas 元素来存储裁剪的图片
      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = selectionBox.width;
      tempCanvas.height = selectionBox.height;
      const tempCtx = tempCanvas.getContext('2d');
      tempCtx.drawImage(
        canvas,
        selectionBox.x,
        selectionBox.y,
        selectionBox.width,
        selectionBox.height,
        0,
        0,
        selectionBox.width,
        selectionBox.height,
      );
      const base64image = tempCanvas.toDataURL('image/png');
      // 处理生成的 base64image，例如显示或下载
      console.log(base64image);
    });
  };

  return (
    <div>
      <button onClick={startSelecting}>Start Selecting</button>
      <button onClick={captureScreenshot} disabled={!isSelecting}>
        Capture
      </button>
      {isSelecting && (
        <div
          ref={selectionRef}
          onMouseDown={onMouseDown}
          style={{
            position: 'absolute',
            border: '2px dashed rgba(0, 0, 0, 0.5)',
            left: selectionBox.x,
            top: selectionBox.y,
            width: selectionBox.width,
            height: selectionBox.height,
          }}
        />
      )}
    </div>
  );
};

export default ScreenshotTool;
