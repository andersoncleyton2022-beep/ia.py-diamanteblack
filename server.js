const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// =================== TERMINAL ===================
io.on('connection', (socket) => {
    const ptyProcess = pty.spawn('bash', ['--login'], {
        cols: 100, rows: 30, cwd: __dirname, env: process.env
    });

    ptyProcess.onData(data => socket.emit('terminal-output', data));
    socket.on('terminal-input', data => ptyProcess.write(data));

    socket.on('disconnect', () => ptyProcess.kill());
});

// =================== SUA IA (Chat) ===================
let iaProcess = null;

app.post('/api/ai', (req, res) => {
    const { message } = req.body;

    if (!iaProcess) {
        iaProcess = spawn('python3', ['ia.py', '--web']);
        
        iaProcess.stdout.on('data', (data) => {
            io.emit('ia-response', data.toString());
        });
    }

    // Envia mensagem para o Python
    iaProcess.stdin.write(message + '\n');
    res.json({ status: "enviado" });
});

// =================== ARQUIVOS ===================
app.get('/api/files', (req, res) => { /* ... mesmo de antes */ });

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Painel rodando na porta ${PORT}`);
});
