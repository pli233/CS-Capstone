/* global chrome */

chrome.runtime.onInstalled.addListener(function () {
  chrome.contextMenus.create({
    id: 'logSelectedText', // 为菜单项指定一个ID
    title: 'Simplify doctor notes', // 菜单项的显示文字
  });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
  if (info.menuItemId === 'logSelectedText') {
    // 如果需要在当前标签页的控制台打印
    // chrome.tabs.executeScript({
    //   code: `console.log('showDialog')`,
    // });
    // chrome.tabs.sendMessage(tab.id, {
    //   action: 'insertDialog',
    //   text: info.selectionText,
    // });
    chrome.tabs.sendMessage(tab.id, {
      action: 'displayDialog',
      text: info.selectionText,
    });
    // chrome.tabs.executeScript({
    //   code: `console.log('showSpinner')`,
    // });
  }
});
