import { Button } from '@/components/ui/button';
import { SENSOR_STATUS_COLORS } from '@/config/map.config';
import { cn } from '@/lib/utils';
import type { SensorMarker } from '@/types/map';
import {
    Axis3d,
    Clock,
    Droplets,
    History,
    MapPin,
    Pencil,
    Trash2,
} from 'lucide-react';
import { useMemo } from 'react';

export interface SensorPopupProps {
    sensor: SensorMarker;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
    onViewHistory?: () => void;
}

export function SensorPopup({
    sensor,
    showActions = false,
    onEdit,
    onDelete,
    onViewHistory,
}: SensorPopupProps) {
    const statusColors = useMemo(() => {
        return SENSOR_STATUS_COLORS[sensor.status];
    }, [sensor.status]);

    return (
        <div className="w-full max-w-[240px] min-w-[220px] rounded-lg bg-background/90 p-3 backdrop-blur-lg">
            <div className="mb-2">
                <StatusBadge
                    status={sensor.status}
                    label={sensor.statusLabel}
                />
            </div>

            <div className="mb-2 border-b border-accent-foreground pb-2">
                <h3 className="text-sm leading-tight font-semibold break-words text-foreground">
                    {sensor.name}
                </h3>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {sensor.code}
                </p>
            </div>

            <div className="space-y-[0px]">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded',
                            statusColors.bg,
                        )}
                    >
                        <Droplets
                            className={cn('h-3.5 w-3.5', statusColors.text)}
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
                        <p
                            className={cn(
                                'text-sm leading-none font-semibold',
                                statusColors.text,
                            )}
                        >
                            {sensor.waterLevel.toFixed(1)} cm
                        </p>
                        <span className="text-[10px] leading-none text-gray-400">
                            (Ketinggian Air)
                        </span>
                    </div>
                </div>

                {sensor.address && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10">
                            <MapPin className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] leading-tight break-words text-foreground/90">
                                {sensor.address}
                            </p>
                        </div>
                    </div>
                )}

                {sensor.position.lat && sensor.position.lng && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10">
                            <Axis3d className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[11px] leading-tight break-words text-foreground/90">
                                [{sensor.position.lat.toFixed(5)},{' '}
                                {sensor.position.lng.toFixed(5)}]
                            </p>
                        </div>
                    </div>
                )}

                {sensor.lastReadingAtFormatted && (
                    <div className="flex items-center gap-2">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded bg-primary/10">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-[10px] leading-tight break-words text-muted-foreground">
                                {sensor.lastReadingAtFormatted ||
                                    sensor.lastReadingAt ||
                                    'Belum ada'}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {showActions && (onViewHistory || onEdit || onDelete) && (
                <div className="mt-3 flex items-center gap-1.5 border-t pt-2">
                    {onViewHistory && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 flex-1 text-[11px]"
                            onClick={(e) => {
                                e.stopPropagation();
                                onViewHistory();
                            }}
                        >
                            <History className="mr-1 h-3 w-3" />
                            Riwayat
                        </Button>
                    )}
                    {onEdit && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit();
                            }}
                        >
                            <Pencil className="h-3 w-3" />
                        </Button>
                    )}
                    {onDelete && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-7 w-7 p-0 text-destructive hover:bg-destructive/10"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete();
                            }}
                        >
                            <Trash2 className="h-3 w-3" />
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}

interface StatusBadgeProps {
    status: SensorMarker['status'];
    label: string;
}

function StatusBadge({ status, label }: StatusBadgeProps) {
    const colors = SENSOR_STATUS_COLORS[status];

    return (
        <span
            className={cn(
                'inline-flex w-full items-center justify-center rounded px-2 py-1 text-xs font-medium',
                colors.bg,
                colors.text,
            )}
        >
            <span
                className={cn(
                    'mr-1.5 h-1.5 w-1.5 rounded-full',
                    status === 'safe' && 'bg-green-500',
                    status === 'warning' && 'bg-yellow-500',
                    status === 'danger' && 'bg-red-500',
                )}
            />
            {label}
        </span>
    );
}

export interface CompactSensorPopupProps {
    sensor: SensorMarker;
    onClick?: () => void;
}

export function CompactSensorPopup({
    sensor,
    onClick,
}: CompactSensorPopupProps) {
    const statusColors = SENSOR_STATUS_COLORS[sensor.status];

    return (
        <div
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-50"
            onClick={onClick}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-medium text-gray-900">
                        {sensor.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                        {sensor.waterLevel.toFixed(1)} cm
                    </p>
                </div>
                <div
                    className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full',
                        statusColors.bg,
                    )}
                >
                    <Droplets
                        className={cn('h-3.5 w-3.5', statusColors.text)}
                    />
                </div>
            </div>
        </div>
    );
}
