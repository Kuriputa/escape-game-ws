// Using global Photon from browser SDK script

export const EVENT_CODES = {
  CHAT: 98,
  PING: 0,
  PUZZLE_UPDATE: 1,
  INK_SET: 2,
  CHOICE_MADE: 3,
} as const;

export class Net {
  client: any;
  onEvent?: (code: number, data: any) => void;
  private desiredRoomName: string | null = null;
  private isJoiningRoom = false;
  private nickname: string = "";
  onJoined?: (roomName: string) => void;

  constructor() {
    const appVersion = import.meta.env.VITE_PHOTON_APP_VERSION || "1.0";
    // Photon is provided globally by the CDN script
    // @ts-ignore
    this.client = new Photon.LoadBalancing.LoadBalancingClient(
      // @ts-ignore
      Photon.ConnectionProtocol.Wss,
      ""
    );
    this.client.setAppVersion(appVersion);

    // logs utiles
    this.client.onEvent = (code: number, content: any) => this.onEvent?.(code, content);
    this.client.onStateChange = (s: number) => {
      console.log("Photon state:", s);
      // Si on vient d'entrer dans le lobby, lancer le join de la room souhaitée
      if (this.client.isInLobby && this.client.isInLobby() && this.desiredRoomName && !this.isJoiningRoom) {
        console.log("Photon: In lobby → joining room", this.desiredRoomName);
        this.isJoiningRoom = true;
        this.client.joinRoom(this.desiredRoomName, { createIfNotExists: true }, {});
      }
      // Callback lorsqu'on rejoint une room
      if (this.client.isJoinedToRoom && this.client.isJoinedToRoom() && this.desiredRoomName) {
        this.onJoined?.(this.desiredRoomName);
      }
    };
  }

  async connect(region = import.meta.env.VITE_PHOTON_REGION || "eu") {
    const appId = import.meta.env.VITE_PHOTON_APP_ID || "";
    this.client.setAppId(appId);
    if (this.nickname) {
      this.client.setUserId(this.nickname);
      this.client.myActor().setName(this.nickname);
    }
    this.client.connectToRegionMaster(region);
  }

  async joinOrCreateRoom(roomName: string) {
    // Memorise la room désirée et rejoins-la dès que le lobby est joignable
    this.desiredRoomName = roomName;
    if (!this.client.isInLobby || !this.client.isInLobby()) {
      await this.connect(import.meta.env.VITE_PHOTON_REGION || "eu");
      return;
    }
    this.isJoiningRoom = true;
    this.client.joinRoom(roomName, { createIfNotExists: true }, {});
  }

  send(code: number, payload: any) {
    // Envoie vers les autres clients de la room (comportement par défaut), fiable
    const opts = { receivers: Photon.LoadBalancing.Constants.ReceiverGroup.Others, reliable: true };
    this.client.raiseEvent(code, payload, opts);
  }

  setNickname(nick: string) {
    this.nickname = nick;
    try {
      this.client?.setUserId?.(nick);
      this.client?.myActor?.()?.setName?.(nick);
    } catch {}
  }

  sendChat(message: string) {
    this.send(EVENT_CODES.CHAT, { from: this.nickname, text: message, t: Date.now() });
  }
}
