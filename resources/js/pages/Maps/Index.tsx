import {
    SensorCard,
    SensorCardSkeleton,
} from '@/components/data-display/sensor-card';
import {
    ZoneCard,
    ZoneCardSkeleton,
} from '@/components/data-display/zone-card';
import { DeleteConfirmDialog, ZoneFormModal } from '@/components/forms';
import { FloodMap } from '@/components/maps/core';
import { DEFAULT_CENTER, DEFAULT_ZOOM } from '@/config/map.config';
import { MapLayout } from '@/layouts/map';
import type {
    FloodZonePolygon,
    MapStats,
    RiskLevelFilter,
    SensorMarker,
    SidebarTab,
    StatusFilter,
} from '@/types/map';
import { Head } from '@inertiajs/react';
import type { LatLngTuple } from 'leaflet';
import { Droplets, MapPinOff } from 'lucide-react';
import * as React from 'react';
import { toast } from 'sonner';

interface MapsIndexProps {
    markers: SensorMarker[];
    polygons: FloodZonePolygon[];
    stats: MapStats;
    center?: { lat: number; lng: number };
    bounds?: {
        northEast: { lat: number; lng: number };
        southWest: { lat: number; lng: number };
    };
}


interface EmptyStateProps {
    type: 'sensors' | 'zones';
    hasFilters?: boolean;
}

function EmptyState({ type, hasFilters }: EmptyStateProps) {
    const config = {
        sensors: {
            icon: Droplets,
            title: hasFilters ? 'Sensor tidak ditemukan' : 'Belum ada sensor',
            description: hasFilters
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Tambahkan sensor untuk memulai pemantauan banjir',
        },
        zones: {
            icon: MapPinOff,
            title: hasFilters
                ? 'Zona tidak ditemukan'
                : 'Belum ada zona banjir',
            description: hasFilters
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Tambahkan zona banjir untuk menandai area rawan',
        },
    };

    const { icon: Icon, title, description } = config[type];

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-12 text-center">
            <div className="flex size-12 items-center justify-center rounded-full bg-muted">
                <Icon className="size-6 text-muted-foreground" />
            </div>
            <div>
                <p className="font-medium text-muted-foreground">{title}</p>
                <p className="text-sm text-muted-foreground/80">
                    {description}
                </p>
            </div>
        </div>
    );
}

