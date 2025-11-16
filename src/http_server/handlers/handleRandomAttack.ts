import { RandomAttackData, Game } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';
import { broadcastTurn } from './broadcastTurn';

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

  const enemyId = Object.keys(game.players).find((id) => id !== String(indexPlayer));
  if (!enemyId) {
    console.error('Enemy not found!');
    return;
  }
  const enemy = game.players[String(enemyId)];

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

  let status: 'miss' | 'shot' | 'killed' = 'miss';

  for (const ship of enemy.ships || []) {
    for (let i = 0; i < ship.length; i++) {
      const px = ship.direction ? ship.position.x : ship.position.x + i;
      const py = ship.direction ? ship.position.y + i : ship.position.y;

      if (px === x && py === y) {
        ship.hits = (ship.hits || 0) + 1;
        status = ship.hits === ship.length ? 'killed' : 'shot';
        break;
      }
    }
  }

  const msg = {
    type: 'attack',
    data: {
      position: { x, y },
      currentPlayer: indexPlayer,
      status,
    },
    id: 0,
  };

  sendJSON(player.ws, msg);
  sendJSON(enemy.ws, msg);

  if (status === 'miss') {
    game.currentTurn = String(enemyId);
    broadcastTurn(game);
  }
}
