import { StatusBadge, StatusDot } from '@/components/ui/status-badge';
import { formatWaterLevel } from '@/config/map.config';
import { cn } from '@/lib/utils';
import type { SensorMarker } from '@/types/map';
import { Clock, Droplets, MapPin } from 'lucide-react';
import * as React from 'react';

interface SensorCardProps extends React.HTMLAttributes<HTMLDivElement> {
    sensor: SensorMarker;
    isSelected?: boolean;
    isHovered?: boolean;
    showWaterLevel?: boolean;
    showAddress?: boolean;
    showLastUpdate?: boolean;
    compact?: boolean;
}

function SensorCard({
    sensor,
    isSelected = false,
    isHovered = false,
    showWaterLevel = true,
    showAddress = true,
    showLastUpdate = false,
    compact = false,
    className,
    onClick,
    ...props
}: SensorCardProps) {
    return (
        <div
            className={cn(
                'group relative rounded-lg border bg-card p-3 transition-all duration-200',
                'cursor-pointer hover:border-primary/50 hover:shadow-sm',
                isSelected && 'border-primary ring-2 ring-primary/20',
                isHovered && 'border-primary/50 bg-accent/50',
                compact && 'p-2',
                className,
            )}
            onClick={onClick}
            {...props}
        >
            <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <StatusDot
                        status={sensor.status}
                        pulse={sensor.status === 'danger'}
                    />
                    <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium">
                            {sensor.name}
                        </h4>
                        {!compact && (
                            <p className="font-mono text-[10px] text-muted-foreground">
                                {sensor.code}
                            </p>
                        )}
                    </div>
                </div>
                <StatusBadge
                    status={sensor.status}
                    size="sm"
                    showIcon={false}
                />
            </div>

            {!compact && (
                <div className="mt-2 space-y-1.5">
                    {showWaterLevel && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Droplets className="size-3 shrink-0 text-blue-500" />
                            <span className="font-medium text-foreground">
                                {formatWaterLevel(sensor.waterLevel)}
                            </span>
                        </div>
                    )}

                    {showAddress && sensor.address && (
                        <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                            <MapPin className="mt-0.5 size-3 shrink-0" />
                            <span className="line-clamp-2">
                                {sensor.address}
                            </span>
                        </div>
                    )}

                    {showLastUpdate && sensor.lastReadingAtFormatted && (
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="size-3 shrink-0" />
                            <span>{sensor.lastReadingAtFormatted}</span>
                        </div>
                    )}
                </div>
            )}

            <div
                className={cn(
                    'absolute inset-y-0 left-0 w-1 rounded-l-lg transition-all duration-200',
                    'opacity-0 group-hover:opacity-100',
                    sensor.status === 'safe' && 'bg-green-500',
                    sensor.status === 'warning' && 'bg-yellow-500',
                    sensor.status === 'danger' && 'bg-red-500',
                    isSelected && 'opacity-100',
                )}
            />
        </div>
    );
}

function SensorCardSkeleton({ compact = false }: { compact?: boolean }) {
    return (
        <div className={cn('rounded-lg border bg-card p-3', compact && 'p-2')}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="size-2.5 animate-pulse rounded-full bg-muted" />
                    <div className="space-y-1">
                        <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                        {!compact && (
                            <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                        )}
                    </div>
                </div>
                <div className="h-5 w-12 animate-pulse rounded-full bg-muted" />
            </div>
            {!compact && (
                <div className="mt-2 space-y-1.5">
                    <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-32 animate-pulse rounded bg-muted" />
                </div>
            )}
        </div>
    );
}

export { SensorCard, SensorCardSkeleton };
