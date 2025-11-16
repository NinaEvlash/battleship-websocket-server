import { Game } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';
import { broadcastTurn } from './broadcastTurn';

export function performAttack(game: Game, indexPlayer: string, x: number, y: number) {
  const player = game.players[indexPlayer];
  const enemyId = Object.keys(game.players).find((id) => id !== indexPlayer)!;
  const enemy = game.players[enemyId];

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
    game.currentTurn = enemyId;
    broadcastTurn(game);
  }

  return status;
}
