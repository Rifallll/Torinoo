// shim.d.ts
import * as L from 'leaflet';

declare module 'leaflet' {
  interface Evented {
    // Add any specific methods or properties you need to augment here
    // For example, if you were adding a custom event:
    // on(type: 'customEvent', fn: (event: CustomEvent) => void, context?: any): this;
  }

  // Add GeoJSON namespace if it's missing
  namespace GeoJSON {
    interface Feature<G = Geometry, P = GeoJsonProperties> extends globalThis.GeoJSON.Feature<G, P> {}
    interface FeatureCollection<G = Geometry, P = GeoJsonProperties> extends globalThis.GeoJSON.FeatureCollection<G, P> {}
    interface Point extends globalthis.GeoJSON.Point {}
    interface Geometry extends globalThis.GeoJSON.Geometry {}
    interface GeoJsonProperties extends globalThis.GeoJSON.GeoJsonProperties {}
  }
}

// Extend Window interface for Vite environment variables
interface ImportMetaEnv {
  // IMPORTANT: In a production application, VITE_TOMTOM_API_KEY and VITE_AQICN_API_KEY
  // should also be proxied through a backend to prevent client-side exposure.
  // For this demo, they remain client-side for simplicity, but be aware of the risk.
  readonly VITE_TOMTOM_API_KEY: string;
  readonly VITE_AQICN_API_KEY: string;
  // VITE_NEWSAPI_KEY and VITE_GNEWS_API_KEY are removed from client-side exposure.
  // In a real application, these would be accessed securely on a backend server
  // (e.g., via a Supabase Edge Function or a custom Node.js backend).
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}