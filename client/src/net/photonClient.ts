// src/net/photon.ts
import { LoadBalancingClient, ClientState } from "photon-realtime";

export const EVENT_CODES = {
  CHAT: 98,
  PING: 0,
  PUZZLE_UPDATE: 1,
  INK_SET: 2,
  CHOICE_MADE: 3,
} as const;

export class Net {
  client = new LoadBalancingClient("wss://", "1.0"); // AppVersion (à ta convenance)
  onEvent?: (code: number, data: any) => void;

  constructor() {
    this.client.onEvent = (code, content) => this.onEvent?.(code, content);
    this.client.onStateChange = (s) => console.log("Photon state:", s);
  }

  async connect(region = "eu") {
    await this.client.connectToRegionMaster(region); // utilise ton AppId configuré côté Photon
  }

  async joinOrCreateRoom(roomName: string) {
    if (this.client.state !== ClientState.JoinedLobby) await this.client.connectToRegionMaster("eu");
    this.client.joinOrCreateRoom(roomName);
  }

  send(code: number, payload: any) {
    this.client.raiseEvent(code, payload);
  }
}
