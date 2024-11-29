const WebSocket = require('ws');

module.exports = {
  setupWebSocket(server) {
    const wss = new WebSocket.Server({ server });
    const clients = new Map(); // To store client connections with unique identifiers
    const rooms = new Map(); // To manage room-based communication

    // Function to broadcast messages to all connected clients
    const broadcast = (message, sender) => {
      wss.clients.forEach((client) => {
        if (client !== sender && client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    };

    // Function to handle room-based communication
    const sendMessageToRoom = (room, message) => {
      if (rooms.has(room)) {
        rooms.get(room).forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(message);
          }
        });
      }
    };

    wss.on('connection', (ws, req) => {
      console.log('New client connected!');

      // Generate a unique ID for the client (can replace with JWT or other identifiers)
      const userId = req.url.split('?userId=')[1] || `user-${Date.now()}`;
      clients.set(userId, ws);

      // Handle incoming messages from clients
      ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        try {
          const { type, content, targetUserId, room } = JSON.parse(message);

          if (type === 'broadcast') {
            broadcast(`Broadcast: ${content}`, ws); // Broadcast to all clients except sender
          } else if (type === 'private' && targetUserId) {
            // Handle private messaging
            const targetClient = clients.get(targetUserId);
            if (targetClient && targetClient.readyState === WebSocket.OPEN) {
              targetClient.send(JSON.stringify({ from: userId, content }));
            } else {
              ws.send(`User ${targetUserId} is not connected.`);
            }
          } else if (type === 'room' && room) {
            // Handle room-based messaging
            sendMessageToRoom(room, JSON.stringify({ from: userId, room, content }));
          } else {
            ws.send(`Invalid message type or missing parameters.`);
          }
        } catch (error) {
          console.error('Error processing message:', error.message);
          ws.send('Error: Invalid message format.');
        }
      });

      // Handle joining a room
      ws.on('join-room', (room) => {
        if (!rooms.has(room)) {
          rooms.set(room, new Set());
        }
        rooms.get(room).add(ws);
        ws.send(`Joined room: ${room}`);
      });

      // Handle client disconnection
      ws.on('close', () => {
        console.log(`Client ${userId} disconnected`);
        clients.delete(userId); // Remove client from active connections
        // Remove client from all rooms
        rooms.forEach((clients, room) => {
          clients.delete(ws);
          if (clients.size === 0) rooms.delete(room); // Remove empty room
        });
      });

      // Heartbeat (Ping-Pong) for connection health
      ws.isAlive = true;
      ws.on('pong', () => (ws.isAlive = true));

      // Send a welcome message to the newly connected client
      ws.send(`Welcome to the WebSocket server, your ID is ${userId}`);
    });

    // Periodically check for inactive clients
    setInterval(() => {
      wss.clients.forEach((ws) => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping(); // Send ping to check connection
      });
    }, 30000); // Every 30 seconds

    console.log('WebSocket server is running...');
  },
};