export default function MapsIndex({
    markers: initialMarkers,
    polygons: initialPolygons,
    stats: initialStats,
    center: initialCenter,
}: MapsIndexProps) {

    const [markers] = React.useState<SensorMarker[]>(initialMarkers);
    const [polygons, setPolygons] =
        React.useState<FloodZonePolygon[]>(initialPolygons);
    const [stats, setStats] = React.useState<MapStats>(initialStats);

    const [mapCenter] = React.useState<LatLngTuple>(
        initialCenter ? [initialCenter.lat, initialCenter.lng] : DEFAULT_CENTER,
    );
    const [mapZoom] = React.useState(DEFAULT_ZOOM);
    const [mapRef, setMapRef] = React.useState<L.Map | null>(null);

    const [activeTab, setActiveTab] = React.useState<SidebarTab>('zones');
    const [statusFilter, setStatusFilter] = React.useState<StatusFilter>('all');
    const [riskLevelFilter, setRiskLevelFilter] =
        React.useState<RiskLevelFilter>('all');
    const [searchQuery, setSearchQuery] = React.useState('');

    const [selectedSensor, setSelectedSensor] =
        React.useState<SensorMarker | null>(null);
    const [selectedZone, setSelectedZone] =
        React.useState<FloodZonePolygon | null>(null);

    const [isZoneModalOpen, setIsZoneModalOpen] = React.useState(false);
    const [editingZone, setEditingZone] =
        React.useState<FloodZonePolygon | null>(null);

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [deletingZone, setDeletingZone] =
        React.useState<FloodZonePolygon | null>(null);

    const [isLoading] = React.useState(false);

    const filteredMarkers = React.useMemo(() => {
        return markers.filter((marker) => {
            if (statusFilter !== 'all' && marker.status !== statusFilter) {
                return false;
            }

            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    marker.name.toLowerCase().includes(query) ||
                    marker.code.toLowerCase().includes(query) ||
                    marker.address?.toLowerCase().includes(query)
                );
            }
            return true;
        });
    }, [markers, statusFilter, searchQuery]);

    const filteredPolygons = React.useMemo(() => {
        return polygons.filter((polygon) => {
            if (
                riskLevelFilter !== 'all' &&
                polygon.riskLevel !== riskLevelFilter
            ) {
                return false;
            }
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                return (
                    polygon.name.toLowerCase().includes(query) ||
                    polygon.description?.toLowerCase().includes(query)
                );
            }
            return true;
        });
    }, [polygons, riskLevelFilter, searchQuery]);

    const handleMapReady = React.useCallback((map: L.Map) => {
        setMapRef(map);
    }, []);

    const handleMarkerClick = React.useCallback(
        (sensor: SensorMarker) => {
            setSelectedSensor(sensor);
            setSelectedZone(null);
            setActiveTab('sensors');
            if (mapRef) {
                mapRef.flyTo([sensor.position.lat, sensor.position.lng], 15, {
                    duration: 1,
                });
            }
        },
        [mapRef],
    );

    const handleZoneClick = React.useCallback(
        (zone: FloodZonePolygon) => {
            setSelectedZone(zone);
            setSelectedSensor(null);
            setActiveTab('zones');

            if (mapRef && zone.bounds) {
                mapRef.flyTo(
                    [zone.bounds.center.lat, zone.bounds.center.lng],
                    14,
                    {
                        duration: 1,
                    },
                );
            }
        },
        [mapRef],
    );

    const handleSensorCardClick = React.useCallback(
        (sensor: SensorMarker) => {
            handleMarkerClick(sensor);
        },
        [handleMarkerClick],
    );

    const handleZoneCardClick = React.useCallback(
        (zone: FloodZonePolygon) => {
            handleZoneClick(zone);
        },
        [handleZoneClick],
    );

    const handleAddZone = React.useCallback(() => {
        setEditingZone(null);
        setIsZoneModalOpen(true);
    }, []);

    const handleMarkerEdit = React.useCallback((sensor: SensorMarker) => {
        console.log('Edit sensor:', sensor.id, sensor.name);
    }, []);

    const handleMarkerDelete = React.useCallback((sensor: SensorMarker) => {
        console.log('Delete sensor:', sensor.id, sensor.name);
    }, []);

    const handleMarkerViewHistory = React.useCallback(
        (sensor: SensorMarker) => {
            console.log('View history:', sensor.id, sensor.name);
        },
        [],
    );

    const handleZoneEdit = React.useCallback((zone: FloodZonePolygon) => {
        setEditingZone(zone);
        setIsZoneModalOpen(true);
    }, []);

    const handleZoneDelete = React.useCallback((zone: FloodZonePolygon) => {
        setDeletingZone(zone);
        setIsDeleteDialogOpen(true);
    }, []);

    const confirmZoneDelete = React.useCallback(async () => {
        if (!deletingZone) return;

        try {
            const response = await fetch(
                `/api/flood-zones/${deletingZone.id}`,
                {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name="csrf-token"]')
                                ?.getAttribute('content') || '',
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Failed to delete zone');
            }

            setPolygons((prev) => prev.filter((p) => p.id !== deletingZone.id));

            setStats((prev) => ({
                ...prev,
                totalZones: prev.totalZones - 1,
                lowRiskZones:
                    deletingZone.riskLevel === 'low'
                        ? prev.lowRiskZones - 1
                        : prev.lowRiskZones,
                mediumRiskZones:
                    deletingZone.riskLevel === 'medium'
                        ? prev.mediumRiskZones - 1
                        : prev.mediumRiskZones,
                highRiskZones:
                    deletingZone.riskLevel === 'high'
                        ? prev.highRiskZones - 1
                        : prev.highRiskZones,
            }));

            if (selectedZone?.id === deletingZone.id) {
                setSelectedZone(null);
            }

            toast.success('Zona banjir berhasil dihapus');
        } catch (error) {
            console.error('Error deleting zone:', error);
            toast.error('Gagal menghapus zona banjir');
            throw error;
        }
    }, [deletingZone, selectedZone]);

    const handleZoneFormSuccess = React.useCallback(
        (newZone: FloodZonePolygon) => {
            if (editingZone) {
                setPolygons((prev) =>
                    prev.map((p) => (p.id === newZone.id ? newZone : p)),
                );
            } else {
                setPolygons((prev) => [...prev, newZone]);

                setStats((prev) => ({
                    ...prev,
                    totalZones: prev.totalZones + 1,
                    lowRiskZones:
                        newZone.riskLevel === 'low'
                            ? prev.lowRiskZones + 1
                            : prev.lowRiskZones,
                    mediumRiskZones:
                        newZone.riskLevel === 'medium'
                            ? prev.mediumRiskZones + 1
                            : prev.mediumRiskZones,
                    highRiskZones:
                        newZone.riskLevel === 'high'
                            ? prev.highRiskZones + 1
                            : prev.highRiskZones,
                }));
            }
        },
        [editingZone],
    );

    const sensorsContent = React.useMemo(() => {
        if (isLoading) {
            return (
                <div className="space-y-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <SensorCardSkeleton key={i} />
                    ))}
                </div>
            );
        }

        if (filteredMarkers.length === 0) {
            return (
                <EmptyState
                    type="sensors"
                    hasFilters={statusFilter !== 'all' || !!searchQuery}
                />
            );
        }

        return (
            <div className="space-y-2">
                {filteredMarkers.map((sensor) => (
                    <SensorCard
                        key={sensor.id}
                        sensor={sensor}
                        onClick={() => handleSensorCardClick(sensor)}
                        isSelected={selectedSensor?.id === sensor.id}
                    />
                ))}
            </div>
        );
    }, [
        filteredMarkers,
        isLoading,
        statusFilter,
        searchQuery,
        selectedSensor,
        handleSensorCardClick,
    ]);

    const zonesContent = React.useMemo(() => {
        if (isLoading) {
            return (
                <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <ZoneCardSkeleton key={i} />
                    ))}
                </div>
            );
        }

        if (filteredPolygons.length === 0) {
            return (
                <EmptyState
                    type="zones"
                    hasFilters={riskLevelFilter !== 'all' || !!searchQuery}
                />
            );
        }

        return (
            <div className="space-y-2">
                {filteredPolygons.map((zone) => (
                    <ZoneCard
                        key={zone.id}
                        zone={zone}
                        onClick={() => handleZoneCardClick(zone)}
                        isSelected={selectedZone?.id === zone.id}
                    />
                ))}
            </div>
        );
    }, [
        filteredPolygons,
        isLoading,
        riskLevelFilter,
        searchQuery,
        selectedZone,
        handleZoneCardClick,
    ]);

    return (
        <>
            <Head title="Peta Pemantauan Banjir" />

            <MapLayout
                sidebarProps={{
                    activeTab,
                    onTabChange: setActiveTab,
                    statusFilter,
                    onStatusFilterChange: setStatusFilter,
                    riskLevelFilter,
                    onRiskLevelFilterChange: setRiskLevelFilter,
                    searchQuery,
                    onSearchChange: setSearchQuery,
                    stats: {
                        ...stats,
                        filteredSensors: filteredMarkers.length,
                        filteredZones: filteredPolygons.length,
                    },
                    sensorsContent,
                    zonesContent,
                    onAddZone: handleAddZone,
                    isLoading,
                }}
            >
                <FloodMap
                    center={mapCenter}
                    zoom={mapZoom}
                    markers={filteredMarkers}
                    polygons={filteredPolygons}
                    stats={stats}
                    selectedSensorId={selectedSensor?.id}
                    selectedZoneId={selectedZone?.id}
                    onMarkerClick={handleMarkerClick}
                    onMarkerEdit={handleMarkerEdit}
                    onMarkerDelete={handleMarkerDelete}
                    onMarkerViewHistory={handleMarkerViewHistory}
                    onZoneClick={handleZoneClick}
                    onZoneEdit={handleZoneEdit}
                    onZoneDelete={handleZoneDelete}
                    onMapReady={handleMapReady}
                    showLayerSwitcher={true}
                    showLegend={true}
                    showLocateControl={true}
                />
            </MapLayout>

            <ZoneFormModal
                open={isZoneModalOpen}
                onOpenChange={setIsZoneModalOpen}
                zone={editingZone}
                onSuccess={handleZoneFormSuccess}
            />

            <DeleteConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="Hapus Zona Banjir"
                itemName={deletingZone?.name}
                onConfirm={confirmZoneDelete}
            />
        </>
    );
}
