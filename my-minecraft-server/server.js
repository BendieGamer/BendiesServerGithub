const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const { spawn } = require('child_process');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

app.use(express.static('public'));

let minecraftServerProcess;
let bungeeServerProcess;

const isWindows = process.platform === 'win32';

io.on('connection', (socket) => {
    console.log('A user connected');

    // Start Minecraft server
    socket.on('start_minecraft_server', () => {
        if (minecraftServerProcess) {
            socket.emit('minecraft_output', 'Minecraft server is already running.');
            return;
        }

        const args = ['-Xmx1024M', '-Xms512M', '-jar', 'server.jar', 'nogui'];

        minecraftServerProcess = spawn('java', args, {
            cwd: path.join(__dirname, 'servers/server1'), // Path to Minecraft server
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        minecraftServerProcess.stdout.on('data', (data) => {
            socket.emit('minecraft_output', data.toString());
        });

        minecraftServerProcess.stderr.on('data', (data) => {
            socket.emit('minecraft_output', data.toString());
        });

        minecraftServerProcess.unref();
        socket.emit('minecraft_output', 'Minecraft server started.');
    });

    // Stop Minecraft server
    socket.on('stop_minecraft_server', () => {
        if (!minecraftServerProcess) {
            socket.emit('minecraft_output', 'Minecraft server is not running.');
            return;
        }
        
        minecraftServerProcess.kill('SIGINT'); // Send SIGINT to gracefully stop
        minecraftServerProcess = null; // Clear the process reference
        socket.emit('minecraft_output', 'Minecraft server stopping...');
    });

    // Start BungeeCord server
    socket.on('start_bungee_server', () => {
        if (bungeeServerProcess) {
            socket.emit('bungee_output', 'BungeeCord server is already running.');
            return;
        }

        const args = ['-Xmx512M', '-Xms256M', '-jar', 'bungee.jar', 'nogui'];

        bungeeServerProcess = spawn('java', args, {
            cwd: path.join(__dirname, 'servers/server3'), // Path to BungeeCord server
            detached: true,
            stdio: ['ignore', 'pipe', 'pipe']
        });

        bungeeServerProcess.stdout.on('data', (data) => {
            socket.emit('bungee_output', data.toString());
        });

        bungeeServerProcess.stderr.on('data', (data) => {
            socket.emit('bungee_output', data.toString());
        });

        bungeeServerProcess.unref();
        socket.emit('bungee_output', 'BungeeCord server started.');
    });

    // Stop BungeeCord server
    socket.on('stop_bungee_server', () => {
        if (!bungeeServerProcess) {
            socket.emit('bungee_output', 'BungeeCord server is not running.');
            return;
        }

        bungeeServerProcess.kill('SIGINT'); // Send SIGINT to gracefully stop
        bungeeServerProcess = null; // Clear the process reference
        socket.emit('bungee_output', 'BungeeCord server stopping...');
    });

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});