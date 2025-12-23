import {
    LocateControlWrapper,
    MapLayerSwitcher,
} from '@/components/maps/controls';
import { SensorMarkers } from '@/components/maps/markers';
import { FloodZonePolygons, ZonePopup } from '@/components/maps/overlays';
import { MapLegend } from '@/components/maps/widgets';
import {
    DEFAULT_CENTER,
    DEFAULT_ZOOM,
    MAX_ZOOM,
    MIN_ZOOM,
    TILE_LAYERS,
    getSavedTileLayer,
    saveTileLayer,
    type TileLayerType,
} from '@/config/map.config';
import { cn } from '@/lib/utils';
import type {
    FloodZonePolygon,
    MapBounds,
    MapCenter,
    MapStats,
    SensorMarker,
} from '@/types/map';
import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import * as React from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';

export interface FloodMapProps {
    center?: LatLngTuple;
    zoom?: number;
    bounds?: MapBounds;

    markers?: SensorMarker[];
    polygons?: FloodZonePolygon[];
    stats?: MapStats;
    selectedSensorId?: number | null;
    selectedZoneId?: number | null;

    onMarkerClick?: (sensor: SensorMarker) => void;
    onMarkerEdit?: (sensor: SensorMarker) => void;
    onMarkerDelete?: (sensor: SensorMarker) => void;
    onMarkerViewHistory?: (sensor: SensorMarker) => void;
    onZoneClick?: (zone: FloodZonePolygon) => void;
    onZoneEdit?: (zone: FloodZonePolygon) => void;
    onZoneDelete?: (zone: FloodZonePolygon) => void;
    onMapClick?: (latlng: { lat: number; lng: number }) => void;
    onZoomChange?: (zoom: number) => void;
    onCenterChange?: (center: MapCenter) => void;
    onMapReady?: (map: L.Map) => void;

    tileLayer?: TileLayerType;
    onTileLayerChange?: (layer: TileLayerType) => void;

    showLayerSwitcher?: boolean;
    showLegend?: boolean;
    showLocateControl?: boolean;

    children?: React.ReactNode;

    className?: string;
}

interface MapEventsProps {
    onZoomChange?: (zoom: number) => void;
    onCenterChange?: (center: MapCenter) => void;
    onMapClick?: (latlng: { lat: number; lng: number }) => void;
    onMapReady?: (map: L.Map) => void;
}

function MapEvents({
    onZoomChange,
    onCenterChange,
    onMapClick,
    onMapReady,
}: MapEventsProps) {
    const map = useMap();

    React.useEffect(() => {
        onMapReady?.(map);

        const handleZoomEnd = () => {
            onZoomChange?.(map.getZoom());
        };

        const handleMoveEnd = () => {
            const center = map.getCenter();
            onCenterChange?.({ lat: center.lat, lng: center.lng });
        };

        const handleClick = (e: L.LeafletMouseEvent) => {
            onMapClick?.({ lat: e.latlng.lat, lng: e.latlng.lng });
        };

        map.on('zoomend', handleZoomEnd);
        map.on('moveend', handleMoveEnd);
        map.on('click', handleClick);

        return () => {
            map.off('zoomend', handleZoomEnd);
            map.off('moveend', handleMoveEnd);
            map.off('click', handleClick);
        };
    }, [map, onZoomChange, onCenterChange, onMapClick, onMapReady]);

    return null;
}

interface FitBoundsProps {
    bounds?: MapBounds;
}

function FitBounds({ bounds }: FitBoundsProps) {
    const map = useMap();

    React.useEffect(() => {
        if (bounds) {
            const leafletBounds: LatLngBoundsExpression = [
                [bounds.southWest.lat, bounds.southWest.lng],
                [bounds.northEast.lat, bounds.northEast.lng],
            ];
            map.fitBounds(leafletBounds, { padding: [50, 50] });
        }
    }, [map, bounds]);

    return null;
}

interface DynamicTileLayerProps {
    tileLayer: TileLayerType;
}

