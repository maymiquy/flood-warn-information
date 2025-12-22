import { Button } from '@/components/ui/button';
import { RISK_LEVEL_COLORS } from '@/config/map.config';
import { cn } from '@/lib/utils';
import type { FloodZonePolygon } from '@/types/map';
import { AlertTriangle, Pencil, Trash2 } from 'lucide-react';
import { useMemo } from 'react';

export interface ZonePopupProps {
    zone: FloodZonePolygon;
    showActions?: boolean;
    onEdit?: () => void;
    onDelete?: () => void;
}

export function ZonePopup({
    zone,
    showActions = false,
    onEdit,
    onDelete,
}: ZonePopupProps) {
    const riskColors = useMemo(() => {
        return RISK_LEVEL_COLORS[zone.riskLevel];
    }, [zone.riskLevel]);

    return (
        <div className="w-full max-w-[240px] min-w-[220px] rounded-lg bg-background/90 p-3 backdrop-blur-lg">
            <div className="mb-2">
                <RiskBadge riskLevel={zone.riskLevel} label={zone.riskLabel} />
            </div>

            <div className="mb-2 border-b border-accent-foreground pb-2">
                <h3 className="text-sm leading-tight font-semibold break-words text-foreground">
                    {zone.name}
                </h3>
            </div>

            <div className="space-y-[0px]">
                <div className="flex items-center gap-2">
                    <div
                        className={cn(
                            'flex h-6 w-6 shrink-0 items-center justify-center rounded',
                            riskColors.bg,
                        )}
                    >
                        <AlertTriangle
                            className={cn('h-3.5 w-3.5', riskColors.text)}
                        />
                    </div>
                    <div className="flex min-w-0 flex-1 items-baseline gap-1.5">
                        <p
                            className={cn(
                                'text-sm leading-none font-semibold',
                                riskColors.text,
                            )}
                        >
                            {zone.riskLabel}
                        </p>
                        <span className="text-[10px] leading-none text-gray-400">
                            (Risiko)
                        </span>
                    </div>
                </div>

                {zone.description && (
                    <div className="flex items-start gap-2 px-1">
                        <span className="min-w-0 flex-1 text-xs leading-tight break-words text-foreground/90">
                            {zone.description}
                        </span>
                    </div>
                )}
            </div>

            {showActions && (onEdit || onDelete) && (
                <div className="mt-2 flex items-center justify-end gap-1.5 border-t pt-2">
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

interface RiskBadgeProps {
    riskLevel: FloodZonePolygon['riskLevel'];
    label: string;
}

function RiskBadge({ riskLevel, label }: RiskBadgeProps) {
    const colors = RISK_LEVEL_COLORS[riskLevel];

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
                    riskLevel === 'low' && 'bg-green-500',
                    riskLevel === 'medium' && 'bg-yellow-500',
                    riskLevel === 'high' && 'bg-red-500',
                )}
            />
            {label}
        </span>
    );
}

export interface CompactZonePopupProps {
    zone: FloodZonePolygon;
    onClick?: () => void;
}

export function CompactZonePopup({ zone, onClick }: CompactZonePopupProps) {
    const riskColors = RISK_LEVEL_COLORS[zone.riskLevel];

    return (
        <div
            className="cursor-pointer rounded-lg p-2 transition-colors hover:bg-gray-50"
            onClick={onClick}
        >
            <div className="flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                    <h4 className="truncate text-sm font-medium text-gray-900">
                        {zone.name}
                    </h4>
                    <p className="text-xs text-gray-500">
                        Risiko {zone.riskLabel}
                    </p>
                </div>
                <div
                    className={cn(
                        'flex h-6 w-6 items-center justify-center rounded-full',
                        riskColors.bg,
                    )}
                >
                    <AlertTriangle
                        className={cn('h-3.5 w-3.5', riskColors.text)}
                    />
                </div>
            </div>
        </div>
    );
}
