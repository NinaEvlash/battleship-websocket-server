import type { WebSocket } from 'ws';
import { sendJSON } from './sendJSON';
import { User, ConnectedUser } from '../utils/types';

export function handleRegistration(
  ws: WebSocket,
  data: { name: string; password: string },
  users: Map<string, User>,
  activeUsers: Map<WebSocket, ConnectedUser>,
  nextIndexRef: { value: number }
) {
  const { name, password } = data;

  if (!name || !password) {
    return sendJSON(ws, {
      type: 'reg',
      data: { name, index: null, error: true, errorText: 'Username and password are required' },
      id: 0,
    });
  }

  const existing = users.get(name);

  if (existing) {
    if (existing.password === password) {
      sendJSON(ws, {
        type: 'reg',
        data: { name, index: existing.index, error: false, errorText: '' },
        id: 0,
      });
    } else {
      sendJSON(ws, {
        type: 'reg',
        data: { name, index: null, error: true, errorText: 'Invalid password' },
        id: 0,
      });
    }
  } else {
    const newUser = { password, index: nextIndexRef.value++ };
    users.set(name, newUser);
    activeUsers.set(ws, { name, index: newUser.index, ws });
    console.log(`Users: ${users}`);
    console.log(`ActiveUsers: ${activeUsers}`);
    sendJSON(ws, {
      type: 'reg',
      data: { name, index: newUser.index, error: false, errorText: '' },
      id: 0,
    });
  }
}
