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
  gameId: string;
  players: GamePlayer[];
  currentTurn: string;
};

export type ShipPosition = {
  x: number;
  y: number;
};

export type ShipType = 'small' | 'medium' | 'large' | 'huge';

export type Ship = {
  position: ShipPosition;
  direction: boolean;
  type: ShipType;
  length: number;
};
