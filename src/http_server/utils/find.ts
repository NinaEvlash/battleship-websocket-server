import { Game } from './types';

export function findGameAndPlayer(games: Map<string, Game>, gameId: string, id: string) {
  const game = games.get(gameId);
  if (!game) return null;

  // ищем и по idPlayer, и по index (фронт иногда путает)
  const player = game.players.find((p) => p.idPlayer === id || String(p.index) === id);

  if (!player) return null;

  return { game, player };
}
