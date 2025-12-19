import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { LucideIcon } from 'lucide-react';
import * as React from 'react';

const statCardVariants = cva(
    'rounded-lg border p-4 transition-all duration-200',
    {
        variants: {
            variant: {
                default: 'bg-card',
                safe: 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
                warning:
                    'bg-yellow-50 border-yellow-200 dark:bg-yellow-950/30 dark:border-yellow-800',
                danger: 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800',
                info: 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-800',
            },
            size: {
                sm: 'p-3',
                md: 'p-4',
                lg: 'p-5',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    },
);

const iconVariants = cva('rounded-lg p-2', {
    variants: {
        variant: {
            default: 'bg-muted text-muted-foreground',
            safe: 'bg-green-100 text-green-600 dark:bg-green-900/50 dark:text-green-400',
            warning:
                'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/50 dark:text-yellow-400',
            danger: 'bg-red-100 text-red-600 dark:bg-red-900/50 dark:text-red-400',
            info: 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400',
        },
    },
    defaultVariants: {
        variant: 'default',
    },
});

interface StatCardProps
    extends React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof statCardVariants> {
    title: string;
    value: string | number;
    icon?: LucideIcon;
    description?: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

function StatCard({
    title,
    value,
    icon: Icon,
    description,
    trend,
    variant,
    size,
    className,
    ...props
}: StatCardProps) {
    return (
        <div
            className={cn(statCardVariants({ variant, size }), className)}
            {...props}
        >
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                        {title}
                    </p>
                    <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold tracking-tight">
                            {value}
                        </p>
                        {trend && (
                            <span
                                className={cn(
                                    'text-xs font-medium',
                                    trend.isPositive
                                        ? 'text-green-600'
                                        : 'text-red-600',
                                )}
                            >
                                {trend.isPositive ? '+' : ''}
                                {trend.value}%
                            </span>
                        )}
                    </div>
                    {description && (
                        <p className="text-xs text-muted-foreground">
                            {description}
                        </p>
                    )}
                </div>
                {Icon && (
                    <div className={cn(iconVariants({ variant }))}>
                        <Icon className="size-5" />
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCardSkeleton() {
    return (
        <div className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between">
                <div className="space-y-2">
                    <div className="h-3 w-16 animate-pulse rounded bg-muted" />
                    <div className="h-7 w-12 animate-pulse rounded bg-muted" />
                    <div className="h-3 w-24 animate-pulse rounded bg-muted" />
                </div>
                <div className="size-9 animate-pulse rounded-lg bg-muted" />
            </div>
        </div>
    );
}

interface MiniStatCardProps extends React.HTMLAttributes<HTMLDivElement> {
    label: string;
    value: string | number;
    color?: 'default' | 'safe' | 'warning' | 'danger';
}

function MiniStatCard({
    label,
    value,
    color = 'default',
    className,
    ...props
}: MiniStatCardProps) {
    const dotColors = {
        default: 'bg-muted-foreground',
        safe: 'bg-green-500',
        warning: 'bg-yellow-500',
        danger: 'bg-red-500',
    };

    return (
        <div
            className={cn(
                'flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2',
                className,
            )}
            {...props}
        >
            <span className={cn('size-2 rounded-full', dotColors[color])} />
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="ml-auto text-sm font-semibold">{value}</span>
        </div>
    );
}

export { MiniStatCard, StatCard, StatCardSkeleton, statCardVariants };
