/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_PHOTON_APP_ID: string
    readonly VITE_PHOTON_APP_VERSION: string
    readonly VITE_PHOTON_REGION: string
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv
  }
  
// Minimal module declaration for photon-realtime (treat as any at runtime)
// Global Photon namespace from CDN
declare const Photon: any;