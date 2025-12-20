import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import type { RiskLevel, SensorStatus } from '@/config/map.config';
import { RISK_LEVEL_COLORS, SENSOR_STATUS_COLORS } from '@/config/map.config';
import { cn } from '@/lib/utils';
import type { RiskLevelFilter, StatusFilter } from '@/types/map';
import {
    CircleAlert,
    CircleCheck,
    Layers,
    Shield,
    ShieldAlert,
    ShieldCheck,
    TriangleAlert,
} from 'lucide-react';
import * as React from 'react';

interface StatusFilterSelectProps {
    value: StatusFilter;
    onChange: (value: StatusFilter) => void;
    className?: string;
    placeholder?: string;
    showCount?: boolean;
    counts?: {
        all?: number;
        safe?: number;
        warning?: number;
        danger?: number;
    };
}

const statusOptions: {
    value: StatusFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}[] = [
    { value: 'all', label: 'Semua Status', icon: Layers },
    {
        value: 'safe',
        label: SENSOR_STATUS_COLORS.safe.label,
        icon: CircleCheck,
    },
    {
        value: 'warning',
        label: SENSOR_STATUS_COLORS.warning.label,
        icon: CircleAlert,
    },
    {
        value: 'danger',
        label: SENSOR_STATUS_COLORS.danger.label,
        icon: TriangleAlert,
    },
];

function StatusFilterSelect({
    value,
    onChange,
    className,
    placeholder = 'Filter Status',
    showCount = false,
    counts = {},
}: StatusFilterSelectProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={cn('w-full', className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {statusOptions.map((option) => {
                    const Icon = option.icon;
                    const count =
                        option.value === 'all'
                            ? counts.all
                            : counts[option.value as SensorStatus];

                    return (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                                <Icon
                                    className={cn(
                                        'size-4',
                                        option.value === 'safe' &&
                                            'text-green-500',
                                        option.value === 'warning' &&
                                            'text-yellow-500',
                                        option.value === 'danger' &&
                                            'text-red-500',
                                        option.value === 'all' &&
                                            'text-muted-foreground',
                                    )}
                                />
                                <span>{option.label}</span>
                                {showCount && count !== undefined && (
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        ({count})
                                    </span>
                                )}
                            </div>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}

interface RiskLevelFilterSelectProps {
    value: RiskLevelFilter;
    onChange: (value: RiskLevelFilter) => void;
    className?: string;
    placeholder?: string;
    showCount?: boolean;
    counts?: {
        all?: number;
        low?: number;
        medium?: number;
        high?: number;
    };
}

const riskOptions: {
    value: RiskLevelFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
}[] = [
    { value: 'all', label: 'Semua Level', icon: Layers },
    { value: 'low', label: RISK_LEVEL_COLORS.low.label, icon: ShieldCheck },
    { value: 'medium', label: RISK_LEVEL_COLORS.medium.label, icon: Shield },
    { value: 'high', label: RISK_LEVEL_COLORS.high.label, icon: ShieldAlert },
];

function RiskLevelFilterSelect({
    value,
    onChange,
    className,
    placeholder = 'Filter Risk Level',
    showCount = false,
    counts = {},
}: RiskLevelFilterSelectProps) {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={cn('w-full', className)}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {riskOptions.map((option) => {
                    const Icon = option.icon;
                    const count =
                        option.value === 'all'
                            ? counts.all
                            : counts[option.value as RiskLevel];

                    return (
                        <SelectItem key={option.value} value={option.value}>
                            <div className="flex items-center gap-2">
                                <Icon
                                    className={cn(
                                        'size-4',
                                        option.value === 'low' &&
                                            'text-green-500',
                                        option.value === 'medium' &&
                                            'text-yellow-500',
                                        option.value === 'high' &&
                                            'text-red-500',
                                        option.value === 'all' &&
                                            'text-muted-foreground',
                                    )}
                                />
                                <span>{option.label}</span>
                                {showCount && count !== undefined && (
                                    <span className="ml-auto text-xs text-muted-foreground">
                                        ({count})
                                    </span>
                                )}
                            </div>
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}

export { RiskLevelFilterSelect, StatusFilterSelect };
