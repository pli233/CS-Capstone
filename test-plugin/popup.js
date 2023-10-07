document.addEventListener('DOMContentLoaded', function () {
    const chatbox = document.getElementById('chatbox');
    const userInput = document.getElementById('userInput');
    const sendMessage = document.getElementById('sendMessage');

    sendMessage.addEventListener('click', () => {
        const message = userInput.value;
        if (message.trim() !== '') {
            displayMessage('You', message);
            userInput.value = '';
            // You can add code here to send the message to a background script or process it as needed.
        }
    });

    function displayMessage(sender, message) {
        const messageDiv = document.createElement('div');
        messageDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatbox.appendChild(messageDiv);
        chatbox.scrollTop = chatbox.scrollHeight;
    }
});
