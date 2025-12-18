<?php

namespace App\Services;

class MapDataService
{
    public function __construct(
        protected SensorService $sensorService,
        protected FloodZoneService $floodZoneService
    ) {}

    public function getFullMapData(): array
    {
        $markers = $this->sensorService->getMapMarkers();
        $polygons = $this->floodZoneService->getPolygonsForMap();
        $stats = $this->getStatistics();

        return [
            'markers' => $markers,
            'polygons' => $polygons,
            'stats' => $stats,
        ];
    }

    public function getFilteredMapData(?string $status = null, ?string $riskLevel = null): array
    {
        $markers = $this->sensorService->getMapMarkers($status);
        $polygons = $this->floodZoneService->getPolygonsForMap($riskLevel);
        $stats = $this->getStatistics();

        $stats['filteredSensors'] = count($markers);
        $stats['filteredZones'] = count($polygons);

        return [
            'markers' => $markers,
            'polygons' => $polygons,
            'stats' => $stats,
        ];
    }

    public function getStatistics(): array
    {
        $sensorStats = $this->sensorService->getStatistics();
        $zoneStats = $this->floodZoneService->getStatistics();

        return [
            'totalSensors' => $sensorStats['total'],
            'safeSensors' => $sensorStats['safe'],
            'warningSensors' => $sensorStats['warning'],
            'dangerSensors' => $sensorStats['danger'],

            'totalZones' => $zoneStats['total'],
            'highRiskZones' => $zoneStats['high'],
            'mediumRiskZones' => $zoneStats['medium'],
            'lowRiskZones' => $zoneStats['low'],
        ];
    }

    public function getSensorsList(?string $status = null, ?string $search = null): array
    {
        return $this->sensorService->getSensorsList($status, $search);
    }

    public function getZonesList(?string $riskLevel = null, ?string $search = null): array
    {
        return $this->floodZoneService->getZonesList($riskLevel, $search);
    }

    public function getInitialMapData(): array
    {
        return $this->getFullMapData();
    }

    public function getMapCenter(): array
    {
        $defaultCenter = [
            'lat' => -6.2088,
            'lng' => 106.8456,
        ];

        $markers = $this->sensorService->getMapMarkers();

        if (empty($markers)) {
            return $defaultCenter;
        }

        $lats = array_column(array_column($markers, 'position'), 'lat');
        $lngs = array_column(array_column($markers, 'position'), 'lng');

        if (empty($lats) || empty($lngs)) {
            return $defaultCenter;
        }

        return [
            'lat' => array_sum($lats) / count($lats),
            'lng' => array_sum($lngs) / count($lngs),
        ];
    }

    public function getMapBounds(): array
    {
        $markers = $this->sensorService->getMapMarkers();
        $polygons = $this->floodZoneService->getPolygonsForMap();

        $allLats = [];
        $allLngs = [];

        foreach ($markers as $marker) {
            $allLats[] = $marker['position']['lat'];
            $allLngs[] = $marker['position']['lng'];
        }

        foreach ($polygons as $polygon) {
            foreach ($polygon['coordinates'] as $coord) {
                $allLats[] = $coord[0];
                $allLngs[] = $coord[1];
            }
        }

        if (empty($allLats) || empty($allLngs)) {
            return [
                'northEast' => ['lat' => -6.0, 'lng' => 107.0],
                'southWest' => ['lat' => -6.4, 'lng' => 106.6],
            ];
        }

        return [
            'northEast' => [
                'lat' => max($allLats),
                'lng' => max($allLngs),
            ],
            'southWest' => [
                'lat' => min($allLats),
                'lng' => min($allLngs),
            ],
        ];
    }

    public function getDashboardSummary(): array
    {
        $stats = $this->getStatistics();

        $dangerSensors = $this->sensorService->getSensorsByStatus('danger');

        $highRiskZones = $this->floodZoneService->getZonesByRiskLevel('high');

        return [
            'stats' => $stats,
            'alerts' => [
                'dangerSensors' => $dangerSensors->map(fn($s) => [
                    'id' => $s->id,
                    'name' => $s->name,
                    'waterLevel' => (float) $s->water_level,
                    'address' => $s->address,
                ])->toArray(),
                'highRiskZones' => $highRiskZones->map(fn($z) => [
                    'id' => $z->id,
                    'name' => $z->name,
                    'description' => $z->description,
                ])->toArray(),
            ],
            'hasAlerts' => $dangerSensors->isNotEmpty() || $highRiskZones->isNotEmpty(),
        ];
    }
}
