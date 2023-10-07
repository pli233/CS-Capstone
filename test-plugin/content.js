// content.js
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'displayMessage') {
        displayMessage(message.sender, message.message);
    }
});

function displayMessage(sender, message) {
    const messageDiv = document.createElement('div');
    messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
    document.body.appendChild(messageDiv);
    document.body.scrollTop = document.body.scrollHeight;
}
