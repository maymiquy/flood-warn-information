import {
    RISK_LEVEL_COLORS,
    SENSOR_STATUS_COLORS,
    type RiskLevel,
    type SensorStatus,
} from '@/config/map.config';
import { cn } from '@/lib/utils';
import { ChevronDown, ChevronUp, Info } from 'lucide-react';
import * as React from 'react';

interface LegendItemProps {
    color: string;
    label: string;
    count?: number;
    showCount?: boolean;
}

function LegendItem({
    color,
    label,
    count,
    showCount = false,
}: LegendItemProps) {
    return (
        <div className="flex items-center gap-2">
            <div
                className="size-3 shrink-0 rounded-full ring-1 ring-black/10"
                style={{ backgroundColor: color }}
            />
            <span className="text-xs text-foreground/90">{label}</span>
            {showCount && count !== undefined && (
                <span className="ml-auto text-[10px] text-muted-foreground">
                    ({count})
                </span>
            )}
        </div>
    );
}

interface SensorLegendProps {
    counts?: {
        safe: number;
        warning: number;
        danger: number;
    };
    showCounts?: boolean;
}

function SensorLegend({ counts, showCounts = false }: SensorLegendProps) {
    const items: { status: SensorStatus; label: string }[] = [
        { status: 'safe', label: 'Aman' },
        { status: 'warning', label: 'Siaga' },
        { status: 'danger', label: 'Bahaya' },
    ];

    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Status Sensor
            </p>
            {items.map(({ status, label }) => (
                <LegendItem
                    key={status}
                    color={SENSOR_STATUS_COLORS[status].hex}
                    label={label}
                    count={counts?.[status]}
                    showCount={showCounts}
                />
            ))}
        </div>
    );
}

interface RiskLegendProps {
    counts?: {
        low: number;
        medium: number;
        high: number;
    };
    showCounts?: boolean;
}

function RiskLegend({ counts, showCounts = false }: RiskLegendProps) {
    const items: { risk: RiskLevel; label: string }[] = [
        { risk: 'low', label: 'Risiko Rendah' },
        { risk: 'medium', label: 'Risiko Sedang' },
        { risk: 'high', label: 'Risiko Tinggi' },
    ];

    return (
        <div className="space-y-1.5">
            <p className="text-[10px] font-medium tracking-wide text-muted-foreground uppercase">
                Tingkat Risiko Zona
            </p>
            {items.map(({ risk, label }) => (
                <LegendItem
                    key={risk}
                    color={RISK_LEVEL_COLORS[risk].hex}
                    label={label}
                    count={counts?.[risk]}
                    showCount={showCounts}
                />
            ))}
        </div>
    );
}

interface MapLegendProps {
    position?: 'topright' | 'topleft' | 'bottomright' | 'bottomleft';
    showSensorLegend?: boolean;
    showRiskLegend?: boolean;
    sensorCounts?: {
        safe: number;
        warning: number;
        danger: number;
    };
    zoneCounts?: {
        low: number;
        medium: number;
        high: number;
    };
    showCounts?: boolean;
    collapsible?: boolean;
    defaultCollapsed?: boolean;
    className?: string;
}

function MapLegend({
    position = 'bottomright',
    showSensorLegend = true,
    showRiskLegend = true,
    sensorCounts,
    zoneCounts,
    showCounts = false,
    collapsible = true,
    defaultCollapsed = false,
    className,
}: MapLegendProps) {
    const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

    const positionClasses = {
        topright: 'top-3 right-3',
        topleft: 'top-3 left-3',
        bottomright: 'bottom-6 right-3',
        bottomleft: 'bottom-6 left-3',
    };

    if (!showSensorLegend && !showRiskLegend) {
        return null;
    }

    return (
        <div
            className={cn(
                'absolute z-[999]',
                positionClasses[position],
                className,
            )}
        >
            <div
                className={cn(
                    'bg-background/90 backdrop-blur-sm',
                    'rounded-lg border shadow-md',
                    'transition-all duration-200',
                    isCollapsed ? 'w-auto' : 'min-w-[140px]',
                )}
            >
                {collapsible && (
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className={cn(
                            'flex w-full items-center gap-1.5 px-2.5 py-1.5',
                            'text-xs font-medium text-foreground/80',
                            'transition-colors hover:bg-accent/50',
                            !isCollapsed && 'border-b',
                        )}
                    >
                        <Info className="size-3.5" />
                        <span>Legend</span>
                        {isCollapsed ? (
                            <ChevronUp className="ml-auto size-3" />
                        ) : (
                            <ChevronDown className="ml-auto size-3" />
                        )}
                    </button>
                )}

                {!isCollapsed && (
                    <div className="space-y-3 p-2.5">
                        {showSensorLegend && (
                            <SensorLegend
                                counts={sensorCounts}
                                showCounts={showCounts}
                            />
                        )}

                        {showSensorLegend && showRiskLegend && (
                            <div className="my-2 border-t" />
                        )}

                        {showRiskLegend && (
                            <RiskLegend
                                counts={zoneCounts}
                                showCounts={showCounts}
                            />
                        )}
                    </div>
                )}

                {isCollapsed && !collapsible && (
                    <div className="flex items-center gap-1 p-2">
                        {showSensorLegend && (
                            <>
                                <div
                                    className="size-2.5 rounded-full"
                                    style={{
                                        backgroundColor:
                                            SENSOR_STATUS_COLORS.safe.hex,
                                    }}
                                    title="Aman"
                                />
                                <div
                                    className="size-2.5 rounded-full"
                                    style={{
                                        backgroundColor:
                                            SENSOR_STATUS_COLORS.warning.hex,
                                    }}
                                    title="Siaga"
                                />
                                <div
                                    className="size-2.5 rounded-full"
                                    style={{
                                        backgroundColor:
                                            SENSOR_STATUS_COLORS.danger.hex,
                                    }}
                                    title="Bahaya"
                                />
                            </>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

interface CompactLegendProps {
    position?: 'topright' | 'topleft' | 'bottomright' | 'bottomleft';
    className?: string;
}

function CompactLegend({
    position = 'bottomright',
    className,
}: CompactLegendProps) {
    const positionClasses = {
        topright: 'top-3 right-3',
        topleft: 'top-3 left-3',
        bottomright: 'bottom-6 right-3',
        bottomleft: 'bottom-6 left-3',
    };

    return (
        <div
            className={cn(
                'absolute z-[999]',
                positionClasses[position],
                className,
            )}
        >
            <div className="flex items-center gap-2 rounded-full border bg-background/90 px-3 py-1.5 shadow-md backdrop-blur-sm">
                <div className="flex items-center gap-1">
                    <div
                        className="size-2.5 rounded-full"
                        style={{
                            backgroundColor: SENSOR_STATUS_COLORS.safe.hex,
                        }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                        Aman
                    </span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1">
                    <div
                        className="size-2.5 rounded-full"
                        style={{
                            backgroundColor: SENSOR_STATUS_COLORS.warning.hex,
                        }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                        Siaga
                    </span>
                </div>
                <div className="h-3 w-px bg-border" />
                <div className="flex items-center gap-1">
                    <div
                        className="size-2.5 rounded-full"
                        style={{
                            backgroundColor: SENSOR_STATUS_COLORS.danger.hex,
                        }}
                    />
                    <span className="text-[10px] text-muted-foreground">
                        Bahaya
                    </span>
                </div>
            </div>
        </div>
    );
}

export { CompactLegend, MapLegend, RiskLegend, SensorLegend };
export type {
    CompactLegendProps,
    MapLegendProps,
    RiskLegendProps,
    SensorLegendProps,
};
