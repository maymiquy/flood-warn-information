<?php

namespace App\Services;

use App\Models\FloodZone;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Pagination\LengthAwarePaginator;

class FloodZoneService
{
    public function getAllZones(): Collection
    {
        return FloodZone::orderBy('name')->get();
    }

    public function getZoneById(int $id): ?FloodZone
    {
        return FloodZone::find($id);
    }

    public function getActiveZones(): Collection
    {
        return FloodZone::where('is_active', true)
            ->orderBy('name')
            ->get();
    }

    public function getZonesByRiskLevel(string $riskLevel): Collection
    {
        return FloodZone::where('is_active', true)
            ->where('risk_level', $riskLevel)
            ->orderBy('name')
            ->get();
    }

    public function getZonesFiltered(array $filters = [], int $perPage = 10): LengthAwarePaginator
    {
        $query = FloodZone::query();

        if (isset($filters['risk_level']) && $filters['risk_level'] !== 'all') {
            $query->where('risk_level', $filters['risk_level']);
        }

        if (isset($filters['is_active'])) {
            $query->where('is_active', $filters['is_active']);
        }

        if (isset($filters['search']) && $filters['search']) {
            $search = $filters['search'];
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        return $query->orderBy('name')->paginate($perPage)->withQueryString();
    }

    public function getPolygonsForMap(?string $riskLevel = null): array
    {
        $query = FloodZone::where('is_active', true);

        if ($riskLevel && $riskLevel !== 'all') {
            $query->where('risk_level', $riskLevel);
        }

        $zones = $query->get();

        return $zones->map(function ($zone) {
            return $this->formatZoneAsPolygon($zone);
        })->toArray();
    }

    public function formatZoneAsPolygon(FloodZone $zone): array
    {
        return [
            'id' => $zone->id,
            'name' => $zone->name,
            'description' => $zone->description,
            'coordinates' => $zone->coordinates,
            'riskLevel' => $zone->risk_level,
            'riskLabel' => $zone->risk_label,
            'riskColor' => $zone->risk_color,
            'color' => $zone->color,
            'opacity' => $zone->opacity,
            'bounds' => $this->calculateBounds($zone->coordinates),
        ];
    }

    public function calculateBounds(array $coordinates): array
    {
        if (empty($coordinates)) {
            return [
                'north' => 0,
                'south' => 0,
                'east' => 0,
                'west' => 0,
                'center' => ['lat' => 0, 'lng' => 0],
            ];
        }

        $lats = array_column($coordinates, 0);
        $lngs = array_column($coordinates, 1);

        $north = max($lats);
        $south = min($lats);
        $east = max($lngs);
        $west = min($lngs);

        return [
            'north' => $north,
            'south' => $south,
            'east' => $east,
            'west' => $west,
            'center' => [
                'lat' => ($north + $south) / 2,
                'lng' => ($east + $west) / 2,
            ],
        ];
    }

    public function getStatistics(): array
    {
        $zones = FloodZone::where('is_active', true)->get();

        return [
            'total' => $zones->count(),
            'high' => $zones->where('risk_level', FloodZone::RISK_HIGH)->count(),
            'medium' => $zones->where('risk_level', FloodZone::RISK_MEDIUM)->count(),
            'low' => $zones->where('risk_level', FloodZone::RISK_LOW)->count(),
        ];
    }

    public function getZonesList(?string $riskLevel = null, ?string $search = null): array
    {
        $query = FloodZone::where('is_active', true);

        if ($riskLevel && $riskLevel !== 'all') {
            $query->where('risk_level', $riskLevel);
        }

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        $zones = $query->orderBy('name')->get();

        return $zones->map(function ($zone) {
            return [
                'id' => $zone->id,
                'name' => $zone->name,
                'description' => $zone->description,
                'riskLevel' => $zone->risk_level,
                'riskLabel' => $zone->risk_label,
                'riskColor' => $zone->risk_color,
                'coordinates' => $zone->coordinates,
                'bounds' => $this->calculateBounds($zone->coordinates),
            ];
        })->toArray();
    }

    public function createZone(array $data): FloodZone
    {
        if (!isset($data['color'])) {
            $data['color'] = $this->getDefaultColor($data['risk_level'] ?? 'high');
        }

        return FloodZone::create($data);
    }

    public function updateZone(FloodZone $zone, array $data): FloodZone
    {
        if (isset($data['risk_level']) && !isset($data['color'])) {
            $data['color'] = $this->getDefaultColor($data['risk_level']);
        }

        $zone->update($data);

        return $zone->fresh();
    }

    public function deleteZone(FloodZone $zone): bool
    {
        return $zone->delete();
    }

    public function getDefaultColor(string $riskLevel): string
    {
        return match ($riskLevel) {
            FloodZone::RISK_LOW => '#22c55e',
            FloodZone::RISK_MEDIUM => '#eab308',
            FloodZone::RISK_HIGH => '#ef4444',
            default => '#ef4444',
        };
    }

    public function validateCoordinates(array $coordinates): bool
    {
        if (count($coordinates) < 3) {
            return false;
        }

        foreach ($coordinates as $point) {
            if (!is_array($point) || count($point) !== 2) {
                return false;
            }

            [$lat, $lng] = $point;

            if (!is_numeric($lat) || $lat < -90 || $lat > 90) {
                return false;
            }

            if (!is_numeric($lng) || $lng < -180 || $lng > 180) {
                return false;
            }
        }

        return true;
    }
}
