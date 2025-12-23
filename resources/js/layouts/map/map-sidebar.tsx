import { MiniStatCard } from '@/components/data-display/stat-card';
import {
    RiskLevelFilterSelect,
    StatusFilterSelect,
} from '@/components/forms/filter-select';
import { SearchInput } from '@/components/forms/search-input';
import { Button } from '@/components/ui/button';
import type {
    MapStats,
    RiskLevelFilter,
    SidebarTab,
    StatusFilter,
} from '@/types/map';
import { Droplets, PanelLeftClose, Plus } from 'lucide-react';
import * as React from 'react';
import { MapSidebarTabs } from './map-sidebar-tabs';

export interface MapSidebarProps {
    activeTab: SidebarTab;
    onTabChange: (tab: SidebarTab) => void;
    statusFilter: StatusFilter;
    onStatusFilterChange: (status: StatusFilter) => void;
    riskLevelFilter: RiskLevelFilter;
    onRiskLevelFilterChange: (risk: RiskLevelFilter) => void;
    searchQuery: string;
    onSearchChange: (query: string) => void;
    stats?: MapStats;
    sensorsContent?: React.ReactNode;
    zonesContent?: React.ReactNode;
    onAddZone?: () => void;
    onClose?: () => void;
    isLoading?: boolean;
}

function MapSidebar({
    activeTab,
    onTabChange,
    statusFilter,
    onStatusFilterChange,
    riskLevelFilter,
    onRiskLevelFilterChange,
    searchQuery,
    onSearchChange,
    stats,
    sensorsContent,
    zonesContent,
    onAddZone,
    onClose,
    isLoading = false,
}: MapSidebarProps) {
    return (
        <div className="flex h-full flex-col">
            <header className="flex items-center justify-between border-b px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                        <Droplets className="size-4" />
                    </div>
                    <div>
                        <h1 className="text-sm font-semibold">Flood Warning</h1>
                        <p className="text-[10px] text-muted-foreground">
                            Sistem Peringatan Banjir
                        </p>
                    </div>
                </div>
                {onClose && (
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <PanelLeftClose className="size-4" />
                        <span className="sr-only">Tutup sidebar</span>
                    </Button>
                )}
            </header>

            {stats && (
                <div className="grid grid-cols-2 gap-2 border-b p-3">
                    <MiniStatCard
                        label="Sensor"
                        value={stats.totalSensors}
                        color="default"
                    />
                    <MiniStatCard
                        label="Zona"
                        value={stats.totalZones}
                        color="default"
                    />
                    <MiniStatCard
                        label="Bahaya"
                        value={stats.dangerSensors}
                        color="danger"
                    />
                    <MiniStatCard
                        label="Risiko Tinggi"
                        value={stats.highRiskZones}
                        color="danger"
                    />
                </div>
            )}

            <MapSidebarTabs
                activeTab={activeTab}
                onTabChange={onTabChange}
                sensorCount={stats?.totalSensors}
                zoneCount={stats?.totalZones}
            />

            <div className="space-y-2 border-b p-3">
                <SearchInput
                    value={searchQuery}
                    onChange={onSearchChange}
                    placeholder={
                        activeTab === 'sensors'
                            ? 'Cari sensor...'
                            : 'Cari zona...'
                    }
                />

                {activeTab === 'sensors' ? (
                    <StatusFilterSelect
                        value={statusFilter}
                        onChange={onStatusFilterChange}
                        showCount
                        counts={{
                            all: stats?.totalSensors,
                            safe: stats?.safeSensors,
                            warning: stats?.warningSensors,
                            danger: stats?.dangerSensors,
                        }}
                    />
                ) : (
                    <RiskLevelFilterSelect
                        value={riskLevelFilter}
                        onChange={onRiskLevelFilterChange}
                        showCount
                        counts={{
                            all: stats?.totalZones,
                            low: stats?.lowRiskZones,
                            medium: stats?.mediumRiskZones,
                            high: stats?.highRiskZones,
                        }}
                    />
                )}
            </div>

            <div className="custom-scrollbar flex-1 overflow-y-auto p-3">
                {isLoading ? (
                    <div className="flex items-center justify-center py-8">
                        <div className="size-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                ) : (
                    <div className="stagger-children">
                        {activeTab === 'sensors' && sensorsContent}
                        {activeTab === 'zones' && zonesContent}
                    </div>
                )}
            </div>

            {activeTab === 'zones' && onAddZone && (
                <footer className="border-t p-3">
                    <Button className="w-full gap-2" onClick={onAddZone}>
                        <Plus className="size-4" />
                        Tambah Zona Banjir
                    </Button>
                </footer>
            )}
        </div>
    );
}

export { MapSidebar };
