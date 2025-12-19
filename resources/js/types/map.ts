import type { RiskLevel, SensorStatus } from '@/config/map.config';

export interface SensorPosition {
    lat: number;
    lng: number;
}

export interface SensorMarker {
    id: number;
    name: string;
    code: string;
    position: SensorPosition;
    status: SensorStatus;
    statusLabel: string;
    statusColor: string;
    waterLevel: number;
    address: string | null;
    description?: string | null;
    lastReadingAt: string | null;
    lastReadingAtFormatted?: string | null;
}

export interface Sensor extends SensorMarker {
    latitude: number;
    longitude: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
    waterLevelLogs?: WaterLevelLog[];
}

export type PolygonCoordinate = [number, number]; // [lat, lng]

export interface ZoneBounds {
    north: number;
    south: number;
    east: number;
    west: number;
    center: {
        lat: number;
        lng: number;
    };
}

export interface FloodZonePolygon {
    id: number;
    name: string;
    description: string | null;
    coordinates: PolygonCoordinate[];
    riskLevel: RiskLevel;
    riskLabel: string;
    riskColor: string;
    color: string;
    opacity: number;
    bounds?: ZoneBounds;
}

export interface FloodZone extends FloodZonePolygon {
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface WaterLevelLog {
    id: number;
    sensorId: number;
    waterLevel: number;
    status: SensorStatus;
    recordedAt: string;
}

export interface MapStats {
    totalSensors: number;
    safeSensors: number;
    warningSensors: number;
    dangerSensors: number;
    totalZones: number;
    highRiskZones: number;
    mediumRiskZones: number;
    lowRiskZones: number;
    filteredSensors?: number;
    filteredZones?: number;
}

export interface MapData {
    markers: SensorMarker[];
    polygons: FloodZonePolygon[];
    stats: MapStats;
}

export interface MapCenter {
    lat: number;
    lng: number;
}

export interface MapBounds {
    northEast: MapCenter;
    southWest: MapCenter;
}

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
    total?: number;
}

export interface PaginatedResponse<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

export type StatusFilter = 'all' | SensorStatus;
export type RiskLevelFilter = 'all' | RiskLevel;

export interface MapFilters {
    status: StatusFilter;
    riskLevel: RiskLevelFilter;
    search: string;
}

export type SidebarTab = 'sensors' | 'zones';

export interface SidebarState {
    isCollapsed: boolean;
    activeTab: SidebarTab;
    filters: MapFilters;
}

export interface SensorFormData {
    name: string;
    code: string;
    latitude: number;
    longitude: number;
    status: SensorStatus;
    water_level: number;
    address?: string;
    description?: string;
    is_active: boolean;
}

export interface FloodZoneFormData {
    name: string;
    description?: string;
    coordinates: PolygonCoordinate[];
    risk_level: RiskLevel;
    color?: string;
    is_active: boolean;
}

export interface MapEventHandlers {
    onMarkerClick?: (sensor: SensorMarker) => void;
    onZoneClick?: (zone: FloodZonePolygon) => void;
    onMapClick?: (latlng: { lat: number; lng: number }) => void;
    onZoomChange?: (zoom: number) => void;
    onCenterChange?: (center: MapCenter) => void;
}

export interface DashboardAlert {
    id: number;
    name: string;
    waterLevel?: number;
    address?: string;
    description?: string;
}

export interface DashboardSummary {
    stats: MapStats;
    alerts: {
        dangerSensors: DashboardAlert[];
        highRiskZones: DashboardAlert[];
    };
    hasAlerts: boolean;
}
