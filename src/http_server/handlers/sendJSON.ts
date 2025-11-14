import type { WebSocket } from 'ws';

export function sendJSON(ws: WebSocket, obj: any) {
  if (obj.data && typeof obj.data === 'object') {
    obj.data = JSON.stringify(obj.data);
  }

  console.log('Sending to client:', obj);
  ws.send(JSON.stringify(obj));
}
