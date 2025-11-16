import { AttackData, Game } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';
import { broadcastTurn } from './broadcastTurn';

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

  const enemyId = Object.keys(game.players).find((id) => id !== String(indexPlayer));
  if (!enemyId) {
    console.error('Enemy not found!');
    return;
  }
  const enemy = game.players[String(enemyId)];

  let status: 'miss' | 'shot' | 'killed' = 'miss';

  for (const ship of enemy.ships || []) {
    for (let i = 0; i < ship.length; i++) {
      const px = ship.position.x + (ship.direction === 'horizontal' ? i : 0);
      const py = ship.position.y + (ship.direction === 'vertical' ? i : 0);

      if (px === x && py === y) {
        ship.hits = (ship.hits || 0) + 1;
        status = ship.hits === ship.length ? 'killed' : 'shot';
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
