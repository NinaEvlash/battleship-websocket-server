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
