// background.js
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.scripting.executeScript({
        target: {tabId: tab.id},
        function: injectPopup,
    });
});

function injectPopup() {
    const popupDiv = document.createElement('div');
    popupDiv.id = 'chat-extension-popup';
    popupDiv.innerHTML = `
        <div id="chatbox">
            <!-- Chat messages will be displayed here -->
        </div>
        <input type="text" id="userInput" placeholder="Type your message">
        <button id="sendMessage">Send</button>
    `;

    document.body.appendChild(popupDiv);

    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');

    sendMessage.addEventListener('click', () => {
        const message = userInput.value;
        if (message.trim() !== '') {
            chrome.runtime.sendMessage({action: 'sendMessage', sender: 'You', message});
            userInput.value = '';
        }
    });

    chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
        if (message.action === 'displayMessage') {
            const messageDiv = document.createElement('div');
            messageDiv.innerHTML = `<strong>${message.sender}:</strong> ${message.message}`;
            chatbox.appendChild(messageDiv);
            chatbox.scrollTop = chatbox.scrollHeight;
        }
    });
}
