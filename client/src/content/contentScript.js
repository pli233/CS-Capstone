// 假设你的构建工具已经将React和ReactDOM打包到你的contentScript.js中
/* global chrome */
// 导入React和ReactDOM库（如果你的构建系统支持这样做）
import React from 'react';
import ReactDOM from 'react-dom';

// 导入你的React组件
import App from '../App';

function renderApp() {
  // 创建容器元素
  const reactContainer = document.createElement('div');

  // 给这个容器设置样式，以便它能够定位在页面的右下角
  // 这里的样式可能需要根据你的具体情况进行调整
  reactContainer.style.position = 'absolute';
  reactContainer.style.right = '0';
  reactContainer.style.bottom = '0';
  reactContainer.style.width = '400px'; // 或者你希望的宽度
  reactContainer.style.height = '300px'; // 或者你希望的高度
  reactContainer.style.zIndex = '1000'; // 确保它不会被其他元素覆盖
  // reactContainer.style.backgroundColor = 'black'; // 以便你能够看到它
  reactContainer.id = 'my-extension-root';
  document.body.appendChild(reactContainer);

  // 使用ReactDOM将你的React组件渲染到容器中
  const root = ReactDOM.createRoot(document.getElementById('my-extension-root'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'displayDialog') {
    renderApp();
    sendResponse({ status: 'success' });
  }
});
