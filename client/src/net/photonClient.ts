import { LoadBalancingClient, ClientState } from "photon-realtime";

export const EVENT_CODES = {
  CHAT: 98,
  PING: 0,
  PUZZLE_UPDATE: 1,
  INK_SET: 2,
  CHOICE_MADE: 3,
} as const;

export class Net {
  client: LoadBalancingClient;
  onEvent?: (code: number, data: any) => void;

  constructor() {
    const appVersion = import.meta.env.VITE_PHOTON_APP_VERSION || "1.0";
    this.client = new LoadBalancingClient("wss://", appVersion);

    // logs utiles
    this.client.onEvent = (code, content) => this.onEvent?.(code, content);
    this.client.onStateChange = (s) => console.log("Photon state:", s);
  }

  async connect(region = import.meta.env.VITE_PHOTON_REGION || "eu") {
    // photon-realtime ^4.4.0 connectToRegionMaster(region) signature
    await this.client.connectToRegionMaster(region);
  }

  async joinOrCreateRoom(roomName: string) {
    if (this.client.state !== ClientState.JoinedLobby) {
      await this.connect(import.meta.env.VITE_PHOTON_REGION || "eu");
    }
    this.client.joinOrCreateRoom(roomName);
  }

  send(code: number, payload: any) {
    this.client.raiseEvent(code, payload);
  }
}
