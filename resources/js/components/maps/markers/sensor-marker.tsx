import { MARKER_FOCUS_ZOOM, SENSOR_MARKER_ICONS } from '@/config/map.config';
import type { SensorMarker as SensorMarkerType } from '@/types/map';
import { useCallback, useMemo } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
import { SensorPopup } from './sensor-popup';

export interface SensorMarkerProps {
    sensor: SensorMarkerType;
    isSelected?: boolean;
    onClick?: (sensor: SensorMarkerType) => void;
    onEdit?: (sensor: SensorMarkerType) => void;
    onDelete?: (sensor: SensorMarkerType) => void;
    onViewHistory?: (sensor: SensorMarkerType) => void;
}

export interface SensorMarkersProps {
    sensors: SensorMarkerType[];
    selectedSensorId?: number | null;
    onSensorClick?: (sensor: SensorMarkerType) => void;
    onSensorEdit?: (sensor: SensorMarkerType) => void;
    onSensorDelete?: (sensor: SensorMarkerType) => void;
    onSensorViewHistory?: (sensor: SensorMarkerType) => void;
}

export function SensorMarker({
    sensor,
    isSelected,
    onClick,
    onEdit,
    onDelete,
    onViewHistory,
}: SensorMarkerProps) {
    const map = useMap();

    const icon = useMemo(() => {
        return SENSOR_MARKER_ICONS[sensor.status] || SENSOR_MARKER_ICONS.safe;
    }, [sensor.status]);

    const handleClick = useCallback(() => {
        onClick?.(sensor);

        map.flyTo(
            [sensor.position.lat, sensor.position.lng],
            MARKER_FOCUS_ZOOM,
            { animate: true, duration: 0.5 },
        );
    }, [map, sensor, onClick]);

    const handleEdit = useCallback(() => {
        onEdit?.(sensor);
    }, [sensor, onEdit]);

    const handleDelete = useCallback(() => {
        onDelete?.(sensor);
    }, [sensor, onDelete]);

    const handleViewHistory = useCallback(() => {
        onViewHistory?.(sensor);
    }, [sensor, onViewHistory]);

    return (
        <Marker
            position={[sensor.position.lat, sensor.position.lng]}
            icon={icon}
            eventHandlers={{
                click: handleClick,
            }}
            opacity={isSelected ? 1 : 0.85}
            zIndexOffset={isSelected ? 1000 : 0}
        >
            <Popup
                className="dark-popup rounded-md"
                closeButton={false}
                autoPan={true}
                minWidth={220}
                maxWidth={240}
            >
                <SensorPopup
                    sensor={sensor}
                    showActions={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onViewHistory={handleViewHistory}
                />
            </Popup>
        </Marker>
    );
}

export function SensorMarkers({
    sensors,
    selectedSensorId,
    onSensorClick,
    onSensorEdit,
    onSensorDelete,
    onSensorViewHistory,
}: SensorMarkersProps) {
    if (!sensors || sensors.length === 0) {
        return null;
    }

    return (
        <>
            {sensors.map((sensor) => (
                <SensorMarker
                    key={sensor.id}
                    sensor={sensor}
                    isSelected={selectedSensorId === sensor.id}
                    onClick={onSensorClick}
                    onEdit={onSensorEdit}
                    onDelete={onSensorDelete}
                    onViewHistory={onSensorViewHistory}
                />
            ))}
        </>
    );
}
