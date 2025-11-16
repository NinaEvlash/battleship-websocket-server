import { WebSocketServer } from 'ws';
import { Room } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';

export function broadcastUpdateRooms(wss: WebSocketServer, rooms: Map<string, Room>) {
  const onePlayerRooms = [...rooms.values()].filter((r) => r.users.length === 1);

  const payload = {
    type: 'update_room',
    data: onePlayerRooms.map((room) => ({
      roomId: room.roomId,
      roomUsers: room.users.map((u) => ({
        name: u.name,
        index: u.index,
      })),
    })),
    id: 0,
  };

  wss.clients.forEach((client) => {
    try {
      sendJSON(client, payload);
    } catch {}
  });
}
