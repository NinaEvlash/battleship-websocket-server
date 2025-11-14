import type { WebSocket } from 'ws';

type User = { password: string; index: number };

export function handleRegistration(
  ws: WebSocket,
  data: { name: string; password: string },
  users: Map<string, User>,
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
    sendJSON(ws, {
      type: 'reg',
      data: { name, index: newUser.index, error: false, errorText: '' },
      id: 0,
    });
  }
}

function sendJSON(ws: WebSocket, obj: any) {
  if (obj.data && typeof obj.data === 'object') {
    obj.data = JSON.stringify(obj.data);
  }

  console.log('Sending to client:', obj);
  ws.send(JSON.stringify(obj));
}
