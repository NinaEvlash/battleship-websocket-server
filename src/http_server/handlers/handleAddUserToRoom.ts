import type { WebSocket } from 'ws';
import { generateId } from '../utils/generateID';
import { ConnectedUser, Room, Game } from '../utils/types';
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

  const game: Game = {
    gameId,
    players: [
      {
        idPlayer: generateId(),
        ws: room.users[0].ws,
        name: room.users[0].name,
        index: room.users[0].index,
        ships: null,
        ready: false,
      },
      {
        idPlayer: generateId(),
        ws: room.users[1].ws,
        name: room.users[1].name,
        index: room.users[1].index,
        ships: null,
        ready: false,
      },
    ],
    currentTurn: '',
  };

  games.set(gameId, game);

  game.players.forEach((player) => {
    sendJSON(player.ws, {
      type: 'create_game',
      data: {
        idGame: gameId,
        idPlayer: player.idPlayer,
      },
      id: 0,
    });
  });
}
