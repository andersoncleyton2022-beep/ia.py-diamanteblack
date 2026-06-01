const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const pty = require('node-pty');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// =================== TERMINAL ===================
io.on('connection', (socket) => {
    const ptyProcess = pty.spawn('bash', ['--login'], {
        name: 'xterm-color',
        cols: 80,
        rows: 24,
        cwd: process.cwd(),
        env: process.env
    });

    ptyProcess.onData(data => socket.emit('terminal-output', data));
    socket.on('terminal-input', data => ptyProcess.write(data));

    socket.on('disconnect', () => ptyProcess.kill());
});

// =================== CHAT COM SUA IA ===================
let iaProcess = null;

app.post('/api/ai', (req, res) => {
    const { message } = req.body;

    if (!iaProcess) {
        iaProcess = spawn('python3', [path.join(__dirname, 'ia.py'), '--web']);
        
        iaProcess.stdout.on('data', (data) => {
            io.emit('ia-response', data.toString().trim());
        });
    }

    iaProcess.stdin.write(message + '\n');
    res.json({ ok: true });
});

// =================== GERENCIADOR DE ARQUIVOS ===================
app.get('/api/files', (req, res) => {
    const dir = req.query.dir || __dirname;
    fs.readdir(dir, { withFileTypes: true }, (err, files) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({
            path: dir,
            files: files.map(f => ({
                name: f.name,
                isDir: f.isDirectory()
            }))
        });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 Painel rodando → http://localhost:${PORT}`);
});
