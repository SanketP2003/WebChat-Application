const loginScreen = document.getElementById('login-screen');
const chatScreen = document.getElementById('chat-screen');
const loginForm = document.getElementById('login-form');
const usernameInput = document.getElementById('username-input');
const chatUsernameHeader = document.getElementById('chat-username');
const userAvatarHeader = document.getElementById('user-avatar-header');
const messageForm = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const messageContainer = document.getElementById('message-container');
const messageArea = document.getElementById('message-area');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');

let stompClient = null;
let username = '';
let activeUsers = new Set();

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const enteredUsername = usernameInput.value.trim();
    if (enteredUsername) {
        username = enteredUsername;
        chatUsernameHeader.textContent = username;
        const userInitial = username.charAt(0).toUpperCase();
        userAvatarHeader.src = `https://placehold.co/100x100/10b981/ffffff?text=${userInitial}`;

        loginScreen.classList.add('opacity-0');
        setTimeout(() => {
            loginScreen.classList.add('hidden');
            chatScreen.classList.remove('hidden');
            chatScreen.classList.add('opacity-100');
            connect();
        }, 700);
    }
});

function connect() {
    const socket = new SockJS('/chat');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, onConnected, onError);
}

function onConnected() {
    updateStatus(true);
    stompClient.subscribe('/topic/return-to', onMessageReceived);
    stompClient.send("/app/message", {}, JSON.stringify({ name: username, type: 'JOIN' }));
    setTimeout(() => {
        const welcomeMessage = { name: username, content: 'hii', type: 'CHAT' };
        stompClient.send("/app/message", {}, JSON.stringify(welcomeMessage));
    }, 500);
}

function onError(error) {
    console.error('STOMP error:', error);
    updateStatus(false);
    setTimeout(connect, 5000);
}

function onMessageReceived(payload) {
    const message = JSON.parse(payload.body);
    if (message.type === 'JOIN') {
        activeUsers.add(message.name);
        if (message.name !== username) showSystemMessage(`${message.name} has entered the void.`);
    } else if (message.type === 'LEAVE') {
        activeUsers.delete(message.name);
        showSystemMessage(`${message.name} has left the void.`);
    } else if (message.type === 'USER_LIST') {
        activeUsers = new Set(message.users);
    } else {
        showMessage(message);
    }
}

function sendMessage(event) {
    event.preventDefault();
    const content = messageInput.value.trim();
    if(content && stompClient) {
        const chatMessage = { name: username, content: content, type: 'CHAT' };
        stompClient.send("/app/message", {}, JSON.stringify(chatMessage));
        messageInput.value = '';
    }
}

function showMessage(message) {
    if (!message.content) {
        return;
    }
    const isOutgoing = message.name === username;
    const messageWrapper = document.createElement('div');
    messageWrapper.classList.add('flex', 'items-start', 'gap-3', isOutgoing ? 'justify-end' : 'justify-start');
    const avatarInitial = message.name.charAt(0).toUpperCase();
    const avatarColor = isOutgoing ? '06b6d4' : '10b981';
    const avatar = `<img class="w-10 h-10 rounded-full flex-shrink-0" src="https://placehold.co/100x100/${avatarColor}/ffffff?text=${avatarInitial}" alt="Avatar">`;
    const messageBubble = `
                <div class="flex flex-col ${isOutgoing ? 'items-end' : 'items-start'}">
                    <div class="px-4 py-3 rounded-2xl shadow-md max-w-sm md:max-w-md ${isOutgoing ? 'bg-gradient-to-br from-emerald-500 to-cyan-600 text-white rounded-br-none' : 'bg-gray-800 text-gray-200 rounded-bl-none'}">
                        ${!isOutgoing ? `<p class="text-xs font-bold text-emerald-400 mb-1">${message.name}</p>` : ''}
                        <p class="text-sm break-words">${message.content}</p>
                    </div>
                </div>
            `;

    messageWrapper.innerHTML = isOutgoing ? messageBubble + avatar : avatar + messageBubble;
    messageWrapper.classList.add('opacity-0', 'transform', isOutgoing ? 'translate-x-4' : '-translate-x-4');
    messageContainer.appendChild(messageWrapper);
    setTimeout(() => messageWrapper.classList.remove('opacity-0', 'transform', 'translate-x-4', '-translate-x-4'), 10);

    messageArea.scrollTop = messageArea.scrollHeight;
}

function showSystemMessage(text) {
    const systemMessage = document.createElement('div');
    systemMessage.classList.add('text-center', 'text-xs', 'text-gray-400', 'my-2', 'opacity-0', 'transform', 'translate-y-2');
    systemMessage.textContent = text;
    messageContainer.appendChild(systemMessage);
    setTimeout(() => systemMessage.classList.remove('opacity-0', 'transform', 'translate-y-2'), 10);
    messageArea.scrollTop = messageArea.scrollHeight;
}

function updateStatus(isConnected) {
    statusIndicator.classList.toggle('bg-gray-500', !isConnected);
    statusIndicator.classList.toggle('bg-green-500', isConnected);
    statusText.textContent = isConnected ? 'Online' : 'Disconnected';
}

messageForm.addEventListener('submit', sendMessage, true);