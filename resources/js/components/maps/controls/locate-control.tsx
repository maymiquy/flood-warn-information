'use client';

import { Button } from '@/components/ui/button';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import L from 'leaflet';
import { Loader2, LocateFixed, LocateOff, Navigation } from 'lucide-react';
import * as React from 'react';
import { Circle, Marker, useMap } from 'react-leaflet';
import { toast } from 'sonner';

type LocationStatus = 'idle' | 'loading' | 'active' | 'error';

interface UserLocation {
    lat: number;
    lng: number;
    accuracy: number;
}

export interface LocateControlProps {
    position?: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    flyToZoom?: number;
    className?: string;
}

const createUserMarkerIcon = () => {
    return L.divIcon({
        className: 'user-location-marker',
        html: `
            <div class="relative flex items-center justify-center">
                <div class="absolute size-8 animate-ping rounded-full bg-blue-400 opacity-75"></div>
                <div class="relative size-4 rounded-full border-2 border-white bg-blue-500 shadow-lg"></div>
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
};

interface UserLocationMarkerProps {
    location: UserLocation;
    showAccuracyCircle?: boolean;
}

function UserLocationMarker({
    location,
    showAccuracyCircle = true,
}: UserLocationMarkerProps) {
    const markerIcon = React.useMemo(() => createUserMarkerIcon(), []);

    return (
        <>
            {showAccuracyCircle && location.accuracy < 1000 && (
                <Circle
                    center={[location.lat, location.lng]}
                    radius={location.accuracy}
                    pathOptions={{
                        color: '#3b82f6',
                        fillColor: '#3b82f6',
                        fillOpacity: 0.1,
                        weight: 1,
                    }}
                />
            )}
            <Marker
                position={[location.lat, location.lng]}
                icon={markerIcon}
                zIndexOffset={1000}
            />
        </>
    );
}

interface LocateButtonProps {
    status: LocationStatus;
    onClick: () => void;
    position: 'topleft' | 'topright' | 'bottomleft' | 'bottomright';
    className?: string;
}

function LocateButton({
    status,
    onClick,
    position,
    className,
}: LocateButtonProps) {
    const positionClasses = {
        topleft: 'top-3 left-3',
        topright: 'top-3 right-3',
        bottomleft: 'bottom-6 left-3',
        bottomright: 'bottom-6 right-3',
    };

    const getIcon = () => {
        switch (status) {
            case 'loading':
                return <Loader2 className="size-4 animate-spin" />;
            case 'active':
                return <Navigation className="size-4 text-blue-500" />;
            case 'error':
                return <LocateOff className="size-4 text-destructive" />;
            default:
                return <LocateFixed className="size-4" />;
        }
    };

    const getTooltip = () => {
        switch (status) {
            case 'loading':
                return 'Mencari lokasi...';
            case 'active':
                return 'Lokasi aktif (klik untuk menonaktifkan)';
            case 'error':
                return 'Lokasi tidak tersedia';
            default:
                return 'Lokasi Saya';
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={onClick}
                        disabled={status === 'loading'}
                        className={cn(
                            'absolute z-[1000] bg-background shadow-md transition-all',
                            positionClasses[position],
                            status === 'active' &&
                                'ring-2 ring-blue-500 ring-offset-2',
                            status === 'error' && 'border-destructive',
                            className,
                        )}
                        aria-label={getTooltip()}
                    >
                        {getIcon()}
                    </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                    <p>{getTooltip()}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}

interface LocateControlInnerProps {
    flyToZoom: number;
    onLocationChange: (location: UserLocation | null) => void;
    onStatusChange: (status: LocationStatus) => void;
    status: LocationStatus;
}

function LocateControlInner({
    flyToZoom,
    onLocationChange,
    onStatusChange,
    status,
}: LocateControlInnerProps) {
    const map = useMap();
    const watchIdRef = React.useRef<number | null>(null);

    const clearWatch = React.useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    const handleLocate = React.useCallback(() => {
        if (status === 'active') {
            clearWatch();
            onLocationChange(null);
            onStatusChange('idle');
            return;
        }

        if (!navigator.geolocation) {
            toast.error('Geolocation tidak didukung oleh browser ini');
            onStatusChange('error');
            return;
        }

        onStatusChange('loading');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const userLocation: UserLocation = {
                    lat: latitude,
                    lng: longitude,
                    accuracy,
                };

                onLocationChange(userLocation);
                onStatusChange('active');

                map.flyTo([latitude, longitude], flyToZoom, {
                    duration: 1.5,
                });

                watchIdRef.current = navigator.geolocation.watchPosition(
                    (pos) => {
                        onLocationChange({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                            accuracy: pos.coords.accuracy,
                        });
                    },
                    (error) => {
                        console.error('Watch position error:', error);
                    },
                    {
                        enableHighAccuracy: true,
                        maximumAge: 10000,
                        timeout: 10000,
                    },
                );

                toast.success('Lokasi ditemukan');
            },
            (error) => {
                console.error('Geolocation error:', error);
                onStatusChange('error');

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error(
                            'Akses lokasi ditolak. Harap izinkan akses lokasi di pengaturan browser.',
                        );
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error(
                            'Lokasi tidak tersedia. Pastikan GPS aktif.',
                        );
                        break;
                    case error.TIMEOUT:
                        toast.error('Waktu pencarian lokasi habis. Coba lagi.');
                        break;
                    default:
                        toast.error('Gagal mendapatkan lokasi');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    }, [map, flyToZoom, status, onLocationChange, onStatusChange, clearWatch]);

    React.useEffect(() => {
        return () => {
            clearWatch();
        };
    }, [clearWatch]);

    React.useEffect(() => {
        (map as unknown as Record<string, () => void>)._locateUser =
            handleLocate;
        return () => {
            delete (map as unknown as Record<string, () => void>)._locateUser;
        };
    }, [map, handleLocate]);

    return null;
}

function LocateControl({
    position = 'bottomleft',
    flyToZoom = 16,
    className,
}: LocateControlProps) {
    const [status, setStatus] = React.useState<LocationStatus>('idle');
    const [userLocation, setUserLocation] = React.useState<UserLocation | null>(
        null,
    );

    return (
        <>
            <LocateControlInner
                flyToZoom={flyToZoom}
                onLocationChange={setUserLocation}
                onStatusChange={setStatus}
                status={status}
            />

            {userLocation && status === 'active' && (
                <UserLocationMarker
                    location={userLocation}
                    showAccuracyCircle={true}
                />
            )}
        </>
    );
}

export interface LocateControlWrapperProps extends LocateControlProps {
    onLocate?: () => void;
}

function LocateControlWrapper({
    position = 'bottomleft',
    flyToZoom = 16,
    className,
}: LocateControlWrapperProps) {
    const [status, setStatus] = React.useState<LocationStatus>('idle');
    const [userLocation, setUserLocation] = React.useState<UserLocation | null>(
        null,
    );
    const mapRef = React.useRef<L.Map | null>(null);
    const watchIdRef = React.useRef<number | null>(null);

    const clearWatch = React.useCallback(() => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
    }, []);

    const handleLocate = React.useCallback(() => {
        if (status === 'active') {
            clearWatch();
            setUserLocation(null);
            setStatus('idle');
            return;
        }

        if (!navigator.geolocation) {
            toast.error('Geolocation tidak didukung oleh browser ini');
            setStatus('error');
            return;
        }

        setStatus('loading');

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude, accuracy } = position.coords;
                const location: UserLocation = {
                    lat: latitude,
                    lng: longitude,
                    accuracy,
                };

                setUserLocation(location);
                setStatus('active');

                if (mapRef.current) {
                    mapRef.current.flyTo([latitude, longitude], flyToZoom, {
                        duration: 1.5,
                    });
                }

                watchIdRef.current = navigator.geolocation.watchPosition(
                    (pos) => {
                        setUserLocation({
                            lat: pos.coords.latitude,
                            lng: pos.coords.longitude,
                            accuracy: pos.coords.accuracy,
                        });
                    },
                    () => {},
                    {
                        enableHighAccuracy: true,
                        maximumAge: 10000,
                        timeout: 10000,
                    },
                );

                toast.success('Lokasi ditemukan');
            },
            (error) => {
                setStatus('error');
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        toast.error('Akses lokasi ditolak');
                        break;
                    case error.POSITION_UNAVAILABLE:
                        toast.error('Lokasi tidak tersedia');
                        break;
                    case error.TIMEOUT:
                        toast.error('Waktu habis');
                        break;
                    default:
                        toast.error('Gagal mendapatkan lokasi');
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    }, [status, flyToZoom, clearWatch]);

    React.useEffect(() => {
        return () => clearWatch();
    }, [clearWatch]);

    const MapRefGetter = () => {
        const map = useMap();
        React.useEffect(() => {
            mapRef.current = map;
        }, [map]);
        return null;
    };

    return (
        <>
            <MapRefGetter />

            {userLocation && status === 'active' && (
                <UserLocationMarker location={userLocation} />
            )}

            <LocateButton
                status={status}
                onClick={handleLocate}
                position={position}
                className={className}
            />
        </>
    );
}

export { LocateControl, LocateControlWrapper, UserLocationMarker };
