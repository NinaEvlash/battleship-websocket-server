import { AttackData, Game } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';
import { performAttack } from './performAttack';

export function handleAttack(data: AttackData, games: Map<string, Game>) {
  const { gameId, x, y, indexPlayer } = data;

  const game = games.get(String(gameId));
  if (!game) {
    console.error('Game not found:', gameId);
    return;
  }

  const player = game.players[indexPlayer];
  if (!player) {
    console.error('Player not found in game:', indexPlayer);
    return;
  }

  if (game.currentTurn && game.currentTurn !== indexPlayer) {
    sendJSON(player.ws, {
      type: 'error',
      data: 'Not your turn!',
      id: 0,
    });
    return;
  }

  const key = `${x},${y}`;
  if (!player.shots) player.shots = new Set<string>();
  player.shots.add(key);

  performAttack(game, String(indexPlayer), x, y);
}
