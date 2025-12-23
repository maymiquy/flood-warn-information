import { Button } from '@/components/ui/button';
import { STORAGE_KEYS } from '@/config/map.config';
import { cn } from '@/lib/utils';
import { Github, Menu } from 'lucide-react';
import * as React from 'react';
import { MapSidebar, type MapSidebarProps } from './map-sidebar';

interface MapLayoutProps {
    children: React.ReactNode;
    sidebarProps: MapSidebarProps;
    className?: string;
}

function MapLayout({ children, sidebarProps, className }: MapLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            if (mobile) {
                setIsSidebarOpen(false);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    React.useEffect(() => {
        if (!isMobile) {
            const saved = localStorage.getItem(STORAGE_KEYS.SIDEBAR_COLLAPSED);
            if (saved !== null) {
                setIsSidebarOpen(saved !== 'true');
            }
        }
    }, [isMobile]);

    const toggleSidebar = () => {
        const newState = !isSidebarOpen;
        setIsSidebarOpen(newState);
        if (!isMobile) {
            localStorage.setItem(
                STORAGE_KEYS.SIDEBAR_COLLAPSED,
                String(!newState),
            );
        }
    };

    return (
        <div
            className={cn(
                'relative flex h-screen w-full overflow-hidden',
                className,
            )}
        >
            {isMobile && isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            <aside
                className={cn(
                    'z-[1000] flex h-full flex-col overflow-hidden border-r bg-background transition-all duration-300 ease-in-out',
                    !isMobile && isSidebarOpen && 'w-80 lg:w-96',
                    !isMobile && !isSidebarOpen && 'w-0 border-r-0',
                    isMobile && 'fixed top-0 left-0 h-full w-80 shadow-xl',
                    isMobile && isSidebarOpen && 'translate-x-0',
                    isMobile && !isSidebarOpen && '-translate-x-full',
                )}
            >
                {isSidebarOpen && (
                    <MapSidebar
                        {...sidebarProps}
                        onClose={() => setIsSidebarOpen(false)}
                    />
                )}
            </aside>

            <main className="relative flex-1 overflow-hidden">
                <div className="h-full w-full">{children}</div>

                {!isSidebarOpen && (
                    <Button
                        variant="outline"
                        size="icon"
                        className="absolute top-3 left-3 z-[1001] bg-background shadow-lg hover:bg-accent"
                        onClick={toggleSidebar}
                        aria-label="Buka sidebar"
                    >
                        <Menu className="size-4" />
                    </Button>
                )}

                <div className="absolute bottom-3 left-1/2 z-[1001] -translate-x-1/2">
                    <a
                        href="https://github.com/maymiquy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm transition-colors hover:bg-background hover:text-foreground"
                    >
                        <Github className="size-3.5" />
                        <span className="text-[9px]">© 2025 maymiquy</span>
                    </a>
                </div>
            </main>
        </div>
    );
}

export { MapLayout };
