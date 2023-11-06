/* global chrome */
import api from '../utils/api';
chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'logSelectedText', // 为菜单项指定一个ID
    title: 'Simplify doctor notes', // 菜单项的显示文字
    contexts: ['selection'], // 只在有文本被选中时显示
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'logSelectedText') {
    console.log('Selected text: ', info.selectionText);
    // 如果需要在当前标签页的控制台打印
    chrome.tabs.executeScript({
      code: `console.log(${JSON.stringify(info.selectionText)})`,
    });
    // chrome.tabs.sendMessage(tab.id, {
    //   action: 'insertDialog',
    //   text: info.selectionText,
    // });
    chrome.tabs.sendMessage(tab.id, {
      action: 'showSpinner',
      text: info.selectionText,
    });
    // chrome.tabs.executeScript({
    //   code: `console.log('showSpinner')`,
    // });
    const formData = new FormData();
    formData.append('content', info.selectionText);

    // 发送 POST 请求到服务器
    api
      .post('/notes/content', formData)
      .then((res) => {
        // 请求成功，发送数据到内容脚本
        chrome.tabs.sendMessage(tab.id, {
          action: 'insertDialog',
          text: res.data.content,
        });
      })
      .catch((err) => {
        // 处理错误
        chrome.tabs.executeScript({
          code: `console.log(${JSON.stringify(err)})`,
        });
      });
  }
});
