import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load configuration
const config = JSON.parse(fs.readFileSync(path.join(__dirname, 'config.json'), 'utf8'));

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = config.port || 3333;

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Extract sketch paths from config
const sketches = config.sketches.map(sketch => sketch.path);
let currentSketchIndex = 0;

// Socket.io connection
io.on('connection', (socket) => {
  console.log('A client connected');
  
  // Send overlay settings to the client
  socket.emit('overlay-config', config.overlay || { titleFontSize: 16, creatorFontSize: 14 });
  
  // Tell new clients the current sketch
  socket.emit('change-sketch', config.sketches[currentSketchIndex]);
  
  socket.on('disconnect', () => {
    console.log('A client disconnected');
  });
});

// Start the server
server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  
  // Set up the sketch rotation based on config
  setInterval(() => {
    currentSketchIndex = (currentSketchIndex + 1) % sketches.length;
    const currentSketch = config.sketches[currentSketchIndex];
    console.log(`Switched to ${currentSketch.name} (${currentSketch.path})`);
    
    // Broadcast the change to all connected clients
    io.emit('change-sketch', currentSketch);
  }, config.switchInterval || 5000);
});