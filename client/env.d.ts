/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PHOTON_APP_ID: string
    readonly VITE_PHOTON_APP_VERSION: string
    readonly VITE_PHOTON_REGION: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
// Minimal types for photon-realtime when no @types package is available
declare module 'photon-realtime' {
  export class LoadBalancingClient {
    constructor(protocol: string, appVersion: string);
    state: number;
    onEvent?: (code: number, content: any) => void;
    onStateChange?: (state: number) => void;
    connectToRegionMaster(region: string): Promise<void>;
    joinOrCreateRoom(roomName: string): void;
    raiseEvent(code: number, payload: any): void;
  }
  export enum ClientState {
    PeerCreated = 0,
    JoinedLobby = 10
  }
}