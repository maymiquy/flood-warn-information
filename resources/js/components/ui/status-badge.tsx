import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import type { SensorStatus, RiskLevel } from '@/config/map.config';
import { SENSOR_STATUS_COLORS, RISK_LEVEL_COLORS } from '@/config/map.config';
import {
    CircleCheck,
    CircleAlert,
    TriangleAlert,
    ShieldCheck,
    ShieldAlert,
    Shield
} from 'lucide-react';

const statusBadgeVariants = cva(
    'inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            status: {
                safe: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                warning: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                danger: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            },
            size: {
                sm: 'text-[10px] px-2 py-0.5',
                md: 'text-xs px-2.5 py-0.5',
                lg: 'text-sm px-3 py-1',
            },
        },
        defaultVariants: {
            status: 'safe',
            size: 'md',
        },
    }
);

const riskBadgeVariants = cva(
    'inline-flex items-center justify-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors',
    {
        variants: {
            risk: {
                low: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
                medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
                high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
            },
            size: {
                sm: 'text-[10px] px-2 py-0.5',
                md: 'text-xs px-2.5 py-0.5',
                lg: 'text-sm px-3 py-1',
            },
        },
        defaultVariants: {
            risk: 'low',
            size: 'md',
        },
    }
);

interface StatusBadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof statusBadgeVariants> {
    status: SensorStatus;
    showIcon?: boolean;
    showLabel?: boolean;
}

const statusIcons: Record<SensorStatus, React.ComponentType<{ className?: string }>> = {
    safe: CircleCheck,
    warning: CircleAlert,
    danger: TriangleAlert,
};

function StatusBadge({
    className,
    status,
    size,
    showIcon = true,
    showLabel = true,
    ...props
}: StatusBadgeProps) {
    const Icon = statusIcons[status];
    const config = SENSOR_STATUS_COLORS[status];

    return (
        <span
            className={cn(statusBadgeVariants({ status, size }), className)}
            {...props}
        >
            {showIcon && <Icon className="size-3" />}
            {showLabel && <span>{config.label}</span>}
        </span>
    );
}

interface RiskBadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
        VariantProps<typeof riskBadgeVariants> {
    risk: RiskLevel;
    showIcon?: boolean;
    showLabel?: boolean;
}

const riskIcons: Record<RiskLevel, React.ComponentType<{ className?: string }>> = {
    low: ShieldCheck,
    medium: Shield,
    high: ShieldAlert,
};

function RiskBadge({
    className,
    risk,
    size,
    showIcon = true,
    showLabel = true,
    ...props
}: RiskBadgeProps) {
    const Icon = riskIcons[risk];
    const config = RISK_LEVEL_COLORS[risk];

    return (
        <span
            className={cn(riskBadgeVariants({ risk, size }), className)}
            {...props}
        >
            {showIcon && <Icon className="size-3" />}
            {showLabel && <span>{config.label}</span>}
        </span>
    );
}

interface StatusDotProps extends React.HTMLAttributes<HTMLSpanElement> {
    status: SensorStatus;
    pulse?: boolean;
}

function StatusDot({ status, pulse = false, className, ...props }: StatusDotProps) {
    const colors: Record<SensorStatus, string> = {
        safe: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
    };

    return (
        <span
            className={cn(
                'relative inline-flex size-2.5 rounded-full',
                colors[status],
                className
            )}
            {...props}
        >
            {pulse && status === 'danger' && (
                <span
                    className={cn(
                        'absolute inline-flex h-full w-full animate-ping rounded-full opacity-75',
                        colors[status]
                    )}
                />
            )}
        </span>
    );
}

interface RiskDotProps extends React.HTMLAttributes<HTMLSpanElement> {
    risk: RiskLevel;
}

function RiskDot({ risk, className, ...props }: RiskDotProps) {
    const colors: Record<RiskLevel, string> = {
        low: 'bg-green-500',
        medium: 'bg-yellow-500',
        high: 'bg-red-500',
    };

    return (
        <span
            className={cn(
                'inline-flex size-2.5 rounded-full',
                colors[risk],
                className
            )}
            {...props}
        />
    );
}

export {
    StatusBadge,
    RiskBadge,
    StatusDot,
    RiskDot,
    statusBadgeVariants,
    riskBadgeVariants
};
