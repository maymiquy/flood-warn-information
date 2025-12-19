import { RiskBadge, RiskDot } from '@/components/ui/status-badge';
import { cn } from '@/lib/utils';
import type { FloodZonePolygon } from '@/types/map';
import { FileText } from 'lucide-react';
import * as React from 'react';

interface ZoneCardProps extends React.HTMLAttributes<HTMLDivElement> {
    zone: FloodZonePolygon;
    isSelected?: boolean;
    isHovered?: boolean;
    showDescription?: boolean;
    compact?: boolean;
}

function ZoneCard({
    zone,
    isSelected = false,
    isHovered = false,
    showDescription = true,
    compact = false,
    className,
    onClick,
    ...props
}: ZoneCardProps) {
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
                    <RiskDot risk={zone.riskLevel} />
                    <div className="min-w-0 flex-1">
                        <h4 className="truncate text-sm font-medium">
                            {zone.name}
                        </h4>
                        {!compact && (
                            <p className="text-[10px] text-muted-foreground">
                                {zone.coordinates.length} titik koordinat
                            </p>
                        )}
                    </div>
                </div>
                <RiskBadge risk={zone.riskLevel} size="sm" showIcon={false} />
            </div>

            {!compact && showDescription && zone.description && (
                <div className="mt-2">
                    <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                        <FileText className="mt-0.5 size-3 shrink-0" />
                        <span className="line-clamp-2">{zone.description}</span>
                    </div>
                </div>
            )}

            <div className="mt-2 flex items-center gap-2">
                <div
                    className="size-4 rounded border"
                    style={{
                        backgroundColor: zone.color,
                        opacity: zone.opacity,
                    }}
                />
                <span className="text-[10px] text-muted-foreground uppercase">
                    {zone.color}
                </span>
            </div>

            <div
                className={cn(
                    'absolute inset-y-0 left-0 w-1 rounded-l-lg transition-all duration-200',
                    'opacity-0 group-hover:opacity-100',
                    zone.riskLevel === 'low' && 'bg-green-500',
                    zone.riskLevel === 'medium' && 'bg-yellow-500',
                    zone.riskLevel === 'high' && 'bg-red-500',
                    isSelected && 'opacity-100',
                )}
            />
        </div>
    );
}

function ZoneCardSkeleton({ compact = false }: { compact?: boolean }) {
    return (
        <div className={cn('rounded-lg border bg-card p-3', compact && 'p-2')}>
            <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                    <div className="size-2.5 animate-pulse rounded-full bg-muted" />
                    <div className="space-y-1">
                        <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                        {!compact && (
                            <div className="h-3 w-20 animate-pulse rounded bg-muted" />
                        )}
                    </div>
                </div>
                <div className="h-5 w-14 animate-pulse rounded-full bg-muted" />
            </div>
            {!compact && (
                <div className="mt-2 space-y-1.5">
                    <div className="h-3 w-full animate-pulse rounded bg-muted" />
                    <div className="flex items-center gap-2">
                        <div className="size-4 animate-pulse rounded bg-muted" />
                        <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                    </div>
                </div>
            )}
        </div>
    );
}

export { ZoneCard, ZoneCardSkeleton };
