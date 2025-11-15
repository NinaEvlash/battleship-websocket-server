import { Game, GamePlayer, AddShipsData } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';
import { broadcastTurn } from './broadcastTurn';

export function handleAddShips(data: AddShipsData, games: Map<any, Game>) {
  const { gameId, ships, indexPlayer } = data;

  if (!games.has(gameId)) {
    console.error('Game not found:', gameId);
    return;
  }

  const game = games.get(gameId)!;

  if (!game.players[indexPlayer]) {
    console.error('Player not found in game:', indexPlayer);
    return;
  }

  const player: GamePlayer = game.players[indexPlayer];
  player.ships = ships;
  player.ready = true;

  console.log(`Player ${indexPlayer} added ships for game ${gameId}`);

  const playerIds = Object.keys(game.players);

  console.log('Game started:', gameId);

  const firstTurn = Math.random() < 0.5 ? playerIds[0] : playerIds[1];
  game.currentTurn = String(firstTurn);

  for (const pid of playerIds) {
    const p = game.players[pid];

    const msg = {
      type: 'start_game',
      data: {
        ships: p.ships,
        currentPlayerIndex: pid,
      },
      id: 0,
    };

    sendJSON(p.ws, msg);
  }

  broadcastTurn(game);
}
