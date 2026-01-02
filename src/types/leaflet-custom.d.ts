declare module 'leaflet' {
    export type LatLngExpression = [number, number] | { lat: number, lng: number };
    export type BoundsExpression = any;

    export class Class {
        static extend(props: any): any;
    }

    export class Layer {
        addTo(map: Map | LayerGroup | any): this;
        remove(): this;
        bindPopup(content: any): this;
        openPopup(): this;
        closePopup(): this;
        getPopup(): any;
        setPopupContent(content: any): this;
        on(event: string, callback: any): this;
        off(event: string, callback: any): this;
    }

    export class LayerGroup extends Layer {
        addLayer(layer: Layer): this;
        removeLayer(layer: Layer): this;
        clearLayers(): this;
        eachLayer(fn: (layer: Layer) => void): this;
        toGeoJSON(): any;
        getLayers(): Layer[];
    }

    export class FeatureGroup extends LayerGroup {
        getBounds(): any;
        setStyle(style: any): this;
        bringToFront(): this;
        bringToBack(): this;
    }

    export class GeoJSON extends FeatureGroup {
        constructor(geojson: any, options?: any);
        static geometryToLayer(geojson: any, options?: any): Layer;
        static coordsToLatLng(coords: any): any;
        static coordsToLatLngs(coords: any, levelsDeep?: number, coordsToLatLng?: any): any;
        addData(data: any): this;
        resetStyle(layer: Layer): this;
    }

    export namespace GeoJSON {
        type Feature = any;
    }

    export class Map {
        constructor(element: string | HTMLElement, options?: any);
        setView(center: LatLngExpression, zoom: number): this;
        getZoom(): number;
        getBounds(): any;
        fitBounds(bounds: any, options?: any): this;
        addLayer(layer: Layer): this;
        removeLayer(layer: Layer): this;
        hasLayer(layer: Layer): boolean;
        on(event: string, callback: any): this;
        off(event: string, callback: any): this;
        remove(): this;
        getContainer(): HTMLElement;
        panTo(latlng: LatLngExpression, options?: any): this;
        invalidateSize(options?: any): this;
    }

    export class TileLayer extends Layer {
        constructor(urlTemplate: string, options?: any);
    }

    export class Marker extends Layer {
        constructor(latlng: LatLngExpression, options?: any);
        setIcon(icon: any): this;
        setOpacity(opacity: number): this;
    }

    export class Polygon extends Layer {
        constructor(latlngs: any, options?: any);
        getBounds(): any;
    }

    export class Icon extends Layer {
        constructor(options: any);
        static Default: any;
    }

    export class Control extends Class {
        constructor(options?: any);
        setPosition(position: string): this;
        addTo(map: Map): this;
        getContainer(): HTMLElement;
        remove(): this;
        static geocoder(options?: any): any;
        static extend(props: any): any;
    }

    export namespace Control {
        class Geocoder {
            constructor(options?: any);
        }
    }

    export namespace DomUtil {
        function create(tagName: string, className?: string, container?: HTMLElement): HTMLElement;
        function remove(el: HTMLElement): void;
        function empty(el: HTMLElement): void;
        function hasClass(el: HTMLElement, name: string): boolean;
        function addClass(el: HTMLElement, name: string): void;
        function removeClass(el: HTMLElement, name: string): void;
    }

    export function map(element: string | HTMLElement, options?: any): Map;
    export function tileLayer(url: string, options?: any): TileLayer;
    export function marker(latlng: LatLngExpression, options?: any): Marker;
    export function divIcon(options?: any): any;
    export function geoJSON(geojson?: any, options?: any): GeoJSON;
    export function layerGroup(layers?: Layer[]): LayerGroup;
    export function latLngBounds(southWest: any, northEast: any): any;
    export function latLng(lat: number, lng: number): any;
    export function polygon(latlngs: any, options?: any): Polygon;

    export namespace control {
        function layers(baseLayers?: any, overlays?: any, options?: any): Control;
    }
}

declare module 'leaflet-control-geocoder';
