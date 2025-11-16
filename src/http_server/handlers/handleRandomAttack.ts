import { RandomAttackData, Game } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';
import { performAttack } from './performAttack';

export function handleRandomAttack(data: RandomAttackData, games: Map<string, Game>) {
  const { gameId, indexPlayer } = data;

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

  if (!player.shots) player.shots = new Set<string>();

  let x: number;
  let y: number;
  let key: string;

  do {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    key = `${x},${y}`;
  } while (player.shots.has(key));

  player.shots.add(key);

  performAttack(game, String(indexPlayer), x, y);
}
