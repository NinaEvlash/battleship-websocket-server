import { WebSocket } from 'ws';
import { sendJSON } from '../utils/sendJSON';

export function broadcastWinners(clients: WebSocket[], winnersMap: Map<string, number>) {
  const data = Array.from(winnersMap.entries()).map(([name, wins]) => ({ name, wins }));

  const msg = {
    type: 'update_winners',
    data,
    id: 0,
  };

  clients.forEach((ws) => sendJSON(ws, msg));
}
