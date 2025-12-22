import { POLYGON_FOCUS_ZOOM, RISK_LEVEL_COLORS } from '@/config/map.config';
import type { FloodZonePolygon as FloodZonePolygonType } from '@/types/map';
import type { LatLngTuple } from 'leaflet';
import { useCallback, useMemo } from 'react';
import { Circle, Popup, useMap } from 'react-leaflet';

export interface FloodZonePolygonProps {
    zone: FloodZonePolygonType;
    isSelected?: boolean;
    onClick?: (zone: FloodZonePolygonType) => void;
    onEdit?: (zone: FloodZonePolygonType) => void;
    onDelete?: (zone: FloodZonePolygonType) => void;
    radius?: number;
    children?: React.ReactNode;
}

export interface FloodZonePolygonsProps {
    zones: FloodZonePolygonType[];
    selectedZoneId?: number | null;
    onZoneClick?: (zone: FloodZonePolygonType) => void;
    onZoneEdit?: (zone: FloodZonePolygonType) => void;
    onZoneDelete?: (zone: FloodZonePolygonType) => void;
    children?: (zone: FloodZonePolygonType) => React.ReactNode;
}

export function FloodZonePolygon({
    zone,
    isSelected,
    onClick,
    radius = 500,
    children,
}: FloodZonePolygonProps) {
    const map = useMap();

    const center = useMemo((): LatLngTuple => {
        if (zone.bounds) {
            return [zone.bounds.center.lat, zone.bounds.center.lng];
        }
        return zone.coordinates[0] || [0, 0];
    }, [zone.bounds, zone.coordinates]);

    const colors = useMemo(() => {
        return RISK_LEVEL_COLORS[zone.riskLevel];
    }, [zone.riskLevel]);

    const pathOptions = useMemo(() => {
        return {
            color: colors.hex,
            weight: isSelected ? 3 : 2,
            opacity: isSelected ? 1 : 0.8,
            fillColor: colors.hex,
            fillOpacity: isSelected ? colors.opacity + 0.15 : colors.opacity,
        };
    }, [colors, isSelected]);

    const handleClick = useCallback(() => {
        onClick?.(zone);

        map.flyTo(center, POLYGON_FOCUS_ZOOM, { animate: true, duration: 0.5 });
    }, [map, zone, onClick, center]);

    return (
        <Circle
            center={center}
            radius={radius}
            pathOptions={pathOptions}
            eventHandlers={{
                click: handleClick,
            }}
        >
            {children && (
                <Popup
                    className="zone-popup dark-popup"
                    closeButton={false}
                    autoPan={true}
                    minWidth={220}
                    maxWidth={240}
                >
                    {children}
                </Popup>
            )}
        </Circle>
    );
}

export function FloodZonePolygons({
    zones,
    selectedZoneId,
    onZoneClick,
    onZoneEdit,
    onZoneDelete,
    children,
}: FloodZonePolygonsProps) {
    if (!zones || zones.length === 0) {
        return null;
    }

    return (
        <>
            {zones.map((zone) => (
                <FloodZonePolygon
                    key={zone.id}
                    zone={zone}
                    isSelected={selectedZoneId === zone.id}
                    onClick={onZoneClick}
                    onEdit={onZoneEdit}
                    onDelete={onZoneDelete}
                >
                    {children?.(zone)}
                </FloodZonePolygon>
            ))}
        </>
    );
}
