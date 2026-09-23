// Sample contacts data
const contacts = [
    {
        id: 1,
        name: "Alice Johnson",
        avatar: "https://i.pravatar.cc/150?img=1",
        status: "online",
        messages: [
            { text: "Hey! How are you?", sent: false, time: "10:30 AM" },
            { text: "I'm good, thanks! How about you?", sent: true, time: "10:32 AM" },
            { text: "Doing great! Want to grab coffee later?", sent: false, time: "10:35 AM" }
        ]
    },
    {
        id: 2,
        name: "Bob Smith",
        avatar: "https://i.pravatar.cc/150?img=2",
        status: "last seen 1h ago",
        messages: [
            { text: "Did you finish the project?", sent: false, time: "9:15 AM" },
            { text: "Almost done! Just need to review it", sent: true, time: "9:20 AM" }
        ]
    },
    {
        id: 3,
        name: "Carol Williams",
        avatar: "https://i.pravatar.cc/150?img=3",
        status: "online",
        messages: []
    },
    {
        id: 4,
        name: "David Brown",
        avatar: "https://i.pravatar.cc/150?img=4",
        status: "last seen yesterday",
        messages: [
            { text: "Happy birthday! 🎉", sent: true, time: "Yesterday" }
        ]
    }
];

let activeChatId = null;

// DOM Elements
const chatList = document.getElementById('chatList');
const messagesContainer = document.getElementById('messagesContainer');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const searchInput = document.getElementById('searchInput');
const contactName = document.querySelector('.contact-name');
const contactStatus = document.querySelector('.contact-status');
const contactPic = document.querySelector('.contact-pic');
const appContainer = document.querySelector('.app-container');

// Initialize the app
function init() {
    renderChatList();
    setupEventListeners();
}

// Render chat list
function renderChatList(filter = '') {
    chatList.innerHTML = '';
    
    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(filter.toLowerCase())
    );
    
    filteredContacts.forEach(contact => {
        const lastMessage = contact.messages.length > 0 
            ? contact.messages[contact.messages.length - 1].text 
            : 'No messages yet';
        
        const chatItem = document.createElement('div');
        chatItem.className = `chat-item ${contact.id === activeChatId ? 'active' : ''}`;
        chatItem.dataset.id = contact.id;
        
        chatItem.innerHTML = `
            <img src="${contact.avatar}" alt="${contact.name}" class="chat-item-pic">
            <div class="chat-item-info">
                <div class="chat-item-name">${contact.name}</div>
                <div class="chat-item-preview">${lastMessage}</div>
            </div>
        `;
        
        chatItem.addEventListener('click', () => openChat(contact.id));
        chatList.appendChild(chatItem);
    });
}

// Open a chat
function openChat(contactId) {
    activeChatId = contactId;
    const contact = contacts.find(c => c.id === contactId);
    
    if (!contact) return;
    
    // Update header
    contactName.textContent = contact.name;
    contactStatus.textContent = contact.status;
    contactPic.src = contact.avatar;
    
    // Enable input
    messageInput.disabled = false;
    sendButton.disabled = false;
    messageInput.focus();
    
    // Render messages
    renderMessages(contact);
    
    // Update active state in list
    renderChatList(searchInput.value);
    
    // Mobile view
    appContainer.classList.add('chat-open');
}

// Render messages
function renderMessages(contact) {
    messagesContainer.innerHTML = '';
    
    if (contact.messages.length === 0) {
        messagesContainer.innerHTML = `
            <div class="welcome-message">
                <h2>No messages yet</h2>
                <p>Start the conversation!</p>
            </div>
        `;
        return;
    }
    
    contact.messages.forEach(msg => {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${msg.sent ? 'sent' : 'received'}`;
        messageDiv.innerHTML = `
            ${escapeHtml(msg.text)}
            <div class="message-time">${msg.time}</div>
        `;
        messagesContainer.appendChild(messageDiv);
    });
    
    scrollToBottom();
}

// Send message
function sendMessage() {
    const text = messageInput.value.trim();
    if (!text || !activeChatId) return;
    
    const contact = contacts.find(c => c.id === activeChatId);
    if (!contact) return;
    
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    contact.messages.push({ text, sent: true, time });
    
    messageInput.value = '';
    renderMessages(contact);
    renderChatList(searchInput.value);
    
    // Simulate reply after delay
    setTimeout(() => {
        simulateReply(contact);
    }, 1500 + Math.random() * 2000);
}

// Simulate auto-reply
function simulateReply(contact) {
    const replies = [
        "That sounds great! 👍",
        "I'll get back to you soon.",
        "Sure, let me check.",
        "Interesting! Tell me more.",
        "Haha, that's funny! 😄",
        "Okay, sounds good!",
        "I agree with you.",
        "Let me think about it."
    ];
    
    const randomReply = replies[Math.floor(Math.random() * replies.length)];
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    contact.messages.push({ text: randomReply, sent: false, time });
    
    if (activeChatId === contact.id) {
        renderMessages(contact);
    }
    renderChatList(searchInput.value);
}

// Scroll to bottom of messages
function scrollToBottom() {
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Setup event listeners
function setupEventListeners() {
    sendButton.addEventListener('click', sendMessage);
    
    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    searchInput.addEventListener('input', (e) => {
        renderChatList(e.target.value);
    });
}

// Start the app
init();