/* global chrome */
import spinner from './spinner.gif';
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === 'showSpinner') {
    // 显示对话框内容
    showSpinner(request.text);
    console.log('showSpinner action triggered');
  } else if (request.action === 'insertDialog') {
    // 显示 spinner
    insertDialog(request.text);
    console.log('insertDialog action triggere');
  }
});

function insertDialog(selectedText) {
  // 使用之前的代码来创建对话框并将其插入到页面中
  // ...
  const spinnerDialog = document.getElementById('my-extension-spinner');
  // 如果 spinner 存在，移除它
  if (spinnerDialog) {
    spinnerDialog.remove();
  }
  const selection = window.getSelection();
  const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
  if (range) {
    // 创建对话框元素
    const dialog = document.createElement('div');
    dialog.textContent = selectedText;
    dialog.style.position = 'absolute';
    dialog.style.zIndex = '1000';
    dialog.style.backgroundColor = 'white';
    dialog.style.border = '1px solid black';
    dialog.style.borderRadius = '5px';
    dialog.style.padding = '5px';
    dialog.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)';
    dialog.style.maxWidth = '600px';
    dialog.style.wordWrap = 'break-word';

    // 计算并设置对话框的位置
    const rect = range.getBoundingClientRect();
    dialog.style.top = `${rect.bottom + window.scrollY}px`;
    dialog.style.left = `${rect.left + window.scrollX}px`;

    // 将对话框添加到页面中
    document.body.appendChild(dialog);

    // 设置点击对话框之外的区域隐藏对话框
    document.addEventListener('click', function (event) {
      if (!dialog.contains(event.target)) {
        dialog.remove();
      }
    });
  }
}

function showSpinner(selectedText) {
  // 检查是否已经有一个 spinner 对话框，如果有就不再创建
  if (!document.getElementById('my-extension-spinner')) {
    const selection = window.getSelection();
    const range = selection.rangeCount > 0 ? selection.getRangeAt(0) : null;
    if (range) {
      // 创建对话框元素
      const dialog = document.createElement('div');
      dialog.textContent = 'Loading your easy notes...';
      dialog.style.position = 'absolute';
      dialog.style.zIndex = '1000';
      dialog.style.backgroundColor = 'white';
      dialog.style.border = '1px solid black';
      dialog.style.borderRadius = '5px';
      dialog.style.padding = '5px';
      dialog.style.boxShadow = '2px 2px 2px rgba(0,0,0,0.2)';
      dialog.style.maxWidth = '600px';

      // 计算并设置对话框的位置
      const rect = range.getBoundingClientRect();
      dialog.style.top = `${rect.bottom + window.scrollY}px`;
      dialog.style.left = `${rect.left + window.scrollX}px`;

      // 将对话框添加到页面中
      document.body.appendChild(dialog);

      // 设置点击对话框之外的区域隐藏对话框
      document.addEventListener('click', function (event) {
        if (!dialog.contains(event.target)) {
          dialog.remove();
        }
      });
    }
  }
}