function DynamicTileLayer({ tileLayer }: DynamicTileLayerProps) {
    const tileConfig = TILE_LAYERS[tileLayer];

    return (
        <TileLayer
            key={tileLayer}
            url={tileConfig.url}
            attribution={tileConfig.attribution}
            maxZoom={tileConfig.maxZoom}
        />
    );
}

function FloodMap({
    center = DEFAULT_CENTER,
    zoom = DEFAULT_ZOOM,
    bounds,
    markers = [],
    polygons = [],
    stats,
    selectedSensorId,
    selectedZoneId,
    onMarkerClick,
    onMarkerEdit,
    onMarkerDelete,
    onMarkerViewHistory,
    onZoneClick,
    onZoneEdit,
    onZoneDelete,
    onMapClick,
    onZoomChange,
    onCenterChange,
    onMapReady,
    tileLayer: controlledTileLayer,
    onTileLayerChange,
    showLayerSwitcher = true,
    showLegend = true,
    showLocateControl = true,
    children,
    className,
}: FloodMapProps) {
    const [internalTileLayer, setInternalTileLayer] =
        React.useState<TileLayerType>(
            controlledTileLayer ?? getSavedTileLayer(),
        );

    const activeTileLayer = controlledTileLayer ?? internalTileLayer;

    const handleTileLayerChange = React.useCallback(
        (layer: TileLayerType) => {
            setInternalTileLayer(layer);
            saveTileLayer(layer);
            onTileLayerChange?.(layer);
        },
        [onTileLayerChange],
    );

    const sensorCounts = stats
        ? {
              safe: stats.safeSensors,
              warning: stats.warningSensors,
              danger: stats.dangerSensors,
          }
        : undefined;

    const zoneCounts = stats
        ? {
              low: stats.lowRiskZones,
              medium: stats.mediumRiskZones,
              high: stats.highRiskZones,
          }
        : undefined;

    return (
        <div className="relative h-full w-full">
            <MapContainer
                center={center}
                zoom={zoom}
                minZoom={MIN_ZOOM}
                maxZoom={MAX_ZOOM}
                className={cn('h-full w-full', className)}
                zoomControl={false}
                attributionControl={true}
            >
                <DynamicTileLayer tileLayer={activeTileLayer} />

                <MapEvents
                    onZoomChange={onZoomChange}
                    onCenterChange={onCenterChange}
                    onMapClick={onMapClick}
                    onMapReady={onMapReady}
                />

                {bounds && <FitBounds bounds={bounds} />}

                {markers.length > 0 && (
                    <SensorMarkers
                        sensors={markers}
                        selectedSensorId={selectedSensorId}
                        onSensorClick={onMarkerClick}
                        onSensorEdit={onMarkerEdit}
                        onSensorDelete={onMarkerDelete}
                        onSensorViewHistory={onMarkerViewHistory}
                    />
                )}

                {polygons.length > 0 && (
                    <FloodZonePolygons
                        zones={polygons}
                        selectedZoneId={selectedZoneId}
                        onZoneClick={onZoneClick}
                        onZoneEdit={onZoneEdit}
                        onZoneDelete={onZoneDelete}
                    >
                        {(zone) => (
                            <ZonePopup
                                zone={zone}
                                showActions={true}
                                onEdit={() => onZoneEdit?.(zone)}
                                onDelete={() => onZoneDelete?.(zone)}
                            />
                        )}
                    </FloodZonePolygons>
                )}

                {showLocateControl && (
                    <LocateControlWrapper
                        position="bottomleft"
                        flyToZoom={16}
                    />
                )}
                {children}
            </MapContainer>

            {showLayerSwitcher && (
                <MapLayerSwitcher
                    activeLayer={activeTileLayer}
                    onLayerChange={handleTileLayerChange}
                    position="topright"
                />
            )}

            {showLegend && (
                <MapLegend
                    position="bottomright"
                    showSensorLegend={true}
                    showRiskLegend={true}
                    sensorCounts={sensorCounts}
                    zoneCounts={zoneCounts}
                    showCounts={!!stats}
                    collapsible={true}
                    defaultCollapsed={false}
                />
            )}
        </div>
    );
}

export { FloodMap };
