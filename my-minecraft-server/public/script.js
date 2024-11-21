const socket = io();
const minecraftTerminal = document.getElementById('minecraft-terminal');
const startMinecraftServerBtn = document.getElementById('start-minecraft-server');
const stopMinecraftServerBtn = document.getElementById('stop-minecraft-server');
const bungeeTerminal = document.getElementById('bungee-terminal');
const startBungeeServerBtn = document.getElementById('start-bungee-server');
const stopBungeeServerBtn = document.getElementById('stop-bungee-server');

// Function to append data to terminal and auto-scroll
const appendToTerminal = (terminal, data) => {
    terminal.textContent += data + '\n';
    terminal.scrollTop = terminal.scrollHeight; // Auto-scroll
};

// Start Minecraft server
startMinecraftServerBtn.addEventListener('click', () => {
    socket.emit('start_minecraft_server');
});

// Stop Minecraft server
stopMinecraftServerBtn.addEventListener('click', () => {
    socket.emit('stop_minecraft_server');
});

// Listen for output from the Minecraft server
socket.on('minecraft_output', (data) => {
    appendToTerminal(minecraftTerminal, data);
});

// Start BungeeCord server
startBungeeServerBtn.addEventListener('click', () => {
    socket.emit('start_bungee_server');
});

// Stop BungeeCord server
stopBungeeServerBtn.addEventListener('click', () => {
    socket.emit('stop_bungee_server');
});

// Listen for output from the BungeeCord server
socket.on('bungee_output', (data) => {
    appendToTerminal(bungeeTerminal, data);
});