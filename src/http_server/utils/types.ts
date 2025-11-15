import type { WebSocket } from 'ws';

export type User = { password: string; index: number };

export type ConnectedUser = {
  name: string;
  index: number;
  ws: WebSocket;
};

export type Room = {
  roomId: string;
  users: ConnectedUser[];
};

export type GamePlayer = {
  idPlayer: string;
  ws: WebSocket;
  name: string;
  index: number;
  ships: any[] | null;
  ready: boolean;
};

export type Game = {
  gameId: number | string;
  players: Record<string, GamePlayer>;
  currentTurn: string | null;
};

export type AddShipsData = {
  gameId: number | string;
  ships: Ship[];
  indexPlayer: number | string;
};

export type Ship = {
  position: { x: number; y: number };
  direction: boolean;
  length: number;
  type: 'small' | 'medium' | 'large' | 'huge';
};
