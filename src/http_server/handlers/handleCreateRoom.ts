import type { WebSocket } from 'ws';
import { generateId } from '../utils/generateID';
import { ConnectedUser, Room } from '../utils/types';

export function handleCreateRoom(
  ws: WebSocket,
  rooms: Map<string, Room>,
  activeUsers: Map<WebSocket, ConnectedUser>
) {
  const user = activeUsers.get(ws);
  if (!user) return;
  const roomId = generateId();
  const newRoom: Room = {
    roomId,
    users: [user],
  };
  rooms.set(roomId, newRoom);
  console.log(`NewRoom: ${newRoom}`);
  return newRoom;
}
