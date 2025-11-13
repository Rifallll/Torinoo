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
    interface Point extends globalThis.GeoJSON.Point {}
    interface Geometry extends globalThis.GeoJSON.Geometry {}
    interface GeoJsonProperties extends globalThis.GeoJSON.GeoJsonProperties {}
  }
}

// Extend Window interface for Vite environment variables
interface ImportMetaEnv {
  readonly VITE_OPENWEATHER_API_KEY: string;
  readonly VITE_TOMTOM_API_KEY: string; // Added TomTom API Key
  readonly VITE_GEOAPIFY_API_KEY: string; // Added Geoapify API Key
  readonly VITE_AQICN_API_TOKEN: string; // New: AQICN API Token
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}