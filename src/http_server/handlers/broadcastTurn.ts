import { Game } from '../utils/types';
import { sendJSON } from '../utils/sendJSON';

export function broadcastTurn(game: Game) {
  const msg = {
    type: 'turn',
    data: {
      currentPlayer: game.currentTurn,
    },
    id: 0,
  };

  for (const pid of Object.keys(game.players)) {
    sendJSON(game.players[pid].ws, msg);
  }
}
