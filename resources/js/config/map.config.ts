import L from 'leaflet';

export const DEFAULT_CENTER: L.LatLngTuple = [-6.2088, 106.8456];

export const DEFAULT_ZOOM = 11;
export const MIN_ZOOM = 5;
export const MAX_ZOOM = 18;
export const MARKER_FOCUS_ZOOM = 15;
export const POLYGON_FOCUS_ZOOM = 13;

export const INDONESIA_BOUNDS: L.LatLngBoundsLiteral = [
    [-11.0, 95.0],
    [6.0, 141.0],
];

export type TileLayerType = 'osm' | 'satellite' | 'terrain' | 'dark';

export interface TileLayerConfig {
    name: string;
    url: string;
    attribution: string;
    maxZoom: number;
}

export const TILE_LAYERS: Record<TileLayerType, TileLayerConfig> = {
    osm: {
        name: 'OpenStreetMap',
        url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
    },
    satellite: {
        name: 'Satelit',
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        attribution:
            '&copy; <a href="https://www.esri.com/">Esri</a> | World Imagery',
        maxZoom: 18,
    },
    terrain: {
        name: 'Terrain',
        url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
        attribution:
            '&copy; <a href="https://opentopomap.org">OpenTopoMap</a> contributors',
        maxZoom: 17,
    },
    dark: {
        name: 'Dark Mode',
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
        maxZoom: 19,
    },
};

export const DEFAULT_TILE_LAYER: TileLayerType = 'osm';

export type SensorStatus = 'safe' | 'warning' | 'danger';
export type RiskLevel = 'low' | 'medium' | 'high';

export interface StatusColor {
    bg: string;
    text: string;
    border: string;
    hex: string;
    label: string;
}

export const SENSOR_STATUS_COLORS: Record<SensorStatus, StatusColor> = {
    safe: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-500',
        hex: '#22c55e',
        label: 'Aman',
    },
    warning: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-500',
        hex: '#eab308',
        label: 'Siaga',
    },
    danger: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-500',
        hex: '#ef4444',
        label: 'Bahaya',
    },
};

export const RISK_LEVEL_COLORS: Record<
    RiskLevel,
    StatusColor & { opacity: number }
> = {
    low: {
        bg: 'bg-green-100 dark:bg-green-900/30',
        text: 'text-green-700 dark:text-green-400',
        border: 'border-green-500',
        hex: '#22c55e',
        label: 'Rendah',
        opacity: 0.3,
    },
    medium: {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-400',
        border: 'border-yellow-500',
        hex: '#eab308',
        label: 'Sedang',
        opacity: 0.4,
    },
    high: {
        bg: 'bg-red-100 dark:bg-red-900/30',
        text: 'text-red-700 dark:text-red-400',
        border: 'border-red-500',
        hex: '#ef4444',
        label: 'Tinggi',
        opacity: 0.5,
    },
};

const BASE_ICON_OPTIONS: Partial<L.IconOptions> = {
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
    shadowUrl: undefined,
};

function createMarkerSvg(color: string): string {
    return `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
            <path fill="${color}" stroke="#fff" stroke-width="1" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
            <circle fill="#fff" cx="12" cy="9" r="3"/>
        </svg>
    `)}`;
}

export const SENSOR_MARKER_ICONS: Record<SensorStatus, L.Icon> = {
    safe: L.icon({
        ...BASE_ICON_OPTIONS,
        iconUrl: createMarkerSvg(SENSOR_STATUS_COLORS.safe.hex),
    }),
    warning: L.icon({
        ...BASE_ICON_OPTIONS,
        iconUrl: createMarkerSvg(SENSOR_STATUS_COLORS.warning.hex),
    }),
    danger: L.icon({
        ...BASE_ICON_OPTIONS,
        iconUrl: createMarkerSvg(SENSOR_STATUS_COLORS.danger.hex),
    }),
};

export const USER_LOCATION_ICON = L.icon({
    ...BASE_ICON_OPTIONS,
    iconUrl: createMarkerSvg('#3b82f6'), // Blue
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
});

export const DEFAULT_MARKER_ICON = L.icon({
    ...BASE_ICON_OPTIONS,
    iconUrl: createMarkerSvg('#6b7280'), // Gray
});

export interface PolygonStyle {
    color: string;
    fillColor: string;
    fillOpacity: number;
    weight: number;
}

export function getPolygonStyle(
    riskLevel: RiskLevel,
    customColor?: string,
): PolygonStyle {
    const config = RISK_LEVEL_COLORS[riskLevel];
    const color = customColor || config.hex;

    return {
        color: color,
        fillColor: color,
        fillOpacity: config.opacity,
        weight: 2,
    };
}

export function getHighlightedPolygonStyle(
    riskLevel: RiskLevel,
    customColor?: string,
): PolygonStyle {
    const baseStyle = getPolygonStyle(riskLevel, customColor);

    return {
        ...baseStyle,
        fillOpacity: baseStyle.fillOpacity + 0.2,
        weight: 3,
    };
}

export const WATER_LEVEL_THRESHOLDS = {
    safe: { max: 50 },
    warning: { max: 100 },
    danger: { min: 101 },
};

export function calculateStatusFromWaterLevel(
    waterLevel: number,
): SensorStatus {
    if (waterLevel <= WATER_LEVEL_THRESHOLDS.safe.max) {
        return 'safe';
    } else if (waterLevel <= WATER_LEVEL_THRESHOLDS.warning.max) {
        return 'warning';
    } else {
        return 'danger';
    }
}

export const STORAGE_KEYS = {
    TILE_LAYER: 'flood-warning-tile-layer',
    MAP_CENTER: 'flood-warning-map-center',
    MAP_ZOOM: 'flood-warning-map-zoom',
    SIDEBAR_COLLAPSED: 'flood-warning-sidebar-collapsed',
    ACTIVE_TAB: 'flood-warning-active-tab',
};

export function getStatusColor(status: SensorStatus): StatusColor {
    return SENSOR_STATUS_COLORS[status] || SENSOR_STATUS_COLORS.safe;
}

export function getRiskLevelColor(
    riskLevel: RiskLevel,
): StatusColor & { opacity: number } {
    return RISK_LEVEL_COLORS[riskLevel] || RISK_LEVEL_COLORS.low;
}

export function getMarkerIcon(status: SensorStatus): L.Icon {
    return SENSOR_MARKER_ICONS[status] || DEFAULT_MARKER_ICON;
}

export function formatWaterLevel(level: number): string {
    return `${level.toFixed(1)} cm`;
}

export function getSavedTileLayer(): TileLayerType {
    if (typeof window === 'undefined') return DEFAULT_TILE_LAYER;

    const saved = localStorage.getItem(STORAGE_KEYS.TILE_LAYER);
    if (saved && saved in TILE_LAYERS) {
        return saved as TileLayerType;
    }
    return DEFAULT_TILE_LAYER;
}

export function saveTileLayer(layer: TileLayerType): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.TILE_LAYER, layer);
}
