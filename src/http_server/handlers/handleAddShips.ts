import { Game, Ship } from '../utils/types';
import { findGameAndPlayer } from '../utils/find';
import { sendJSON } from '../utils/sendJSON';

export function handleAddShips(
  data: { gameId: string; ships: Ship[]; idPlayer?: string; indexPlayer?: string },
  games: Map<string, Game>
) {
  if (!data) {
    console.error('handleAddShips: empty data');
    return;
  }
  const { gameId, ships } = data;
  const idPlayer = data.idPlayer || data.indexPlayer;

  if (!gameId) {
    console.error('handleAddShips: missing gameId', data);
    return;
  }
  if (!idPlayer) {
    console.error('handleAddShips: missing player id (idPlayer/indexPlayer)', data);
    return;
  }

  const resultFind = findGameAndPlayer(games, gameId, idPlayer);
  if (!resultFind) {
    console.error(
      `handleAddShips: game or player not found. gameId=${gameId}, idPlayer=${idPlayer}`
    );
    return;
  }
  const { game, player } = resultFind;

  player.ships = ships;
  player.ready = true;

  console.log(`Player ${idPlayer} set ships for game ${gameId}`);

  const isReady = game.players.every((p) => p.ready);

  if (isReady) {
    const firstPlayerIndex = player.idPlayer;

    game.players.forEach((p) => {
      sendJSON(p.ws, {
        type: 'start_game',
        data: {
          ships: p.ships,
          currentPlayerIndex: firstPlayerIndex,
        },
        id: 0,
      });
    });

    game.currentTurn = String(firstPlayerIndex);

    game.players.forEach((p) => {
      sendJSON(p.ws, {
        type: 'turn',
        data: { currentPlayer: game.currentTurn },
        id: 0,
      });
    });

    console.log(`Game ${gameId} started. currentTurn=${game.currentTurn}`);
  }
}
