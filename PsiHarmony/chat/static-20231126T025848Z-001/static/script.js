document.addEventListener('DOMContentLoaded', function () {
    const chatContainer = document.getElementById('chat');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');

    function appendMessage(sender, message) {
        const chatMessage = document.createElement('div');
        chatMessage.innerHTML = `<strong>${sender}:</strong> ${message}`;
        chatContainer.appendChild(chatMessage);
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (userMessage === '') return;

        appendMessage('You', userMessage);
        userInput.value = '';

        // Check for greetings
        const lowerCaseMessage = userMessage.toLowerCase();
        if (lowerCaseMessage === 'hi' || lowerCaseMessage === 'hello') {
            appendMessage('Chatbot', 'Hi there! How can I help you?');
            return;
        }

        // Make a request to the Flask backend
        fetch('/predict', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        })
        .then(response => response.json())
        .then(data => {
            const chatbotResponse = data.answer || "I'm sorry, I couldn't understand that.";
            appendMessage('Chatbot', chatbotResponse);
        })
        .catch(error => {
            console.error('Error:', error);
            // Handle errors gracefully, display a default message or try again
        });
    }

    // Trigger sendMessage when the Enter key is pressed
    userInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Trigger sendMessage when the "Send" button is clicked
    sendButton.addEventListener('click', sendMessage);

    function goToChatbot() {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('chatbot').style.display = 'block';
    }

    function goToCardSlider() {
        window.location.href = '/cards';
    }

    window.goToChatbot = goToChatbot;
    window.goToCardSlider = goToCardSlider;
});
