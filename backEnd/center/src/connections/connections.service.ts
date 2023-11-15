import { Injectable } from '@nestjs/common';
import { ReturnConnectionsDto } from './dto/return-connections.dto copy';
import { SignalingConnectionDto } from './dto/signaling-connections.dto';
import { RegisterSignalingSocket } from './dto/register-signaling-socket.dto';

@Injectable()
export class ConnectionsService {
  private roomToSocket = new Map<string, string>();
  private socketToConnections = new Map<string, number>();

  registerSockets(data: RegisterSignalingSocket) {
    const url = data.url;
    console.log(url);
    const isSocket = this.socketToConnections.has(url);

    if (isSocket) {
      return 'Already Registered';
    }

    this.socketToConnections.set(url, 0);
    return 'Register Success';
  }

  createConnection(data: SignalingConnectionDto): ReturnConnectionsDto {
    const { roomName } = data;

    const isRoom = this.roomToSocket.has(roomName);

    if (isRoom) {
      const socket = this.roomToSocket.get(roomName);
      const connections = this.socketToConnections.get(socket);
      this.socketToConnections.set(socket, connections + 1);
      const result: ReturnConnectionsDto = { url: socket };
      return result;
    }

    let socket = null;
    let connections = Number.MAX_SAFE_INTEGER;
    this.socketToConnections.forEach((value, key) => {
      if (value < connections) {
        connections = value;
        socket = key;
      }
    });

    this.roomToSocket.set(roomName, socket);
    this.socketToConnections.set(socket, connections + 1);
    const result: ReturnConnectionsDto = { url: socket };

    return result;
  }

  leaveRoom(data: SignalingConnectionDto): void {
    const { roomName } = data;
    const socket = this.roomToSocket.get(roomName);
    const connections = this.socketToConnections.get(socket);
    this.socketToConnections.set(socket, connections - 1);
    return;
  }
}
