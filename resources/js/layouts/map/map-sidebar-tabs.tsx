import { cn } from '@/lib/utils';
import type { SidebarTab } from '@/types/map';
import { Layers, Radio } from 'lucide-react';
import * as React from 'react';

interface MapSidebarTabsProps {
    activeTab: SidebarTab;
    onTabChange: (tab: SidebarTab) => void;
    sensorCount?: number;
    zoneCount?: number;
    className?: string;
}

function MapSidebarTabs({
    activeTab,
    onTabChange,
    sensorCount,
    zoneCount,
    className,
}: MapSidebarTabsProps) {
    const tabs: {
        id: SidebarTab;
        label: string;
        icon: React.ComponentType<{ className?: string }>;
        count?: number;
    }[] = [
        { id: 'sensors', label: 'Sensor', icon: Radio, count: sensorCount },
        { id: 'zones', label: 'Zona Banjir', icon: Layers, count: zoneCount },
    ];

    return (
        <div className={cn('flex border-b', className)}>
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;

                return (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => onTabChange(tab.id)}
                        className={cn(
                            'flex flex-1 items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors',
                            '-mb-px border-b-2',
                            isActive
                                ? 'border-primary text-primary'
                                : 'border-transparent text-muted-foreground hover:bg-muted/50 hover:text-foreground',
                        )}
                    >
                        <Icon className="size-4" />
                        <span>{tab.label}</span>
                        {tab.count !== undefined && (
                            <span
                                className={cn(
                                    'rounded-full px-1.5 py-0.5 text-[10px] font-medium',
                                    isActive
                                        ? 'bg-primary/10 text-primary'
                                        : 'bg-muted text-muted-foreground',
                                )}
                            >
                                {tab.count}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
}

export { MapSidebarTabs };
