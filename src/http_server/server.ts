import { WebSocketServer } from 'ws';
import { httpServer } from './index';
import { handleRegistration } from './handlers/handleRegistration';

const wss = new WebSocketServer({ server: httpServer });
const users = new Map();
let indexNextUser = { value: 1 };

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString());
      let data = msg.data;
      if (typeof data === 'string') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Parsing error data:', e);
        }
      }

      if (msg.type === 'reg' && msg.id === 0) {
        handleRegistration(ws, data, users, indexNextUser);
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => console.log(`The server is running on http://localhost:${PORT}`));
