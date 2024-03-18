document.addEventListener('DOMContentLoaded', function () {
    const socket = io();

    // Function to send a message to the server
    function sendMessage() {
        const messageInput = document.querySelector('input[type="text"]');
        const messageText = messageInput.value.trim();
        if (messageText !== '') {
            const message = {
                sender: 'You',
                time: new Date().toLocaleTimeString(),
                text: messageText
            };
            // Send the message to the server
            socket.emit('chatMessage', message);
            // Clear the input field after sending
            messageInput.value = '';
        }
    }

    // Function to display a message in the chatbox
    function displayMessage(message) {
        // Append the message to the chatbox
        const chatMessages = document.querySelector('.chat-messages');
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.innerHTML = `
            <p class="sender">${message.sender}</p>
            <p class="time">${message.time}</p>
            <p class="text">${message.text}</p>
        `;
        chatMessages.appendChild(messageDiv);
    }

    // Handle incoming messages
    socket.on('chatMessage', function(message) {
        // Display the message in the chatbox
        displayMessage(message);
    });

    // Handle incoming user list
    socket.on('userList', function(users) {
        // Update the user list display
        const userList = document.querySelector('.user-list');
        userList.innerHTML = '';
        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.textContent = user;
            userItem.addEventListener('click', function() {
                // Connect to the selected user
                socket.emit('addUser', user);
            });
            userList.appendChild(userItem);
        });
    });

    // Handle sending messages when the send button is clicked
    document.getElementById('sendBtn').addEventListener('click', sendMessage);

    // Handle sending messages when Enter key is pressed
    document.querySelector('input[type="text"]').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });
});
