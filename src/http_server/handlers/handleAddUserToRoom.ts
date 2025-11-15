import type { WebSocket } from 'ws';
import { generateId } from '../utils/generateID';
import { ConnectedUser, Room, Game, GamePlayer } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';

export function handleAddUserToRoom(
  ws: WebSocket,
  indexRoom: string,
  rooms: Map<string, Room>,
  activeUsers: Map<WebSocket, ConnectedUser>,
  games: Map<string, Game>
) {
  const room = rooms.get(indexRoom);
  if (!room) return console.log('Room not found');

  const secondUser = activeUsers.get(ws);
  if (!secondUser) return;

  room.users.push(secondUser);
  rooms.delete(indexRoom);

  const gameId = generateId();

  const id1 = generateId();
  const id2 = generateId();

  const player1: GamePlayer = {
    idPlayer: id1,
    ws: room.users[0].ws,
    name: room.users[0].name,
    index: room.users[0].index,
    ships: [],
    ready: false,
  };

  const player2: GamePlayer = {
    idPlayer: id2,
    ws: room.users[1].ws,
    name: room.users[1].name,
    index: room.users[1].index,
    ships: [],
    ready: false,
  };

  const game: Game = {
    gameId,
    players: {
      [id1]: player1,
      [id2]: player2,
    },
    currentTurn: null,
  };

  games.set(gameId, game);

  sendJSON(player1.ws, {
    type: 'create_game',
    data: { idGame: gameId, idPlayer: id1 },
    id: 0,
  });

  sendJSON(player2.ws, {
    type: 'create_game',
    data: { idGame: gameId, idPlayer: id2 },
    id: 0,
  });
}
