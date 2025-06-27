// Get DOM elements
const voiceBtn = document.getElementById('voice-btn');
const taskList = document.getElementById('task-list');
const status = document.getElementById('status');

// Check for browser support
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (!SpeechRecognition) {
    status.textContent = "Sorry, your browser does not support Speech Recognition.";
    voiceBtn.disabled = true;
} else {
    const recognition = new SpeechRecognition();

    // Configure recognition settings
    recognition.continuous = false; // Stop listening after the first result
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    // Event listener for the voice button
    voiceBtn.addEventListener('click', () => {
        recognition.start();
    });

    // Handle recognition events
    recognition.onstart = () => {
        status.textContent = "Listening...";
        voiceBtn.classList.add('is-listening');
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        addTask(transcript);
    };
    
    recognition.onerror = (event) => {
        status.textContent = `Error occurred: ${event.error}`;
    };

    recognition.onend = () => {
        status.textContent = "Click the microphone to add a task by voice.";
        voiceBtn.classList.remove('is-listening');
    };
}

// Function to add a new task to the list
function addTask(text) {
    if (text.trim() === '') return;

    const li = document.createElement('li');
    li.className = 'task-item';

    // Task text
    const taskText = document.createElement('span');
    taskText.textContent = text;
    li.appendChild(taskText);

    // Buttons container
    const buttonsDiv = document.createElement('div');
    
    // Complete button
    const completeBtn = document.createElement('button');
    completeBtn.className = 'complete-btn';
    completeBtn.innerHTML = '<i class="fas fa-check-circle"></i>';
    completeBtn.title = 'Mark as completed';
    buttonsDiv.appendChild(completeBtn);

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.title = 'Delete task';
    buttonsDiv.appendChild(deleteBtn);

    li.appendChild(buttonsDiv);
    taskList.appendChild(li);
}

// Event delegation for complete and delete buttons
taskList.addEventListener('click', (e) => {
    // Find the button that was clicked
    const btn = e.target.closest('button');
    if (!btn) return;

    // Get the parent list item
    const li = btn.closest('.task-item');

    if (btn.classList.contains('complete-btn')) {
        li.classList.toggle('completed');
    }

    if (btn.classList.contains('delete-btn')) {
        li.remove();
    }
});