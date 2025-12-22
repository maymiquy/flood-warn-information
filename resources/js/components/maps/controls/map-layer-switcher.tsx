import { Button } from '@/components/ui/button';
import {
    TILE_LAYERS,
    getSavedTileLayer,
    saveTileLayer,
    type TileLayerType,
} from '@/config/map.config';
import { cn } from '@/lib/utils';
import {
    Check,
    ChevronDown,
    Layers,
    Map,
    Moon,
    Mountain,
    Satellite,
} from 'lucide-react';
import * as React from 'react';

const LAYER_ICONS: Record<TileLayerType, React.ElementType> = {
    osm: Map,
    satellite: Satellite,
    terrain: Mountain,
    dark: Moon,
};

interface MapLayerSwitcherProps {
    activeLayer?: TileLayerType;
    onLayerChange?: (layer: TileLayerType) => void;
    position?: 'topright' | 'topleft' | 'bottomright' | 'bottomleft';
    className?: string;
}

function MapLayerSwitcher({
    activeLayer: controlledLayer,
    onLayerChange,
    position = 'topright',
    className,
}: MapLayerSwitcherProps) {
    const [isOpen, setIsOpen] = React.useState(false);
    const [internalLayer, setInternalLayer] = React.useState<TileLayerType>(
        controlledLayer ?? getSavedTileLayer(),
    );
    const dropdownRef = React.useRef<HTMLDivElement>(null);

    const activeLayer = controlledLayer ?? internalLayer;

    const positionClasses = {
        topright: 'top-3 right-3',
        topleft: 'top-3 left-14',
        bottomright: 'bottom-3 right-3',
        bottomleft: 'bottom-3 left-3',
    };

    const handleLayerChange = React.useCallback(
        (layer: TileLayerType) => {
            setInternalLayer(layer);
            saveTileLayer(layer);
            onLayerChange?.(layer);
            setIsOpen(false);
        },
        [onLayerChange],
    );

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () =>
            document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    React.useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setIsOpen(false);
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, []);

    return (
        <div
            ref={dropdownRef}
            className={cn(
                'absolute z-[1000]',
                positionClasses[position],
                className,
            )}
        >
            <Button
                variant="outline"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    'bg-background/95 shadow-md backdrop-blur-sm',
                    'hover:bg-accent',
                    isOpen && 'ring-2 ring-primary/20',
                )}
            >
                <Layers className="mr-1.5 size-4" />
                <span className="hidden text-xs sm:inline">
                    {TILE_LAYERS[activeLayer].name}
                </span>
                <ChevronDown
                    className={cn(
                        'ml-1 size-3.5 transition-transform duration-200',
                        isOpen && 'rotate-180',
                    )}
                />
            </Button>

            {isOpen && (
                <div
                    className={cn(
                        'absolute mt-1 w-44',
                        'bg-background/95 backdrop-blur-sm',
                        'rounded-lg border shadow-lg',
                        'overflow-hidden',
                        'animate-in duration-150 fade-in-0 zoom-in-95',
                        position.includes('right') ? 'right-0' : 'left-0',
                    )}
                >
                    <div className="p-1">
                        {(Object.keys(TILE_LAYERS) as TileLayerType[]).map(
                            (layerKey) => {
                                const layer = TILE_LAYERS[layerKey];
                                const Icon = LAYER_ICONS[layerKey];
                                const isActive = activeLayer === layerKey;

                                return (
                                    <button
                                        key={layerKey}
                                        onClick={() =>
                                            handleLayerChange(layerKey)
                                        }
                                        className={cn(
                                            'flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-sm',
                                            'transition-colors duration-150',
                                            isActive
                                                ? 'bg-primary text-primary-foreground'
                                                : 'text-foreground hover:bg-accent',
                                        )}
                                    >
                                        <Icon className="size-4 shrink-0" />
                                        <span className="flex-1 text-left">
                                            {layer.name}
                                        </span>
                                        {isActive && (
                                            <Check className="size-4 shrink-0" />
                                        )}
                                    </button>
                                );
                            },
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

interface CompactLayerSwitcherProps {
    activeLayer?: TileLayerType;
    onLayerChange?: (layer: TileLayerType) => void;
    position?: 'topright' | 'topleft' | 'bottomright' | 'bottomleft';
    className?: string;
}

function CompactLayerSwitcher({
    activeLayer: controlledLayer,
    onLayerChange,
    position = 'topright',
    className,
}: CompactLayerSwitcherProps) {
    const [internalLayer, setInternalLayer] = React.useState<TileLayerType>(
        controlledLayer ?? getSavedTileLayer(),
    );

    const activeLayer = controlledLayer ?? internalLayer;

    const positionClasses = {
        topright: 'top-3 right-3',
        topleft: 'top-3 left-14',
        bottomright: 'bottom-3 right-3',
        bottomleft: 'bottom-3 left-3',
    };

    const handleLayerChange = React.useCallback(
        (layer: TileLayerType) => {
            setInternalLayer(layer);
            saveTileLayer(layer);
            onLayerChange?.(layer);
        },
        [onLayerChange],
    );

    return (
        <div
            className={cn(
                'absolute z-[1000]',
                positionClasses[position],
                className,
            )}
        >
            <div className="flex overflow-hidden rounded-lg border bg-background/95 shadow-md backdrop-blur-sm">
                {(Object.keys(TILE_LAYERS) as TileLayerType[]).map(
                    (layerKey) => {
                        const Icon = LAYER_ICONS[layerKey];
                        const isActive = activeLayer === layerKey;

                        return (
                            <button
                                key={layerKey}
                                onClick={() => handleLayerChange(layerKey)}
                                title={TILE_LAYERS[layerKey].name}
                                className={cn(
                                    'p-2 transition-colors duration-150',
                                    'border-r last:border-r-0',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                                )}
                            >
                                <Icon className="size-4" />
                            </button>
                        );
                    },
                )}
            </div>
        </div>
    );
}

export { CompactLayerSwitcher, MapLayerSwitcher };
export type { CompactLayerSwitcherProps, MapLayerSwitcherProps };
