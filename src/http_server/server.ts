import { WebSocketServer } from 'ws';
import { httpServer } from './index';
import { handleRegistration } from './handlers/handleRegistration';
import { handleCreateRoom } from './handlers/handleCreateRoom';
import { broadcastUpdateRooms } from './handlers/broadcastUpdateRooms';
import { handleAddUserToRoom } from './handlers/handleAddUserToRoom';
import { handleAddShips } from './handlers/handleAddShips';

const wss = new WebSocketServer({ server: httpServer });
const users = new Map();
const activeUsers = new Map();
const rooms = new Map();
const games = new Map();
let indexNextUser = { value: 1 };

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', (message) => {
    try {
      const msg = JSON.parse(message.toString());
      let data = msg.data;
      console.log(data);
      if (typeof data === 'string' && data !== '') {
        try {
          data = JSON.parse(data);
        } catch (e) {
          console.error('Parsing error data:', e);
        }
      }
      switch (msg.type) {
        case 'reg':
          if (msg.id === 0) {
            handleRegistration(ws, data, users, activeUsers, indexNextUser);
            broadcastUpdateRooms(wss, rooms);
          }
          break;

        case 'create_room':
          if (msg.id === 0) {
            handleCreateRoom(ws, rooms, activeUsers);
            broadcastUpdateRooms(wss, rooms);
          }
          break;

        case 'add_user_to_room':
          if (msg.id === 0) {
            handleAddUserToRoom(ws, data.indexRoom, rooms, activeUsers, games);
            broadcastUpdateRooms(wss, rooms);
          }
          break;

        case 'add_ships':
          handleAddShips(data, games);
          break;

        case 'attack':
          //handleAttack(ws, data, games);
          break;

        case 'randomAttack':
          //handleRandomAttack(ws, data, games);
          break;
      }
    } catch (err) {
      console.error('Error processing message:', err);
    }
  });
});

const PORT = 3000;
httpServer.listen(PORT, () => console.log(`The server is running on http://localhost:${PORT}`));
