const BACKEND_URL = 'REPLACE_WITH_BACKEND_URL';

const MESSAGES = {
    opening: [
        "Cześć! Jak mogę Ci pomóc?",
        "Witaj! Czego potrzebujesz?",
        "Dzień dobry! W czym mogę Ci służyć?",
        "Hej! Jestem tu, żeby pomóc. Co mogę dla Ciebie zrobić?",
        "Cześć! Jakie masz pytanie?"
    ],
    closing: [
        "Mam nadzieję, że mogłem pomóc! Miłego dnia!",
        "Dziękuję za rozmowę. Do zobaczenia!",
        "To wszystko na dziś. Jeśli masz kolejne pytania, jestem tutaj!",
        "Dziękuję za kontakt! Powodzenia w dalszej pracy!",
        "Miło było Ci pomóc. Do następnego razu!"
    ]
};

// Utility function for generating random messages
function getRandomMessage(type) {
    const messages = MESSAGES[type];
    const randomIndex = Math.floor(Math.random() * messages.length);
    return messages[randomIndex];
}

// Function to append messages to the UI
function appendMessage(sender, message) {
    const messagesDiv = document.getElementById('messages');
    const messageParagraph = document.createElement('p');
    messageParagraph.textContent = `${sender}: ${message}`;
    messagesDiv.appendChild(messageParagraph);
}

// Function to send user message and fetch assistant response from backend
async function sendMessage() {
    const userMessage = document.getElementById('userMessage').value;

    if (!userMessage) return;

    appendMessage('Ty', userMessage);

    try {
        const response = await fetch(`${BACKEND_URL}/send_message`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: userMessage }),
        });

        if (response.ok) {
            const data = await response.json();
            appendMessage('Asystent', data.response);
        } else {
            appendMessage('Asystent', 'Wystąpił błąd przy wysyłaniu wiadomości.');
        }
    } catch (error) {
        console.error('Error fetching response:', error);
        appendMessage('Asystent', 'Wystąpił błąd połączenia.');
    }

    document.getElementById('userMessage').value = '';  // Clear input field
}

// Function to start the conversation with a random opening message
function startConversation() {
    const openingMessage = getRandomMessage('opening');
    appendMessage('Asystent', openingMessage);
}

// Function to close the conversation with a random closing message
function endConversation() {
    const closingMessage = getRandomMessage('closing');
    appendMessage('Asystent', closingMessage);
}


window.onload = startConversation;
